import type { CollectionConfig } from 'payload';

export const AdminAlerts: CollectionConfig = {
  slug: 'admin-alerts',
  admin: {
    group: 'System',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'severity', 'isRead', 'createdAt'],
  },
  timestamps: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    // Payload local API (hooks, cron) bypasses access by default — this gates
    // only external REST/GraphQL writes, so anonymous spam is impossible.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 2000,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'New Lead', value: 'new-lead' },
        { label: 'Hot Lead', value: 'hot-lead' },
        { label: 'Stale Lead', value: 'stale-lead' },
        { label: 'Status Change', value: 'status-change' },
        { label: 'Deal Closed', value: 'deal-closed' },
        { label: 'Sequence Failed', value: 'sequence-failed' },
        { label: 'System', value: 'system' },
      ],
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'inquiry',
      type: 'relationship',
      relationTo: 'inquiries',
      admin: { description: 'Link to general inquiry' },
    },
    {
      name: 'venueInquiry',
      type: 'relationship',
      relationTo: 'venue-inquiries',
      admin: { description: 'Link to venue inquiry' },
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'readAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Auto-set when marked as read',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        // Auto-set readAt when isRead changes to true
        if (operation === 'update' && data?.isRead && !originalDoc?.isRead) {
          data.readAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
};
