import { emailLayout, heading, paragraph, dataTable, divider, goldBadge, esc, escAttr } from './base';

interface ContactData {
  name: string;
  email: string;
  projectType?: string;
  details?: string;
}

export function contactNotification(data: ContactData): string {
  const name = esc(data.name);
  const email = esc(data.email);
  const emailAttr = escAttr(data.email);
  return emailLayout(`
    ${goldBadge('New Inquiry')}
    ${heading(`Contact from ${name}`)}
    ${dataTable([
      ['Name', name],
      ['Email', `<a href="mailto:${emailAttr}" style="color:#c8a96e;text-decoration:none;">${email}</a>`],
      ['Project Type', esc(data.projectType) || 'Not specified'],
    ])}
    ${data.details ? `
      ${divider()}
      <p style="margin:0 0 8px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;color:#a1a1aa;">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#e7e5e4;white-space:pre-line;">${esc(data.details)}</p>
    ` : ''}
  `);
}

export function contactAutoReply(data: ContactData): string {
  return emailLayout(`
    ${heading(`Thank you, ${esc(data.name)}`)}
    ${paragraph("We've received your inquiry and appreciate you reaching out. Our team will review your message and respond within <strong style=\"color:#e7e5e4;\">48 hours</strong> with a personalized reply.")}
    ${paragraph("In the meantime, feel free to explore our recent work:")}
    ${paragraph('<a href="https://samuellgoldfinch.com/blaze" style="color:#c8a96e;text-decoration:none;">Blaze Production</a> &mdash; Film &amp; content creation<br><a href="https://samuellgoldfinch.com/kolasi" style="color:#c8a96e;text-decoration:none;">Kolasi Agency</a> &mdash; DJ booking &amp; event curation')}
    ${divider()}
    ${paragraph("For urgent matters, reach us directly:")}
    <p style="margin:0;font-size:14px;color:#e7e5e4;">
      <a href="mailto:contact@samuellgoldfinch.com" style="color:#c8a96e;text-decoration:none;">contact@samuellgoldfinch.com</a><br>
      <a href="tel:+33605883966" style="color:#c8a96e;text-decoration:none;">+33 6 05 88 39 66</a>
    </p>
  `);
}
