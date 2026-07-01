'use server';

import { getPayload } from './payload';
import { getResend } from './resend';
import { checkFormAbuse, getFormPayloadSize } from './form-abuse';
import {
  contactNotification,
  contactAutoReply,
  quoteNotification,
  quoteAutoReply,
  venueQualifiedNotification,
  venueQualifiedAutoReply,
  venueUnderBudgetNotification,
  venueStarterNightAutoReply,
} from './email-templates';

function sanitize(input: string, maxLength: number): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function sanitizeMultiline(input: string, maxLength: number): string {
  return input
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const QUOTE_SERVICES = ['wedding-film', 'editorial-commercial', 'event-production', 'dj-performance', 'hybrid-package'] as const;
type QuoteService = (typeof QUOTE_SERVICES)[number];

const VENUE_TYPES = ['bar', 'brasserie', 'club', 'resto-festif', 'hybrid'] as const;
type VenueType = (typeof VENUE_TYPES)[number];

const VENUE_GOALS = ['more-tables', 'better-crowd', 'stronger-brand', 'higher-spend', 'signature-night'] as const;
type VenueGoal = (typeof VENUE_GOALS)[number];

const VENUE_BUDGETS = ['under-2k', '2k-5k', '5k-10k', '10k-plus'] as const;
type VenueBudget = (typeof VENUE_BUDGETS)[number];

const VENUE_DECISION_MAKERS = ['owner', 'gm', 'event-manager'] as const;
type VenueDecisionMaker = (typeof VENUE_DECISION_MAKERS)[number];

const VENUE_TIMELINES = ['asap', 'next-month', 'next-season'] as const;
type VenueTimeline = (typeof VENUE_TIMELINES)[number];

function inEnum<T extends string>(allowed: readonly T[], value: string): value is T {
  return (allowed as readonly string[]).includes(value);
}

interface FormResult {
  success: boolean;
  error?: string;
}

const CONTACT_GENERIC_ERROR = 'Something went wrong. Please try again or email us directly.';
const VENUE_GENERIC_ERROR = 'Something went wrong. Please try again.';

async function getClientIp(): Promise<string | undefined> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();

    return (
      headersList.get('x-real-ip') ||
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      undefined
    );
  } catch {
    return undefined;
  }
}

export async function submitContactForm(formData: FormData): Promise<FormResult> {
  const honeypot = formData.get('_hp') as string;
  if (honeypot) return { success: true };
  const payloadSize = getFormPayloadSize(formData);

  const name = sanitize((formData.get('name') as string) || '', 100);
  const email = sanitize((formData.get('email') as string) || '', 254);
  const projectType = sanitize((formData.get('projectType') as string) || '', 200);
  const details = sanitizeMultiline((formData.get('details') as string) || '', 5000);

  if (!name || !email) {
    return { success: false, error: 'Name and email are required.' };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const abuse = checkFormAbuse({
    email,
    formId: 'contact',
    ip: await getClientIp(),
    message: details,
    payloadSize,
  });
  if (!abuse.allowed) {
    return { success: false, error: CONTACT_GENERIC_ERROR };
  }

  // Map contact projectType to collection service values
  const serviceMap: Record<string, string> = {
    'Wedding Film': 'wedding-film',
    'Editorial / Brand': 'editorial-commercial',
    'DJ Booking / Live Performance': 'dj-performance',
    'Event Curation': 'event-production',
  };
  const service = serviceMap[projectType] as 'wedding-film' | 'editorial-commercial' | 'event-production' | 'dj-performance' | undefined;

  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
        ...(service ? { service } : {}),
        details,
        source: 'contact-page',
      },
    });

    try {
      const resend = getResend();
      await resend.emails.send({
        from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
        to: 'contact@samuellgoldfinch.com',
        subject: `New Contact Inquiry from ${name}`,
        html: contactNotification({ name, email, projectType, details }),
      });

      await resend.emails.send({
        from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
        to: email,
        subject: 'Thank you for reaching out — Samuell Goldfinch',
        html: contactAutoReply({ name, email }),
      });
    } catch (err) {
      console.error('[submitContactForm] email send failed — lead saved to CMS', err);
    }

    return { success: true };
  } catch (err) {
    console.error('[submitContactForm] failed to save inquiry', err);
    return { success: false, error: CONTACT_GENERIC_ERROR };
  }
}

