import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/fetchers';
import JournalClient from './JournalClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Journal — Samuell Goldfinch',
  description: 'Behind the scenes, tips, industry insights and stories from the world of cinematic filmmaking and nightlife curation.',
  alternates: { canonical: '/journal' },
};

/* ── Static fallback posts ── */
const staticPosts = [
  {
    title: 'Behind the Scenes: Filming a Destination Wedding in Beirut',
    slug: 'behind-the-scenes-beirut-wedding',
    excerpt: 'A look inside the creative process of capturing a three-day celebration across Beirut — from scouting locations at dawn to the final color grade.',
    category: 'behind-the-scenes',
    coverImage: { url: '/assets/blaze/weddings/DSCF2395.jpg' },
    publishedAt: '2025-12-15',
    featured: true,
    tags: [{ tag: 'Wedding' }, { tag: 'Beirut' }, { tag: 'Cinematic' }],
  },
  {
    title: '5 Questions to Ask Your Wedding Videographer',
    slug: '5-questions-wedding-videographer',
    excerpt: 'Before you book, make sure you ask these essential questions to find a filmmaker whose style matches your vision.',
    category: 'tips',
    coverImage: { url: '/assets/blaze/weddings/0G0A7733.jpg' },
    publishedAt: '2025-11-28',
    featured: false,
    tags: [{ tag: 'Tips' }, { tag: 'Wedding' }],
  },
  {
    title: 'The Art of Nightlife Programming',
    slug: 'art-of-nightlife-programming',
    excerpt: 'How we curate lineups, build crowd loyalty, and create weekly identities for venues — the Kolasi methodology explained.',
    category: 'industry',
    coverImage: { url: '/assets/kolasi/images/4F8A3195.jpg' },
    publishedAt: '2025-11-10',
    featured: false,
    tags: [{ tag: 'Nightlife' }, { tag: 'Kolasi' }, { tag: 'Venues' }],
  },
  {
    title: 'Kolasi Season 3: What\'s Coming',
    slug: 'kolasi-season-3',
    excerpt: 'New residencies, international headliners, and a brand new rooftop series — here\'s everything we have planned for the season ahead.',
    category: 'news',
    coverImage: { url: '/assets/kolasi/images/4F8A3750.jpg' },
    publishedAt: '2025-10-20',
    featured: false,
    tags: [{ tag: 'News' }, { tag: 'Kolasi' }],
  },
  {
    title: 'How We Shot the Embassy of Lebanon Reception',
    slug: 'embassy-of-lebanon-bts',
    excerpt: 'Diplomatic events require a unique approach — discretion, elegance, and zero room for error. Here\'s how we handled it.',
    category: 'client-stories',
    coverImage: { url: '/assets/blaze/ambassy/0C5A9134.jpg' },
    publishedAt: '2025-09-05',
    featured: false,
    tags: [{ tag: 'Embassy' }, { tag: 'Diplomatic' }, { tag: 'Client Story' }],
  },
];

export default async function JournalPage() {
  let cmsPosts: any[] = [];
  try {
    cmsPosts = await getAllPosts();
  } catch {
    /* CMS unavailable */
  }

  const posts = cmsPosts.length > 0 ? cmsPosts : staticPosts;

  return <JournalClient posts={posts as any} />;
}
