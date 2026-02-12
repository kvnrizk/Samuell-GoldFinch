import type { GlobalConfig } from 'payload';

export const Showreel: GlobalConfig = {
  slug: 'showreel',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'heroReel',
      type: 'group',
      fields: [
        { name: 'muxPlaybackId', type: 'text', required: true },
        { name: 'posterUrl', type: 'text' },
        { name: 'title', type: 'text', defaultValue: 'Showreel 2025' },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'muxPlaybackId', type: 'text', required: true },
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
