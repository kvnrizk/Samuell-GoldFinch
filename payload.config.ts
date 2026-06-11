import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { cloudinaryAdapter } from './lib/cloudinary-adapter';
import { getPayloadConfigEnv } from './lib/server-env';
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
import { Testimonials } from './collections/Testimonials';
import { Posts } from './collections/Posts';
import { PricingFactors } from './collections/PricingFactors';
import { AdminAlerts } from './collections/AdminAlerts';
import { AutomationSequences } from './collections/AutomationSequences';
import { SentNotifications } from './collections/SentNotifications';
import { GlobalSettings } from './globals/GlobalSettings';
import { PressKit } from './globals/PressKit';
import { Showreel } from './globals/Showreel';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const payloadEnv = getPayloadConfigEnv();

export default buildConfig({
  serverURL: payloadEnv.siteUrl,

  admin: {
    user: Users.slug,
    importMap: {
      importMapFile: path.resolve(dirname, 'app/(payload)/admin/importMap.ts'),
    },
    meta: {
      titleSuffix: ' - Samuell Goldfinch',
    },
    components: {
      beforeDashboard: [
        '/components/admin/AdminNotificationBell',
        '/components/admin/DashboardKPIs',
        '/components/admin/RecentInquiries',
      ],
    },
  },

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: payloadEnv.databaseUri,
    connectOptions: {
      serverSelectionTimeoutMS: 1500,
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
    Pages,
    VenuePackages,
    CaseStudies,
    VenueFAQ,
    VenueInquiries,
    VenueSEOPages,
    Testimonials,
    Posts,
    PricingFactors,
    AdminAlerts,
    AutomationSequences,
    SentNotifications,
  ],

  globals: [GlobalSettings, PressKit, Showreel],

  secret: payloadEnv.payloadSecret,

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
    payloadEnv.siteUrl,
  ].filter(Boolean),
});
