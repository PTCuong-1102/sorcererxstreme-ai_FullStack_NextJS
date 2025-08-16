import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to get user ID from JWT token
function getUserIdFromToken(req: Request): string | null {
  console.log('getUserIdFromToken called');
  
  // First try to get from middleware-set header
  const userIdFromHeader = req.headers.get('x-user-id');
  console.log('x-user-id header:', userIdFromHeader);
  if (userIdFromHeader) {
    return userIdFromHeader;
  }

  // Fallback: decode JWT token manually
  const authHeader = req.headers.get('authorization');
  console.log('authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid authorization header found');
    return null;
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token?.substring(0, 20) + '...');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    console.log('Decoded token:', decoded);
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

// GET - Lấy thông tin partner của user hiện tại
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const partner = await prisma.partner.findUnique({
      where: { userId },
    });

    return NextResponse.json(partner, { status: 200 });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Thêm partner mới
export async function POST(req: Request) {
  try {
    console.log('POST /api/partner - Request received');
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    
    const userId = getUserIdFromToken(req);
    console.log('UserId from token:', userId);
    
    if (!userId) {
      console.log('Unauthorized: No userId found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, birthDate, birthTime, birthPlace, relationship } = await req.json();

    // Validate required fields
    if (!name || !birthDate || !birthTime || !birthPlace || !relationship) {
      return NextResponse.json({ 
        message: 'Missing required fields: name, birthDate, birthTime, birthPlace, relationship' 
      }, { status: 400 });
    }

    // Check if user already has a partner
    const existingPartner = await prisma.partner.findUnique({
      where: { userId },
    });

    if (existingPartner) {
      return NextResponse.json({ 
        message: 'User already has a partner. Use PUT to update or DELETE first.' 
      }, { status: 409 });
    }

    // Create new partner
    const partner = await prisma.partner.create({
      data: {
        userId,
        name,
        birthDate: new Date(birthDate),
        birthTime,
        birthPlace,
        relationship,
        startDate: new Date(),
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Cập nhật thông tin partner
export async function PUT(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, birthDate, birthTime, birthPlace, relationship } = await req.json();

    // Check if partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: { userId },
    });

    if (!existingPartner) {
      return NextResponse.json({ 
        message: 'Partner not found. Use POST to create a new partner.' 
      }, { status: 404 });
    }

    // Update partner
    const updatedPartner = await prisma.partner.update({
      where: { userId },
      data: {
        ...(name && { name }),
        ...(birthDate && { birthDate: new Date(birthDate) }),
        ...(birthTime && { birthTime }),
        ...(birthPlace && { birthPlace }),
        ...(relationship && { relationship }),
      },
    });

    return NextResponse.json(updatedPartner, { status: 200 });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Xóa partner (chia tay)
export async function DELETE(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: { userId },
    });

    if (!existingPartner) {
      return NextResponse.json({ 
        message: 'Partner not found.' 
      }, { status: 404 });
    }

    // Create breakup record before deleting partner
    await prisma.breakup.create({
      data: {
        userId,
        partnerName: existingPartner.name,
        breakupDate: new Date(),
        autoDeleteDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 tháng sau
        weeklyCheckDone: [],
      },
    });

    // Delete partner
    await prisma.partner.delete({
      where: { userId },
    });

    return NextResponse.json({ 
      message: 'Partner deleted and breakup record created successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
