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
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { VenuePackages } from './collections/VenuePackages';
import { CaseStudies } from './collections/CaseStudies';
import { VenueFAQ } from './collections/VenueFAQ';
import { VenueInquiries } from './collections/VenueInquiries';
import { VenueSEOPages } from './collections/VenueSEOPages';
import { AdminAlerts } from './collections/AdminAlerts';
import { AutomationSequences } from './collections/AutomationSequences';
import { SentNotifications } from './collections/SentNotifications';
import { GlobalSettings } from './globals/GlobalSettings';
import { Showreel } from './globals/Showreel';
import { getEnv, getRequiredProductionEnv, validateProductionEnv } from './lib/env';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
validateProductionEnv();

export default buildConfig({
  serverURL: (() => {
    const url = getEnv('NEXT_PUBLIC_SITE_URL');
    if (!url && process.env.NODE_ENV === 'production') {
      console.warn('[payload] NEXT_PUBLIC_SITE_URL is not set in production — absolute URLs will fall back to localhost');
    }
    return url || 'http://localhost:3000';
  })(),

  admin: {
    user: Users.slug,
    importMap: {
      importMapFile: path.resolve(dirname, 'app/(payload)/admin/importMap.ts'),
    },
    meta: {
      titleSuffix: ' — Samuell Goldfinch',
    },
    components: {
      beforeDashboard: [
        '/components/admin/AdminNotificationBell',
        '/components/admin/DashboardKPIs',
        '/components/admin/RevenueDashboard',
        '/components/admin/RecentInquiries',
        '/components/admin/InquiryKanban',
      ],
    },
  },

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: getRequiredProductionEnv('DATABASE_URI'),
    connectOptions: {
      serverSelectionTimeoutMS: 8000,
    },
  }),

  collections: [
    Users,
    Media,
    BlazeProjects,
    KolasiEvents,
    Artists,
    Milestones,
    Inquiries,
    VenuePackages,
    CaseStudies,
    VenueFAQ,
    VenueInquiries,
    VenueSEOPages,
    AdminAlerts,
    AutomationSequences,
    SentNotifications,
  ],

  globals: [GlobalSettings, Showreel],

  secret: getRequiredProductionEnv('PAYLOAD_SECRET'),

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
    getEnv('NEXT_PUBLIC_SITE_URL') || '',
  ].filter(Boolean),
});
