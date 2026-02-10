'use server';

import { getPayload } from './payload';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(input: string, maxLength: number): string {
  return input
    .replace(/<[^>]*>/g, '')
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

  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
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
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
          <p><strong>Details:</strong></p>
          <p>${details || 'No details provided'}</p>
        `,
      });

      await resend.emails.send({
        from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
        to: email,
        subject: 'Thank you for reaching out — Samuell Goldfinch',
        html: `
          <h2>Thank you, ${name}</h2>
          <p>We've received your inquiry and will respond within <strong>48 hours</strong> with a personalized reply.</p>
          <p>For urgent matters, feel free to reach out directly:</p>
          <p>Email: contact@samuellgoldfinch.com<br>Phone: +33 6 05 88 39 66</p>
          <p style="color:#999;font-size:12px;">— Samuell Goldfinch</p>
        `,
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
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service || 'Not specified'}</p>
          <p><strong>Date:</strong> ${eventDate || 'Not specified'}</p>
          <p><strong>Guests:</strong> ${guestCount || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Details:</strong></p>
          <p>${details || 'No details provided'}</p>
        `,
      });

      await resend.emails.send({
        from: 'Samuell Goldfinch <noreply@samuellgoldfinch.com>',
        to: email,
        subject: 'Thank you for your quote request — Samuell Goldfinch',
        html: `
          <h2>Thank you, ${name}</h2>
          <p>We've received your bespoke quote request and will respond within <strong>48 hours</strong>.</p>
          <p>For urgent matters:</p>
          <p>Email: contact@samuellgoldfinch.com<br>Phone: +33 6 05 88 39 66</p>
          <p style="color:#999;font-size:12px;">— Samuell Goldfinch</p>
        `,
      });
    } catch {
      // Email failed but inquiry saved
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' };
  }
}
