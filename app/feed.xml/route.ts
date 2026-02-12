import { getAllPosts } from '@/lib/fetchers';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';

/* ── Static fallback posts for RSS ── */
const staticPosts = [
  {
    title: 'Behind the Scenes: Filming a Destination Wedding in Beirut',
    slug: 'behind-the-scenes-beirut-wedding',
    excerpt: 'A look inside the creative process of capturing a three-day celebration across Beirut.',
    category: 'behind-the-scenes',
    publishedAt: '2025-12-15',
  },
  {
    title: '5 Questions to Ask Your Wedding Videographer',
    slug: '5-questions-wedding-videographer',
    excerpt: 'Before you book, make sure you ask these essential questions.',
    category: 'tips',
    publishedAt: '2025-11-28',
  },
  {
    title: 'The Art of Nightlife Programming',
    slug: 'art-of-nightlife-programming',
    excerpt: 'How we curate lineups, build crowd loyalty, and create weekly identities for venues.',
    category: 'industry',
    publishedAt: '2025-11-10',
  },
  {
    title: 'Kolasi Season 3: What\'s Coming',
    slug: 'kolasi-season-3',
    excerpt: 'New residencies, international headliners, and a brand new rooftop series.',
    category: 'news',
    publishedAt: '2025-10-20',
  },
  {
    title: 'How We Shot the Embassy of Lebanon Reception',
    slug: 'embassy-of-lebanon-bts',
    excerpt: 'Diplomatic events require a unique approach — discretion, elegance, and zero room for error.',
    category: 'client-stories',
    publishedAt: '2025-09-05',
  },
];

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let posts: any[] = [];
  try {
    posts = await getAllPosts(undefined, 50);
  } catch { /* CMS unavailable */ }

  if (posts.length === 0) posts = staticPosts;

  const items = posts.map((post: any) => {
    const pubDate = post.publishedAt
      ? new Date(post.publishedAt).toUTCString()
      : new Date().toUTCString();

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/journal/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/journal/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <category>${escapeXml(post.category || '')}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Samuell Goldfinch — Journal</title>
    <link>${BASE_URL}/journal</link>
    <description>Stories, insights and behind-the-scenes from the world of cinematic filmmaking and nightlife curation.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
