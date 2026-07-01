import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getArtists, getAdjacentArtists, getEventsByArtist } from '@/lib/fetchers';
import ArtistProfile from './ArtistProfile';

export const revalidate = 60;

export async function generateStaticParams() {
  let cmsSlugs: string[] = [];

  try {
    const artists = await getArtists();
    cmsSlugs = artists.map((artist: any) => artist.slug).filter(Boolean);
  } catch {
    /* CMS unavailable */
  }

  return Array.from(new Set(cmsSlugs)).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let artist: any = null;
  try {
    artist = await getArtistBySlug(slug);
  } catch {
    /* CMS unavailable */
  }

  if (!artist) return { title: 'Artist Not Found' };

  const genres = (artist.genres || []).map((genre: any) => genre.genre || genre).join(', ');

  return {
    title: `${artist.name} — Kolasi | Samuell Goldfinch`,
    description: artist.bio || `${artist.name} — ${genres} artist represented by Kolasi`,
    alternates: { canonical: `/kolasi/artists/${slug}` },
    openGraph: {
      title: `${artist.name} — Kolasi`,
      description: artist.bio || `${artist.name} — ${genres}`,
      images: artist.photo?.url ? [{ url: artist.photo.url }] : [],
    },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let artist: any = null;
  try {
    artist = await getArtistBySlug(slug);
  } catch {
    /* CMS unavailable */
  }

  if (!artist) notFound();

  let events: any[] = [];
  let adjacent: { prev: any; next: any } = { prev: null, next: null };

  try {
    events = await getEventsByArtist(artist.id);
    adjacent = await getAdjacentArtists(slug);
  } catch {
    /* Related CMS data unavailable */
  }

  return (
    <ArtistProfile
      artist={artist}
      events={events}
      prevArtist={adjacent.prev ? { name: adjacent.prev.name, slug: adjacent.prev.slug } : undefined}
      nextArtist={adjacent.next ? { name: adjacent.next.name, slug: adjacent.next.slug } : undefined}
    />
  );
}
