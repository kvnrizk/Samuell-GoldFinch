import type { CollectionConfig } from 'payload';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    group: 'Content',
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'brand', 'rating', 'featured'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Client Role/Title',
      admin: { description: 'e.g. "Bride", "Venue Owner", "Event Director"' },
    },
    {
      name: 'brand',
      type: 'select',
      required: true,
      options: [
        { label: 'Blaze (Film)', value: 'blaze' },
        { label: 'Kolasi (Nightlife)', value: 'kolasi' },
        { label: 'Venues', value: 'venues' },
        { label: 'Personal/General', value: 'personal' },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Client Photo',
    },
    {
      name: 'projectLink',
      type: 'relationship',
      relationTo: 'blaze-projects',
      label: 'Related Project',
      admin: { description: 'Link this testimonial to a specific project' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on Homepage',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first' },
    },
  ],
};
