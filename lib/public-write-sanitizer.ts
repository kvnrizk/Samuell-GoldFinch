import type { PayloadRequest } from 'payload';

type PublicWriteData = Record<string, unknown>;

export const INQUIRY_PUBLIC_CREATE_FIELDS = [
  'name',
  'email',
  'phone',
  'service',
  'eventDate',
  'guestCount',
  'budget',
  'details',
  'source',
] as const;

export const INQUIRY_INTERNAL_FIELDS = [
  'status',
  'internalNotes',
  'leadScore',
  'leadTier',
  'estimatedValue',
  'lastContactedAt',
] as const;

export const VENUE_INQUIRY_PUBLIC_CREATE_FIELDS = [
  'venueName',
  'address',
  'website',
  'instagram',
  'venueType',
  'capacity',
  'hasDancePocket',
  'currentProgramming',
  'goal',
  'monthlyBudget',
  'decisionMaker',
  'contactName',
  'contactWhatsApp',
  'contactEmail',
  'timeline',
] as const;

export const VENUE_INQUIRY_INTERNAL_FIELDS = [
  'roomPhotos',
  'source',
  'status',
  'internalNotes',
  'leadScore',
  'leadTier',
  'estimatedValue',
  'lastContactedAt',
  'contractValue',
  'monthlyValue',
  'annualValue',
] as const;

const INQUIRY_SOURCES = ['contact-page', 'quote-page'] as const;

function pickAllowed(data: PublicWriteData | undefined, allowed: readonly string[]) {
  const next: PublicWriteData = {};
  if (!data) return next;

  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      next[field] = data[field];
    }
  }

  return next;
}

export function isUnauthenticatedCreate(operation: string, req: PayloadRequest): boolean {
  return operation === 'create' && !req.user;
}

export function sanitizePublicInquiryCreate(data: PublicWriteData | undefined): PublicWriteData {
  const next = pickAllowed(data, INQUIRY_PUBLIC_CREATE_FIELDS);
  const source = typeof next.source === 'string' ? next.source : '';

  next.source = INQUIRY_SOURCES.includes(source as (typeof INQUIRY_SOURCES)[number])
    ? source
    : 'contact-page';
  next.status = 'new';

  return next;
}

export function sanitizePublicVenueInquiryCreate(data: PublicWriteData | undefined): PublicWriteData {
  const next = pickAllowed(data, VENUE_INQUIRY_PUBLIC_CREATE_FIELDS);
  const budget = typeof next.monthlyBudget === 'string' ? next.monthlyBudget : '';

  next.source = 'venue-form';
  next.status = budget && budget !== 'under-2k' ? 'qualified' : 'new';

  return next;
}
