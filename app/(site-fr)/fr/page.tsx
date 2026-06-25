import type { Metadata } from 'next';
import { getFeaturedBlazeProjects } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import { getDictionary } from '@/lib/i18n';
import HomeClient from '../../(site)/HomeClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: getDictionary('fr').metadata.homeTitle,
  description: getDictionary('fr').metadata.homeDescription,
  alternates: {
    canonical: '/fr',
    languages: { en: '/', fr: '/fr' },
  },
  openGraph: { locale: getDictionary('fr').metadata.ogLocale },
};

export default async function FrenchHomePage() {
  const blazeProjects = await safeCms(getFeaturedBlazeProjects(6), [], 'fr home blaze projects');

  return (
    <HomeClient
      blazeProjects={blazeProjects as any}
      locale="fr"
    />
  );
}
