// ---------------------------------------------------------------------------
// Multi-channel Notification Dispatcher
// Routes messages to Email (Resend), WhatsApp (Twilio), and Admin Alerts
// (Payload collection). Logs every attempt to SentNotifications.
// ---------------------------------------------------------------------------

import { getPayload } from './payload';
import { getResend } from './resend';
import { sendWhatsApp } from './whatsapp';
import { emailLayout, heading, paragraph, esc } from './email-templates/base';

const FROM_ADDRESS = 'Samuell Goldfinch <noreply@samuellgoldfinch.com>';
const FALLBACK_ADMIN_EMAIL = 'contact@samuellgoldfinch.com';
const FALLBACK_CALENDLY = 'https://calendly.com/samuellgoldfinch';

// ---- Types ----------------------------------------------------------------

export type NotificationChannel = 'email' | 'whatsapp' | 'admin-alert';
export type TargetAudience = 'admin' | 'lead' | 'both';
export type AlertType =
  | 'new-lead'
  | 'hot-lead'
  | 'stale-lead'
  | 'status-change'
  | 'deal-closed'
  | 'sequence-failed'
  | 'system';
export type AlertSeverity = 'info' | 'warning' | 'urgent';

/**
 * Context object used to resolve `{{variable}}` placeholders in templates.
 * All fields are optional — the resolver simply skips unknown keys.
 */
export interface TemplateContext {
  name?: string;
  email?: string;
  venueName?: string;
  service?: string;
  budget?: string;
  leadScore?: number;
  contractValue?: number;
  status?: string;
  days?: number;
  calendlyUrl?: string;
  [key: string]: string | number | undefined;
}

export interface NotificationPayload {
  /** The AutomationSequence document ID that triggered this notification. */
  sequenceId?: string;

  /** Reference to a general inquiry (Inquiries collection). */
  inquiryId?: string;

  /** Reference to a venue inquiry (VenueInquiries collection). */
  venueInquiryId?: string;

  /** Which channel to send through. */
  channel: NotificationChannel;

  /** Who receives this: admin, lead, or both. */
  targetAudience: TargetAudience;

  /** Email subject line (supports template variables). */
  emailSubject?: string;

  /** Email body as HTML string (supports template variables). */
  emailBody?: string;

  /** WhatsApp message body (supports template variables). */
  whatsappMessage?: string;

  /** For admin-alert channel: alert type in the AdminAlerts collection. */
  alertType?: AlertType;

  /** For admin-alert channel: severity level. */
  alertSeverity?: AlertSeverity;

  /** For admin-alert channel: short title. */
  alertTitle?: string;

  /** For admin-alert channel: longer description. */
  alertMessage?: string;

  /** Template variable context — merged with data pulled from the inquiry. */
  context: TemplateContext;

  /**
   * When true, skip writing a new `sent-notifications` log row. The caller
   * (e.g. the cron) is responsible for updating the existing pending row.
   * Prevents duplicate rows for delayed sequences.
   */
  skipLogging?: boolean;
}

// ---- Template variable resolution -----------------------------------------

/**
 * Replace `{{key}}` placeholders in a plain-text template (WhatsApp, alert
 * messages). No HTML escaping — the output is not embedded in HTML.
 */
export function resolveTemplateVariables(
  template: string,
  context: TemplateContext,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = context[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

/**
 * Replace `{{key}}` placeholders in an HTML template. Variable VALUES are
 * HTML-escaped so user-supplied context (name, email, details) cannot break
 * out of the surrounding markup. The template itself is assumed trusted
 * (admin-authored).
 */
export function resolveTemplateVariablesHtml(
  template: string,
  context: TemplateContext,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = context[key];
    if (value === undefined || value === null) return match;
    return esc(value);
  });
}

// ---- Deduplication check --------------------------------------------------

async function isDuplicate(
  sequenceId: string | undefined,
  inquiryId: string | undefined,
  venueInquiryId: string | undefined,
  channel: NotificationChannel,
): Promise<boolean> {
  if (!sequenceId) return false; // Can't deduplicate without a sequence reference

  try {
    const payload = await getPayload();

    // Build a where clause matching on sequence + channel + the inquiry ref
    const conditions: Array<Record<string, { equals: string }>> = [
      { sequence: { equals: sequenceId } },
      { channel: { equals: channel } },
      { status: { equals: 'sent' } },
    ];
    if (inquiryId) conditions.push({ inquiryRef: { equals: inquiryId } });
    if (venueInquiryId) conditions.push({ venueInquiryRef: { equals: venueInquiryId } });

    const existing = await payload.find({
      collection: 'sent-notifications',
      where: { and: conditions },
      limit: 1,
    });

    return existing.totalDocs > 0;
  } catch (err) {
    console.error('[notifications] Dedup check failed:', err);
    return false; // On error, allow the send (better to double-send than miss)
  }
}

