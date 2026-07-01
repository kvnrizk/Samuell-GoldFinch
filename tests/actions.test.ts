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
import { resetFormAbuseForTests } from '../lib/form-abuse';

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
    resetFormAbuseForTests();
    mocks.create.mockReset();
    mocks.findGlobal.mockReset();
    mocks.emailSend.mockReset();
    mocks.create.mockResolvedValue({});
    mocks.findGlobal.mockResolvedValue({});
    mocks.emailSend.mockResolvedValue({});
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

  it('submits contact form data without internal inquiry fields', async () => {
    const result = await submitContactForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      projectType: 'Wedding Film',
      details: '<b>Hello</b>',
    }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledTimes(1);

    const call = mocks.create.mock.calls[0][0];
    expect(call.collection).toBe('inquiries');
    expect(call.data).toMatchObject({
      name: 'Sam',
      email: 'sam@example.com',
      service: 'wedding-film',
      details: 'Hello',
      source: 'contact-page',
    });
    expect(call.data).not.toHaveProperty('status');
    expect(call.data).not.toHaveProperty('internalNotes');
    expect(call.data).not.toHaveProperty('leadScore');
  });

  it('rejects duplicate contact submissions before persistence', async () => {
    const data = form({
      name: 'Sam',
      email: 'sam@example.com',
      projectType: 'Wedding Film',
      details: 'Same inquiry',
    });

    expect(await submitContactForm(data)).toEqual({ success: true });

    const duplicate = await submitContactForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      projectType: 'Wedding Film',
      details: 'Same inquiry',
    }));

    expect(duplicate.success).toBe(false);
    expect(duplicate.error).toContain('Something went wrong');
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });

  it('rejects oversized contact payloads before persistence', async () => {
    const result = await submitContactForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      details: 'x'.repeat(9000),
    }));

    expect(result.success).toBe(false);
    expect(result.error).toContain('Something went wrong');
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

  it('submits quote form data without internal inquiry fields', async () => {
    const result = await submitQuoteForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'editorial-commercial',
      eventDate: 'September',
      guestCount: '120',
      budget: '5000',
      details: 'Brand film',
    }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledTimes(1);

    const call = mocks.create.mock.calls[0][0];
    expect(call.collection).toBe('inquiries');
    expect(call.data).toMatchObject({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'editorial-commercial',
      eventDate: 'September',
      guestCount: 120,
      budget: '5000',
      details: 'Brand film',
      source: 'quote-page',
    });
    expect(call.data).not.toHaveProperty('status');
    expect(call.data).not.toHaveProperty('internalNotes');
    expect(call.data).not.toHaveProperty('estimatedValue');
  });

  it('rate-limits repeated quote submissions by fallback email when IP is unavailable', async () => {
    for (let i = 0; i < 5; i += 1) {
      const result = await submitQuoteForm(form({
        name: 'Sam',
        email: 'sam@example.com',
        phone: '+33123456789',
        service: 'editorial-commercial',
        details: `Brand film ${i}`,
      }));

      expect(result).toEqual({ success: true });
    }

    const limited = await submitQuoteForm(form({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '+33123456789',
      service: 'editorial-commercial',
      details: 'Brand film 6',
    }));

    expect(limited.success).toBe(false);
    expect(limited.error).toContain('Something went wrong');
    expect(mocks.create).toHaveBeenCalledTimes(5);
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

  it('submits venue inquiry data without internal venue fields', async () => {
    const result = await submitVenueInquiry(form({
      venueName: 'Club Test',
      address: 'Paris',
      website: 'https://example.com',
      instagram: '@club',
      venueType: 'club',
      capacity: '250',
      hasDancePocket: 'on',
      currentProgramming: 'Weekly DJs',
      goal: ['better-crowd', 'signature-night'],
      monthlyBudget: '2k-5k',
      decisionMaker: 'owner',
      contactName: 'Owner',
      contactWhatsApp: '+33123456789',
      contactEmail: 'owner@example.com',
      timeline: 'asap',
    }));

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledTimes(1);

    const call = mocks.create.mock.calls[0][0];
    expect(call.collection).toBe('venue-inquiries');
    expect(call.data).toMatchObject({
      venueName: 'Club Test',
      address: 'Paris',
      website: 'https://example.com',
      instagram: '@club',
      venueType: 'club',
      capacity: 250,
      hasDancePocket: true,
      currentProgramming: 'Weekly DJs',
      goal: ['better-crowd', 'signature-night'],
      monthlyBudget: '2k-5k',
      decisionMaker: 'owner',
      contactName: 'Owner',
      contactWhatsApp: '+33123456789',
      contactEmail: 'owner@example.com',
      timeline: 'asap',
      source: 'venue-form',
    });
    expect(call.data).not.toHaveProperty('status');
    expect(call.data).not.toHaveProperty('contractValue');
    expect(call.data).not.toHaveProperty('leadScore');
    expect(call.data).not.toHaveProperty('internalNotes');
  });

  it('rejects duplicate venue submissions before persistence', async () => {
    const data = {
      venueName: 'Club Test',
      monthlyBudget: '2k-5k',
      contactName: 'Owner',
      contactWhatsApp: '+33123456789',
      contactEmail: 'owner@example.com',
      currentProgramming: 'Same program',
    };

    expect(await submitVenueInquiry(form(data))).toEqual({ success: true });

    const duplicate = await submitVenueInquiry(form(data));

    expect(duplicate.success).toBe(false);
    expect(duplicate.error).toContain('Something went wrong');
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
});
