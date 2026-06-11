import { describe, expect, it } from 'vitest';
import { buildCSV, escapeCSV, getCSVColumns } from '../lib/csv-export';

describe('CSV export helpers', () => {
  it('escapes commas, quotes, and newlines', () => {
    expect(escapeCSV('A, "quoted"\nvalue')).toBe('"A, ""quoted""\nvalue"');
  });

  it('keeps inquiry headers and rows aligned', () => {
    const csv = buildCSV('inquiries', [{
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'wedding-film',
      eventDate: '2026-06-01',
      guestCount: 120,
      budget: '5000',
      details: 'Details',
      source: 'contact-page',
      status: 'new',
      internalNotes: 'Notes',
      createdAt: '2026-05-05T00:00:00.000Z',
    }]);

    const [header, row] = csv.split('\n');
    expect(header.split(',')).toHaveLength(getCSVColumns('inquiries').length);
    expect(row.split(',')).toHaveLength(getCSVColumns('inquiries').length);
  });

  it('keeps venue inquiry headers and rows aligned', () => {
    const csv = buildCSV('venue-inquiries', [{
      venueName: 'Venue',
      address: 'Paris',
      website: 'https://example.com',
      instagram: '@venue',
      venueType: 'club',
      capacity: 300,
      hasDancePocket: true,
      currentProgramming: 'Weekly',
      goal: ['more-tables'],
      monthlyBudget: '5k-10k',
      decisionMaker: 'owner',
      contactName: 'Owner',
      contactWhatsApp: '+33123456789',
      contactEmail: 'owner@example.com',
      timeline: 'asap',
      source: 'venue-form',
      status: 'qualified',
      internalNotes: 'Notes',
      createdAt: '2026-05-05T00:00:00.000Z',
    }]);

    const [header, row] = csv.split('\n');
    expect(header.split(',')).toHaveLength(getCSVColumns('venue-inquiries').length);
    expect(row.split(',')).toHaveLength(getCSVColumns('venue-inquiries').length);
  });
});