// ---- SentNotifications logging --------------------------------------------

async function logSentNotification(
  sequenceId: string | undefined,
  inquiryId: string | undefined,
  venueInquiryId: string | undefined,
  channel: NotificationChannel,
  status: 'sent' | 'failed',
  errorMessage?: string,
): Promise<void> {
  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'sent-notifications',
      data: {
        ...(sequenceId ? { sequence: sequenceId } : {}),
        ...(inquiryId ? { inquiryRef: inquiryId } : {}),
        ...(venueInquiryId ? { venueInquiryRef: venueInquiryId } : {}),
        channel,
        sentAt: new Date().toISOString(),
        status,
        ...(errorMessage ? { errorMessage: errorMessage.slice(0, 500) } : {}),
      },
    });
  } catch (err) {
    console.error('[notifications] Failed to log sent notification:', err);
  }
}

// ---- Create admin alert on failure ----------------------------------------

async function createFailureAlert(
  channel: NotificationChannel,
  errorMsg: string,
  inquiryId?: string,
  venueInquiryId?: string,
): Promise<void> {
  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'admin-alerts',
      data: {
        title: `Notification failed (${channel})`,
        message: errorMsg.slice(0, 2000),
        type: 'sequence-failed' as const,
        severity: 'warning' as const,
        ...(inquiryId ? { inquiry: inquiryId } : {}),
        ...(venueInquiryId ? { venueInquiry: venueInquiryId } : {}),
      },
    });
  } catch (err) {
    console.error('[notifications] Failed to create failure alert:', err);
  }
}

// ---- Resolve admin email & WhatsApp from GlobalSettings -------------------

interface ResolvedSettings {
  adminEmail: string;
  adminWhatsApp: string;
  calendlyUrl: string;
}

async function getGlobalSettings(): Promise<ResolvedSettings> {
  try {
    const payload = await getPayload();
    const settings = await payload.findGlobal({ slug: 'global-settings' }) as unknown as Record<string, unknown>;
    return {
      adminEmail: (settings.email as string) || FALLBACK_ADMIN_EMAIL,
      adminWhatsApp: (settings.whatsappNumber as string) || process.env.SAM_WHATSAPP_NUMBER || '',
      calendlyUrl: (settings.calendlyUrl as string) || FALLBACK_CALENDLY,
    };
  } catch {
    return {
      adminEmail: FALLBACK_ADMIN_EMAIL,
      adminWhatsApp: process.env.SAM_WHATSAPP_NUMBER || '',
      calendlyUrl: FALLBACK_CALENDLY,
    };
  }
}

// ---- Resolve lead contact info from inquiry docs --------------------------

interface LeadContact {
  email?: string;
  phone?: string;
  name?: string;
}

async function getLeadContact(
  inquiryId?: string,
  venueInquiryId?: string,
): Promise<LeadContact> {
  try {
    const payload = await getPayload();

    if (inquiryId) {
      const doc = await payload.findByID({ collection: 'inquiries', id: inquiryId }) as unknown as Record<string, unknown>;
      return {
        email: doc.email as string | undefined,
        phone: doc.phone as string | undefined,
        name: doc.name as string | undefined,
      };
    }

    if (venueInquiryId) {
      const doc = await payload.findByID({ collection: 'venue-inquiries', id: venueInquiryId }) as unknown as Record<string, unknown>;
      return {
        email: doc.contactEmail as string | undefined,
        phone: doc.contactWhatsApp as string | undefined,
        name: doc.contactName as string | undefined,
      };
    }
  } catch (err) {
    console.error('[notifications] Failed to fetch lead contact:', err);
  }

  return {};
}

// ---- Channel: Email -------------------------------------------------------

async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html: htmlBody,
    });

    if (error) {
      return { success: false, error: JSON.stringify(error) };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function handleEmailChannel(
  p: NotificationPayload,
  settings: ResolvedSettings,
  leadContact: LeadContact,
): Promise<{ success: boolean; error?: string }> {
  const subject = p.emailSubject
    ? resolveTemplateVariables(p.emailSubject, p.context)
    : 'Notification from Samuell Goldfinch';

  // emailBody is admin-authored (trusted HTML) — only variable VALUES escape.
  // alertMessage is code-built and may contain raw user data — escape the
  // whole string before inserting into HTML.
  const bodyHtml = p.emailBody
    ? emailLayout(resolveTemplateVariablesHtml(p.emailBody, p.context))
    : emailLayout(
        heading(esc(subject)) +
        paragraph(
          p.alertMessage
            ? esc(resolveTemplateVariables(p.alertMessage, p.context))
            : 'You have a new notification.',
        ),
      );

  const results: Array<{ success: boolean; error?: string }> = [];

  if (p.targetAudience === 'admin' || p.targetAudience === 'both') {
    results.push(await sendEmail(settings.adminEmail, subject, bodyHtml));
  }

  if (p.targetAudience === 'lead' || p.targetAudience === 'both') {
    const leadEmail = leadContact.email || p.context.email;
    if (leadEmail) {
      results.push(await sendEmail(leadEmail, subject, bodyHtml));
    } else {
      results.push({ success: false, error: 'No lead email address available' });
    }
  }

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    return { success: false, error: failed.map((f) => f.error).join('; ') };
  }
  return { success: true };
}

