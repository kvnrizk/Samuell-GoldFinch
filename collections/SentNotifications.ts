import type { CollectionConfig } from 'payload';

export const SentNotifications: CollectionConfig = {
  slug: 'sent-notifications',
  admin: {
    group: 'System',
    useAsTitle: 'channel',
    defaultColumns: ['channel', 'status', 'sentAt', 'createdAt'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    // Payload local API (hooks, cron) bypasses access — this gates external
    // writes. Closes the dedup-poisoning vector: an anonymous POST could
    // otherwise permanently block any automated email from being sent.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'sequence',
      type: 'relationship',
      relationTo: 'automation-sequences',
      index: true,
      admin: { description: 'Which sequence triggered this notification' },
    },
    {
      name: 'inquiryRef',
      type: 'relationship',
      relationTo: 'inquiries',
      index: true,
      admin: { description: 'Which general inquiry' },
    },
    {
      name: 'venueInquiryRef',
      type: 'relationship',
      relationTo: 'venue-inquiries',
      index: true,
      admin: { description: 'Which venue inquiry' },
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Admin Alert', value: 'admin-alert' },
      ],
    },
    {
      name: 'scheduledFor',
      type: 'date',
      index: true,
      admin: {
        description: 'When this notification is due to fire. Set at queue time. Cron filters by scheduledFor <= now.',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: { description: 'When notification was actually sent (or attempted)' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'errorMessage',
      type: 'text',
      maxLength: 500,
      admin: { description: 'Error details if send failed' },
    },
  ],
};
