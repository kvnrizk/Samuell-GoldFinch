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
    create: () => true, // System creates these
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'sequence',
      type: 'relationship',
      relationTo: 'automation-sequences',
      admin: { description: 'Which sequence triggered this notification' },
    },
    {
      name: 'inquiryRef',
      type: 'relationship',
      relationTo: 'inquiries',
      admin: { description: 'Which general inquiry' },
    },
    {
      name: 'venueInquiryRef',
      type: 'relationship',
      relationTo: 'venue-inquiries',
      admin: { description: 'Which venue inquiry' },
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      options: [
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Admin Alert', value: 'admin-alert' },
      ],
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: { description: 'When notification was sent' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
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
