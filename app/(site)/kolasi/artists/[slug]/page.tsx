import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getArtists, getAdjacentArtists, getEventsByArtist } from '@/lib/fetchers';
import ArtistProfile from './ArtistProfile';

/* ── Static fallback artists (until CMS is seeded) ── */
const staticArtists: Record<string, any> = {
  'kate-zubok': {
    id: 'kate-zubok',
    name: 'Kate Zubok',
    slug: 'kate-zubok',
    bio: 'A Parisian DJ known for her eclectic blend of deep house, melodic techno, and ethnic grooves. Kate has headlined events across France, Lebanon, and the UAE, bringing a hypnotic energy to every set.',
    photo: { url: '/assets/kolasi/artists/artist-1.jpg' },
    genres: [{ genre: 'Deep House' }, { genre: 'Melodic Techno' }],
    rosterCategory: 'resident',
    socialLinks: {
      instagram: 'https://instagram.com/katezubok',
      soundcloud: 'https://soundcloud.com/katezubok',
      spotify: '',
    },
    mixes: [
      { title: 'Le Speakeasy Opening Set', url: 'https://soundcloud.com/katezubok/le-speakeasy', platform: 'soundcloud', duration: '1:32:00' },
      { title: 'Kolasi Nights Vol. 3', url: 'https://soundcloud.com/katezubok/kolasi-nights-3', platform: 'soundcloud', duration: '1:45:00' },
    ],
    featured: true,
  },
  'dj-marco': {
    id: 'dj-marco',
    name: 'DJ Marco',
    slug: 'dj-marco',
    bio: 'Resident DJ at some of Beirut\'s most iconic rooftops. Marco\'s sets blend Afro house, organic house, and progressive elements, creating uplifting journeys that keep dance floors alive until sunrise.',
    photo: { url: '/assets/kolasi/artists/artist-2.jpg' },
    genres: [{ genre: 'Afro House' }, { genre: 'Progressive' }],
    rosterCategory: 'resident',
    socialLinks: {
      instagram: 'https://instagram.com/djmarco',
      soundcloud: 'https://soundcloud.com/djmarco',
      spotify: '',
    },
    mixes: [
      { title: 'Rooftop Sessions — Summer 2025', url: 'https://soundcloud.com/djmarco/rooftop-summer', platform: 'soundcloud', duration: '2:10:00' },
    ],
    featured: true,
  },
  'naya-sound': {
    id: 'naya-sound',
    name: 'Naya Sound',
    slug: 'naya-sound',
    bio: 'Blending live vocals with electronic production, Naya Sound delivers a hybrid live act that fuses Arabic melodies with modern club sounds. Featured at festivals across Europe and the MENA region.',
    photo: { url: '/assets/kolasi/artists/artist-3.JPG' },
    genres: [{ genre: 'Live Act' }, { genre: 'Electronic Fusion' }],
    rosterCategory: 'live-act',
    socialLinks: {
      instagram: 'https://instagram.com/nayasound',
      soundcloud: '',
      spotify: 'https://open.spotify.com/artist/nayasound',
    },
    mixes: [
      { title: 'Live at 2nd Sun', url: 'https://soundcloud.com/nayasound/live-2nd-sun', platform: 'soundcloud', duration: '1:15:00' },
    ],
    featured: true,
  },
  'samir-k': {
    id: 'samir-k',
    name: 'Samir K',
    slug: 'samir-k',
    bio: 'International headliner specializing in high-energy techno and industrial sounds. Samir K has performed at leading European clubs and festivals, known for intense peak-time sets.',
    photo: { url: '/assets/kolasi/artists/artist-4.JPG' },
    genres: [{ genre: 'Techno' }, { genre: 'Industrial' }],
    rosterCategory: 'headliner',
    socialLinks: {
      instagram: 'https://instagram.com/samirk',
      soundcloud: 'https://soundcloud.com/samirk',
      spotify: '',
    },
    mixes: [
      { title: 'Peak Time Techno — Warehouse Set', url: 'https://soundcloud.com/samirk/warehouse', platform: 'soundcloud', duration: '2:00:00' },
    ],
    featured: false,
  },
  'lina-m': {
    id: 'lina-m',
    name: 'Lina M',
    slug: 'lina-m',
    bio: 'A rising star in the melodic house scene, Lina M combines delicate synth work with driving rhythms. Her sets at Kolasi events have earned her a devoted following in the French Riviera scene.',
    photo: { url: '/assets/kolasi/artists/IMG_6476.JPG' },
    genres: [{ genre: 'Melodic House' }, { genre: 'Indie Dance' }],
    rosterCategory: 'resident',
    socialLinks: {
      instagram: 'https://instagram.com/linam',
      soundcloud: 'https://soundcloud.com/linam',
      spotify: '',
    },
    mixes: [],
    featured: true,
  },
};

