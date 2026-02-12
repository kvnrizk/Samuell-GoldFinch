import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/fetchers';
import JournalPostDetail from './JournalPostDetail';

export const revalidate = 60;

/* ── Static fallback posts (full content for detail pages) ── */
const staticPostsMap: Record<string, any> = {
  'behind-the-scenes-beirut-wedding': {
    title: 'Behind the Scenes: Filming a Destination Wedding in Beirut',
    slug: 'behind-the-scenes-beirut-wedding',
    excerpt: 'A look inside the creative process of capturing a three-day celebration across Beirut — from scouting locations at dawn to the final color grade.',
    category: 'behind-the-scenes',
    coverImage: { url: '/assets/blaze/weddings/DSCF2395.jpg' },
    publishedAt: '2025-12-15',
    featured: true,
    tags: [{ tag: 'Wedding' }, { tag: 'Beirut' }, { tag: 'Cinematic' }],
    author: { name: 'Samuell Goldfinch' },
    content: `When we first received the brief for this Beirut wedding, we knew it would be unlike anything we had filmed before. A three-day celebration spanning rooftops, seaside venues, and historic quarters of the city — each with its own mood, light, and energy.

Day one began at 5 AM. We drove to Raouché to catch the golden hour over the Pigeon Rocks. The bride had requested a "first look" sequence there, and the morning light delivered. We shot on two cameras — one locked on a gimbal for smooth tracking, the other handheld for intimate close-ups.

The ceremony itself took place in a restored Ottoman-era courtyard. The challenge here was audio — the acoustics bounced sound everywhere. We ran three wireless lavs and a shotgun mic overhead, mixing them in post to get clean vows without the ambient echo.

For the reception, we transitioned to a modern rooftop venue overlooking the city. This is where our cinematic approach really shone. We pre-rigged two slider setups and a drone for the entrance reveal. The couple's first dance was lit entirely by 200 candles — no artificial light. We pushed our Sony FX6 to ISO 12800 and the footage was breathtaking.

The color grade took three full days. We developed a custom LUT that bridged the warm Mediterranean daylight with the cool blue-hour tones of the rooftop. Every frame was treated individually — this isn't a template approach, it's craft.

The final film runs 12 minutes. The couple cried when they watched it. Their parents called it "the most beautiful thing they'd ever seen." That's why we do this.`,
  },
  '5-questions-wedding-videographer': {
    title: '5 Questions to Ask Your Wedding Videographer',
    slug: '5-questions-wedding-videographer',
    excerpt: 'Before you book, make sure you ask these essential questions to find a filmmaker whose style matches your vision.',
    category: 'tips',
    coverImage: { url: '/assets/blaze/weddings/DSCF2471.jpg' },
    publishedAt: '2025-11-28',
    featured: false,
    tags: [{ tag: 'Tips' }, { tag: 'Wedding' }],
    author: { name: 'Samuell Goldfinch' },
    content: `Choosing a wedding videographer is one of the most important decisions you'll make for your big day. Photos capture moments, but video captures the emotion, the laughter, the tears, and the music that made your celebration unique.

Here are five questions that will help you find the right filmmaker:

1. What is your shooting style?

Every videographer has a signature approach. Some lean documentary — minimal direction, capturing events as they unfold. Others take a cinematic approach — carefully composed shots, dramatic lighting, and a narrative arc. Ask to see full wedding films, not just highlight reels, to understand how they tell a complete story.

2. How do you handle low-light situations?

Receptions, candlelit ceremonies, and evening celebrations are where most videographers struggle. Ask about their camera bodies, lens choices, and whether they use supplemental lighting. A great filmmaker works with available light wherever possible.

3. What does your team look like on the day?

A solo shooter can capture beautiful footage, but a two-person team allows for simultaneous coverage — capturing both the bride's preparation and the groom's, or the couple's expressions and the guests' reactions at the same time.

4. What is your turnaround time and editing process?

Be wary of anyone promising a final film in under 4 weeks. Quality editing takes time. Ask about their color grading process, music licensing, and how many revision rounds are included.

5. Can you share a full wedding film from start to finish?

Highlight reels are curated to show the best moments. A full film reveals how the videographer handles transitions, pacing, and the quieter moments between the big ones. This is where you'll see their true storytelling ability.`,
  },
  'art-of-nightlife-programming': {
    title: 'The Art of Nightlife Programming',
    slug: 'art-of-nightlife-programming',
    excerpt: 'How we curate lineups, build crowd loyalty, and create weekly identities for venues — the Kolasi methodology explained.',
    category: 'industry',
    coverImage: { url: '/assets/kolasi/images/4F8A3195.jpg' },
    publishedAt: '2025-11-10',
    featured: false,
    tags: [{ tag: 'Nightlife' }, { tag: 'Kolasi' }, { tag: 'Venues' }],
    author: { name: 'Samuell Goldfinch' },
    content: `Nightlife programming is an art form that sits at the intersection of music curation, crowd psychology, and brand building. At Kolasi, we've spent years developing a methodology that turns venues from "places with music" into cultural destinations.

The foundation of great programming is understanding your audience. Not who you wish they were, but who actually walks through the door. We spend the first month of any venue partnership observing — tracking peak hours, noting what makes people stay versus leave, and mapping the energy curve of each night.

From there, we build what we call "night identities." Each evening of the week gets its own character. Monday might be intimate deep house with low lighting. Thursday could be afro house with live percussion. Saturday is the flagship — high energy, curated headliners, full production.

The key insight most venue owners miss is that consistency creates loyalty. When your Thursday crowd knows exactly what to expect — and those expectations are consistently exceeded — they become evangelists. They bring friends. They create FOMO for everyone else.

Lineup curation is where the magic happens. We don't just book DJs — we design journeys. An opening set that builds gradually, a peak-time headliner who understands the room, and a closing act who knows how to wind the energy down without killing it. Every transition is considered.

We also believe in developing local talent. Our resident DJ program pairs emerging artists with established names, giving them prime-time slots alongside mentors. This builds the local scene while keeping our costs sustainable.

The results speak for themselves. Venues we program see an average 40% increase in weekly revenue within the first quarter, and our resident nights consistently outperform guest bookings for bar spend per capita.`,
  },
  'kolasi-season-3': {
    title: 'Kolasi Season 3: What\'s Coming',
    slug: 'kolasi-season-3',
    excerpt: 'New residencies, international headliners, and a brand new rooftop series — here\'s everything we have planned for the season ahead.',
    category: 'news',
    coverImage: { url: '/assets/kolasi/images/4F8A3750.jpg' },
    publishedAt: '2025-10-20',
    featured: false,
    tags: [{ tag: 'News' }, { tag: 'Kolasi' }],
    author: { name: 'Samuell Goldfinch' },
    content: `Season 3 of Kolasi is our most ambitious yet. After two seasons of building our reputation across Paris, Beirut, and the French Riviera, we're expanding our reach while deepening our roots.

New Residencies: We're launching three new weekly residencies — two in Paris and one in the south of France. Each night has been carefully developed with its own identity, sound profile, and visual language. More details dropping soon.

International Headliners: This season features our strongest lineup of international artists to date. We've locked in bookings with names that our community has been requesting since day one. Expect announcements every two weeks starting next month.

Rooftop Series: The crown jewel of Season 3. We've partnered with an iconic rooftop space overlooking the city for a monthly sunset-to-midnight series. Limited capacity, premium production, and some of the most incredible views in the city as your backdrop.

Behind the scenes, we've also invested in our production capabilities. New sound systems at two of our partner venues, upgraded lighting rigs, and a dedicated content team that will bring the Kolasi experience to those who can't be there in person.

Stay tuned. Subscribe to our newsletter and follow us on Instagram for first access to tickets and announcements.`,
  },
  'embassy-of-lebanon-bts': {
    title: 'How We Shot the Embassy of Lebanon Reception',
    slug: 'embassy-of-lebanon-bts',
    excerpt: 'Diplomatic events require a unique approach — discretion, elegance, and zero room for error. Here\'s how we handled it.',
    category: 'client-stories',
    coverImage: { url: '/assets/blaze/ambassy/0C5A9134.jpg' },
    publishedAt: '2025-09-05',
    featured: false,
    tags: [{ tag: 'Embassy' }, { tag: 'Diplomatic' }, { tag: 'Client Story' }],
    author: { name: 'Samuell Goldfinch' },
    content: `When the Embassy of Lebanon approached us to film their annual diplomatic reception, the brief was clear: capture the elegance and significance of the event while remaining completely invisible.

Diplomatic events operate under a different set of rules. Every attendee is high-profile. Every interaction is potentially sensitive. There are areas you cannot film, people who cannot appear on camera, and protocols that must be followed to the letter.

Our preparation started two weeks before the event. We conducted a full site walk-through with the embassy's security team, mapping approved angles, restricted zones, and the exact flow of the evening. We identified our key shots — the ambassador's welcome address, the cultural performance, and the networking reception — and planned our positioning for each.

On the night, we deployed a three-person team. One operator was dedicated to formal coverage — wide establishing shots and the official program. A second captured candid moments among guests. The third handled detail work — the table settings, the artwork, the architecture of the space.

We shot entirely on prime lenses with natural lighting. No flash, no video lights, no attention-drawing equipment. Our cameras were dressed in black with tape over any LED indicators. We wore formal attire matching the dress code.

The edit followed the same philosophy of restraint. No flashy transitions. No dramatic music. Just a clean, elegant presentation that honored the gravity of the occasion. The final piece was reviewed by the embassy's communications office before delivery.

The ambassador personally called to thank us. He said it was the first time their events had been captured in a way that truly reflected the dignity of the occasion. That call led to three more embassy commissions across Europe.`,
  },
};

