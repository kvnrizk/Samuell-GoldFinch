import { afterEach, describe, expect, it, vi } from 'vitest';

import { Users } from '../collections/Users';

const createAccess = Users.access?.create as unknown as (args: {
  req: {
    user?: { role?: string } | null;
    payload: { find: ReturnType<typeof vi.fn> };
  };
}) => boolean | Promise<boolean>;

const beforeChange = Users.hooks?.beforeChange?.[0] as unknown as (args: {
  data: Record<string, unknown>;
  req: { payload: { find: ReturnType<typeof vi.fn> } };
  operation: 'create' | 'update';
}) => Record<string, unknown> | Promise<Record<string, unknown>>;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('users access', () => {
  it('allows local first-admin bootstrap only when no users exist', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const find = vi.fn().mockResolvedValue({ totalDocs: 0 });

    await expect(createAccess({ req: { user: null, payload: { find } } })).resolves.toBe(true);
    expect(find).toHaveBeenCalledWith({ collection: 'users', limit: 0 });
  });

  it('blocks unauthenticated user creation after local bootstrap', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const find = vi.fn().mockResolvedValue({ totalDocs: 1 });

    await expect(createAccess({ req: { user: null, payload: { find } } })).resolves.toBe(false);
  });

  it('blocks unauthenticated first-admin bootstrap in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const find = vi.fn();

    await expect(createAccess({ req: { user: null, payload: { find } } })).resolves.toBe(false);
    expect(find).not.toHaveBeenCalled();
  });

  it('still allows admins to create users in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const find = vi.fn();

    await expect(createAccess({ req: { user: { role: 'admin' }, payload: { find } } })).resolves.toBe(true);
    expect(find).not.toHaveBeenCalled();
  });

  it('only auto-promotes the first local bootstrap user to admin', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const data = { role: 'editor' };

    await expect(beforeChange({
      data,
      operation: 'create',
      req: { payload: { find: vi.fn().mockResolvedValue({ totalDocs: 0 }) } },
    })).resolves.toMatchObject({ role: 'admin' });
  });

  it('does not auto-promote users in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const data = { role: 'editor' };
    const find = vi.fn();

    await expect(beforeChange({
      data,
      operation: 'create',
      req: { payload: { find } },
    })).resolves.toMatchObject({ role: 'editor' });
    expect(find).not.toHaveBeenCalled();
  });
});
