import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

async function loadMiddleware(secret?: string) {
  vi.resetModules();
  if (secret) {
    process.env.ADMIN_ACCESS_SECRET = secret;
  } else {
    delete process.env.ADMIN_ACCESS_SECRET;
  }
  return import('../middleware');
}

function request(url: string, init?: ConstructorParameters<typeof NextRequest>[1]) {
  return new NextRequest(url, init);
}

describe('middleware', () => {
  it('hides /admin when the configured secret is missing', async () => {
    const { middleware } = await loadMiddleware('admin-secret');
    const response = middleware(request('https://example.com/admin'));

    expect(response.headers.get('x-middleware-rewrite')).toBe('https://example.com/not-found');
  });

  it('sets the admin access cookie and redirects to a clean URL with a valid secret', async () => {
    const { middleware } = await loadMiddleware('admin-secret');
    const response = middleware(request('https://example.com/admin?secret=admin-secret'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/admin');
    expect(response.headers.get('set-cookie')).toContain('sg-admin-access=admin-secret');
  });

  it('rate-limits matched form endpoints after five POSTs from the same IP', async () => {
    const { middleware, resetRateLimitForTests } = await loadMiddleware();
    resetRateLimitForTests();

    const init = {
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.10' },
    };

    for (let i = 0; i < 5; i += 1) {
      expect(middleware(request('https://example.com/contact', init)).status).toBe(200);
    }

    const limited = middleware(request('https://example.com/contact', init));
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Retry-After')).toBe('3600');
  });
});