const staticAllPosts = Object.values(staticPostsMap);

export async function generateStaticParams() {
  let cmsPosts: any[] = [];
  try {
    cmsPosts = await getAllPosts();
  } catch { /* CMS unavailable */ }

  const cmsParams = cmsPosts.map((p: any) => ({ slug: p.slug }));
  const staticParams = staticAllPosts.map((p) => ({ slug: p.slug }));

  // Deduplicate
  const seen = new Set<string>();
  return [...cmsParams, ...staticParams].filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  let post: any = null;
  try {
    post = await getPostBySlug(slug);
  } catch { /* CMS unavailable */ }

  if (!post) post = staticPostsMap[slug];
  if (!post) return { title: 'Post Not Found — Samuell Goldfinch' };

  const title = post.seo?.metaTitle || `${post.title} — Samuell Goldfinch Journal`;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const ogImage = post.seo?.ogImage?.url || post.coverImage?.url;

  return {
    title,
    description,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: any = null;
  try {
    post = await getPostBySlug(slug);
  } catch { /* CMS unavailable */ }

  if (!post) post = staticPostsMap[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-serif italic mb-4">Post Not Found</h1>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>This article doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  let relatedPosts: any[] = [];
  try {
    relatedPosts = await getRelatedPosts(post.category, slug);
  } catch { /* CMS unavailable */ }

  if (relatedPosts.length === 0) {
    relatedPosts = staticAllPosts
      .filter((p) => p.category === post.category && p.slug !== slug)
      .slice(0, 3);
  }

  return <JournalPostDetail post={post} relatedPosts={relatedPosts} />;
}
