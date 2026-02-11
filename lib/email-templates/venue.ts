import { emailLayout, heading, paragraph, dataTable, ctaButton, divider, urgentBadge, goldBadge } from './base';

interface VenueData {
  venueName: string;
  contactName: string;
  contactEmail: string;
  contactWhatsApp?: string;
  venueType?: string;
  capacity?: number;
  monthlyBudget: string;
  goals?: string[];
  timeline?: string;
  currentProgramming?: string;
  calendlyUrl: string;
}

const VENUE_TYPES: Record<string, string> = {
  bar: 'Bar',
  brasserie: 'Brasserie',
  club: 'Club',
  'resto-festif': 'Resto-Festif',
  hybrid: 'Hybrid',
};

const BUDGET_LABELS: Record<string, string> = {
  'under-2k': 'Under €2,000',
  '2k-5k': '€2,000 – €5,000',
  '5k-10k': '€5,000 – €10,000',
  '10k-plus': '€10,000+',
};

const GOAL_LABELS: Record<string, string> = {
  'more-tables': 'More Table Reservations',
  'better-crowd': 'Better Crowd Quality',
  'stronger-brand': 'Stronger Brand Identity',
  'higher-spend': 'Higher Average Spend',
  'signature-night': 'Signature Night Concept',
};

export function venueQualifiedNotification(data: VenueData): string {
  return emailLayout(`
    ${urgentBadge('Qualified Lead')}
    ${heading(data.venueName)}
    ${paragraph(`<strong style="color:#e7e5e4;">${data.contactName}</strong> submitted a venue inquiry with a budget of <strong style="color:#c8a96e;">${BUDGET_LABELS[data.monthlyBudget] || data.monthlyBudget}</strong>. This lead has budget — book the call ASAP.`)}
    ${dataTable([
      ['Venue', data.venueName],
      ['Type', VENUE_TYPES[data.venueType || ''] || data.venueType || 'Not specified'],
      ['Capacity', data.capacity ? String(data.capacity) : 'Not specified'],
      ['Budget', BUDGET_LABELS[data.monthlyBudget] || data.monthlyBudget],
      ['Goals', data.goals?.map((g) => GOAL_LABELS[g] || g).join(', ') || 'Not specified'],
      ['Timeline', data.timeline || 'Not specified'],
      ['Contact', data.contactName],
      ['Email', `<a href="mailto:${data.contactEmail}" style="color:#c8a96e;text-decoration:none;">${data.contactEmail}</a>`],
      ['WhatsApp', data.contactWhatsApp || 'Not provided'],
    ])}
    ${data.currentProgramming ? `
      ${divider()}
      <p style="margin:0 0 8px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;">Current Programming</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#e7e5e4;white-space:pre-line;">${data.currentProgramming}</p>
    ` : ''}
  `);
}

export function venueQualifiedAutoReply(data: VenueData): string {
  return emailLayout(`
    ${heading(`Thank you, ${data.contactName}`)}
    ${paragraph(`We've received your inquiry for <strong style="color:#e7e5e4;">${data.venueName}</strong> and we're genuinely excited about the potential.`)}
    ${paragraph("The next step is a <strong style=\"color:#e7e5e4;\">30-minute discovery call</strong> where we'll discuss your venue's identity, programming goals, and how Kolasi can help you build something remarkable.")}
    ${ctaButton('Book Your Discovery Call', data.calendlyUrl)}
    ${divider()}
    ${paragraph("For immediate questions, reach us on WhatsApp:")}
    <p style="margin:0;font-size:14px;color:#e7e5e4;">
      <a href="https://wa.me/33605883966" style="color:#c8a96e;text-decoration:none;">+33 6 05 88 39 66</a>
    </p>
  `);
}

export function venueUnderBudgetNotification(data: VenueData): string {
  return emailLayout(`
    ${goldBadge('Under Budget')}
    ${heading(data.venueName)}
    ${paragraph(`<strong style="color:#e7e5e4;">${data.contactName}</strong> submitted a venue inquiry with a budget of <strong style="color:#a1a1aa;">${BUDGET_LABELS[data.monthlyBudget] || data.monthlyBudget}</strong>. Auto-sent Starter Night offer. No call scheduled.`)}
    ${dataTable([
      ['Venue', data.venueName],
      ['Budget', BUDGET_LABELS[data.monthlyBudget] || data.monthlyBudget],
      ['Contact', data.contactName],
      ['Email', `<a href="mailto:${data.contactEmail}" style="color:#c8a96e;text-decoration:none;">${data.contactEmail}</a>`],
    ])}
  `);
}

export function venueStarterNightAutoReply(data: VenueData): string {
  return emailLayout(`
    ${heading(`Thank you, ${data.contactName}`)}
    ${paragraph(`We've reviewed your inquiry for <strong style="color:#e7e5e4;">${data.venueName}</strong>.`)}
    ${paragraph("Based on your current budget, we recommend our <strong style=\"color:#e7e5e4;\">Starter Night</strong> package — designed for venues testing curated programming for the first time:")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:rgba(200,169,110,0.06);border:1px solid rgba(200,169,110,0.15);border-radius:8px;padding:20px;">
    <tr><td style="padding:4px 20px;font-size:14px;color:#e7e5e4;">&#8226; 1 night per week</td></tr>
    <tr><td style="padding:4px 20px;font-size:14px;color:#e7e5e4;">&#8226; 1 DJ per session from our roster</td></tr>
    <tr><td style="padding:4px 20px;font-size:14px;color:#e7e5e4;">&#8226; 2 Instagram reels/month</td></tr>
    <tr><td style="padding:4px 20px;font-size:14px;color:#e7e5e4;">&#8226; Social media templates</td></tr>
    <tr><td style="padding:4px 20px;font-size:14px;color:#e7e5e4;">&#8226; Monthly check-in call</td></tr>
    </table>
    ${paragraph("Starting from <strong style=\"color:#c8a96e;\">€1,500/month</strong>.")}
    ${paragraph("Interested? Simply reply to this email and we'll set up a quick 15-minute call to discuss the details.")}
    ${divider()}
    <p style="margin:0;font-size:14px;color:#e7e5e4;">
      <a href="mailto:contact@samuellgoldfinch.com" style="color:#c8a96e;text-decoration:none;">contact@samuellgoldfinch.com</a><br>
      <a href="https://wa.me/33605883966" style="color:#c8a96e;text-decoration:none;">+33 6 05 88 39 66</a>
    </p>
  `);
}
