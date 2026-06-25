import type { Metadata } from 'next';
import { getGlobalSettings, getFeaturedBlazeProjects } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import HomeClient from './HomeClient';
import { getDictionary } from '@/lib/i18n';

export const revalidate = 60;

const fallbackSettings = {
  seoDefaults: {
    defaultTitle: 'Samuell Goldfinch - Creative Director, Filmmaker, DJ',
    defaultDescription: 'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safeCms(getGlobalSettings() as Promise<typeof fallbackSettings>, fallbackSettings, 'home metadata');
  const meta = getDictionary('en').metadata;
  return {
    title: settings.seoDefaults?.defaultTitle || meta.homeTitle,
    description: settings.seoDefaults?.defaultDescription || meta.homeDescription,
    alternates: {
      canonical: '/',
      languages: { en: '/', fr: '/fr' },
    },
    openGraph: { locale: meta.ogLocale },
  };
}

export default async function HomePage() {
  const blazeProjects = await safeCms(getFeaturedBlazeProjects(6), [], 'home blaze projects');

  return (
    <HomeClient
      blazeProjects={blazeProjects as any}
      locale="en"
    />
  );
}
