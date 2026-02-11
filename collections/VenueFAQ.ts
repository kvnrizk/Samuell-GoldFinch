import type { CollectionConfig } from 'payload';

export const VenueFAQ: CollectionConfig = {
  slug: 'venue-faq',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
