import type { CollectionConfig } from 'payload';

export const VenueFAQ: CollectionConfig = {
  slug: 'venue-faq',
  admin: {
    group: 'Venues',
    useAsTitle: 'question',
    defaultColumns: ['question', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
    },
    {
      name: 'sortOrder',
      type: 'number',
    },
  ],
};