export async function submitQuoteForm(formData: FormData): Promise<FormResult> {
  const honeypot = formData.get('_hp') as string;
  if (honeypot) return { success: true };
  const payloadSize = getFormPayloadSize(formData);

  const name = sanitize((formData.get('name') as string) || '', 100);
  const email = sanitize((formData.get('email') as string) || '', 254);
  const phone = sanitize((formData.get('phone') as string) || '', 30);
  const serviceRaw = sanitize((formData.get('service') as string) || '', 50);
  const eventDate = sanitize((formData.get('eventDate') as string) || '', 100);
  const guestCount = parseInt((formData.get('guestCount') as string) || '0', 10) || undefined;
  const budget = sanitize((formData.get('budget') as string) || '', 100);
  const details = sanitizeMultiline((formData.get('details') as string) || '', 5000);

  if (!name || !email) {
    return { success: false, error: 'Name and email are required.' };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }
  if (phone && phone.replace(/\D/g, '').length < 8) {
    return { success: false, error: 'Please provide a valid phone number.' };
  }
  if (serviceRaw && !inEnum(QUOTE_SERVICES, serviceRaw)) {
    return { success: false, error: 'Please select a valid service.' };
  }
  const service = serviceRaw as QuoteService | '';

  const abuse = checkFormAbuse({
    email,
    formId: 'quote',
    ip: await getClientIp(),
    message: details,
    payloadSize,
    phone,
  });
  if (!abuse.allowed) {
    return { success: false, error: CONTACT_GENERIC_ERROR };
  }

  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
        phone,
        ...(service ? { service } : {}),
        eventDate,
        guestCount,
        budget,
        details,
        source: 'quote-page',
      },
    });

    try {
      const resend = getResend();
      await resend.emails.send({
        from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
        to: 'contact@samuellgoldfinch.com',
        subject: `New Quote Request from ${name}`,
        html: quoteNotification({ name, email, phone, service, eventDate, guestCount, budget, details }),
      });

      await resend.emails.send({
        from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
        to: email,
        subject: 'Thank you for your quote request — Samuell Goldfinch',
        html: quoteAutoReply({ name, email }),
      });
    } catch (err) {
      console.error('[submitQuoteForm] email send failed — lead saved to CMS', err);
    }

    return { success: true };
  } catch (err) {
    console.error('[submitQuoteForm] failed to save inquiry', err);
    return { success: false, error: CONTACT_GENERIC_ERROR };
  }
}

