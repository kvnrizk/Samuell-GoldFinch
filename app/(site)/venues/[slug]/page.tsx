import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVenueSEOPageBySlug, getVenueSEOPages, getGlobalSettings } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import { BreadcrumbJsonLd, LocalBusinessJsonLd, ArticleJsonLd } from '@/components/JsonLd';
import { SectionKicker } from '@/components/ui/SectionKicker';
import { GlassCard } from '@/components/ui/GlassCard';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await safeCms(getVenueSEOPageBySlug(slug), null, `venue metadata ${slug}`);
  if (!page) return { title: 'Not Found' };
  const ogImage = typeof page.ogImage === 'object' ? page.ogImage?.url : undefined;

  return {
    title: page.seoTitle || `${page.title} | Samuell Goldfinch`,
    description: page.seoDescription || page.heroSubtitle || '',
    alternates: { canonical: `${SITE_URL}/venues/${slug}` },
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || '',
      url: `${SITE_URL}/venues/${slug}`,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

export async function generateStaticParams() {
  const pages = await safeCms(getVenueSEOPages(), [], 'venue static params');
  return pages.map((p) => ({ slug: (p as unknown as Record<string, string>).slug }));
}

export default async function VenueSEOPage({ params }: Props) {
  const { slug } = await params;

  // Don't match "case-studies" — that's handled by a different route
  if (slug === 'case-studies') return notFound();

  const page = await safeCms(getVenueSEOPageBySlug(slug), null, `venue page ${slug}`);
  if (!page) notFound();

  const settings = await safeCms(getGlobalSettings() as unknown as Promise<Record<string, string>>, {}, 'venue detail settings');
  const calendlyUrl = settings.calendlyUrl || 'https://calendly.com/samuellgoldfinch/venue-discovery';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'For Venues', url: `${SITE_URL}/venues` },
          { name: page.title, url: `${SITE_URL}/venues/${slug}` },
        ]}
      />
      <LocalBusinessJsonLd />
      <ArticleJsonLd
        title={page.title}
        description={page.seoDescription || page.heroSubtitle || ''}
        url={`${SITE_URL}/venues/${slug}`}
        datePublished={page.createdAt}
      />

      <article className="pt-32 pb-24 venues-section">
        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/venues" className="hover:text-white transition-colors">For Venues</Link>
            <span>/</span>
            <span className="text-zinc-400">{page.title}</span>
          </nav>

          {/* Header */}
          <SectionKicker label="For Venues" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-100 leading-tight mb-4">
            {page.title}
          </h1>
          {page.heroSubtitle && (
            <p className="text-lg text-zinc-400 mb-12 max-w-2xl">
              {page.heroSubtitle}
            </p>
          )}

          {/* Rich text content */}
          <div className="prose prose-invert prose-lg max-w-none mb-16
            prose-headings:font-serif prose-headings:text-stone-100
            prose-p:text-zinc-400 prose-p:leading-relaxed
            prose-a:text-ivory prose-a:no-underline hover:prose-a:underline
            prose-strong:text-stone-200
            prose-li:text-zinc-400
            prose-blockquote:border-ivory/30 prose-blockquote:text-zinc-400
          ">
            {page.content ? (
              typeof (page.content as unknown) === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: (page.content as unknown as string).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '') }} />
              ) : (
                <p className="text-zinc-500">Content coming soon — this page is being prepared.</p>
              )
            ) : (
              <p className="text-zinc-500">Content coming soon — this page is being prepared.</p>
            )}
          </div>

          {/* CTA */}
          <GlassCard featured className="!p-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 mb-3">
              {page.ctaHeading || 'Ready to transform your venue?'}
            </h2>
            <p className="text-sm text-zinc-400 mb-8 max-w-lg mx-auto">
              {page.ctaDescription || 'Book a free discovery call and get a personalised programming plan within 5 days.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ivory text-midnight font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#e4e4e7] active:scale-[0.98] transition-all"
              >
                Book a Discovery Call
              </a>
              <Link
                href="/venues#venue-form"
                className="border border-ivory text-ivory font-semibold text-sm px-8 py-3.5 rounded-lg text-center hover:bg-ivory/8 transition-all"
              >
                Apply Now
              </Link>
            </div>
          </GlassCard>

          {/* Internal links */}
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-xs font-mono text-zinc-600 mb-4">Related</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/venues" className="text-sm text-ivory hover:underline">Venue Packages</Link>
              <span className="text-zinc-700">·</span>
              <Link href="/venues#venue-form" className="text-sm text-ivory hover:underline">Apply Now</Link>
              <span className="text-zinc-700">·</span>
              <Link href="/kolasi" className="text-sm text-zinc-500 hover:text-white transition-colors">Kolasi Agency</Link>
              <span className="text-zinc-700">·</span>
              <Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
