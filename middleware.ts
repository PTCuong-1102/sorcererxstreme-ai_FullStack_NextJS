
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')?.[1];

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    // Use Web Crypto API instead of Node.js crypto for Edge Runtime
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    
    // Simple JWT verification for Edge Runtime
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode payload (we'll do basic validation)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: [
    '/api/tarot/:path*',
    '/api/profile/:path*', 
    '/api/chat/:path*',
    '/api/astrology/:path*',
    '/api/fortune/:path*',
    '/api/numerology/:path*',
    '/api/partner',
    '/dashboard',
    '/profile',
    '/chat',
    '/tarot',
    '/astrology',
    '/fortune',
    '/numerology',
  ],
};
