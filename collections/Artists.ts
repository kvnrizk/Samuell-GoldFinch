import type { CollectionConfig } from 'payload';

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: '2–3 sentences' },
    },
    {
      name: 'genres',
      type: 'array',
      fields: [
        { name: 'genre', type: 'text', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'soundcloud', type: 'text' },
        { name: 'spotify', type: 'text' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Appears in homepage gallery band' },
    },
    {
      name: 'rosterCategory',
      type: 'select',
      options: [
        { label: 'Resident', value: 'resident' },
        { label: 'Headliner', value: 'headliner' },
        { label: 'Live Act', value: 'live-act' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: { description: 'Category for /venues roster display' },
    },
  ],
};
