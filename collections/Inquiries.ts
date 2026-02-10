import type { CollectionConfig } from 'payload';

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'email', 'service', 'status'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
  ],
};
