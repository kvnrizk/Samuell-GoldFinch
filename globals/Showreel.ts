import type { GlobalConfig } from 'payload';

export const Showreel: GlobalConfig = {
  slug: 'showreel',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'heroReel',
      type: 'group',
      fields: [
        {
          name: 'videoSource',
          type: 'select',
          defaultValue: 'mux',
          options: [
            { label: 'Mux', value: 'mux' },
            { label: 'Cloudinary', value: 'cloudinary' },
          ],
        },
        {
          name: 'muxPlaybackId',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.videoSource !== 'cloudinary' },
        },
        {
          name: 'cloudinaryVideoId',
          type: 'text',
          admin: {
            description: 'Cloudinary public ID',
            condition: (_, siblingData) => siblingData?.videoSource === 'cloudinary',
          },
        },
        { name: 'posterUrl', type: 'text' },
        { name: 'title', type: 'text', defaultValue: 'Showreel 2025' },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'videoSource',
          type: 'select',
          defaultValue: 'mux',
          options: [
            { label: 'Mux', value: 'mux' },
            { label: 'Cloudinary', value: 'cloudinary' },
          ],
        },
        {
          name: 'muxPlaybackId',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.videoSource !== 'cloudinary' },
        },
        {
          name: 'cloudinaryVideoId',
          type: 'text',
          admin: {
            description: 'Cloudinary public ID',
            condition: (_, siblingData) => siblingData?.videoSource === 'cloudinary',
          },
        },
        { name: 'posterUrl', type: 'text' },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Wedding', value: 'wedding' },
            { label: 'Editorial', value: 'editorial' },
            { label: 'Event', value: 'event' },
            { label: 'Music', value: 'music' },
            { label: 'Brand', value: 'brand' },
          ],
        },
        {
          name: 'linkedProject',
          type: 'relationship',
          relationTo: 'blaze-projects',
        },
      ],
    },
  ],
};
