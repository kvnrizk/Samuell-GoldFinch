import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  findGlobal: vi.fn(),
  emailSend: vi.fn(),
}));

vi.mock('../lib/payload', () => ({
  getPayload: vi.fn(async () => ({
    create: mocks.create,
    findGlobal: mocks.findGlobal,
  })),
}));

vi.mock('../lib/resend', () => ({
  getResend: () => ({
    emails: { send: mocks.emailSend },
  }),
}));

import { submitContactForm, submitQuoteForm, submitVenueInquiry } from '../lib/actions';

function form(entries: Record<string, string | string[]>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (Array.isArray(value)) {
      for (const item of value) data.append(key, item);
    } else {
      data.set(key, value);
    }
  }
  return data;
}

describe('form actions', () => {
  beforeEach(() => {
    mocks.create.mockReset();
    mocks.findGlobal.mockReset();
    mocks.emailSend.mockReset();
    mocks.create.mockResolvedValue({});
    mocks.findGlobal.mockResolvedValue({});
    mocks.emailSend.mockResolvedValue({});
  });

  it('saves valid contact submissions through Payload', async () => {
    const result = await submitContactForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      projectType: 'Wedding Film',
      details: 'Wedding in Paris',
    }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      collection: 'inquiries',
      data: expect.objectContaining({
        name: 'Sam',
        email: 'sam@example.com',
        service: 'wedding-film',
        source: 'contact-page',
        status: 'new',
      }),
    }));
  });

  it('saves valid quote submissions through Payload', async () => {
    const result = await submitQuoteForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'dj-performance',
      eventDate: 'September 2026',
      guestCount: '120',
      budget: '5000-10000',
      details: 'Private event',
    }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      collection: 'inquiries',
      data: expect.objectContaining({
        name: 'Sam',
        email: 'sam@example.com',
        service: 'dj-performance',
        source: 'quote-page',
        status: 'new',
      }),
    }));
  });

  it('saves valid venue submissions through Payload', async () => {
    const result = await submitVenueInquiry(form({
      venueName: 'Club Test',
      contactName: 'Owner',
      contactEmail: 'owner@example.com',
      contactWhatsApp: '+33123456789',
      monthlyBudget: '2k-5k',
      venueType: 'club',
      goal: ['more-tables', 'higher-spend'],
    }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      collection: 'venue-inquiries',
      data: expect.objectContaining({
        venueName: 'Club Test',
        contactName: 'Owner',
        contactEmail: 'owner@example.com',
        monthlyBudget: '2k-5k',
        source: 'venue-form',
        status: 'qualified',
      }),
    }));
  });
  it('short-circuits honeypot submissions without touching Payload or Resend', async () => {
    const result = await submitContactForm(form({ _hp: 'bot', name: 'Bot', email: 'bot@example.com' }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.emailSend).not.toHaveBeenCalled();
  });

  it('rejects invalid contact emails before persistence', async () => {
    const result = await submitContactForm(form({ name: 'Sam', email: 'not-an-email' }));

    expect(result.success).toBe(false);
    expect(result.error).toContain('valid email');
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('rejects invalid quote services before persistence', async () => {
    const result = await submitQuoteForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      service: 'invalid-service',
    }));

    expect(result.success).toBe(false);
    expect(result.error).toContain('valid service');
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('rejects venue inquiries without a WhatsApp number before persistence', async () => {
    const result = await submitVenueInquiry(form({
      venueName: 'Club Test',
      contactName: 'Owner',
      contactEmail: 'owner@example.com',
      monthlyBudget: '2k-5k',
    }));

    expect(result.success).toBe(false);
    expect(result.error).toContain('required');
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
