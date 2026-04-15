import { emailLayout, heading, paragraph, dataTable, divider, goldBadge, esc, escAttr } from './base';

interface QuoteData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  eventDate?: string;
  guestCount?: number;
  budget?: string;
  details?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  'wedding-film': 'Wedding Film',
  'editorial-commercial': 'Editorial & Commercial',
  'event-production': 'Event Production',
  'dj-performance': 'DJ Performance',
  'hybrid-package': 'Hybrid Package',
};

export function quoteNotification(data: QuoteData): string {
  const name = esc(data.name);
  const email = esc(data.email);
  const emailAttr = escAttr(data.email);
  const serviceLabel = SERVICE_LABELS[data.service || ''] || data.service || 'Not specified';
  return emailLayout(`
    ${goldBadge('Quote Request')}
    ${heading(`Quote from ${name}`)}
    ${dataTable([
      ['Name', name],
      ['Email', `<a href="mailto:${emailAttr}" style="color:#c8a96e;text-decoration:none;">${email}</a>`],
      ['Phone', esc(data.phone) || 'Not provided'],
      ['Service', esc(serviceLabel)],
      ['Event Date', esc(data.eventDate) || 'Not specified'],
      ['Guests', data.guestCount ? String(data.guestCount) : 'Not specified'],
      ['Budget', esc(data.budget) || 'Not specified'],
    ])}
    ${data.details ? `
      ${divider()}
      <p style="margin:0 0 8px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;">Project Details</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#e7e5e4;white-space:pre-line;">${esc(data.details)}</p>
    ` : ''}
  `);
}

export function quoteAutoReply(data: QuoteData): string {
  return emailLayout(`
    ${heading(`Thank you, ${esc(data.name)}`)}
    ${paragraph("We've received your bespoke quote request. Every project we take on is unique, and we'll craft a tailored proposal based on your specific needs.")}
    ${paragraph("Expect a detailed response within <strong style=\"color:#e7e5e4;\">48 hours</strong> including a personalized scope, timeline, and pricing.")}
    ${divider()}
    ${paragraph("For urgent matters, reach us directly:")}
    <p style="margin:0;font-size:14px;color:#e7e5e4;">
      <a href="mailto:contact@samuellgoldfinch.com" style="color:#c8a96e;text-decoration:none;">contact@samuellgoldfinch.com</a><br>
      <a href="tel:+33605883966" style="color:#c8a96e;text-decoration:none;">+33 6 05 88 39 66</a>
    </p>
  `);
}
