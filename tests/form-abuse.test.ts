import { beforeEach, describe, expect, it } from 'vitest';

import { checkFormAbuse, getFormPayloadSize, resetFormAbuseForTests } from '../lib/form-abuse';

describe('form abuse guard', () => {
  beforeEach(() => {
    resetFormAbuseForTests();
  });

  it('allows legitimate submissions', () => {
    expect(checkFormAbuse({
      email: 'sam@example.com',
      formId: 'contact',
      message: 'A real inquiry',
      payloadSize: 100,
    })).toEqual({ allowed: true });
  });

  it('blocks duplicate submissions within the duplicate window', () => {
    const input = {
      email: 'sam@example.com',
      formId: 'contact' as const,
      message: 'Same message',
      payloadSize: 100,
      now: 1000,
    };

    expect(checkFormAbuse(input)).toEqual({ allowed: true });
    expect(checkFormAbuse({ ...input, now: 2000 })).toEqual({
      allowed: false,
      reason: 'duplicate',
    });
  });

  it('rate-limits repeated submissions by fallback email key', () => {
    for (let i = 0; i < 5; i += 1) {
      expect(checkFormAbuse({
        email: 'sam@example.com',
        formId: 'quote',
        message: `Inquiry ${i}`,
        payloadSize: 100,
        now: 1000 + i,
      })).toEqual({ allowed: true });
    }

    expect(checkFormAbuse({
      email: 'sam@example.com',
      formId: 'quote',
      message: 'Another inquiry',
      payloadSize: 100,
      now: 2000,
    })).toEqual({ allowed: false, reason: 'rate-limit' });
  });

  it('rejects oversized payloads', () => {
    expect(checkFormAbuse({
      email: 'sam@example.com',
      formId: 'contact',
      message: 'Large',
      payloadSize: 8_001,
    })).toEqual({ allowed: false, reason: 'payload-too-large' });
  });

  it('measures form payload size without exposing field values', () => {
    const formData = new FormData();
    formData.set('email', 'sam@example.com');
    formData.set('details', 'Hello');

    expect(getFormPayloadSize(formData)).toBeGreaterThan(0);
  });
});