export async function submitVenueInquiry(formData: FormData): Promise<FormResult> {
  const honeypot = formData.get('_hp') as string;
  if (honeypot) return { success: true };
  const payloadSize = getFormPayloadSize(formData);

  const venueName = sanitize((formData.get('venueName') as string) || '', 200);
  const address = sanitize((formData.get('address') as string) || '', 300);
  const website = sanitize((formData.get('website') as string) || '', 200);
  const instagram = sanitize((formData.get('instagram') as string) || '', 100);
  const venueTypeRaw = sanitize((formData.get('venueType') as string) || '', 50);
  const capacity = parseInt((formData.get('capacity') as string) || '0', 10) || undefined;
  const hasDancePocket = formData.has('hasDancePocket');
  const currentProgramming = sanitizeMultiline((formData.get('currentProgramming') as string) || '', 1000);
  const goalsRaw = (formData.getAll('goal') as string[]).map((g) => sanitize(g, 50));
  const monthlyBudgetRaw = sanitize((formData.get('monthlyBudget') as string) || '', 30);
  const decisionMakerRaw = sanitize((formData.get('decisionMaker') as string) || '', 30);
  const contactName = sanitize((formData.get('contactName') as string) || '', 100);
  const contactWhatsApp = sanitize((formData.get('contactWhatsApp') as string) || '', 30);
  const contactEmail = sanitize((formData.get('contactEmail') as string) || '', 254);
  const timelineRaw = sanitize((formData.get('timeline') as string) || '', 30);

  if (!venueName || !contactName || !contactEmail || !monthlyBudgetRaw || !contactWhatsApp) {
    return { success: false, error: 'Please fill in all required fields.' };
  }
  if (contactWhatsApp.replace(/\D/g, '').length < 8) {
    return { success: false, error: 'Please provide a valid WhatsApp number.' };
  }
  if (!isValidEmail(contactEmail)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }
  if (venueTypeRaw && !inEnum(VENUE_TYPES, venueTypeRaw)) {
    return { success: false, error: 'Please select a valid venue type.' };
  }
  if (!inEnum(VENUE_BUDGETS, monthlyBudgetRaw)) {
    return { success: false, error: 'Please select a valid monthly budget.' };
  }
  if (decisionMakerRaw && !inEnum(VENUE_DECISION_MAKERS, decisionMakerRaw)) {
    return { success: false, error: 'Please select a valid decision maker.' };
  }
  if (timelineRaw && !inEnum(VENUE_TIMELINES, timelineRaw)) {
    return { success: false, error: 'Please select a valid timeline.' };
  }
  const goals = goalsRaw.filter((g): g is VenueGoal => inEnum(VENUE_GOALS, g));

  const venueType = venueTypeRaw as VenueType | '';
  const monthlyBudget = monthlyBudgetRaw as VenueBudget;
  const decisionMaker = decisionMakerRaw as VenueDecisionMaker | '';
  const timeline = timelineRaw as VenueTimeline | '';
  const isQualified = monthlyBudget !== 'under-2k';

  const abuse = checkFormAbuse({
    email: contactEmail,
    formId: 'venue',
    ip: await getClientIp(),
    message: currentProgramming,
    payloadSize,
    phone: contactWhatsApp,
  });
  if (!abuse.allowed) {
    return { success: false, error: VENUE_GENERIC_ERROR };
  }

  try {
    const payload = await getPayload();

    await payload.create({
      collection: 'venue-inquiries',
      data: {
        venueName,
        address,
        website,
        instagram,
        ...(venueType ? { venueType } : {}),
        capacity,
        hasDancePocket,
        currentProgramming,
        goal: goals,
        monthlyBudget,
        ...(decisionMaker ? { decisionMaker } : {}),
        contactName,
        contactWhatsApp,
        contactEmail,
        ...(timeline ? { timeline } : {}),
        source: 'venue-form',
      },
    });

    const settings = await payload.findGlobal({ slug: 'global-settings' });
    const calendlyUrl = (settings as unknown as Record<string, unknown>).calendlyUrl as string || 'https://calendly.com/samuellgoldfinch';

    try {
      const resend = getResend();
      if (isQualified) {
        const venueData = { venueName, contactName, contactEmail, contactWhatsApp, venueType, capacity, monthlyBudget, goals, timeline, currentProgramming, calendlyUrl };

        await resend.emails.send({
          from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
          to: 'contact@samuellgoldfinch.com',
          subject: `Qualified Venue Lead: ${venueName} (${monthlyBudget})`,
          html: venueQualifiedNotification(venueData),
        });

        await resend.emails.send({
          from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
          to: contactEmail,
          subject: `Your venue inquiry — Samuell Goldfinch`,
          html: venueQualifiedAutoReply(venueData),
        });
      } else {
        const venueData = { venueName, contactName, contactEmail, contactWhatsApp, venueType, capacity, monthlyBudget, goals, timeline, currentProgramming, calendlyUrl };

        await resend.emails.send({
          from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
          to: 'contact@samuellgoldfinch.com',
          subject: `Venue Inquiry (under budget): ${venueName}`,
          html: venueUnderBudgetNotification(venueData),
        });

        await resend.emails.send({
          from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
          to: contactEmail,
          subject: `Starter Night — Perfect for ${venueName}`,
          html: venueStarterNightAutoReply(venueData),
        });
      }
    } catch (err) {
      console.error('[submitVenueInquiry] email send failed — lead saved to CMS', err);
    }

    return { success: true };
  } catch (err) {
    console.error('[submitVenueInquiry] failed to save venue inquiry', err);
    return { success: false, error: VENUE_GENERIC_ERROR };
  }
}
