import type { CollectionConfig } from 'payload';

export const KolasiEvents: CollectionConfig = {
  slug: 'kolasi-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'venue', 'featured', 'date'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Club', value: 'club' },
        { label: 'Festival', value: 'festival' },
        { label: 'Private', value: 'private' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Rooftop', value: 'rooftop' },
      ],
    },
    {
      name: 'venue',
      type: 'text',
      admin: { description: 'e.g. Le Speakeasy Paris' },
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'muxPlaybackId', type: 'text', required: true },
        { name: 'loopEnd', type: 'number', admin: { description: 'Loop point in seconds (e.g. 22)' } },
      ],
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};
