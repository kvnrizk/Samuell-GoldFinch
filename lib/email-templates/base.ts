// HTML-encode a value destined for text content. User-supplied form data
// (name, email, details, etc.) MUST go through esc() before being injected
// into template strings. Attribute values use escAttr() instead.
export function esc(value: unknown): string {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escAttr(value: unknown): string {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const GOLD = '#c8a96e';
const BG = '#09090b';
const CARD_BG = '#111113';
const TEXT = '#e7e5e4';
const TEXT_DIM = '#a1a1aa';
const BORDER = 'rgba(255,255,255,0.08)';

export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Samuell Goldfinch</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo / Brand -->
<tr><td style="padding:0 0 32px;text-align:center;">
<span style="font-family:Georgia,'Playfair Display',serif;font-size:22px;font-weight:700;color:${TEXT};letter-spacing:0.02em;">Samuell Goldfinch</span>
<br>
<span style="font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${GOLD};">Creative Director &middot; Filmmaker &middot; DJ</span>
</td></tr>

<!-- Content Card -->
<tr><td style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:12px;padding:40px 32px;">
${content}
</td></tr>

<!-- Footer -->
<tr><td style="padding:32px 0 0;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:${TEXT_DIM};">
<a href="https://samuellgoldfinch.com" style="color:${GOLD};text-decoration:none;">samuellgoldfinch.com</a>
&nbsp;&middot;&nbsp;
<a href="https://instagram.com/samuellgoldfinch" style="color:${TEXT_DIM};text-decoration:none;">Instagram</a>
</p>
<p style="margin:0;font-size:11px;color:#52525b;">
&copy; ${new Date().getFullYear()} Samuell Goldfinch. All rights reserved.
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 24px;font-family:Georgia,'Playfair Display',serif;font-size:26px;font-weight:700;color:${TEXT};line-height:1.3;">${text}</h1>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${TEXT_DIM};">${text}</p>`;
}

export function field(label: string, value: string): string {
  return `<tr>
<td style="padding:8px 12px;font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;color:${TEXT_DIM};border-bottom:1px solid ${BORDER};width:35%;vertical-align:top;">${label}</td>
<td style="padding:8px 12px;font-size:14px;color:${TEXT};border-bottom:1px solid ${BORDER};">${value}</td>
</tr>`;
}

export function dataTable(fields: Array<[string, string]>): string {
  const rows = fields
    .filter(([, v]) => v && v !== 'Not specified' && v !== 'N/A')
    .map(([label, value]) => field(label, value))
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">${rows}</table>`;
}

export function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr><td style="background-color:${GOLD};border-radius:8px;">
<a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:${BG};text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">${text}</a>
</td></tr>
</table>`;
}

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${BORDER};margin:24px 0;">`;
}

export function urgentBadge(text: string): string {
  return `<span style="display:inline-block;background:rgba(239,68,68,0.15);color:#ef4444;font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;">${text}</span>`;
}

export function goldBadge(text: string): string {
  return `<span style="display:inline-block;background:rgba(200,169,110,0.15);color:${GOLD};font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;">${text}</span>`;
}
