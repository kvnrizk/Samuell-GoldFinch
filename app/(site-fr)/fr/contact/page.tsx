import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import ContactClient from '../../../(site)/contact/ContactClient';

const meta = getDictionary('fr').metadata;

export const metadata = buildPageMetadata({
  title: meta.contactTitle,
  description: meta.contactDescription,
  path: '/fr/contact',
  locale: 'fr',
  languages: { en: '/contact', fr: '/fr/contact' },
});

export default function FrenchContactPage() {
  return <ContactClient locale="fr" />;
}
