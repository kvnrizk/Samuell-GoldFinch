import type { CollectionConfig } from 'payload';

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'brand',
      type: 'select',
      options: [
        { label: 'Blaze', value: 'blaze' },
        { label: 'Kolasi', value: 'kolasi' },
        { label: 'Both', value: 'both' },
        { label: 'Personal', value: 'personal' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      admin: { description: 'Lower numbers appear first' },
    },
  ],
};
