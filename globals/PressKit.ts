import type { GlobalConfig } from 'payload';

export const PressKit: GlobalConfig = {
  slug: 'press-kit',
  label: 'Press Kit',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'shortBio',
      type: 'textarea',
      label: 'Short Bio (1-2 sentences)',
      maxLength: 200,
    },
    {
      name: 'mediumBio',
      type: 'textarea',
      label: 'Medium Bio (1 paragraph)',
      maxLength: 500,
    },
    {
      name: 'fullBio',
      type: 'richText',
      label: 'Full Bio',
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Brand Logos',
      fields: [
        {
          name: 'brand',
          type: 'select',
          options: [
            { label: 'Samuell Goldfinch', value: 'sg' },
            { label: 'Blaze', value: 'blaze' },
            { label: 'Kolasi', value: 'kolasi' },
          ],
        },
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'format',
          type: 'select',
          options: [
            { label: 'SVG', value: 'svg' },
            { label: 'PNG', value: 'png' },
            { label: 'EPS', value: 'eps' },
          ],
        },
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Light (for dark backgrounds)', value: 'light' },
            { label: 'Dark (for light backgrounds)', value: 'dark' },
            { label: 'Color', value: 'color' },
          ],
        },
      ],
    },
    {
      name: 'pressPhotos',
      type: 'array',
      label: 'Press Photos',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
        { name: 'credit', type: 'text', label: 'Photo Credit' },
      ],
    },
    {
      name: 'mediaAppearances',
      type: 'array',
      label: 'Media Appearances & Features',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'publication', type: 'text', required: true },
        { name: 'url', type: 'text' },
        { name: 'date', type: 'date' },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Article', value: 'article' },
            { label: 'Interview', value: 'interview' },
            { label: 'Feature', value: 'feature' },
            { label: 'Podcast', value: 'podcast' },
            { label: 'Video', value: 'video' },
          ],
        },
      ],
    },
    {
      name: 'pressContact',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
  ],
};
