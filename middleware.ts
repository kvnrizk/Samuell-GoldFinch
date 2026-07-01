import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// KNOWN LIMITATION: this Map lives in the serverless instance's memory. Vercel
// spins up many instances, so the effective limit scales with instance count.
// This treats naive spam but is not a real global protection layer.
const rateLimit = new Map<string, { count: number; resetTime: number }>();

let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < 10 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetTime) rateLimit.delete(key);
  }
}

export function resetRateLimitForTests() {
  rateLimit.clear();
  lastCleanup = Date.now();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for form submissions (POST only).
  if (request.method !== 'POST') return NextResponse.next();

  // Skip rate limiting for Payload CMS internal API routes.
  if (
    pathname.startsWith('/api/users') ||
    pathname.startsWith('/api/media') ||
    pathname.startsWith('/api/globals')
  ) {
    return NextResponse.next();
  }

  const isFormEndpoint =
    pathname.includes('contact') ||
    pathname.includes('quote') ||
    pathname.includes('venues') ||
    pathname.includes('inquiries') ||
    pathname.includes('venue-inquiries');

  if (!isFormEndpoint) return NextResponse.next();

  cleanupStaleEntries();

  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 5;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/contact', '/quote', '/venues', '/venues/:path*', '/fr/contact', '/fr/quote', '/fr/venues', '/fr/venues/:path*'],
};