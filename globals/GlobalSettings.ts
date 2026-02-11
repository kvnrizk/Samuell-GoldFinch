import type { GlobalConfig } from 'payload';

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
      defaultValue: '+33 6 05 88 39 66',
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'contact@samuellgoldfinch.com',
    },
    {
      name: 'instagramLinks',
      type: 'array',
      fields: [
        { name: 'handle', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
      defaultValue: [
        { handle: '@samuellgoldfinch', url: 'https://instagram.com/samuellgoldfinch' },
        { handle: '@kolasi.paris', url: 'https://instagram.com/kolasi.paris' },
        { handle: '@blazeprd', url: 'https://instagram.com/blazeprd' },
      ],
    },
    {
      name: 'footerText',
      type: 'text',
      defaultValue: 'Samuell Goldfinch. All rights reserved.',
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
          defaultValue: 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          defaultValue: 'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'responsePromise',
      type: 'textarea',
      defaultValue: 'Every inquiry receives a personal reply within 48 hours. Not a template — a thoughtful response crafted by Samuell.',
    },
    {
      name: 'calendlyUrl',
      type: 'text',
      admin: { description: 'Calendly booking link for venue discovery calls' },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      defaultValue: '+33605883966',
      admin: { description: 'WhatsApp number shown on /venues page' },
    },
  ],
};
