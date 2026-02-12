import type { CollectionConfig } from 'payload';

export const PricingFactors: CollectionConfig = {
  slug: 'pricing-factors',
  labels: { singular: 'Pricing Factor', plural: 'Pricing Factors' },
  admin: {
    useAsTitle: 'factorName',
    defaultColumns: ['service', 'factorName', 'factorType', 'basePrice', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'service',
      type: 'select',
      required: true,
      options: [
        { label: 'Wedding Film', value: 'wedding-film' },
        { label: 'Editorial / Commercial', value: 'editorial-commercial' },
        { label: 'DJ Performance', value: 'dj-performance' },
        { label: 'Event Production', value: 'event-production' },
      ],
    },
    {
      name: 'factorName',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Hours of Coverage", "Number of Cameras"' },
    },
    {
      name: 'factorType',
      type: 'select',
      required: true,
      options: [
        { label: 'Slider', value: 'slider' },
        { label: 'Toggle', value: 'toggle' },
        { label: 'Select', value: 'select' },
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      admin: { description: 'Base price in EUR for this factor' },
    },
    {
      name: 'options',
      type: 'array',
      admin: { description: 'Options for select/slider type factors' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        {
          name: 'multiplier',
          type: 'number',
          required: true,
          defaultValue: 1,
          admin: { description: 'Price multiplier (e.g. 1.5 = 150% of base)' },
        },
      ],
    },
    {
      name: 'sliderMin',
      type: 'number',
      admin: { description: 'Minimum value for slider type', condition: (_, siblingData) => siblingData?.factorType === 'slider' },
    },
    {
      name: 'sliderMax',
      type: 'number',
      admin: { description: 'Maximum value for slider type', condition: (_, siblingData) => siblingData?.factorType === 'slider' },
    },
    {
      name: 'sliderStep',
      type: 'number',
      admin: { description: 'Step increment for slider', condition: (_, siblingData) => siblingData?.factorType === 'slider' },
    },
    {
      name: 'unit',
      type: 'text',
      admin: { description: 'Display unit (e.g. "hours", "cameras")' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
