import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getKolasiEventBySlug, getAllKolasiEvents, getAdjacentKolasiEvents } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import KolasiEventDetail from './KolasiEventDetail';

export const revalidate = 60;

export async function generateStaticParams() {
  const events = await safeCms(getAllKolasiEvents(), [], 'kolasi static params');
  const seen = new Set<string>();

  return (events as any[])
    .filter((event) => event.slug && !seen.has(event.slug) && seen.add(event.slug))
    .map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await safeCms(getKolasiEventBySlug(slug), null, `kolasi metadata ${slug}`) as any;
  if (!event) return {};

  const title = `${event.title} — Kolasi by Samuell Goldfinch`;
  const description = event.venue
    ? `${event.title} at ${event.venue} — A Kolasi event experience`
    : `${event.title} — A Kolasi event experience`;
  const ogImage = event.gallery?.[0]?.image?.url;

  return {
    title,
    description,
    alternates: { canonical: `/kolasi/${slug}` },
    openGraph: {
      title: event.title,
      description,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function KolasiEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await safeCms(getKolasiEventBySlug(slug), null, `kolasi event ${slug}`) as any;
  if (!event) notFound();

  const adjacent = await safeCms(
    getAdjacentKolasiEvents(slug),
    { prev: null, next: null },
    `kolasi adjacent ${slug}`,
  );

  return (
    <KolasiEventDetail
      event={event}
      prevEvent={adjacent.prev as any}
      nextEvent={adjacent.next as any}
    />
  );
}
