import type { Metadata } from 'next';
import ShowreelClient from './ShowreelClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Showreel — Samuell Goldfinch',
  description: 'Watch the latest cinematic showreel and highlight clips from Blaze Production and Kolasi Agency. Wedding films, event coverage, editorial content.',
  alternates: { canonical: '/showreel' },
};

/* ── Static fallback highlights (used when CMS is empty) ── */
const staticHighlights = [
  {
    title: 'Wedding Demoreel',
    muxPlaybackId: 'ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A',
    category: 'wedding' as const,
    slug: 'stouh-beirut',
  },
  {
    title: 'Art Direction',
    muxPlaybackId: 'QhSdi3vQs0193ZnrH8K00mhoz4ImI5G01kPTOcCgMeqnKA',
    category: 'editorial' as const,
    slug: null,
  },
  {
    title: 'Transdev Aftermovie',
    muxPlaybackId: 'SvrdUWLKn5e7B6AVE4hblhCTjZsg9g01KI7iCykNLY00Y',
    category: 'brand' as const,
    slug: null,
  },
  {
    title: 'Wedding Film',
    muxPlaybackId: 'k6goj8JKK9ChHj7WDapbsfsjv9U3MC02GLhJBGddzyTk',
    category: 'wedding' as const,
    slug: null,
  },
  {
    title: 'Château de Chantilly',
    muxPlaybackId: '2aAgNa5S5s32fQG8XBUHXrwPUBbEQxn4oyKAjJSV801k',
    category: 'event' as const,
    slug: null,
  },
  {
    title: '2nd Sun Festival',
    muxPlaybackId: 'RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo',
    category: 'event' as const,
    slug: null,
  },
  {
    title: 'Hangar Y — Solomun',
    muxPlaybackId: 'uar02cwjF78qfyUUvSQIMcnQyHVImiF6sJP3Izh7D01JU',
    category: 'music' as const,
    slug: null,
  },
  {
    title: 'Kate Zubok Live',
    muxPlaybackId: 'RPuL7pFySoUTqNAjG601srkT1Nhqmcyhkug5uhGpz8PA',
    category: 'music' as const,
    slug: null,
  },
];

export default async function ShowreelPage() {
  // Try CMS first, fall back to static data
  let heroReel = {
    muxPlaybackId: 'ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A',
    posterUrl: '/assets/blaze/weddings/DSCF2395.jpg',
    title: 'Showreel 2025',
  };
  let highlights = staticHighlights;

  try {
    const { getShowreel } = await import('@/lib/fetchers');
    const data = await getShowreel();
    if (data?.heroReel?.muxPlaybackId) {
      heroReel = data.heroReel;
    }
    if (data?.highlights?.length) {
      highlights = data.highlights;
    }
  } catch {
    // CMS unavailable — use static fallbacks
  }

  return (
    <ShowreelClient
      heroReel={heroReel}
      highlights={highlights as any}
    />
  );
}
