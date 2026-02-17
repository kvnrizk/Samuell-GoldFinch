import type { CollectionConfig } from 'payload';

export const VenueSEOPages: CollectionConfig = {
  slug: 'venue-seo-pages',
  admin: {
    group: 'Venues',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'targetKeyword', 'sortOrder'],
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
      admin: { description: 'H1 heading for the page' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL: /venues/[slug] — e.g. dj-booking-paris' },
    },
    {
      name: 'targetKeyword',
      type: 'text',
      admin: { description: 'Primary SEO keyword — e.g. "DJ booking Paris"' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: { description: 'Meta title (50–60 chars)' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: { description: 'Meta description (120–155 chars)' },
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      admin: { description: 'Subtitle under the H1' },
    },
    {
      name: 'content',
      type: 'richText',
      admin: { description: 'Main body content (800–1200 words)' },
    },
    {
      name: 'ctaHeading',
      type: 'text',
      defaultValue: 'Ready to transform your venue?',
    },
    {
      name: 'ctaDescription',
      type: 'textarea',
      defaultValue: 'Book a free discovery call and get a personalised programming plan within 5 days.',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '1200x630 OG image' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
