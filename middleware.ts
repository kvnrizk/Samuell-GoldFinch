import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  // Rate limiting for form submissions only
  if (request.method === 'POST' && (request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname.includes('contact') || request.nextUrl.pathname.includes('quote'))) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = 3;

    const entry = rateLimit.get(ip);

    if (entry) {
      if (now > entry.resetTime) {
        rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
      } else if (entry.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '3600' } },
        );
      } else {
        entry.count++;
      }
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/(site)/contact', '/(site)/quote'],
};
