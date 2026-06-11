import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// KNOWN LIMITATION: this Map lives in the serverless instance's memory. Vercel
// spins up many instances, so effective limit ≈ 5 × instance_count. Treats
// naive spam but NOT a real protection layer. Replace with Vercel KV/Upstash
// Redis for per-project-global limiting when traffic justifies the upgrade.
// See AUDIT.md P1-1.
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Clean stale entries every 10 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < 10 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetTime) rateLimit.delete(key);
  }
}

const ADMIN_SECRET = process.env.ADMIN_ACCESS_SECRET;
const COOKIE_NAME = 'sg-admin-access';

export function resetRateLimitForTests() {
  rateLimit.clear();
  lastCleanup = Date.now();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin route protection ──
  // If ADMIN_ACCESS_SECRET is set, require ?secret=xxx to access /admin
  // First visit with correct secret sets a cookie; subsequent visits use the cookie
  if (ADMIN_SECRET && pathname.startsWith('/admin')) {
    const hasValidCookie = request.cookies.get(COOKIE_NAME)?.value === ADMIN_SECRET;
    const querySecret = request.nextUrl.searchParams.get('secret');

    if (querySecret === ADMIN_SECRET) {
      // Correct secret in URL — set cookie and redirect to clean URL
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete('secret');
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(COOKIE_NAME, ADMIN_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/admin',
      });
      return response;
    }

    if (!hasValidCookie) {
      // No valid cookie and no valid secret — return 404 (hide admin existence)
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  // ── Rate limiting for form submissions (POST only) ──
  if (request.method !== 'POST') return NextResponse.next();

  // Skip rate limiting for Payload CMS internal API routes (auth, collections, globals)
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

  // Use x-forwarded-for from trusted proxy (Vercel sets this), fall back to IP header
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
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
  matcher: ['/admin/:path*', '/api/:path*', '/contact', '/quote', '/venues', '/venues/:path*', '/fr/contact', '/fr/quote', '/fr/venues', '/fr/venues/:path*'],
};
