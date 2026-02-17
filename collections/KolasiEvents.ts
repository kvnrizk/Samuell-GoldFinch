import type { CollectionConfig } from 'payload';

export const KolasiEvents: CollectionConfig = {
  slug: 'kolasi-events',
  admin: {
    group: 'Kolasi Agency',
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'venue', 'featured', 'date'],
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
            description: 'Cloudinary public ID (e.g. sg-platform/videos/my-video)',
            condition: (_, siblingData) => siblingData?.videoSource === 'cloudinary',
          },
        },
        { name: 'loopEnd', type: 'number', admin: { description: 'Loop point in seconds (e.g. 22)' } },
      ],
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Ticket Link',
      admin: { description: 'URL to ticket platform (Shotgun, Dice, Eventbrite, etc.)' },
    },
    {
      name: 'doorsTime',
      type: 'text',
      label: 'Doors Open',
      admin: { description: 'e.g. "23:00"' },
    },
    {
      name: 'endTime',
      type: 'text',
      label: 'End Time',
      admin: { description: 'e.g. "06:00"' },
    },
    {
      name: 'ticketPrice',
      type: 'text',
      label: 'Price',
      admin: { description: 'e.g. "15€ / 20€ at door"' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};
