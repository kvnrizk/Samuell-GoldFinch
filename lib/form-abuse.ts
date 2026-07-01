import { createHash } from 'node:crypto';

type FormId = 'contact' | 'quote' | 'venue';
type AbuseReason = 'duplicate' | 'payload-too-large' | 'rate-limit';

interface AbuseInput {
  email?: string;
  formId: FormId;
  ip?: string;
  message?: string;
  payloadSize: number;
  phone?: string;
  now?: number;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_KEY = 5;

const MAX_PAYLOAD_SIZE: Record<FormId, number> = {
  contact: 8_000,
  quote: 9_000,
  venue: 12_000,
};

const submissions = new Map<string, number[]>();
const duplicates = new Map<string, number>();

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || '';
}

function normalizePhone(phone?: string) {
  return phone?.replace(/\D/g, '') || '';
}

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function getRateKey(input: AbuseInput) {
  if (input.ip) return `${input.formId}:ip:${input.ip}`;

  const email = normalizeEmail(input.email);
  if (email) return `${input.formId}:email:${email}`;

  const phone = normalizePhone(input.phone);
  if (phone) return `${input.formId}:phone:${phone}`;

  return undefined;
}

function getDuplicateKey(input: AbuseInput) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const message = input.message?.trim().toLowerCase() || '';

  if (!email && !phone) return undefined;

  return `${input.formId}:duplicate:${hash([email, phone, message].join('|'))}`;
}

function cleanup(now: number) {
  for (const [key, timestamps] of submissions) {
    const active = timestamps.filter((timestamp) => now - timestamp <= RATE_LIMIT_WINDOW_MS);
    if (active.length > 0) submissions.set(key, active);
    else submissions.delete(key);
  }

  for (const [key, expiresAt] of duplicates) {
    if (expiresAt <= now) duplicates.delete(key);
  }
}

export function getFormPayloadSize(formData: FormData) {
  let size = 0;

  for (const [key, value] of formData.entries()) {
    size += Buffer.byteLength(key);
    if (typeof value === 'string') {
      size += Buffer.byteLength(value);
    } else {
      size += value.size;
    }
  }

  return size;
}

export function checkFormAbuse(input: AbuseInput): { allowed: true } | { allowed: false; reason: AbuseReason } {
  const now = input.now ?? Date.now();
  cleanup(now);

  if (input.payloadSize > MAX_PAYLOAD_SIZE[input.formId]) {
    return { allowed: false, reason: 'payload-too-large' };
  }

  const rateKey = getRateKey(input);
  if (rateKey) {
    const active = submissions.get(rateKey) || [];
    if (active.length >= MAX_SUBMISSIONS_PER_KEY) {
      return { allowed: false, reason: 'rate-limit' };
    }
    submissions.set(rateKey, [...active, now]);
  }

  const duplicateKey = getDuplicateKey(input);
  if (duplicateKey) {
    if (duplicates.has(duplicateKey)) {
      return { allowed: false, reason: 'duplicate' };
    }
    duplicates.set(duplicateKey, now + DUPLICATE_WINDOW_MS);
  }

  return { allowed: true };
}

export function resetFormAbuseForTests() {
  submissions.clear();
  duplicates.clear();
}
