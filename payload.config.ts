import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { cloudinaryAdapter } from './lib/cloudinary-adapter';

import { BlazeProjects } from './collections/BlazeProjects';
import { KolasiEvents } from './collections/KolasiEvents';
import { Artists } from './collections/Artists';
import { Milestones } from './collections/Milestones';
import { Inquiries } from './collections/Inquiries';
import { Pages } from './collections/Pages';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { VenuePackages } from './collections/VenuePackages';
import { CaseStudies } from './collections/CaseStudies';
import { VenueFAQ } from './collections/VenueFAQ';
import { VenueInquiries } from './collections/VenueInquiries';
import { VenueSEOPages } from './collections/VenueSEOPages';
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
    VenuePackages,
    CaseStudies,
    VenueFAQ,
    VenueInquiries,
    VenueSEOPages,
  ],

  globals: [GlobalSettings],

  secret: process.env.PAYLOAD_SECRET || 'DEFAULT_SECRET_CHANGE_ME',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter,
          disableLocalStorage: true,
        },
      },
    }),
  ],

  cors: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
});