const staticArtistSlugs = Object.keys(staticArtists);

/* ── Static fallback events per artist ── */
const staticEventsByArtist: Record<string, any[]> = {
  'kate-zubok': [
    { title: 'Le Speakeasy Opening', slug: 'le-speakeasy', date: '2025-03-15', venue: 'Le Speakeasy, Paris' },
    { title: 'Kolasi Nights', slug: 'kolasi-nights', date: '2025-06-22', venue: 'Rooftop Lounge, Beirut' },
  ],
  'dj-marco': [
    { title: '2nd Sun', slug: '2nd-sun', date: '2025-05-10', venue: 'Skybar, Beirut' },
  ],
  'naya-sound': [
    { title: '2nd Sun', slug: '2nd-sun', date: '2025-05-10', venue: 'Skybar, Beirut' },
    { title: 'Le Speakeasy Opening', slug: 'le-speakeasy', date: '2025-03-15', venue: 'Le Speakeasy, Paris' },
  ],
  'samir-k': [
    { title: 'Kolasi Nights', slug: 'kolasi-nights', date: '2025-06-22', venue: 'Rooftop Lounge, Beirut' },
  ],
  'lina-m': [],
};

export const revalidate = 60;

export async function generateStaticParams() {
  let cmsSlugs: string[] = [];
  try {
    const artists = await getArtists();
    cmsSlugs = artists.map((a: any) => a.slug).filter(Boolean);
  } catch {
    /* CMS unavailable */
  }
  const allSlugs = Array.from(new Set([...cmsSlugs, ...staticArtistSlugs]));
  return allSlugs.map((slug) => ({ slug }));
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
  if (!artist) artist = staticArtists[slug];
  if (!artist) return { title: 'Artist Not Found' };

  const genres = (artist.genres || []).map((g: any) => g.genre || g).join(', ');

  return {
    title: `${artist.name} — Kolasi | Samuell Goldfinch`,
    description: artist.bio || `${artist.name} — ${genres} artist represented by Kolasi`,
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

  /* Try CMS first, fall back to static */
  let artist: any = null;
  let events: any[] = [];
  let adjacent: { prev: any; next: any } = { prev: null, next: null };

  try {
    artist = await getArtistBySlug(slug);
    if (artist) {
      events = await getEventsByArtist(artist.id);
      adjacent = await getAdjacentArtists(slug);
    }
  } catch {
    /* CMS unavailable */
  }

  if (!artist) {
    artist = staticArtists[slug];
    events = staticEventsByArtist[slug] || [];

    if (artist) {
      const slugs = staticArtistSlugs;
      const idx = slugs.indexOf(slug);
      adjacent = {
        prev: staticArtists[slugs[idx > 0 ? idx - 1 : slugs.length - 1]],
        next: staticArtists[slugs[idx < slugs.length - 1 ? idx + 1 : 0]],
      };
    }
  }

  if (!artist) notFound();

  return (
    <ArtistProfile
      artist={artist}
      events={events}
      prevArtist={adjacent.prev ? { name: adjacent.prev.name, slug: adjacent.prev.slug } : undefined}
      nextArtist={adjacent.next ? { name: adjacent.next.name, slug: adjacent.next.slug } : undefined}
    />
  );
}
