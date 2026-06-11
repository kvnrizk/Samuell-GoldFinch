import ContactClient from './ContactClient';
import { getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';

const meta = getDictionary('en').metadata;

export const metadata = buildPageMetadata({
  title: meta.contactTitle,
  description: meta.contactDescription,
  path: '/contact',
  languages: { en: '/contact', fr: '/fr/contact' },
});

export default function ContactPage() {
  return <ContactClient locale="en" />;
}
