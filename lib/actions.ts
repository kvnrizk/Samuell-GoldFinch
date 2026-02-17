'use server';

import { getPayload } from './payload';
import { Resend } from 'resend';
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

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(input: string, maxLength: number): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface FormResult {
  success: boolean;
  error?: string;
}

export async function submitContactForm(formData: FormData): Promise<FormResult> {
  const honeypot = formData.get('_hp') as string;
  if (honeypot) return { success: true };

  const name = sanitize((formData.get('name') as string) || '', 100);
  const email = sanitize((formData.get('email') as string) || '', 254);
  const projectType = sanitize((formData.get('projectType') as string) || '', 200);
  const details = sanitize((formData.get('details') as string) || '', 5000);

  if (!name || !email) {
    return { success: false, error: 'Name and email are required.' };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
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
        status: 'new',
      },
    });

    try {
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
    } catch {
      // Email failed but inquiry saved — don't lose the lead
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' };
  }
}

export async function submitQuoteForm(formData: FormData): Promise<FormResult> {
  const honeypot = formData.get('_hp') as string;
  if (honeypot) return { success: true };

  const name = sanitize((formData.get('name') as string) || '', 100);
  const email = sanitize((formData.get('email') as string) || '', 254);
  const phone = sanitize((formData.get('phone') as string) || '', 30);
  const service = (formData.get('service') as string) || '';
  const eventDate = sanitize((formData.get('eventDate') as string) || '', 100);
  const guestCount = parseInt((formData.get('guestCount') as string) || '0', 10) || undefined;
  const budget = sanitize((formData.get('budget') as string) || '', 100);
  const details = sanitize((formData.get('details') as string) || '', 5000);

  if (!name || !email) {
    return { success: false, error: 'Name and email are required.' };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }
  if (phone && phone.replace(/\D/g, '').length < 8) {
    return { success: false, error: 'Please provide a valid phone number.' };
  }

  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
        phone,
        service: service as 'wedding-film' | 'editorial-commercial' | 'event-production' | 'dj-performance' | 'hybrid-package',
        eventDate,
        guestCount,
        budget,
        details,
        source: 'quote-page',
        status: 'new',
      },
    });

    try {
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
    } catch {
      // Email failed but inquiry saved
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' };
  }
}

export async function submitVenueInquiry(formData: FormData): Promise<FormResult> {
  const honeypot = formData.get('_hp') as string;
  if (honeypot) return { success: true };

  const venueName = sanitize((formData.get('venueName') as string) || '', 200);
  const address = sanitize((formData.get('address') as string) || '', 300);
  const website = sanitize((formData.get('website') as string) || '', 200);
  const instagram = sanitize((formData.get('instagram') as string) || '', 100);
  const venueType = (formData.get('venueType') as string) || '';
  const capacity = parseInt((formData.get('capacity') as string) || '0', 10) || undefined;
  const hasDancePocket = formData.has('hasDancePocket');
  const currentProgramming = sanitize((formData.get('currentProgramming') as string) || '', 1000);
  const goals = formData.getAll('goal') as string[];
  const monthlyBudget = (formData.get('monthlyBudget') as string) || '';
  const decisionMaker = (formData.get('decisionMaker') as string) || '';
  const contactName = sanitize((formData.get('contactName') as string) || '', 100);
  const contactWhatsApp = sanitize((formData.get('contactWhatsApp') as string) || '', 30);
  const contactEmail = sanitize((formData.get('contactEmail') as string) || '', 254);
  const timeline = (formData.get('timeline') as string) || '';

  if (!venueName || !contactName || !contactEmail || !monthlyBudget) {
    return { success: false, error: 'Please fill in all required fields.' };
  }
  if (!isValidEmail(contactEmail)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const isQualified = monthlyBudget !== 'under-2k';

  try {
    const payload = await getPayload();

    await payload.create({
      collection: 'venue-inquiries',
      data: {
        venueName,
        address,
        website,
        instagram,
        venueType: venueType as 'bar' | 'brasserie' | 'club' | 'resto-festif' | 'hybrid',
        capacity,
        hasDancePocket,
        currentProgramming,
        goal: goals as ('more-tables' | 'better-crowd' | 'stronger-brand' | 'higher-spend' | 'signature-night')[],
        monthlyBudget: monthlyBudget as 'under-2k' | '2k-5k' | '5k-10k' | '10k-plus',
        decisionMaker: decisionMaker as 'owner' | 'gm' | 'event-manager',
        contactName,
        contactWhatsApp,
        contactEmail,
        timeline: timeline as 'asap' | 'next-month' | 'next-season',
        source: 'venue-form',
        status: isQualified ? 'qualified' : 'new',
      },
    });

    const settings = await payload.findGlobal({ slug: 'global-settings' });
    const calendlyUrl = (settings as Record<string, unknown>).calendlyUrl as string || 'https://calendly.com/samuellgoldfinch';

    try {
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
    } catch {
      // Email failed but venue inquiry saved
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
