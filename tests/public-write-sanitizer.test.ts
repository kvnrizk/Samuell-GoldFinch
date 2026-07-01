import { describe, expect, it } from 'vitest';

import {
  INQUIRY_INTERNAL_FIELDS,
  VENUE_INQUIRY_INTERNAL_FIELDS,
  sanitizePublicInquiryCreate,
  sanitizePublicVenueInquiryCreate,
} from '../lib/public-write-sanitizer';

describe('public write sanitizer', () => {
  it('keeps allowed inquiry fields and protects internal fields', () => {
    const sanitized = sanitizePublicInquiryCreate({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'wedding-film',
      details: 'Hello',
      source: 'quote-page',
      status: 'booked',
      internalNotes: 'Injected',
      leadScore: 100,
      leadTier: 'hot',
      estimatedValue: 999999,
      lastContactedAt: '2026-07-01',
    });

    expect(sanitized).toMatchObject({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'wedding-film',
      details: 'Hello',
      source: 'quote-page',
      status: 'new',
    });

    for (const field of INQUIRY_INTERNAL_FIELDS) {
      if (field !== 'status') {
        expect(sanitized).not.toHaveProperty(field);
      }
    }
  });

  it('defaults unsafe inquiry source values to contact-page', () => {
    expect(sanitizePublicInquiryCreate({ source: 'admin-import' })).toMatchObject({
      source: 'contact-page',
      status: 'new',
    });
  });

  it('keeps allowed venue inquiry fields and protects internal fields', () => {
    const sanitized = sanitizePublicVenueInquiryCreate({
      venueName: 'Club Test',
      address: 'Paris',
      website: 'https://example.com',
      instagram: '@club',
      venueType: 'club',
      capacity: 250,
      hasDancePocket: true,
      currentProgramming: 'Weekly DJs',
      goal: ['better-crowd'],
      monthlyBudget: '2k-5k',
      decisionMaker: 'owner',
      contactName: 'Owner',
      contactWhatsApp: '+33123456789',
      contactEmail: 'owner@example.com',
      timeline: 'asap',
      roomPhotos: [{ photo: 'media-id' }],
      source: 'deck-download',
      status: 'signed',
      internalNotes: 'Injected',
      leadScore: 100,
      contractValue: 999999,
      monthlyValue: 9999,
      annualValue: 99999,
    });

    expect(sanitized).toMatchObject({
      venueName: 'Club Test',
      address: 'Paris',
      website: 'https://example.com',
      instagram: '@club',
      venueType: 'club',
      capacity: 250,
      hasDancePocket: true,
      currentProgramming: 'Weekly DJs',
      goal: ['better-crowd'],
      monthlyBudget: '2k-5k',
      decisionMaker: 'owner',
      contactName: 'Owner',
      contactWhatsApp: '+33123456789',
      contactEmail: 'owner@example.com',
      timeline: 'asap',
      source: 'venue-form',
      status: 'qualified',
    });

    for (const field of VENUE_INQUIRY_INTERNAL_FIELDS) {
      if (field !== 'source' && field !== 'status') {
        expect(sanitized).not.toHaveProperty(field);
      }
    }
  });

  it('keeps under-budget venue inquiries as new', () => {
    expect(sanitizePublicVenueInquiryCreate({ monthlyBudget: 'under-2k' })).toMatchObject({
      source: 'venue-form',
      status: 'new',
    });
  });
});
