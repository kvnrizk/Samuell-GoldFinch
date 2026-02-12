import type { CollectionConfig } from 'payload';

export const BlazeProjects: CollectionConfig = {
  slug: 'blaze-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'date'],
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
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-generated from title if left blank',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Wedding', value: 'wedding' },
        { label: 'Editorial', value: 'editorial' },
        { label: 'Event', value: 'event' },
        { label: 'Documentary', value: 'documentary' },
        { label: 'Diplomatic', value: 'diplomatic' },
      ],
    },
    {
      name: 'heroVideo',
      type: 'group',
      fields: [
        { name: 'muxPlaybackId', type: 'text' },
        { name: 'muxAssetId', type: 'text' },
        { name: 'posterUrl', type: 'text' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      maxRows: 50,
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
      name: 'client',
      type: 'text',
      admin: { description: 'e.g. STOUH BEIRUT, Embassy of Lebanon' },
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'e.g. Paris, Cannes, Beirut' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on homepage carousel' },
    },
    {
      name: 'comingSoon',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show "Coming Soon" badge instead of link' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
};
