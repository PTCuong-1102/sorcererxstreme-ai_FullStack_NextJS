import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to get user ID from JWT token
function getUserIdFromToken(req: Request): string | null {
  // First try to get from middleware-set header
  const userIdFromHeader = req.headers.get('x-user-id');
  if (userIdFromHeader) {
    return userIdFromHeader;
  }

  // Fallback: decode JWT token manually
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

// GET - Lấy thông tin breakup hiện tại của user
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find active breakup (not expired)
    const breakup = await prisma.breakup.findFirst({
      where: { 
        userId,
        autoDeleteDate: { gte: new Date() } // Still active
      },
      orderBy: { breakupDate: 'desc' }
    });

    if (!breakup) {
      return NextResponse.json(null, { status: 200 });
    }

    // Transform to client format
    const breakupData = {
      id: breakup.id,
      isActive: true,
      partnerName: breakup.partnerName,
      breakupDate: breakup.breakupDate.toISOString(),
      autoDeleteDate: breakup.autoDeleteDate.toISOString(),
      weeklyCheckDone: breakup.weeklyCheckDone
    };

    return NextResponse.json(breakupData, { status: 200 });
  } catch (error) {
    console.error('Error fetching breakup:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Cập nhật weekly check và recovery status
export async function PUT(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { weeklyCheckDone, isRecovered } = await req.json();

    // Find active breakup
    const breakup = await prisma.breakup.findFirst({
      where: { 
        userId,
        autoDeleteDate: { gte: new Date() }
      }
    });

    if (!breakup) {
      return NextResponse.json({ 
        message: 'No active breakup found' 
      }, { status: 404 });
    }

    // If user has recovered, delete the breakup record
    if (isRecovered) {
      await prisma.breakup.delete({
        where: { id: breakup.id }
      });

      return NextResponse.json({ 
        message: 'Breakup record deleted - user has recovered',
        isRecovered: true
      }, { status: 200 });
    }

    // Otherwise, update weekly check status
    if (weeklyCheckDone !== undefined) {
      const updatedBreakup = await prisma.breakup.update({
        where: { id: breakup.id },
        data: { weeklyCheckDone }
      });

      const breakupData = {
        id: updatedBreakup.id,
        isActive: true,
        partnerName: updatedBreakup.partnerName,
        breakupDate: updatedBreakup.breakupDate.toISOString(),
        autoDeleteDate: updatedBreakup.autoDeleteDate.toISOString(),
        weeklyCheckDone: updatedBreakup.weeklyCheckDone
      };

      return NextResponse.json(breakupData, { status: 200 });
    }

    return NextResponse.json({ message: 'No updates provided' }, { status: 400 });
  } catch (error) {
    console.error('Error updating breakup:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Restore partner from breakup (get back together)
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { restorePartner } = await req.json();
    
    if (!restorePartner) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    // Find active breakup
    const breakup = await prisma.breakup.findFirst({
      where: { 
        userId,
        autoDeleteDate: { gte: new Date() }
      }
    });

    if (!breakup) {
      return NextResponse.json({ 
        message: 'No active breakup found to restore from' 
      }, { status: 404 });
    }

    // Check if user already has a partner
    const existingPartner = await prisma.partner.findUnique({
      where: { userId }
    });

    if (existingPartner) {
      return NextResponse.json({ 
        message: 'User already has a partner' 
      }, { status: 409 });
    }

    // Parse partner info from the request
    const { partnerInfo } = restorePartner;
    if (!partnerInfo) {
      return NextResponse.json({ 
        message: 'Partner info required for restoration' 
      }, { status: 400 });
    }

    // Restore partner
    const restoredPartner = await prisma.partner.create({
      data: {
        userId,
        name: partnerInfo.name,
        birthDate: new Date(partnerInfo.birthDate),
        birthTime: partnerInfo.birthTime,
        birthPlace: partnerInfo.birthPlace,
        relationship: partnerInfo.relationship,
        startDate: new Date(), // New start date for reconciliation
      }
    });

    // Delete breakup record
    await prisma.breakup.delete({
      where: { id: breakup.id }
    });

    return NextResponse.json({
      message: 'Partner restored successfully',
      partner: restoredPartner
    }, { status: 200 });
  } catch (error) {
    console.error('Error restoring partner:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Force delete breakup record (admin/cleanup)
export async function DELETE(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Delete all expired breakup records for this user
    const deletedRecords = await prisma.breakup.deleteMany({
      where: { 
        userId,
        autoDeleteDate: { lt: new Date() } // Expired records only
      }
    });

    return NextResponse.json({
      message: 'Expired breakup records cleaned up',
      deletedCount: deletedRecords.count
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting breakup records:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
