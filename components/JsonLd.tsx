import { serializeJsonLd } from '@/lib/seo';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';
const STRUCTURED_DATA_LOGO = `${SITE_URL}/og-image.png`;

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Samuell Goldfinch',
        url: SITE_URL,
        logo: STRUCTURED_DATA_LOGO,
        sameAs: [
          'https://instagram.com/samuellgoldfinch',
          'https://instagram.com/kolasi.paris',
          'https://instagram.com/blazeprd',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contact@samuellgoldfinch.com',
          telephone: '+33605883966',
          contactType: 'customer service',
          availableLanguage: ['English', 'French'],
        },
      }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
        name: 'Kolasi Agency — DJ Booking & Venue Programming',
        description:
          'Curated DJ programming, content production, and brand strategy for bars, clubs, and restaurants across Paris and Europe.',
        url: `${SITE_URL}/venues`,
        telephone: '+33605883966',
        email: 'contact@samuellgoldfinch.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Paris',
          addressCountry: 'FR',
        },
        areaServed: [
          { '@type': 'City', name: 'Paris' },
          { '@type': 'Country', name: 'France' },
          { '@type': 'Continent', name: 'Europe' },
        ],
        priceRange: '€€€',
        openingHours: 'Mo-Fr 10:00-19:00',
      }}
    />
  );
}

export function PersonJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Samuell Goldfinch',
        url: SITE_URL,
        jobTitle: 'Creative Director, Filmmaker, DJ',
        worksFor: [
          { '@type': 'Organization', name: 'Blaze Production' },
          { '@type': 'Organization', name: 'Kolasi Agency' },
        ],
        sameAs: [
          'https://instagram.com/samuellgoldfinch',
        ],
        knowsAbout: [
          'Film Direction',
          'DJ Performance',
          'Event Curation',
          'Venue Programming',
          'Content Production',
        ],
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  image?: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        author: {
          '@type': 'Person',
          name: 'Samuell Goldfinch',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Samuell Goldfinch',
          logo: { '@type': 'ImageObject', url: STRUCTURED_DATA_LOGO },
        },
        ...(datePublished && { datePublished }),
        ...(image && { image }),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
