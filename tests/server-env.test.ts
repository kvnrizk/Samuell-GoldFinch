import { afterEach, describe, expect, it } from 'vitest';

import {
  LocalDatabaseUnavailableError,
  MissingServerEnvError,
  describeError,
  ensurePayloadRuntimeEnv,
  ensurePayloadRuntimeReady,
  getPayloadConfigEnv,
  requireServerEnv,
} from '../lib/server-env';

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  process.env = { ...ORIGINAL_ENV };
}

describe('server env helpers', () => {
  afterEach(() => {
    resetEnv();
  });

  it('throws a readable error for missing Payload runtime env', () => {
    delete process.env.DATABASE_URI;
    delete process.env.PAYLOAD_SECRET;

    expect(() => ensurePayloadRuntimeEnv()).toThrow(MissingServerEnvError);
    expect(() => ensurePayloadRuntimeEnv()).toThrow('DATABASE_URI, PAYLOAD_SECRET');
  });

  it('accepts Payload runtime env when configured', () => {
    process.env.DATABASE_URI = 'mongodb://127.0.0.1:27017/sg-platform';
    process.env.PAYLOAD_SECRET = 'secret';

    expect(ensurePayloadRuntimeEnv()).toMatchObject({
      DATABASE_URI: 'mongodb://127.0.0.1:27017/sg-platform',
      PAYLOAD_SECRET: 'secret',
    });
  });

  it('does not local-preflight non-local MongoDB URIs', async () => {
    process.env.DATABASE_URI = 'mongodb+srv://user:pass@example.mongodb.net/sg-platform';
    process.env.PAYLOAD_SECRET = 'secret';

    await expect(ensurePayloadRuntimeReady()).resolves.toMatchObject({
      DATABASE_URI: 'mongodb+srv://user:pass@example.mongodb.net/sg-platform',
      PAYLOAD_SECRET: 'secret',
    });
  });
  it('keeps Payload config import-safe when runtime env is absent', () => {
    delete process.env.DATABASE_URI;
    delete process.env.PAYLOAD_SECRET;
    delete process.env.NEXT_PUBLIC_SITE_URL;

    expect(getPayloadConfigEnv()).toEqual({
      databaseUri: 'mongodb://127.0.0.1:27017/sg-platform-missing-env',
      payloadSecret: 'missing-payload-secret',
      siteUrl: 'http://localhost:3000',
    });
  });

  it('formats missing env errors without dumping stack traces', () => {
    expect(() => requireServerEnv(['RESEND_API_KEY'], 'Resend email')).toThrow(MissingServerEnvError);

    try {
      requireServerEnv(['RESEND_API_KEY'], 'Resend email');
    } catch (err) {
      expect(describeError(err)).toContain('Missing required Resend email env variable: RESEND_API_KEY');
      expect(describeError(err)).not.toContain('at ');
    }
  });

  it('formats local MongoDB availability errors without stack traces', () => {
    const message = describeError(new LocalDatabaseUnavailableError('127.0.0.1', 27017));

    expect(message).toContain('DATABASE_URI points to local MongoDB at 127.0.0.1:27017');
    expect(message).toContain('Start MongoDB locally');
    expect(message).not.toMatch(/\\n\\s*at /);
  });
});