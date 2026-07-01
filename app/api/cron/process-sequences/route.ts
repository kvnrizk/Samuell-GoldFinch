// ---------------------------------------------------------------------------
// Vercel Cron: Process Pending Sequences & Detect Stale Leads
// Schedule: every hour (0 * * * *)
// Auth: Bearer CRON_SECRET header
//
// Part 1 — Processes SentNotifications in "pending" status whose delay has
//          elapsed, then sends via the appropriate channel.
// Part 2 — Detects inquiries/venue-inquiries that have been stale for 7+
//          days and creates admin alerts (max one per lead per 7 days).
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { sendNotification } from '@/lib/notifications';
import { getEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cronSecret = getEnv('CRON_SECRET');
  if (!cronSecret) {
    console.error('[cron/process-sequences] CRON_SECRET env var is not set — refusing to run');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await getPayload();
  const results = {
    processedSequences: 0,
    staleAlerts: 0,
    errors: [] as string[],
  };

  // ---- Part 1: Process pending sequences ----------------------------------
  try {
    const nowIso = new Date().toISOString();
    const pendingNotifs = await payload.find({
      collection: 'sent-notifications',
      where: {
        and: [
          { status: { equals: 'pending' } },
          {
            or: [
              { scheduledFor: { less_than_equal: nowIso } },
              { scheduledFor: { exists: false } },
            ],
          },
        ],
      },
      sort: 'scheduledFor',
      limit: 100,
      depth: 1, // populate sequence and inquiry refs
    });

    for (const notif of pendingNotifs.docs) {
      try {
        const sequence =
          typeof notif.sequence === 'object' && notif.sequence
            ? (notif.sequence as unknown as Record<string, unknown>)
            : null;

        if (!sequence) {
          await payload.update({
            collection: 'sent-notifications',
            id: notif.id as string,
            data: { status: 'failed', errorMessage: 'No sequence linked' },
          });
          continue;
        }

        const inquiryDoc =
          notif.inquiryRef && typeof notif.inquiryRef === 'object'
            ? (notif.inquiryRef as unknown as Record<string, unknown>)
            : null;
        const venueDoc =
          notif.venueInquiryRef && typeof notif.venueInquiryRef === 'object'
            ? (notif.venueInquiryRef as unknown as Record<string, unknown>)
            : null;

        const refDoc = inquiryDoc || venueDoc;
        if (!refDoc) {
          await payload.update({
            collection: 'sent-notifications',
            id: notif.id as string,
            data: { status: 'failed', errorMessage: 'No inquiry reference found' },
          });
          continue;
        }

        const channel = notif.channel as 'email' | 'whatsapp' | 'admin-alert';
        const name =
          (refDoc.name as string | undefined) ||
          (refDoc.contactName as string | undefined) ||
          'Unknown';
        const email =
          (refDoc.email as string | undefined) ||
          (refDoc.contactEmail as string | undefined) ||
          '';
        const venueName = (refDoc.venueName as string | undefined) || '';

        // skipLogging=true — we own the log row (the pending record) and
        // update it in place below to avoid duplicate sent-notifications.
        const result = await sendNotification({
          sequenceId: String(sequence.id || notif.sequence),
          inquiryId: inquiryDoc
            ? String(inquiryDoc.id || notif.inquiryRef)
            : undefined,
          venueInquiryId: venueDoc
            ? String(venueDoc.id || notif.venueInquiryRef)
            : undefined,
          channel,
          targetAudience:
            (sequence.targetAudience as 'admin' | 'lead' | 'both') || 'admin',
          emailSubject: (sequence.emailSubject as string) || undefined,
          emailBody: (sequence.emailBody as string | undefined) || undefined,
          whatsappMessage: (sequence.whatsappMessage as string) || undefined,
          alertType: 'system',
          alertSeverity: 'info',
          alertTitle: (sequence.name as string) || 'Automated sequence',
          alertMessage: `Automated: ${sequence.name}`,
          context: {
            name,
            email,
            venueName,
            status: (refDoc.status as string) || '',
          },
          skipLogging: true,
        });

        await payload.update({
          collection: 'sent-notifications',
          id: notif.id as string,
          data: {
            status: result.success ? 'sent' : 'failed',
            sentAt: new Date().toISOString(),
            ...(result.error
              ? { errorMessage: result.error.slice(0, 500) }
              : {}),
          },
        });

        if (result.success) results.processedSequences++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.errors.push(`Sequence processing error: ${msg}`);
      }
    }
  } catch (err) {
    results.errors.push(
      `Failed to fetch pending notifications: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // ---- Part 2: Detect stale leads -----------------------------------------
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000).toISOString();

  try {
    // --- Stale general inquiries ---
    const staleInquiries = await payload.find({
      collection: 'inquiries',
      where: {
        and: [
          { status: { not_in: ['closed', 'booked'] } },
          { updatedAt: { less_than: sevenDaysAgo } },
        ],
      },
      limit: 50,
    });

    for (const lead of staleInquiries.docs) {
      // Avoid spamming: check if a stale-lead alert already exists for this
      // inquiry within the last 7 days.
      const existingAlert = await payload.find({
        collection: 'admin-alerts',
        where: {
          and: [
            { type: { equals: 'stale-lead' } },
            { inquiry: { equals: lead.id } },
            { createdAt: { greater_than: sevenDaysAgo } },
          ],
        },
        limit: 1,
      });

      if (existingAlert.totalDocs === 0) {
        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(lead.updatedAt as string).getTime()) /
            (24 * 3600000),
        );

        await sendNotification({
          channel: 'admin-alert',
          targetAudience: 'admin',
          inquiryId: String(lead.id),
          alertType: 'stale-lead',
          alertSeverity: 'warning',
          alertTitle: `${lead.name} stale for ${daysSinceUpdate} days`,
          alertMessage: `${lead.name} has been in "${lead.status}" for ${daysSinceUpdate} days — follow up?`,
          context: {
            name: lead.name as string,
            status: (lead.status as string) || 'unknown',
            days: daysSinceUpdate,
          },
        });
        results.staleAlerts++;
      }
    }

    // --- Stale venue inquiries ---
    const staleVenueInquiries = await payload.find({
      collection: 'venue-inquiries',
      where: {
        and: [
          { status: { not_in: ['signed', 'disqualified'] } },
          { updatedAt: { less_than: sevenDaysAgo } },
        ],
      },
      limit: 50,
    });

    for (const lead of staleVenueInquiries.docs) {
      const existingAlert = await payload.find({
        collection: 'admin-alerts',
        where: {
          and: [
            { type: { equals: 'stale-lead' } },
            { venueInquiry: { equals: lead.id } },
            { createdAt: { greater_than: sevenDaysAgo } },
          ],
        },
        limit: 1,
      });

      if (existingAlert.totalDocs === 0) {
        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(lead.updatedAt as string).getTime()) /
            (24 * 3600000),
        );

        await sendNotification({
          channel: 'admin-alert',
          targetAudience: 'admin',
          venueInquiryId: String(lead.id),
          alertType: 'stale-lead',
          alertSeverity: 'warning',
          alertTitle: `${lead.venueName} stale for ${daysSinceUpdate} days`,
          alertMessage: `${lead.venueName} (${lead.contactName}) has been in "${lead.status}" for ${daysSinceUpdate} days — follow up?`,
          context: {
            name: lead.contactName as string,
            venueName: lead.venueName as string,
            status: (lead.status as string) || 'unknown',
            days: daysSinceUpdate,
          },
        });
        results.staleAlerts++;
      }
    }
  } catch (err) {
    results.errors.push(
      `Stale lead detection error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
