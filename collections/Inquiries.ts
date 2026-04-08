import type { CollectionConfig } from 'payload';
import { calculateInquiryScore } from '../lib/lead-scoring';

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'email', 'service', 'leadScore', 'status'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (data && (operation === 'create' || operation === 'update')) {
          const { score, tier, estimatedValue } = calculateInquiryScore({
            service: data.service,
            budget: data.budget,
            eventDate: data.eventDate,
            phone: data.phone,
            email: data.email,
            details: data.details,
            guestCount: data.guestCount,
          });
          data.leadScore = score;
          data.leadTier = tier;
          data.estimatedValue = estimatedValue;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        // Dynamic imports to avoid circular dependency (collection → notifications → payload → config → collection)
        const { sendNotification } = await import('../lib/notifications');
        const { getPayload } = await import('../lib/payload');

        // ---- On CREATE: admin alert + hot-lead alert + automation sequences ----
        if (operation === 'create') {
          // 1. Always create an admin alert for new leads
          await sendNotification({
            channel: 'admin-alert',
            targetAudience: 'admin',
            inquiryId: doc.id,
            alertType: 'new-lead',
            alertSeverity: 'info',
            alertTitle: `New inquiry from ${doc.name}`,
            alertMessage: `${doc.name} submitted a ${doc.service || 'general'} inquiry${doc.budget ? ` — Budget: ${doc.budget}` : ''}`,
            context: {
              name: doc.name,
              email: doc.email,
              service: doc.service || '',
              budget: doc.budget || '',
              leadScore: doc.leadScore,
            },
          });

          // 2. If lead score > 75, create a hot-lead alert
          if (doc.leadScore && doc.leadScore > 75) {
            await sendNotification({
              channel: 'admin-alert',
              targetAudience: 'admin',
              inquiryId: doc.id,
              alertType: 'hot-lead',
              alertSeverity: 'warning',
              alertTitle: `Hot lead: ${doc.name} scored ${doc.leadScore}/100`,
              alertMessage: `${doc.name} scored ${doc.leadScore}/100 for ${doc.service || 'general'} — ${doc.budget || 'no budget specified'}`,
              context: {
                name: doc.name,
                leadScore: doc.leadScore,
                service: doc.service || '',
                budget: doc.budget || '',
              },
            });
          }

          // 3. Find active AutomationSequences and process them
          try {
            const p = await getPayload();

            const sequences = await p.find({
              collection: 'automation-sequences',
              where: {
                and: [
                  { isActive: { equals: true } },
                  { triggerType: { equals: 'on-create' } },
                  { triggerCollection: { equals: 'inquiries' } },
                ],
              },
              limit: 50,
            });

            for (const seq of sequences.docs) {
              // Skip if triggerStatus is set and doesn't match
              if (seq.triggerStatus && seq.triggerStatus !== doc.status) continue;

              const channels = Array.isArray(seq.channels) ? seq.channels : [seq.channels];

              for (const channel of channels) {
                if (seq.delayHours === 0) {
                  // Send immediately
                  await sendNotification({
                    sequenceId: String(seq.id),
                    inquiryId: doc.id,
                    channel: channel as 'email' | 'whatsapp' | 'admin-alert',
                    targetAudience: (seq.targetAudience as 'admin' | 'lead' | 'both') || 'admin',
                    emailSubject: seq.emailSubject || undefined,
                    emailBody: typeof seq.emailBody === 'string' ? seq.emailBody : undefined,
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
                  // Queue for later — create a pending SentNotification
                  await p.create({
                    collection: 'sent-notifications',
                    data: {
                      sequence: seq.id,
                      inquiryRef: doc.id,
                      channel: channel as string,
                      sentAt: new Date().toISOString(),
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

        // ---- On UPDATE with status change ----
        if (operation === 'update' && previousDoc && doc.status !== previousDoc.status) {
          // 1. Create status-change admin alert
          await sendNotification({
            channel: 'admin-alert',
            targetAudience: 'admin',
            inquiryId: doc.id,
            alertType: 'status-change',
            alertSeverity: 'info',
            alertTitle: `${doc.name}: ${previousDoc.status} → ${doc.status}`,
            alertMessage: `${doc.name} moved from ${previousDoc.status} to ${doc.status}`,
            context: {
              name: doc.name,
              status: doc.status || '',
            },
          });

          // 2. If status is 'closed' or 'booked', cancel all pending sequences
          if (doc.status === 'closed' || doc.status === 'booked') {
            try {
              const p = await getPayload();
              const pending = await p.find({
                collection: 'sent-notifications',
                where: {
                  and: [
                    { inquiryRef: { equals: doc.id } },
                    { status: { equals: 'pending' } },
                  ],
                },
                limit: 100,
              });
              for (const pend of pending.docs) {
                await p.update({
                  collection: 'sent-notifications',
                  id: pend.id,
                  data: { status: 'failed', errorMessage: `Cancelled: status changed to ${doc.status}` },
                });
              }
            } catch (err) {
              console.error('[Inquiries afterChange] Failed to cancel pending sequences:', err);
            }
          }

          // 3. Find on-status-change sequences
          try {
            const p = await getPayload();
            const sequences = await p.find({
              collection: 'automation-sequences',
              where: {
                and: [
                  { isActive: { equals: true } },
                  { triggerType: { equals: 'on-status-change' } },
                  {
                    or: [
                      { triggerCollection: { equals: 'inquiries' } },
                      { triggerCollection: { equals: 'both' } },
                    ],
                  },
                ],
              },
              limit: 50,
            });

            for (const seq of sequences.docs) {
              if (seq.triggerStatus && seq.triggerStatus !== doc.status) continue;
              const channels = Array.isArray(seq.channels) ? seq.channels : [seq.channels];
              for (const channel of channels) {
                if (seq.delayHours === 0) {
                  await sendNotification({
                    sequenceId: String(seq.id),
                    inquiryId: doc.id,
                    channel: channel as 'email' | 'whatsapp' | 'admin-alert',
                    targetAudience: (seq.targetAudience as 'admin' | 'lead' | 'both') || 'admin',
                    emailSubject: seq.emailSubject || undefined,
                    emailBody: typeof seq.emailBody === 'string' ? seq.emailBody : undefined,
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
                  await p.create({
                    collection: 'sent-notifications',
                    data: {
                      sequence: seq.id,
                      inquiryRef: doc.id,
                      channel: channel as string,
                      sentAt: new Date().toISOString(),
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
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      maxLength: 30,
    },
    {
      name: 'service',
      type: 'select',
      options: [
        { label: 'Wedding Film', value: 'wedding-film' },
        { label: 'Editorial / Commercial Film', value: 'editorial-commercial' },
        { label: 'Event Production & Design', value: 'event-production' },
        { label: 'DJ Performance / Live Music', value: 'dj-performance' },
        { label: 'Hybrid Package', value: 'hybrid-package' },
      ],
    },
    {
      name: 'eventDate',
      type: 'text',
      admin: { description: 'Freeform timeframe from user' },
    },
    {
      name: 'guestCount',
      type: 'number',
      min: 1,
      max: 100000,
    },
    {
      name: 'budget',
      type: 'text',
      maxLength: 100,
      admin: { description: 'Freeform, e.g. EUR 5,000–10,000' },
    },
    {
      name: 'details',
      type: 'textarea',
      maxLength: 5000,
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact Page', value: 'contact-page' },
        { label: 'Quote Page', value: 'quote-page' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { description: 'Private notes — not visible to client' },
    },
    // ---- Lead Intelligence (auto-calculated) --------------------------------
    {
      type: 'collapsible',
      label: 'Lead Intelligence',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'leadScore',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            readOnly: true,
            position: 'sidebar',
            description: 'Auto-calculated lead score (0-100)',
          },
        },
        {
          name: 'leadTier',
          type: 'select',
          options: [
            { label: '\uD83D\uDD25 Hot (80-100)', value: 'hot' },
            { label: '\uD83D\uDFE1 Warm (60-79)', value: 'warm' },
            { label: '\uD83D\uDFE2 Cool (40-59)', value: 'cool' },
            { label: '\u26AA Cold (0-39)', value: 'cold' },
          ],
          admin: {
            readOnly: true,
            position: 'sidebar',
          },
        },
        {
          name: 'estimatedValue',
          type: 'number',
          admin: {
            readOnly: true,
            position: 'sidebar',
            description: 'Estimated deal value in EUR',
          },
        },
        {
          name: 'lastContactedAt',
          type: 'date',
          admin: {
            position: 'sidebar',
            description: 'When this lead was last contacted',
          },
        },
      ],
    },
  ],
};
