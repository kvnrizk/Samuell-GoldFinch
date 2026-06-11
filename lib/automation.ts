import { getPayload } from './payload';
import { sendNotification, type AlertSeverity } from './notifications';

type InquiryDoc = Record<string, any>;
type SequenceDoc = Record<string, any>;

type Channel = 'email' | 'whatsapp' | 'admin-alert';
type TargetAudience = 'admin' | 'lead' | 'both';

function channelsFor(seq: SequenceDoc) {
  return (Array.isArray(seq.channels) ? seq.channels : [seq.channels]) as Channel[];
}

function scheduledFor(delayHours: number) {
  return new Date(Date.now() + delayHours * 3600000).toISOString();
}

async function findSequences(triggerType: 'on-create' | 'on-status-change', triggerCollection: string) {
  const payload = await getPayload();
  return payload.find({
    collection: 'automation-sequences',
    where: {
      and: [
        { isActive: { equals: true } },
        { triggerType: { equals: triggerType } },
        triggerType === 'on-status-change'
          ? {
              or: [
                { triggerCollection: { equals: triggerCollection } },
                { triggerCollection: { equals: 'both' } },
              ],
            }
          : { triggerCollection: { equals: triggerCollection } },
      ],
    },
    limit: 50,
  });
}

export async function processInquiryCreateSequences(doc: InquiryDoc) {
  try {
    const payload = await getPayload();
    const sequences = await findSequences('on-create', 'inquiries');

    for (const seq of sequences.docs as SequenceDoc[]) {
      if (seq.triggerStatus && seq.triggerStatus !== doc.status) continue;

      for (const channel of channelsFor(seq)) {
        if (seq.delayHours === 0) {
          await sendNotification({
            sequenceId: String(seq.id),
            inquiryId: doc.id,
            channel,
            targetAudience: (seq.targetAudience as TargetAudience) || 'admin',
            emailSubject: seq.emailSubject || undefined,
            emailBody: (seq.emailBody as string | undefined) || undefined,
            whatsappMessage: seq.whatsappMessage || undefined,
            alertType: 'new-lead',
            alertSeverity: 'info',
            alertTitle: seq.name,
            alertMessage: seq.whatsappMessage || seq.emailSubject || seq.name,
            context: {
              name: doc.name,
              email: doc.email,
              service: doc.service || '',
              budget: doc.budget || '',
              leadScore: doc.leadScore,
              status: doc.status || 'new',
            },
          });
        } else {
          await payload.create({
            collection: 'sent-notifications',
            data: {
              sequence: seq.id,
              inquiryRef: doc.id,
              channel,
              scheduledFor: scheduledFor(seq.delayHours as number),
              status: 'pending',
            },
          });
        }
      }
    }
  } catch (err) {
    console.error('[Inquiries afterChange] Failed to process sequences:', err);
  }
}

export async function processInquiryStatusChangeSequences(doc: InquiryDoc) {
  try {
    const payload = await getPayload();
    const sequences = await findSequences('on-status-change', 'inquiries');

    for (const seq of sequences.docs as SequenceDoc[]) {
      if (seq.triggerStatus && seq.triggerStatus !== doc.status) continue;

      for (const channel of channelsFor(seq)) {
        if (seq.delayHours === 0) {
          await sendNotification({
            sequenceId: String(seq.id),
            inquiryId: doc.id,
            channel,
            targetAudience: (seq.targetAudience as TargetAudience) || 'admin',
            emailSubject: seq.emailSubject || undefined,
            emailBody: (seq.emailBody as string | undefined) || undefined,
            whatsappMessage: seq.whatsappMessage || undefined,
            alertType: 'status-change',
            alertSeverity: 'info',
            alertTitle: seq.name,
            alertMessage: `${doc.name} moved to ${doc.status}`,
            context: {
              name: doc.name,
              email: doc.email,
              service: doc.service || '',
              status: doc.status || '',
            },
          });
        } else {
          await payload.create({
            collection: 'sent-notifications',
            data: {
              sequence: seq.id,
              inquiryRef: doc.id,
              channel,
              scheduledFor: scheduledFor(seq.delayHours as number),
              status: 'pending',
            },
          });
        }
      }
    }
  } catch (err) {
    console.error('[Inquiries afterChange] Failed to process status-change sequences:', err);
  }
}

