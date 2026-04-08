import type { CollectionConfig } from 'payload';

export const AutomationSequences: CollectionConfig = {
  slug: 'automation-sequences',
  admin: {
    group: 'Automation',
    useAsTitle: 'name',
    defaultColumns: ['name', 'triggerType', 'triggerCollection', 'delayHours', 'isActive'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'triggerType',
      type: 'select',
      required: true,
      options: [
        { label: 'On Create', value: 'on-create' },
        { label: 'On Status Change', value: 'on-status-change' },
        { label: 'On Stale', value: 'on-stale' },
      ],
    },
    {
      name: 'triggerCollection',
      type: 'select',
      required: true,
      options: [
        { label: 'General Inquiries', value: 'inquiries' },
        { label: 'Venue Inquiries', value: 'venue-inquiries' },
      ],
    },
    {
      name: 'triggerStatus',
      type: 'select',
      admin: { description: 'Which status triggers this sequence' },
      options: [
        // General inquiry statuses
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
        // Venue inquiry statuses
        { label: 'Qualified', value: 'qualified' },
        { label: 'Call Booked', value: 'call-booked' },
        { label: 'Proposal Sent', value: 'proposal-sent' },
        { label: 'Signed', value: 'signed' },
        { label: 'Disqualified', value: 'disqualified' },
      ],
    },
    {
      name: 'delayHours',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: { description: 'Hours to wait before sending (0 = immediate)' },
    },
    {
      name: 'channels',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Admin Alert', value: 'admin-alert' },
      ],
    },
    {
      name: 'emailSubject',
      type: 'text',
      maxLength: 200,
      admin: { description: 'Supports {{name}}, {{venueName}}, etc.' },
    },
    {
      name: 'emailBody',
      type: 'richText',
      admin: { description: 'Email template body with variable placeholders' },
    },
    {
      name: 'whatsappMessage',
      type: 'textarea',
      maxLength: 1600,
      admin: { description: 'WhatsApp message template with variables' },
    },
    {
      name: 'targetAudience',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin (Sam)', value: 'admin' },
        { label: 'Lead (Client)', value: 'lead' },
        { label: 'Both', value: 'both' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Toggle on/off without deleting' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Sequence order (1st, 2nd, 3rd follow-up)' },
    },
  ],
};
