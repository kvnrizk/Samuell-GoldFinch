import { getAllPosts } from '@/lib/fetchers';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuellgoldfinch.com';

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

  // CMS-only: never publish static/demo posts in the public feed.
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
