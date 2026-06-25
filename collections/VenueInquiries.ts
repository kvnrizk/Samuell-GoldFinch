import type { CollectionConfig } from 'payload';
import { calculateVenueScore } from '../lib/lead-scoring';

export const VenueInquiries: CollectionConfig = {
  slug: 'venue-inquiries',
  admin: {
    group: 'Leads',
    useAsTitle: 'venueName',
    defaultColumns: ['venueName', 'contactName', 'monthlyBudget', 'leadScore', 'status', 'createdAt'],
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
          const result = calculateVenueScore({
            monthlyBudget: data.monthlyBudget,
            capacity: data.capacity,
            decisionMaker: data.decisionMaker,
            timeline: data.timeline,
            goal: data.goal,
            hasDancePocket: data.hasDancePocket,
            roomPhotos: data.roomPhotos,
            instagram: data.instagram,
          });
          data.leadScore = result.score;
          data.leadTier = result.tier;
          data.estimatedValue = result.estimatedValue;
          data.monthlyValue = result.monthlyValue;
          data.annualValue = result.annualValue;
          // Only set contractValue on create (don't overwrite Sam's manual edits)
          if (operation === 'create') {
            data.contractValue = result.annualValue;
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        // Dynamic imports to avoid circular dependency (collection → notifications → payload → config → collection)
        const { sendNotification } = await import('../lib/notifications');
        const {
          cancelPendingVenueSequences,
          processVenueCreateSequences,
          processVenueStatusChangeSequences,
        } = await import('../lib/automation');
        type AlertSeverity = 'info' | 'warning' | 'urgent';

        // ---- On CREATE: admin alert + automation sequences ----
        if (operation === 'create') {
          // 1. Determine severity based on budget
          const isHighBudget = doc.monthlyBudget && doc.monthlyBudget !== 'under-2k';
          const severity: AlertSeverity = isHighBudget ? 'urgent' : 'info';

          // 2. Create admin alert for new venue lead
          await sendNotification({
            channel: 'admin-alert',
            targetAudience: 'admin',
            venueInquiryId: doc.id,
            alertType: 'new-lead',
            alertSeverity: severity,
            alertTitle: `New venue lead: ${doc.venueName} — ${doc.monthlyBudget || 'no budget'}/mo`,
            alertMessage: `${doc.contactName} from ${doc.venueName} submitted a venue inquiry — Budget: ${doc.monthlyBudget || 'not specified'}`,
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

          // 3. If lead score > 75, create a hot-lead alert
          if (doc.leadScore && doc.leadScore > 75) {
            await sendNotification({
              channel: 'admin-alert',
              targetAudience: 'admin',
              venueInquiryId: doc.id,
              alertType: 'hot-lead',
              alertSeverity: 'warning',
              alertTitle: `Hot venue lead: ${doc.venueName} scored ${doc.leadScore}/100`,
              alertMessage: `${doc.contactName} from ${doc.venueName} scored ${doc.leadScore}/100 — Budget: ${doc.monthlyBudget || 'not specified'}`,
              context: {
                name: doc.contactName,
                leadScore: doc.leadScore,
                venueName: doc.venueName,
                budget: doc.monthlyBudget || '',
              },
            });
          }

          await processVenueCreateSequences(doc, severity);
        }

        // ---- On UPDATE with status change ----
        if (operation === 'update' && previousDoc && doc.status !== previousDoc.status) {
          // 1. Create status-change admin alert
          await sendNotification({
            channel: 'admin-alert',
            targetAudience: 'admin',
            venueInquiryId: doc.id,
            alertType: 'status-change',
            alertSeverity: 'info',
            alertTitle: `${doc.venueName}: ${previousDoc.status} → ${doc.status}`,
            alertMessage: `${doc.venueName} moved from ${previousDoc.status} to ${doc.status}`,
            context: {
              name: doc.contactName,
              venueName: doc.venueName,
              status: doc.status || '',
            },
          });

          // 2. If status is 'signed', create deal-closed alert
          if (doc.status === 'signed') {
            await sendNotification({
              channel: 'admin-alert',
              targetAudience: 'admin',
              venueInquiryId: doc.id,
              alertType: 'deal-closed',
              alertSeverity: 'info',
              alertTitle: `Deal closed: ${doc.venueName} — €${doc.contractValue || 0}`,
              alertMessage: `${doc.venueName} signed! Contract value: €${doc.contractValue || 0}`,
              context: {
                name: doc.contactName,
                venueName: doc.venueName,
                contractValue: doc.contractValue,
                status: 'signed',
              },
            });
          }

          // 3. If status is terminal ('signed' or 'disqualified'), cancel all pending sequences
          if (doc.status === 'disqualified' || doc.status === 'signed') {
            await cancelPendingVenueSequences(doc.id, doc.status);
          }

          await processVenueStatusChangeSequences(doc);
        }
      },
    ],
  },
  fields: [
    {
      name: 'venueName',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'venueType',
      type: 'select',
      options: [
        { label: 'Bar', value: 'bar' },
        { label: 'Brasserie', value: 'brasserie' },
        { label: 'Club', value: 'club' },
        { label: 'Resto-Festif', value: 'resto-festif' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
    },
    {
      name: 'hasDancePocket',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'currentProgramming',
      type: 'textarea',
      admin: { description: '"Do you currently have DJ nights?"' },
    },
    {
      name: 'goal',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'More Tables / Reservations', value: 'more-tables' },
        { label: 'Better Crowd', value: 'better-crowd' },
        { label: 'Stronger Brand', value: 'stronger-brand' },
        { label: 'Higher Average Spend', value: 'higher-spend' },
        { label: 'Create a Signature Night', value: 'signature-night' },
      ],
    },
    {
      name: 'monthlyBudget',
      type: 'select',
      required: true,
      options: [
        { label: 'Under \u20AC2,000/month', value: 'under-2k' },
        { label: '\u20AC2,000\u20135,000/month', value: '2k-5k' },
        { label: '\u20AC5,000\u201310,000/month', value: '5k-10k' },
        { label: '\u20AC10,000+/month', value: '10k-plus' },
      ],
    },
    {
      name: 'decisionMaker',
      type: 'select',
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'General Manager', value: 'gm' },
        { label: 'Event Manager', value: 'event-manager' },
      ],
    },
    {
      name: 'contactName',
      type: 'text',
      required: true,
    },
    {
      name: 'contactWhatsApp',
      type: 'text',
      required: true,
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'timeline',
      type: 'select',
      options: [
        { label: 'As soon as possible', value: 'asap' },
        { label: 'Next month', value: 'next-month' },
        { label: 'Next season', value: 'next-season' },
      ],
    },
    {
      name: 'roomPhotos',
      type: 'array',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'venue-form',
      options: [
        { label: 'Venue Form', value: 'venue-form' },
        { label: 'Deck Download', value: 'deck-download' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Call Booked', value: 'call-booked' },
        { label: 'Proposal Sent', value: 'proposal-sent' },
        { label: 'Signed', value: 'signed' },
        { label: 'Disqualified', value: 'disqualified' },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { description: 'Internal notes \u2014 not visible to the client' },
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
        {
          name: 'contractValue',
          type: 'number',
          admin: {
            position: 'sidebar',
            description: 'Actual contract value (EUR). Auto-estimated, editable.',
          },
        },
        {
          name: 'monthlyValue',
          type: 'number',
          admin: {
            readOnly: true,
            position: 'sidebar',
            description: 'Estimated monthly retainer value (EUR)',
          },
        },
        {
          name: 'annualValue',
          type: 'number',
          admin: {
            readOnly: true,
            position: 'sidebar',
            description: 'Projected 12-month value (EUR)',
          },
        },
      ],
    },
  ],
};
