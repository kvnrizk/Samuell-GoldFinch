import type { CollectionConfig } from 'payload';
import { createAdminAlert } from '../lib/admin-alerts';
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
    create: ({ req: { user } }) => Boolean(user),
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
      async ({ doc, previousDoc, operation, req }) => {
        // Phase 3: keep simple admin alerts, but disable automation sequences.
        type AlertSeverity = 'info' | 'warning' | 'urgent';

        if (operation === 'create') {
          const isHighBudget = doc.monthlyBudget && doc.monthlyBudget !== 'under-2k';
          const severity: AlertSeverity = isHighBudget ? 'urgent' : 'info';

          await createAdminAlert({
            payload: req.payload,
            venueInquiry: doc.id,
            type: 'new-lead',
            severity,
            title: `New venue lead: ${doc.venueName} - ${doc.monthlyBudget || 'no budget'}/mo`,
            message: `${doc.contactName} from ${doc.venueName} submitted a venue inquiry - Budget: ${doc.monthlyBudget || 'not specified'}`,
          });

          if (doc.leadScore && doc.leadScore > 75) {
            await createAdminAlert({
              payload: req.payload,
              venueInquiry: doc.id,
              type: 'hot-lead',
              severity: 'warning',
              title: `Hot venue lead: ${doc.venueName} scored ${doc.leadScore}/100`,
              message: `${doc.contactName} from ${doc.venueName} scored ${doc.leadScore}/100 - Budget: ${doc.monthlyBudget || 'not specified'}`,
            });
          }
        }

        if (operation === 'update' && previousDoc && doc.status !== previousDoc.status) {
          await createAdminAlert({
            payload: req.payload,
            venueInquiry: doc.id,
            type: 'status-change',
            severity: 'info',
            title: `${doc.venueName}: ${previousDoc.status} -> ${doc.status}`,
            message: `${doc.venueName} moved from ${previousDoc.status} to ${doc.status}`,
          });

          if (doc.status === 'signed') {
            await createAdminAlert({
              payload: req.payload,
              venueInquiry: doc.id,
              type: 'deal-closed',
              severity: 'info',
              title: `Deal closed: ${doc.venueName} - EUR ${doc.contractValue || 0}`,
              message: `${doc.venueName} signed. Contract value: EUR ${doc.contractValue || 0}`,
            });
          }
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
