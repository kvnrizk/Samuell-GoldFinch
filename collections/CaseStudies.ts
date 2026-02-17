import type { CollectionConfig } from 'payload';

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    group: 'Venues',
    useAsTitle: 'venueName',
    defaultColumns: ['venueName', 'role', 'featured', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'venueName',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL: /venues/case-studies/[slug]' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'coverVideoSource',
      type: 'select',
      defaultValue: 'mux',
      options: [
        { label: 'Mux', value: 'mux' },
        { label: 'Cloudinary', value: 'cloudinary' },
      ],
      admin: { description: 'Where the cover video is hosted' },
    },
    {
      name: 'coverVideo',
      type: 'text',
      admin: {
        description: 'Mux playback ID',
        condition: (data) => data?.coverVideoSource !== 'cloudinary',
      },
    },
    {
      name: 'coverVideoCloudinaryId',
      type: 'text',
      admin: {
        description: 'Cloudinary public ID (e.g. sg-platform/videos/my-video)',
        condition: (data) => data?.coverVideoSource === 'cloudinary',
      },
    },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'e.g. "Booking / DA / Content"' },
    },
    {
      name: 'frequency',
      type: 'text',
      admin: { description: 'e.g. "3 nights/week"' },
    },
    {
      name: 'deliverables',
      type: 'textarea',
      admin: { description: 'What was delivered' },
    },
    {
      name: 'outcome',
      type: 'text',
      admin: { description: '1 measurable result' },
    },
    {
      name: 'fullContent',
      type: 'richText',
      admin: { description: 'Full content for the detail page' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
    },
  ],
};