// ---- Channel: WhatsApp ----------------------------------------------------

async function handleWhatsAppChannel(
  p: NotificationPayload,
  settings: ResolvedSettings,
  leadContact: LeadContact,
): Promise<{ success: boolean; error?: string }> {
  const message = p.whatsappMessage
    ? resolveTemplateVariables(p.whatsappMessage, p.context)
    : p.alertMessage
      ? resolveTemplateVariables(p.alertMessage, p.context)
      : 'New notification from Samuell Goldfinch';

  const results: Array<{ success: boolean; error?: string }> = [];

  if (p.targetAudience === 'admin' || p.targetAudience === 'both') {
    const adminPhone = settings.adminWhatsApp || process.env.SAM_WHATSAPP_NUMBER;
    if (adminPhone) {
      const ok = await sendWhatsApp(adminPhone, message);
      results.push(ok ? { success: true } : { success: false, error: 'WhatsApp send to admin failed' });
    } else {
      results.push({ success: false, error: 'No admin WhatsApp number configured' });
    }
  }

  if (p.targetAudience === 'lead' || p.targetAudience === 'both') {
    const leadPhone = leadContact.phone;
    if (leadPhone) {
      const ok = await sendWhatsApp(leadPhone, message);
      results.push(ok ? { success: true } : { success: false, error: 'WhatsApp send to lead failed' });
    } else {
      results.push({ success: false, error: 'No lead phone number available' });
    }
  }

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    return { success: false, error: failed.map((f) => f.error).join('; ') };
  }
  return { success: true };
}

// ---- Channel: Admin Alert -------------------------------------------------

async function handleAdminAlertChannel(
  p: NotificationPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload();
    await payload.create({
      collection: 'admin-alerts',
      data: {
        title: p.alertTitle
          ? resolveTemplateVariables(p.alertTitle, p.context)
          : 'Notification',
        message: p.alertMessage
          ? resolveTemplateVariables(p.alertMessage, p.context).slice(0, 2000)
          : undefined,
        type: p.alertType || ('system' as const),
        severity: p.alertSeverity || ('info' as const),
        ...(p.inquiryId ? { inquiry: p.inquiryId } : {}),
        ...(p.venueInquiryId ? { venueInquiry: p.venueInquiryId } : {}),
      },
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ---- Main dispatcher ------------------------------------------------------

/**
 * Send a notification through the specified channel.
 *
 * - Deduplicates based on sequence + inquiry + channel combo.
 * - Logs every attempt to SentNotifications.
 * - On failure, creates an admin alert about the failure.
 *
 * Never throws — returns `{ success, error? }`.
 */
export async function sendNotification(
  payload: NotificationPayload,
): Promise<{ success: boolean; error?: string }> {
  const { channel, sequenceId, inquiryId, venueInquiryId, context } = payload;

  // ---- Deduplication ----
  const duplicate = await isDuplicate(sequenceId, inquiryId, venueInquiryId, channel);
  if (duplicate) {
    return { success: true }; // Already sent — treat as success
  }

  // ---- Enrich context with calendlyUrl from GlobalSettings ----
  const settings = await getGlobalSettings();
  if (!context.calendlyUrl) {
    context.calendlyUrl = settings.calendlyUrl;
  }

  // ---- Resolve lead contact (for email/whatsapp sends to the lead) ----
  const leadContact = await getLeadContact(inquiryId, venueInquiryId);

  // ---- Dispatch to channel ----
  let result: { success: boolean; error?: string };

  switch (channel) {
    case 'email':
      result = await handleEmailChannel(payload, settings, leadContact);
      break;

    case 'whatsapp':
      result = await handleWhatsAppChannel(payload, settings, leadContact);
      break;

    case 'admin-alert':
      result = await handleAdminAlertChannel(payload);
      break;

    default:
      result = { success: false, error: `Unknown channel: ${channel}` };
  }

  // ---- Log the send attempt (skipped when the caller owns the log row) ----
  if (!payload.skipLogging) {
    await logSentNotification(
      sequenceId,
      inquiryId,
      venueInquiryId,
      channel,
      result.success ? 'sent' : 'failed',
      result.error,
    );
  }

  // ---- On failure, create an admin alert about it ----
  if (!result.success && channel !== 'admin-alert') {
    await createFailureAlert(
      channel,
      result.error || 'Unknown error',
      inquiryId,
      venueInquiryId,
    );
  }

  return result;
}
