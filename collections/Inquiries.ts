import type { CollectionConfig } from 'payload';
import { createAdminAlert } from '../lib/admin-alerts';
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
    create: ({ req: { user } }) => Boolean(user),
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
      async ({ doc, previousDoc, operation, req }) => {
        // Phase 3: keep simple admin alerts, but disable automation sequences.
        if (operation === 'create') {
          await createAdminAlert({
            payload: req.payload,
            inquiry: doc.id,
            type: 'new-lead',
            severity: 'info',
            title: `New inquiry from ${doc.name}`,
            message: `${doc.name} submitted a ${doc.service || 'general'} inquiry${doc.budget ? ` - Budget: ${doc.budget}` : ''}`,
          });

          if (doc.leadScore && doc.leadScore > 75) {
            await createAdminAlert({
              payload: req.payload,
              inquiry: doc.id,
              type: 'hot-lead',
              severity: 'warning',
              title: `Hot lead: ${doc.name} scored ${doc.leadScore}/100`,
              message: `${doc.name} scored ${doc.leadScore}/100 for ${doc.service || 'general'} - ${doc.budget || 'no budget specified'}`,
            });
          }
        }

        if (operation === 'update' && previousDoc && doc.status !== previousDoc.status) {
          await createAdminAlert({
            payload: req.payload,
            inquiry: doc.id,
            type: 'status-change',
            severity: 'info',
            title: `${doc.name}: ${previousDoc.status} -> ${doc.status}`,
            message: `${doc.name} moved from ${previousDoc.status} to ${doc.status}`,
          });
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
      admin: { description: 'Freeform, e.g. EUR 5,000-10,000' },
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
      admin: { description: 'Private notes - not visible to client' },
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
