import type { Metadata } from 'next';
import { getKolasiEventBySlug, getAllKolasiEvents, getAdjacentKolasiEvents } from '@/lib/fetchers';
import KolasiEventDetail from './KolasiEventDetail';
import { notFound } from 'next/navigation';

export const revalidate = 60;

/* ── Static fallback data (used until CMS is seeded) ── */
const staticEvents: Record<string, any> = {
  'le-speakeasy': {
    title: 'Le Speakeasy',
    slug: 'le-speakeasy',
    eventType: 'club',
    venue: 'Le Speakeasy, Paris',
    date: '2025-10-18',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'An intimate underground night at one of Paris\'s most iconic hidden bars. Le Speakeasy by Kolasi brought together a curated lineup of deep house and melodic techno DJs for a one-of-a-kind experience.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'The night featured bespoke cocktails, immersive lighting design, and a sound system tuned to perfection. Every detail was crafted to transport guests into a world where music, art, and nightlife converge.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.JPG' } },
      { image: { url: '/assets/kolasi/images/4F8A2882.jpg' } },
      { image: { url: '/assets/kolasi/images/4F8A3195.jpg' } },
      { image: { url: '/assets/kolasi/images/4F8A3310.jpg' } },
      { image: { url: '/assets/kolasi/images/4F8A2938.jpg' } },
    ],
    videos: [],
    artists: [
      { name: 'Kate Zubok', slug: 'kate-zubok', photo: { url: '/assets/kolasi/artists/artist-1.jpg' }, genres: ['Deep House', 'Melodic Techno'] },
      { name: 'Naya Sound', slug: 'naya-sound', photo: { url: '/assets/kolasi/artists/artist-3.JPG' }, genres: ['Live Act', 'Electronic Fusion'] },
    ],
  },
  '2nd-sun': {
    title: '2nd Sun',
    slug: '2nd-sun',
    eventType: 'rooftop',
    venue: 'Rooftop Venue, Paris',
    date: '2025-07-12',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'A sun-drenched afternoon-to-night rooftop session overlooking the Parisian skyline. 2nd Sun merged deep grooves with golden-hour energy, featuring a rotating cast of resident and guest DJs.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'From sunset cocktails to late-night dancing under the stars, this open-air event redefined what a Parisian summer gathering could feel like.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/kolasi/images/4F8A3750.jpg' } },
      { image: { url: '/assets/kolasi/images/4F8A3777.jpg' } },
      { image: { url: '/assets/kolasi/images/4F8A3801.jpg' } },
      { image: { url: '/assets/kolasi/artists/4F8A3682.jpg' } },
    ],
    videos: [],
    artists: [
      { name: 'DJ Marco', slug: 'dj-marco', photo: { url: '/assets/kolasi/artists/artist-2.jpg' }, genres: ['Afro House', 'Progressive'] },
      { name: 'Naya Sound', slug: 'naya-sound', photo: { url: '/assets/kolasi/artists/artist-3.JPG' }, genres: ['Live Act', 'Electronic Fusion'] },
    ],
  },
  'kolasi-nights': {
    title: 'Kolasi Nights',
    slug: 'kolasi-nights',
    eventType: 'club',
    venue: 'Various Venues, Paris',
    date: '2025-12-06',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'The flagship Kolasi club night series. A rotating concept that transforms a different venue each edition — from underground bunkers to art galleries — into a Kolasi universe of sound and light.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'Each edition features international headliners alongside Kolasi residents, custom visual installations, and a community of music lovers who come for the experience as much as the lineup.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/kolasi/artists/artist-1.jpg' } },
      { image: { url: '/assets/kolasi/artists/artist-2.jpg' } },
      { image: { url: '/assets/kolasi/artists/artist-3.JPG' } },
      { image: { url: '/assets/kolasi/artists/artist-4.JPG' } },
      { image: { url: '/assets/kolasi/artists/IMG_6476.JPG' } },
      { image: { url: '/assets/kolasi/artists/IMG_6733.jpg' } },
    ],
    videos: [],
    artists: [
      { name: 'Samir K', slug: 'samir-k', photo: { url: '/assets/kolasi/artists/artist-4.JPG' }, genres: ['Techno', 'Industrial'] },
      { name: 'Kate Zubok', slug: 'kate-zubok', photo: { url: '/assets/kolasi/artists/artist-1.jpg' }, genres: ['Deep House', 'Melodic Techno'] },
      { name: 'Lina M', slug: 'lina-m', photo: { url: '/assets/kolasi/artists/IMG_6476.JPG' }, genres: ['Melodic House', 'Indie Dance'] },
    ],
  },
};

const staticSlugs = Object.keys(staticEvents);
const staticOrder = ['le-speakeasy', '2nd-sun', 'kolasi-nights'];

function getStaticAdjacent(slug: string) {
  const idx = staticOrder.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };
  const prevSlug = idx > 0 ? staticOrder[idx - 1] : staticOrder[staticOrder.length - 1];
  const nextSlug = idx < staticOrder.length - 1 ? staticOrder[idx + 1] : staticOrder[0];
  return {
    prev: staticEvents[prevSlug],
    next: staticEvents[nextSlug],
  };
}

/* ── Route generation ── */

export async function generateStaticParams() {
  const events = await getAllKolasiEvents();
  const cmsSlugs = (events as any[])
    .filter((e) => e.slug)
    .map((e) => ({ slug: e.slug }));

  const fallbackSlugs = staticSlugs.map((slug) => ({ slug }));
  const allSlugs = [...cmsSlugs, ...fallbackSlugs];

  const seen = new Set<string>();
  return allSlugs.filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmsEvent = await getKolasiEventBySlug(slug);
  const event = (cmsEvent as any) || staticEvents[slug];
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
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function KolasiEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cmsEvent = await getKolasiEventBySlug(slug);
  const event = (cmsEvent as any) || staticEvents[slug];
  if (!event) notFound();

  let adjacent;
  if (cmsEvent) {
    adjacent = await getAdjacentKolasiEvents(slug);
  } else {
    adjacent = getStaticAdjacent(slug);
  }

  return (
    <KolasiEventDetail
      event={event}
      prevEvent={adjacent.prev as any}
      nextEvent={adjacent.next as any}
    />
  );
}