export async function cancelPendingInquirySequences(inquiryId: string, status: string) {
  try {
    const payload = await getPayload();
    const pending = await payload.find({
      collection: 'sent-notifications',
      where: {
        and: [
          { inquiryRef: { equals: inquiryId } },
          { status: { equals: 'pending' } },
        ],
      },
      limit: 100,
    });

    for (const pend of pending.docs as SequenceDoc[]) {
      await payload.update({
        collection: 'sent-notifications',
        id: pend.id,
        data: { status: 'failed', errorMessage: `Cancelled: status changed to ${status}` },
      });
    }
  } catch (err) {
    console.error('[Inquiries afterChange] Failed to cancel pending sequences:', err);
  }
}

export async function processVenueCreateSequences(doc: InquiryDoc, severity: AlertSeverity) {
  try {
    const payload = await getPayload();
    const sequences = await findSequences('on-create', 'venue-inquiries');

    for (const seq of sequences.docs as SequenceDoc[]) {
      if (seq.triggerStatus && seq.triggerStatus !== doc.status) continue;

      for (const channel of channelsFor(seq)) {
        if (seq.delayHours === 0) {
          await sendNotification({
            sequenceId: String(seq.id),
            venueInquiryId: doc.id,
            channel,
            targetAudience: (seq.targetAudience as TargetAudience) || 'admin',
            emailSubject: seq.emailSubject || undefined,
            emailBody: (seq.emailBody as string | undefined) || undefined,
            whatsappMessage: seq.whatsappMessage || undefined,
            alertType: 'new-lead',
            alertSeverity: severity,
            alertTitle: seq.name,
            alertMessage: seq.whatsappMessage || seq.emailSubject || seq.name,
            context: {
              name: doc.contactName,
              email: doc.contactEmail,
              venueName: doc.venueName,
              budget: doc.monthlyBudget || '',
              leadScore: doc.leadScore,
              contractValue: doc.contractValue,
              status: doc.status || 'new',
            },
          });
        } else {
          await payload.create({
            collection: 'sent-notifications',
            data: {
              sequence: seq.id,
              venueInquiryRef: doc.id,
              channel,
              scheduledFor: scheduledFor(seq.delayHours as number),
              status: 'pending',
            },
          });
        }
      }
    }
  } catch (err) {
    console.error('[VenueInquiries afterChange] Failed to process sequences:', err);
  }
}

export async function processVenueStatusChangeSequences(doc: InquiryDoc) {
  try {
    const payload = await getPayload();
    const sequences = await findSequences('on-status-change', 'venue-inquiries');

    for (const seq of sequences.docs as SequenceDoc[]) {
      if (seq.triggerStatus && seq.triggerStatus !== doc.status) continue;

      for (const channel of channelsFor(seq)) {
        if (seq.delayHours === 0) {
          await sendNotification({
            sequenceId: String(seq.id),
            venueInquiryId: doc.id,
            channel,
            targetAudience: (seq.targetAudience as TargetAudience) || 'admin',
            emailSubject: seq.emailSubject || undefined,
            emailBody: (seq.emailBody as string | undefined) || undefined,
            whatsappMessage: seq.whatsappMessage || undefined,
            alertType: 'status-change',
            alertSeverity: 'info',
            alertTitle: seq.name,
            alertMessage: `${doc.venueName} moved to ${doc.status}`,
            context: {
              name: doc.contactName,
              email: doc.contactEmail,
              venueName: doc.venueName,
              budget: doc.monthlyBudget || '',
              status: doc.status || '',
            },
          });
        } else {
          await payload.create({
            collection: 'sent-notifications',
            data: {
              sequence: seq.id,
              venueInquiryRef: doc.id,
              channel,
              scheduledFor: scheduledFor(seq.delayHours as number),
              status: 'pending',
            },
          });
        }
      }
    }
  } catch (err) {
    console.error('[VenueInquiries afterChange] Failed to process status-change sequences:', err);
  }
}

export async function cancelPendingVenueSequences(venueInquiryId: string, status: string) {
  try {
    const payload = await getPayload();
    const pending = await payload.find({
      collection: 'sent-notifications',
      where: {
        and: [
          { venueInquiryRef: { equals: venueInquiryId } },
          { status: { equals: 'pending' } },
        ],
      },
      limit: 100,
    });

    for (const pend of pending.docs as SequenceDoc[]) {
      await payload.update({
        collection: 'sent-notifications',
        id: pend.id,
        data: { status: 'failed', errorMessage: `Cancelled: status changed to ${status}` },
      });
    }
  } catch (err) {
    console.error('[VenueInquiries afterChange] Failed to cancel pending sequences:', err);
  }
}
