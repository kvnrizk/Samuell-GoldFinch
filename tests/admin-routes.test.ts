import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  find: vi.fn(),
  getPayload: vi.fn(),
  headers: vi.fn(),
}));

vi.mock('@/lib/payload', () => ({
  getPayload: mocks.getPayload,
}));

vi.mock('next/headers', () => ({
  headers: mocks.headers,
}));

vi.mock('@/lib/notifications', () => ({
  sendNotification: vi.fn(),
}));

import { GET as exportCsvGET } from '../app/api/export-csv/route';
import { GET as processSequencesGET } from '../app/api/cron/process-sequences/route';

function request(url: string, init?: ConstructorParameters<typeof NextRequest>[1]) {
  return new NextRequest(url, init);
}

describe('admin-only routes', () => {
  beforeEach(() => {
    delete process.env.CRON_SECRET;
    mocks.auth.mockReset();
    mocks.find.mockReset();
    mocks.getPayload.mockReset();
    mocks.headers.mockReset();
    mocks.headers.mockResolvedValue(new Headers());
    mocks.getPayload.mockResolvedValue({
      auth: mocks.auth,
      find: mocks.find,
    });
  });

  it('rejects unauthenticated CSV exports', async () => {
    mocks.auth.mockResolvedValue({ user: null });

    const response = await exportCsvGET(request('https://example.com/api/export-csv?collection=inquiries'));

    expect(response.status).toBe(401);
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it('rejects non-admin CSV exports', async () => {
    mocks.auth.mockResolvedValue({ user: { role: 'editor' } });

    const response = await exportCsvGET(request('https://example.com/api/export-csv?collection=inquiries'));

    expect(response.status).toBe(403);
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it('refuses cron execution when CRON_SECRET is unset', async () => {
    const response = await processSequencesGET(new Request('https://example.com/api/cron/process-sequences'));

    expect(response.status).toBe(401);
    expect(mocks.getPayload).not.toHaveBeenCalled();
  });

  it('rejects cron execution with an invalid bearer secret', async () => {
    process.env.CRON_SECRET = 'expected-secret';

    const response = await processSequencesGET(new Request('https://example.com/api/cron/process-sequences', {
      headers: { authorization: 'Bearer wrong-secret' },
    }));

    expect(response.status).toBe(401);
    expect(mocks.getPayload).not.toHaveBeenCalled();
  });
});
