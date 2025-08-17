import { NextRequest } from 'next/server';
import { verifyJWT } from './jwt';

export async function getUserFromRequest(req: NextRequest | Request): Promise<string | null> {
  try {
    // Try to get user ID from middleware header first (more reliable)
    const userIdFromHeader = req.headers.get('x-user-id');
    if (userIdFromHeader) {
      return userIdFromHeader;
    }

    // Fallback: verify token directly (for API routes not covered by middleware)
    const token = req.headers.get('authorization')?.split(' ')?.[1];
    if (!token) {
      return null;
    }

    const decoded = await verifyJWT(token);
    return decoded.userId;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}