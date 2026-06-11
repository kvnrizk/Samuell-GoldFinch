import type { Metadata } from 'next';
import { absoluteUrl, siteUrl, type Locale } from './i18n';

const JSON_LD_ESCAPE_MAP: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

export const defaultOgImagePath = '/og-image.png';

export function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (char) => JSON_LD_ESCAPE_MAP[char]);
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  languages?: Record<string, string>;
  type?: 'website' | 'article';
  imagePath?: string;
}

export function buildPageMetadata({
  title,
  description,
  path,
  locale = 'en',
  languages,
  type = 'website',
  imagePath = defaultOgImagePath,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = imagePath.startsWith('http') ? imagePath : absoluteUrl(imagePath);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Samuell Goldfinch',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Samuell Goldfinch',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function absoluteSiteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}
