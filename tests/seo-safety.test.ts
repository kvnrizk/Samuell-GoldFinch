import { describe, expect, it } from 'vitest';

import { htmlToPlainText } from '../lib/safe-content';
import { buildPageMetadata, serializeJsonLd } from '../lib/seo';

describe('SEO and content safety helpers', () => {
  it('escapes JSON-LD script breakout characters', () => {
    const serialized = serializeJsonLd({
      name: '</script><img src=x onerror=alert(1)>',
      ampersand: 'Sam & Co',
    });

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<img');
    expect(serialized).toContain('\\u003c/script\\u003e');
    expect(serialized).toContain('Sam \\u0026 Co');
  });

  it('turns CMS HTML strings into safe plain text', () => {
    const text = htmlToPlainText('<p>Hello <strong>Sam &amp; Co</strong></p><img src=x onerror=alert(1)><script>alert(1)</script>');

    expect(text).toBe('Hello Sam & Co');
    expect(text).not.toContain('onerror');
    expect(text).not.toContain('alert(1)');
  });

  it('builds canonical, hreflang, OpenGraph, and Twitter metadata together', () => {
    const metadata = buildPageMetadata({
      title: 'Contact',
      description: 'Contact description',
      path: '/contact',
      languages: { en: '/contact', fr: '/fr/contact' },
    });

    expect(metadata.alternates).toMatchObject({
      canonical: '/contact',
      languages: { en: '/contact', fr: '/fr/contact' },
    });
    expect(metadata.openGraph).toMatchObject({
      title: 'Contact',
      description: 'Contact description',
      url: 'https://samuellgoldfinch.com/contact',
      locale: 'en_US',
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Contact',
    });
  });
});
