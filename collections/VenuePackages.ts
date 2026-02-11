import type { CollectionConfig } from 'payload';

export const VenuePackages: CollectionConfig = {
  slug: 'venue-packages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'featured', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Starter", "Core", "Flagship"' },
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Core', value: 'core' },
        { label: 'Flagship', value: 'flagship' },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'e.g. "For venues testing the waters"' },
    },
    {
      name: 'whoItsFor',
      type: 'textarea',
    },
    {
      name: 'deliverables',
      type: 'array',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
    {
      name: 'priceRange',
      type: 'text',
      admin: { description: 'e.g. "€1,500–3,000/mo"' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Visually highlighted card' },
    },
    {
      name: 'sortOrder',
      type: 'number',
    },
  ],
};
