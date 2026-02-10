import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { BlazeProjects } from './collections/BlazeProjects';
import { KolasiEvents } from './collections/KolasiEvents';
import { Artists } from './collections/Artists';
import { Milestones } from './collections/Milestones';
import { Inquiries } from './collections/Inquiries';
import { Pages } from './collections/Pages';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { GlobalSettings } from './globals/GlobalSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Samuell Goldfinch',
    },
  },

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  collections: [
    Users,
    Media,
    BlazeProjects,
    KolasiEvents,
    Artists,
    Milestones,
    Inquiries,
    Pages,
  ],

  globals: [GlobalSettings],

  secret: process.env.PAYLOAD_SECRET || 'DEFAULT_SECRET_CHANGE_ME',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [],

  cors: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
});
