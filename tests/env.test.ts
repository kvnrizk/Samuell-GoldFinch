import { describe, expect, it } from 'vitest';

import { getEnv, getRequiredProductionEnv, validateProductionEnv } from '../lib/env';

describe('env helper', () => {
  it('fails clearly in production when core variables are missing', () => {
    expect(() => validateProductionEnv({ NODE_ENV: 'production' })).toThrow(
      'DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL',
    );
  });

  it('does not expose present secret values in missing-variable errors', () => {
    expect(() => validateProductionEnv({
      NODE_ENV: 'production',
      DATABASE_URI: 'mongodb+srv://user:secret@example.test/db',
      PAYLOAD_SECRET: 'very-secret-value',
    })).toThrow('NEXT_PUBLIC_SITE_URL');

    try {
      validateProductionEnv({
        NODE_ENV: 'production',
        DATABASE_URI: 'mongodb+srv://user:secret@example.test/db',
        PAYLOAD_SECRET: 'very-secret-value',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).not.toContain('very-secret-value');
      expect(message).not.toContain('mongodb+srv://user:secret@example.test/db');
    }
  });

  it('allows local development without production variables', () => {
    expect(validateProductionEnv({ NODE_ENV: 'development' })).toMatchObject({
      ok: true,
      missing: [],
    });
  });

  it('returns empty strings for missing required production vars outside production', () => {
    expect(getRequiredProductionEnv('DATABASE_URI', { NODE_ENV: 'development' })).toBe('');
  });

  it('normalizes blank values as missing', () => {
    expect(getEnv('DATABASE_URI', { DATABASE_URI: '   ' })).toBeUndefined();
  });
});
