import type { CollectionConfig } from 'payload';

export const VenueInquiries: CollectionConfig = {
  slug: 'venue-inquiries',
  admin: {
    group: 'Leads',
    useAsTitle: 'venueName',
    defaultColumns: ['venueName', 'contactName', 'monthlyBudget', 'status', 'createdAt'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
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
        { label: 'Under €2,000/month', value: 'under-2k' },
        { label: '€2,000–5,000/month', value: '2k-5k' },
        { label: '€5,000–10,000/month', value: '5k-10k' },
        { label: '€10,000+/month', value: '10k-plus' },
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
      admin: { description: 'Internal notes — not visible to the client' },
    },
  ],
};
