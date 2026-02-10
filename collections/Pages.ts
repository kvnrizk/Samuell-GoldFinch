import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
      admin: { description: 'Internal label' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Matches route: home, blaze, kolasi, about, contact, quote' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: { description: 'Browser tab + Google title (50–60 chars)' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: { description: 'Meta description (120–155 chars)' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '1200x630 recommended' },
    },
  ],
};
