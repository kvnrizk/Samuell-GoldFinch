/**
 * CMS Seed Script — Full Platform
 * Run: npx ts-node --skip-project scripts/seed.ts
 *
 * Seeds Payload CMS with initial content for ALL collections and globals:
 * - Artists (5 DJs)
 * - BlazeProjects (4 portfolio projects)
 * - KolasiEvents (3 events)
 * - Venue Packages (3 tiers)
 * - Venue FAQ (5 items)
 * - Case Studies (3 venues)
 * - Milestones (5 career milestones)
 * - Testimonials (8 client quotes)
 * - Posts / Journal (5 articles)
 * - PricingFactors (8 factors)
 * - Pages SEO (8 pages)
 * - VenueSEOPages (3 landing pages)
 * - Global Settings (Calendly + WhatsApp)
 * - PressKit global
 * - Showreel global
 */

import 'dotenv/config';

const PAYLOAD_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
const API = `${PAYLOAD_URL}/api`;

let token = '';

// ─── Helpers ───────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@samuellgoldfinch.com',
      password: process.env.PAYLOAD_ADMIN_PASSWORD || (() => { throw new Error('PAYLOAD_ADMIN_PASSWORD env var is required for seeding'); })(),
    }),
  });
  const data = await res.json();
  if (!data.token) {
    console.error('Login failed:', data);
    process.exit(1);
  }
  token = data.token;
  console.log('Logged in successfully');
}

async function create(collection: string, data: any) {
  const res = await fetch(`${API}/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.errors) {
    console.error(`Error creating ${collection}:`, result.errors);
    return null;
  }
  const label = result.doc?.name || result.doc?.venueName || result.doc?.title || result.doc?.clientName || result.doc?.factorName || result.doc?.question || result.doc?.slug || result.doc?.id;
  console.log(`  Created ${collection}: ${label}`);
  return result.doc;
}

async function updateGlobal(slug: string, data: any) {
  const res = await fetch(`${API}/globals/${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  console.log(`  Updated global: ${slug}`);
  return result;
}

// Helper to build Lexical richText from plain paragraphs
function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  };
}

// ─── Artists ───────────────────────────────────────────────────────────

const artistIds: Record<string, string> = {};

async function seedArtists() {
  console.log('\n--- Seeding Artists ---');

  const artists = [
    {
      name: 'Kate Zubok',
      slug: 'kate-zubok',
      bio: 'A Parisian DJ known for her eclectic blend of deep house, melodic techno, and ethnic grooves. Kate has headlined events across France, Lebanon, and the UAE, bringing a hypnotic energy to every set.',
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
    {
      name: 'DJ Marco',
      slug: 'dj-marco',
      bio: "Resident DJ at some of Beirut's most iconic rooftops. Marco's sets blend Afro house, organic house, and progressive elements, creating uplifting journeys that keep dance floors alive until sunrise.",
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
    {
      name: 'Naya Sound',
      slug: 'naya-sound',
      bio: 'Blending live vocals with electronic production, Naya Sound delivers a hybrid live act that fuses Arabic melodies with modern club sounds. Featured at festivals across Europe and the MENA region.',
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
    {
      name: 'Samir K',
      slug: 'samir-k',
      bio: 'International headliner specializing in high-energy techno and industrial sounds. Samir K has performed at leading European clubs and festivals, known for intense peak-time sets.',
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
    {
      name: 'Lina M',
      slug: 'lina-m',
      bio: 'A rising star in the melodic house scene, Lina M combines delicate synth work with driving rhythms. Her sets at Kolasi events have earned her a devoted following in the French Riviera scene.',
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
  ];

  for (const artist of artists) {
    const doc = await create('artists', artist);
    if (doc) artistIds[artist.slug] = doc.id;
  }
}

// ─── Blaze Projects ───────────────────────────────────────────────────

async function seedBlazeProjects() {
  console.log('\n--- Seeding Blaze Projects ---');

  const projects = [
    {
      title: 'Stouh Beirut Rooftop',
      slug: 'stouh-beirut',
      category: 'event',
      client: 'Stouh Beirut',
      location: 'Paris, France',
      date: '2025-06-15',
      featured: true,
      comingSoon: false,
      heroVideo: { muxPlaybackId: '', posterUrl: '/assets/blaze/stouh_beirut/2E2A1724.jpg' },
      description: richText(
        'Golden-hour diplomacy on the Parisian skyline. A rooftop celebration blending Lebanese hospitality with Parisian elegance, captured with cinematic precision across every moment of the evening.',
        'From the intimate conversations to the grand gestures, every frame tells the story of a night where two cultures met above the city of light.',
      ),
      seo: { metaTitle: 'Stouh Beirut Rooftop — Blaze Production', metaDescription: 'Rooftop event film for Stouh Beirut in Paris. Cinematic coverage of a Lebanese cultural celebration on the Parisian skyline.' },
    },
    {
      title: 'Embassy of Lebanon',
      slug: 'embassy-of-lebanon',
      category: 'diplomatic',
      client: 'Embassy of Lebanon',
      location: 'Paris, France',
      date: '2025-04-20',
      featured: true,
      comingSoon: false,
      heroVideo: { muxPlaybackId: '', posterUrl: '/assets/blaze/ambassy/0C5A9134.jpg' },
      description: richText(
        'Diplomatic ceremonies captured with cinematic restraint. An exclusive evening at the Embassy of Lebanon in Paris, where tradition meets contemporary elegance.',
        'Every detail was preserved with discretion and artistry — from the grand reception halls to the candid moments of cultural exchange between distinguished guests.',
      ),
      seo: { metaTitle: 'Embassy of Lebanon — Blaze Production', metaDescription: 'Diplomatic event film at the Embassy of Lebanon in Paris. Discreet cinematic documentation of cultural exchange.' },
    },
    {
      title: 'Weddings',
      slug: 'weddings',
      category: 'wedding',
      client: 'Private Clients',
      location: 'Paris & International',
      date: '2025-09-10',
      featured: true,
      comingSoon: false,
      heroVideo: { muxPlaybackId: 'ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A', posterUrl: '/assets/blaze/weddings/DSCF2395.jpg' },
      description: richText(
        "Stories of connection and timeless elegance. Each wedding film is a deeply personal work — a cinematic love letter crafted from the real emotions, stolen glances, and unscripted moments of your day.",
        "From intimate elopements in the French countryside to grand celebrations in Beirut, we bring a director's eye and an editor's precision to the most important day of your life.",
      ),
      seo: { metaTitle: 'Wedding Films — Blaze Production', metaDescription: 'Cinematic wedding films by Blaze Production. Intimate elopements to grand celebrations across Paris, Beirut, and beyond.' },
    },
    {
      title: 'Editorial & Brand',
      slug: 'editorial-brand',
      category: 'editorial',
      client: 'Various Brands',
      location: 'Paris & International',
      date: '2025-11-01',
      featured: true,
      comingSoon: false,
      heroVideo: { muxPlaybackId: 'QhSdi3vQs0193ZnrH8K00mhoz4ImI5G01kPTOcCgMeqnKA', posterUrl: '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG' },
      description: richText(
        'The language of identity told through crafted imagery. Brand films, lookbooks, and editorial content that capture the essence of who you are and what you stand for.',
        'Working with brands from fashion to hospitality, we translate vision into visual narratives that resonate with audiences and elevate your presence across every platform.',
      ),
      seo: { metaTitle: 'Editorial & Brand Films — Blaze Production', metaDescription: 'Brand films, lookbooks, and editorial content by Blaze Production. Visual storytelling for fashion, hospitality, and luxury brands.' },
    },
  ];

  for (const project of projects) {
    await create('blaze-projects', project);
  }
}

// ─── Kolasi Events ────────────────────────────────────────────────────

async function seedKolasiEvents() {
  console.log('\n--- Seeding Kolasi Events ---');

  const events = [
    {
      title: 'Le Speakeasy',
      slug: 'le-speakeasy',
      eventType: 'club',
      venue: 'Le Speakeasy, Paris',
      date: '2025-10-18',
      status: 'past',
      doorsTime: '22:00',
      endTime: '04:00',
      ticketPrice: '15€ / 20€ at door',
      featured: true,
      artists: [artistIds['kate-zubok'], artistIds['naya-sound']].filter(Boolean),
      videos: [
        { title: 'Le Speakeasy Aftermovie', muxPlaybackId: 'RPuL7pFySoUTqNAjG601srkT1Nhqmcyhkug5uhGpz8PA' },
      ],
      description: richText(
        "An intimate underground night at one of Paris's most iconic hidden bars. Le Speakeasy by Kolasi brought together a curated lineup of deep house and melodic techno DJs for a one-of-a-kind experience.",
        'The night featured bespoke cocktails, immersive lighting design, and a sound system tuned to perfection. Every detail was crafted to transport guests into a world where music, art, and nightlife converge.',
      ),
    },
    {
      title: '2nd Sun',
      slug: '2nd-sun',
      eventType: 'rooftop',
      venue: 'Rooftop Venue, Paris',
      date: '2025-07-12',
      status: 'past',
      doorsTime: '16:00',
      endTime: '02:00',
      ticketPrice: '20€',
      featured: true,
      artists: [artistIds['dj-marco'], artistIds['naya-sound']].filter(Boolean),
      videos: [
        { title: '2nd Sun Highlight', muxPlaybackId: 'RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo' },
      ],
      description: richText(
        'A sun-drenched afternoon-to-night rooftop session overlooking the Parisian skyline. 2nd Sun merged deep grooves with golden-hour energy, featuring a rotating cast of resident and guest DJs.',
        'From sunset cocktails to late-night dancing under the stars, this open-air event redefined what a Parisian summer gathering could feel like.',
      ),
    },
    {
      title: 'Kolasi Nights',
      slug: 'kolasi-nights',
      eventType: 'club',
      venue: 'Various Venues, Paris',
      date: '2026-03-15',
      status: 'upcoming',
      doorsTime: '23:00',
      endTime: '06:00',
      ticketPrice: '20€ presale / 25€ at door',
      ticketUrl: 'https://shotgun.live/kolasi-nights',
      featured: true,
      artists: [artistIds['samir-k'], artistIds['kate-zubok'], artistIds['lina-m']].filter(Boolean),
      videos: [
        { title: 'Kolasi Nights Teaser', muxPlaybackId: 'uar02cwjF78qfyUUvSQIMcnQyHVImiF6sJP3Izh7D01JU' },
      ],
      description: richText(
        'The flagship Kolasi club night series. A rotating concept that transforms a different venue each edition — from underground bunkers to art galleries — into a Kolasi universe of sound and light.',
        'Each edition features international headliners alongside Kolasi residents, custom visual installations, and a community of music lovers who come for the experience as much as the lineup.',
      ),
    },
  ];

  for (const event of events) {
    await create('kolasi-events', event);
  }
}

// ─── Venue Packages ───────────────────────────────────────────────────

async function seedVenuePackages() {
  console.log('\n--- Seeding Venue Packages ---');

  await create('venue-packages', {
    name: 'Starter Night',
    tier: 'starter',
    tagline: 'Test the waters with a curated weekly session',
    whoItsFor: 'Bars and restaurants looking to add a first DJ night without long-term commitment.',
    deliverables: [
      { item: '1 DJ night per week' },
      { item: 'Artist booking & scheduling' },
      { item: 'Monthly content recap (5 photos + 1 reel)' },
      { item: 'WhatsApp support line' },
    ],
    priceRange: 'From €1,500/mo',
    featured: false,
    sortOrder: 1,
  });

  await create('venue-packages', {
    name: 'Core Identity',
    tier: 'core',
    tagline: 'Build a weekly identity that attracts a loyal crowd',
    whoItsFor: 'Venues ready to establish a signature nightlife brand with consistent programming.',
    deliverables: [
      { item: '2–3 nights per week' },
      { item: 'Full booking + sound rider management' },
      { item: 'Social content per session (photos + video)' },
      { item: 'Monthly strategy call' },
      { item: 'Dedicated WhatsApp channel' },
      { item: 'Priority access to headliner roster' },
    ],
    priceRange: 'From €3,500/mo',
    featured: true,
    sortOrder: 2,
  });

  await create('venue-packages', {
    name: 'Flagship',
    tier: 'flagship',
    tagline: "Full creative direction for your venue's nightlife brand",
    whoItsFor: 'Premium venues and clubs seeking a fully managed nightlife identity with content and strategy.',
    deliverables: [
      { item: '4+ nights per week' },
      { item: 'International headliner bookings' },
      { item: 'Professional video + photo per session' },
      { item: 'Brand strategy & visual identity design' },
      { item: 'Weekly reporting dashboard' },
      { item: 'Priority artist access across all tiers' },
      { item: 'PR & influencer outreach' },
    ],
    priceRange: 'From €7,500/mo',
    featured: false,
    sortOrder: 3,
  });
}

// ─── Venue FAQ ────────────────────────────────────────────────────────

async function seedVenueFAQ() {
  console.log('\n--- Seeding Venue FAQ ---');

  const faqs = [
    { question: 'What genres do you programme?', answer: "We cover the full spectrum — from deep house and afro beats to disco, funk, Latin, and live jazz. Every programme is tailored to your venue's atmosphere and clientele.", sortOrder: 1 },
    { question: 'Do you work outside Paris?', answer: 'Yes. We have active partnerships across France and regularly work in London, Dubai, and Ibiza. Travel fees may apply for remote locations.', sortOrder: 2 },
    { question: 'How fast can you launch?', answer: 'After the discovery call, we typically deliver a programming plan within 5 business days. First night can happen 2–3 weeks after sign-off.', sortOrder: 3 },
    { question: 'What if we already have DJs booked?', answer: 'No problem. We can work alongside your existing roster, upgrade the quality, or gradually transition to our curated programming.', sortOrder: 4 },
    { question: "What's included in content production?", answer: 'Depending on your tier: professional photo/video at each session, social-ready edits, story highlights, and a monthly performance report.', sortOrder: 5 },
  ];

  for (const faq of faqs) {
    await create('venue-faq', faq);
  }
}

// ─── Case Studies ─────────────────────────────────────────────────────

async function seedCaseStudies() {
  console.log('\n--- Seeding Case Studies ---');

  await create('case-studies', {
    venueName: 'Le Speakeasy',
    slug: 'le-speakeasy',
    role: 'Booking / DA / Content',
    frequency: '3 nights/week',
    deliverables: 'Full DJ programming for 3 weekly nights including Thursday Jazz Night, Friday Deep House, and Saturday Dance. Monthly content package with professional photography and 4 Instagram reels per month.',
    outcome: '+45% reservation rate in 3 months',
    featured: true,
    sortOrder: 1,
  });

  await create('case-studies', {
    venueName: 'Calypso Club',
    slug: 'calypso-club',
    role: 'Full Programming',
    frequency: 'Every Saturday',
    deliverables: 'Complete Saturday night curation — from warm-up to closing. Artist booking with international headliners rotating monthly. Full social media content strategy with weekly posts.',
    outcome: 'Sold out 12 weeks in a row',
    featured: true,
    sortOrder: 2,
  });

  await create('case-studies', {
    venueName: 'Hotel Costes Bar',
    slug: 'hotel-costes',
    role: 'Curation / Content',
    frequency: '2 nights/week',
    deliverables: 'Ambient-to-upbeat programming for the hotel bar. Curated playlist during dinner service transitioning to live DJ after 10pm. Monthly video content for hotel social channels.',
    outcome: '2x social engagement in 60 days',
    featured: true,
    sortOrder: 3,
  });
}

// ─── Milestones ───────────────────────────────────────────────────────

async function seedMilestones() {
  console.log('\n--- Seeding Milestones ---');

  const items = [
    { title: 'About Samuell Goldfinch', description: 'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency. Over 50 productions across 12 cities and a roster of 50+ international DJs.', sortOrder: 1 },
    { title: 'About Kolasi', description: 'Creative booking and talent agency based in Paris. We craft visual and audio identities through artistic direction, DJ bookings, live shows, and PR strategy across 20+ venues.', sortOrder: 2 },
    { title: 'About Blaze Production', description: 'Full-service creative studio specialising in cinematic wedding films, editorial content, and branded storytelling. Trusted by MIPIM Cannes, Brunch Festival, and France Tourisme.', sortOrder: 3 },
    { title: '2023 – Venue Expansion', description: 'Launched weekly programming at Le Speakeasy Paris & Cannes, establishing Kolasi as the go-to agency for curated venue nightlife in Paris.', sortOrder: 4 },
    { title: '2024 – International Growth', description: 'Expanded to Dubai, Ibiza, and London with flagship venue partnerships. Introduced content production packages and social strategy services.', sortOrder: 5 },
  ];

  for (const item of items) {
    await create('milestones', item);
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────

async function seedTestimonials() {
  console.log('\n--- Seeding Testimonials ---');

  const testimonials = [
    {
      clientName: 'Sophie & Marc',
      role: 'Bride & Groom',
      brand: 'blaze',
      quote: "Samuell didn't just film our wedding — he told our story. Every time we rewatch the film, we feel the same emotions we felt that day. The cinematography was breathtaking.",
      rating: 5,
      featured: true,
      sortOrder: 1,
    },
    {
      clientName: 'Nadia El-Khoury',
      role: 'Cultural Attaché, Embassy of Lebanon',
      brand: 'blaze',
      quote: 'The discretion and professionalism of Blaze Production exceeded our expectations. They captured the essence of our diplomatic reception with elegance and respect for the occasion.',
      rating: 5,
      featured: true,
      sortOrder: 2,
    },
    {
      clientName: 'Thomas Beaumont',
      role: 'Owner, Le Speakeasy Paris',
      brand: 'venues',
      quote: "Since Kolasi took over our programming, reservations are up 45%. The crowd quality has completely transformed. They understand what makes a venue tick — it's not just about the DJ, it's the whole experience.",
      rating: 5,
      featured: true,
      sortOrder: 3,
    },
    {
      clientName: 'Léa Fontaine',
      role: 'Event Director, Calypso Club',
      brand: 'venues',
      quote: "12 sold-out Saturdays in a row speaks for itself. The Kolasi team's artist curation and marketing support made our venue the place to be in the 11th arrondissement.",
      rating: 5,
      featured: true,
      sortOrder: 4,
    },
    {
      clientName: 'Rami Haddad',
      role: 'CEO, Stouh Beirut',
      brand: 'kolasi',
      quote: 'Kolasi brought an energy to our rooftop launch that we could never have created on our own. From the DJ lineup to the visual direction — everything was perfectly curated.',
      rating: 5,
      featured: true,
      sortOrder: 5,
    },
    {
      clientName: 'Claire Dubois',
      role: 'Brand Director, MIPIM Cannes',
      brand: 'blaze',
      quote: 'Blaze delivered an aftermovie that perfectly captured the spirit of our event. Professional, creative, and incredibly efficient under tight deadlines.',
      rating: 5,
      featured: false,
      sortOrder: 6,
    },
    {
      clientName: 'Antoine Moreau',
      role: 'General Manager, Hotel Costes',
      brand: 'venues',
      quote: "The transition from background playlist to curated live DJ programming was seamless. Our guests love the new ambiance and our social media engagement doubled within two months.",
      rating: 5,
      featured: false,
      sortOrder: 7,
    },
    {
      clientName: 'Yasmine Khalil',
      role: 'Bride',
      brand: 'personal',
      quote: "I found Samuell through Instagram and instantly knew he was the one. His team made us feel completely at ease, and the final film was more beautiful than I could have imagined.",
      rating: 5,
      featured: true,
      sortOrder: 8,
    },
  ];

  for (const t of testimonials) {
    await create('testimonials', t);
  }
}

// ─── Posts / Journal ──────────────────────────────────────────────────

async function seedPosts() {
  console.log('\n--- Seeding Journal Posts ---');

  const posts = [
    {
      title: 'Behind the Scenes: Filming a Destination Wedding in Beirut',
      slug: 'behind-the-scenes-beirut-wedding',
      excerpt: 'A look inside the creative process of capturing a three-day celebration across Beirut — from scouting locations at dawn to the final color grade.',
      category: 'behind-the-scenes',
      publishedAt: '2025-12-15T10:00:00.000Z',
      featured: true,
      tags: [{ tag: 'Wedding' }, { tag: 'Beirut' }, { tag: 'Cinematic' }],
      content: richText(
        'Every destination wedding presents unique challenges. When we flew to Beirut for a three-day celebration, we knew we needed to adapt our approach to capture the rich cultural traditions alongside the modern luxury of the event.',
        'Day one began before sunrise. We scouted the ceremony location — a stunning hilltop chapel overlooking the Mediterranean — to plan our camera angles and lighting setups. The golden hour there is unlike anything in Paris.',
        'The key to cinematic wedding coverage is preparation. We mapped out every moment: the bride getting ready, the first look, the ceremony, and the reception. But we also left room for the unplanned — the tears, the laughter, the moments that make each wedding unique.',
        'In post-production, we spent three weeks on the color grade alone, matching the warm Lebanese light with a cinematic palette that felt both timeless and contemporary. The result is a film that transports you back to that hilltop every time you press play.',
      ),
      seo: { metaTitle: 'Behind the Scenes: Destination Wedding in Beirut', metaDescription: 'Inside the creative process of filming a luxury destination wedding in Beirut. Scouting, cinematography, and post-production insights.' },
    },
    {
      title: '5 Questions to Ask Your Wedding Videographer',
      slug: '5-questions-wedding-videographer',
      excerpt: 'Before you book, make sure you ask these essential questions to find a filmmaker whose style matches your vision.',
      category: 'tips',
      publishedAt: '2025-11-28T10:00:00.000Z',
      featured: false,
      tags: [{ tag: 'Tips' }, { tag: 'Wedding' }],
      content: richText(
        "Choosing a wedding videographer is one of the most important decisions you'll make for your big day. Here are five questions every couple should ask before signing a contract.",
        "1. What's your editing style? — Some filmmakers favour documentary-style coverage, while others lean into cinematic storytelling. Watch at least three full films to understand their aesthetic.",
        "2. How do you handle low-light situations? — Many wedding receptions happen in dimly lit venues. A skilled cinematographer should be comfortable shooting in challenging conditions without intrusive lighting.",
        "3. What equipment do you use? — This isn't about brand names. It's about understanding whether they use stabilizers, drones, multiple cameras, and professional audio recording.",
        "4. What's your delivery timeline? — A quality wedding film takes time. Expect 8–12 weeks for a cinematic edit. If someone promises a turnaround under 4 weeks, ask what they're sacrificing.",
        "5. Can we hear the audio quality? — The vows, the speeches, the laughter — these are the soul of your film. Ask to hear raw audio samples from previous weddings.",
      ),
      seo: { metaTitle: '5 Questions to Ask Your Wedding Videographer', metaDescription: 'Essential questions every couple should ask before booking a wedding videographer. Expert tips from Blaze Production.' },
    },
    {
      title: 'The Art of Nightlife Programming',
      slug: 'art-of-nightlife-programming',
      excerpt: 'How we curate lineups, build crowd loyalty, and create weekly identities for venues — the Kolasi methodology explained.',
      category: 'industry',
      publishedAt: '2025-11-10T10:00:00.000Z',
      featured: false,
      tags: [{ tag: 'Nightlife' }, { tag: 'Kolasi' }, { tag: 'Venues' }],
      content: richText(
        "Nightlife programming isn't about booking the biggest name or playing the most popular genre. It's about understanding your venue's DNA and building a consistent identity that attracts the right crowd.",
        "At Kolasi, we start every venue partnership with a deep-dive into the space itself. What's the capacity? What's the sound system capable of? What does the neighbourhood look like? Who are the existing regulars?",
        "From there, we design a weekly programme that creates anticipation. Monday might be a low-key jazz session. Thursday could be deep house with emerging local talent. Saturday is the headline night — the one people plan their week around.",
        "The secret ingredient is consistency. A venue that changes its programming every week will never build a loyal following. We commit to a concept for at least 8 weeks before evaluating and adjusting.",
        "Content is the other half of the equation. Every night gets documented: professional photos, short-form video clips, and story content. This creates FOMO for those who weren't there and pride for those who were.",
      ),
      seo: { metaTitle: 'The Art of Nightlife Programming — Kolasi Agency', metaDescription: 'How Kolasi Agency curates lineups, builds crowd loyalty, and creates weekly identities for venues. The nightlife programming methodology explained.' },
    },
    {
      title: "Kolasi Season 3: What's Coming",
      slug: 'kolasi-season-3',
      excerpt: "New residencies, international headliners, and a brand new rooftop series — here's everything we have planned for the season ahead.",
      category: 'news',
      publishedAt: '2025-10-20T10:00:00.000Z',
      featured: false,
      tags: [{ tag: 'News' }, { tag: 'Kolasi' }],
      content: richText(
        "We're excited to announce Kolasi Season 3 — our most ambitious season yet. New cities, new venues, and a roster of international headliners that will redefine what's possible in the Paris nightlife scene.",
        "Highlights include a new monthly rooftop series launching in May, an expanded residency at Le Speakeasy with dedicated themed nights, and our first Dubai event in partnership with a major beachfront venue.",
        "The artist roster is growing too. We're welcoming five new international DJs to the Kolasi family, spanning genres from minimal techno to Afro-Latin house.",
        "Stay tuned for lineup announcements, ticket drops, and behind-the-scenes content throughout the season. Follow us on Instagram for first access.",
      ),
      seo: { metaTitle: "Kolasi Season 3: What's Coming", metaDescription: "New residencies, international headliners, and rooftop series. Everything coming in Kolasi Agency's most ambitious season yet." },
    },
    {
      title: 'How We Shot the Embassy of Lebanon Reception',
      slug: 'embassy-of-lebanon-bts',
      excerpt: "Diplomatic events require a unique approach — discretion, elegance, and zero room for error. Here's how we handled it.",
      category: 'client-stories',
      publishedAt: '2025-09-05T10:00:00.000Z',
      featured: false,
      tags: [{ tag: 'Embassy' }, { tag: 'Diplomatic' }, { tag: 'Client Story' }],
      content: richText(
        "When we received the brief for the Embassy of Lebanon's reception in Paris, we knew this would be unlike any other project. Diplomatic events operate under strict protocol — every camera angle, every movement has to be planned and approved in advance.",
        "We worked closely with the embassy's cultural attaché to understand the hierarchy of the event, the key moments to capture, and the boundaries we needed to respect.",
        "On the night itself, we operated with a minimal footprint: two camera operators, no flash photography, and silent shutter mode throughout. The goal was to be invisible while capturing everything.",
        "The final film was delivered in three formats: a 90-second social cut, a 5-minute highlight reel, and a full 20-minute documentary version for the embassy's archives.",
      ),
      seo: { metaTitle: 'How We Shot the Embassy of Lebanon Reception', metaDescription: 'Behind the scenes of filming a diplomatic reception at the Embassy of Lebanon in Paris. Discretion, elegance, and cinematic precision.' },
    },
  ];

  for (const post of posts) {
    await create('posts', post);
  }
}

// ─── Pricing Factors ──────────────────────────────────────────────────

async function seedPricingFactors() {
  console.log('\n--- Seeding Pricing Factors ---');

  const factors = [
    // Wedding Film
    {
      service: 'wedding-film',
      factorName: 'Hours of Coverage',
      factorType: 'slider',
      basePrice: 500,
      sliderMin: 4,
      sliderMax: 16,
      sliderStep: 2,
      unit: 'hours',
      sortOrder: 1,
      options: [],
    },
    {
      service: 'wedding-film',
      factorName: 'Number of Cameras',
      factorType: 'select',
      basePrice: 0,
      sortOrder: 2,
      options: [
        { label: '1 Camera', value: '1', multiplier: 1 },
        { label: '2 Cameras', value: '2', multiplier: 1.6 },
        { label: '3 Cameras', value: '3', multiplier: 2.2 },
      ],
    },
    {
      service: 'wedding-film',
      factorName: 'Drone Footage',
      factorType: 'toggle',
      basePrice: 800,
      sortOrder: 3,
      options: [
        { label: 'No', value: 'no', multiplier: 0 },
        { label: 'Yes', value: 'yes', multiplier: 1 },
      ],
    },
    // Editorial / Commercial
    {
      service: 'editorial-commercial',
      factorName: 'Shoot Days',
      factorType: 'slider',
      basePrice: 2000,
      sliderMin: 1,
      sliderMax: 5,
      sliderStep: 1,
      unit: 'days',
      sortOrder: 1,
      options: [],
    },
    {
      service: 'editorial-commercial',
      factorName: 'Deliverables',
      factorType: 'select',
      basePrice: 0,
      sortOrder: 2,
      options: [
        { label: 'Photos Only', value: 'photos', multiplier: 1 },
        { label: 'Video Only', value: 'video', multiplier: 1.5 },
        { label: 'Photos + Video', value: 'both', multiplier: 2 },
      ],
    },
    // DJ Performance
    {
      service: 'dj-performance',
      factorName: 'Set Duration',
      factorType: 'slider',
      basePrice: 300,
      sliderMin: 2,
      sliderMax: 8,
      sliderStep: 1,
      unit: 'hours',
      sortOrder: 1,
      options: [],
    },
    {
      service: 'dj-performance',
      factorName: 'DJ Tier',
      factorType: 'select',
      basePrice: 0,
      sortOrder: 2,
      options: [
        { label: 'Resident DJ', value: 'resident', multiplier: 1 },
        { label: 'Headliner', value: 'headliner', multiplier: 2.5 },
        { label: 'International Headliner', value: 'international', multiplier: 4 },
      ],
    },
    // Event Production
    {
      service: 'event-production',
      factorName: 'Event Scale',
      factorType: 'select',
      basePrice: 3000,
      sortOrder: 1,
      options: [
        { label: 'Intimate (up to 100)', value: 'intimate', multiplier: 1 },
        { label: 'Medium (100–300)', value: 'medium', multiplier: 2 },
        { label: 'Large (300–1000)', value: 'large', multiplier: 3.5 },
        { label: 'Festival (1000+)', value: 'festival', multiplier: 5 },
      ],
    },
  ];

  for (const factor of factors) {
    await create('pricing-factors', factor);
  }
}

// ─── Pages SEO ────────────────────────────────────────────────────────

async function seedPages() {
  console.log('\n--- Seeding Pages SEO ---');

  const pages = [
    { title: 'Home', slug: 'home', seoTitle: 'Samuell Goldfinch — Creative Director, Filmmaker & DJ | Paris', seoDescription: 'Paris-based creative director, cinematic filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency. 50+ productions across 12 cities.' },
    { title: 'Blaze Production', slug: 'blaze', seoTitle: 'Blaze Production — Cinematic Films & Visual Storytelling', seoDescription: 'Cinematic wedding films, editorial content, and branded storytelling by Blaze Production. Based in Paris, working internationally.' },
    { title: 'Kolasi Agency', slug: 'kolasi', seoTitle: 'Kolasi — Creative Booking & Talent Agency | Paris Nightlife', seoDescription: 'DJ bookings, event curation, and nightlife programming by Kolasi Agency. 50+ international DJs, 20+ venue partnerships.' },
    { title: 'For Venues', slug: 'venues', seoTitle: 'Venue Programming & DJ Booking Packages | Samuell Goldfinch', seoDescription: 'Transform your venue with curated DJ programming, content production, and nightlife strategy. Packages from €1,500/mo.' },
    { title: 'About', slug: 'about', seoTitle: 'About Samuell Goldfinch — Creative Director & Founder', seoDescription: 'Meet Samuell Goldfinch — Paris-based creative director behind Blaze Production and Kolasi Agency. Bridging cinema, music, and nightlife.' },
    { title: 'Contact', slug: 'contact', seoTitle: 'Contact Samuell Goldfinch — Paris', seoDescription: 'Get in touch with Samuell Goldfinch for film production, DJ bookings, event curation, or venue programming inquiries.' },
    { title: 'Quote', slug: 'quote', seoTitle: 'Request a Quote — Samuell Goldfinch', seoDescription: 'Get a personalised quote for wedding films, editorial content, DJ performances, or event production. Response within 24 hours.' },
    { title: 'Showreel', slug: 'showreel', seoTitle: 'Showreel — Samuell Goldfinch | Blaze Production', seoDescription: 'Watch the latest showreel from Blaze Production. Cinematic highlights from weddings, events, editorials, and brand campaigns.' },
  ];

  for (const page of pages) {
    await create('pages', page);
  }
}

// ─── Venue SEO Pages ──────────────────────────────────────────────────

async function seedVenueSEOPages() {
  console.log('\n--- Seeding Venue SEO Pages ---');

  const seoPages = [
    {
      title: 'DJ Booking Paris — Professional DJ Programming for Venues',
      slug: 'dj-booking-paris',
      targetKeyword: 'DJ booking Paris',
      seoTitle: 'DJ Booking Paris — Professional Venue Programming | Kolasi Agency',
      seoDescription: 'Looking for professional DJ booking in Paris? Kolasi Agency provides curated DJ programming, nightlife strategy, and content production for bars, clubs, and restaurants.',
      heroSubtitle: 'Curated DJ programming that transforms your venue into the place to be.',
      ctaHeading: 'Ready to elevate your venue?',
      ctaDescription: 'Book a free discovery call and get a personalised DJ programming plan within 5 business days.',
      sortOrder: 1,
    },
    {
      title: 'Nightlife Programming Agency — Venue Strategy & Booking',
      slug: 'nightlife-programming-agency',
      targetKeyword: 'nightlife programming agency',
      seoTitle: 'Nightlife Programming Agency Paris — Kolasi by Samuell Goldfinch',
      seoDescription: 'Full-service nightlife programming agency in Paris. Kolasi Agency delivers DJ bookings, event curation, content strategy, and venue branding across France and Europe.',
      heroSubtitle: 'From concept to execution — we build nightlife identities that last.',
      ctaHeading: 'Build your venue identity',
      ctaDescription: 'Discover how our programming methodology has increased reservations by up to 45% for our partner venues.',
      sortOrder: 2,
    },
    {
      title: 'Wedding DJ Paris — Luxury Wedding Entertainment',
      slug: 'wedding-dj-paris',
      targetKeyword: 'wedding DJ Paris',
      seoTitle: 'Wedding DJ Paris — Luxury Wedding Entertainment | Samuell Goldfinch',
      seoDescription: 'Premium wedding DJ services in Paris and internationally. Curated playlists, seamless transitions, and bespoke entertainment tailored to your celebration.',
      heroSubtitle: 'Bespoke musical direction for the most important day of your life.',
      ctaHeading: 'Create your perfect wedding soundtrack',
      ctaDescription: 'Let us craft a musical experience as unique as your love story. Book a consultation today.',
      sortOrder: 3,
    },
    // ── French-market SEO landing pages ──
    {
      title: 'Programmation Musicale Bar Paris — DJ Résident & Soirées',
      slug: 'programmation-musicale-bar-paris',
      targetKeyword: 'programmation musicale bar paris',
      seoTitle: 'Programmation Musicale Bar Paris — DJ Résident & Ambiance | Kolasi',
      seoDescription: 'Programmation musicale sur mesure pour bars parisiens. DJ résidents, sélection musicale, et stratégie d\'ambiance pour transformer votre bar en destination incontournable.',
      heroSubtitle: 'Une identité sonore unique qui fidélise votre clientèle et augmente vos réservations.',
      ctaHeading: 'Prêt à transformer l\'ambiance de votre bar ?',
      ctaDescription: 'Réservez un appel découverte gratuit et recevez une proposition de programmation musicale personnalisée sous 5 jours.',
      sortOrder: 4,
    },
    {
      title: 'Agence DJ Booking Paris — Réservation DJ Professionnels',
      slug: 'agence-dj-booking-paris',
      targetKeyword: 'DJ booking agence paris',
      seoTitle: 'Agence DJ Booking Paris — Réservation DJ Professionnels | Kolasi',
      seoDescription: 'Agence de booking DJ à Paris. Kolasi Agency met à disposition un roster de 50+ DJs internationaux pour bars, clubs, restaurants et événements privés.',
      heroSubtitle: 'Un roster de DJs internationaux, une direction artistique exigeante.',
      ctaHeading: 'Trouvez le DJ parfait pour votre établissement',
      ctaDescription: 'Notre équipe vous accompagne dans le choix et la programmation de DJs adaptés à l\'identité de votre lieu.',
      sortOrder: 5,
    },
    {
      title: 'Animation Soirée Restaurant Paris — Musique & Ambiance',
      slug: 'animation-soiree-restaurant-paris',
      targetKeyword: 'animation soirée restaurant paris',
      seoTitle: 'Animation Soirée Restaurant Paris — DJ & Ambiance | Kolasi Agency',
      seoDescription: 'Animation musicale pour restaurants parisiens. Soirées DJ, ambiance lounge, et programmation festive pour brasseries, rooftops et restaurants branchés.',
      heroSubtitle: 'De la musique d\'ambiance au set DJ — une expérience culinaire devenue événement.',
      ctaHeading: 'Créez des soirées mémorables dans votre restaurant',
      ctaDescription: 'Découvrez comment nos partenaires restaurants ont augmenté leur fréquentation de 35% grâce à la programmation musicale.',
      sortOrder: 6,
    },
    {
      title: 'Programmation Musicale Club — Direction Artistique & Booking',
      slug: 'programmation-musicale-club',
      targetKeyword: 'programmation musicale club',
      seoTitle: 'Programmation Musicale Club — Direction Artistique | Kolasi Agency',
      seoDescription: 'Direction artistique et programmation musicale pour clubs. Line-ups, soirées thématiques, et stratégie de marque nightlife par Kolasi Agency, Paris.',
      heroSubtitle: 'Des line-ups qui créent l\'événement et une identité de marque qui perdure.',
      ctaHeading: 'Donnez une identité forte à votre club',
      ctaDescription: 'Nous construisons des programmations cohérentes qui attirent le bon public et renforcent votre positionnement.',
      sortOrder: 7,
    },
    {
      title: 'Agence Événementiel Paris Nuit — Curation & Production',
      slug: 'agence-evenementiel-paris-nuit',
      targetKeyword: 'agence événementiel paris nuit',
      seoTitle: 'Agence Événementiel Paris Nuit — Curation & Production | Kolasi',
      seoDescription: 'Agence événementielle spécialisée dans la nuit parisienne. Curation musicale, production d\'événements, contenu visuel et stratégie de marque pour lieux nocturnes.',
      heroSubtitle: 'De la conception à l\'exécution — nous créons des expériences nocturnes inoubliables.',
      ctaHeading: 'Lancez votre prochain concept de soirée',
      ctaDescription: 'Kolasi Agency conçoit et produit des événements clé en main : booking, direction artistique, contenu et communication.',
      sortOrder: 8,
    },
  ];

  for (const page of seoPages) {
    await create('venue-seo-pages', page);
  }
}

// ─── Global Settings ──────────────────────────────────────────────────

async function seedGlobalSettings() {
  console.log('\n--- Updating Global Settings ---');

  await updateGlobal('global-settings', {
    calendlyUrl: 'https://calendly.com/samuellgoldfinch/venue-discovery',
    whatsappNumber: '+33605883966',
  });
}

// ─── Press Kit Global ─────────────────────────────────────────────────

async function seedPressKit() {
  console.log('\n--- Updating Press Kit ---');

  await updateGlobal('press-kit', {
    shortBio: 'Samuell Goldfinch is a Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
    mediumBio: 'Samuell Goldfinch is a Paris-based creative director who bridges the worlds of cinema, music, and nightlife. As founder of Blaze Production, he creates cinematic wedding films and editorial content for luxury brands. Through Kolasi Agency, he curates DJ programming and nightlife experiences across 20+ venues in Paris, Dubai, Ibiza, and London. With over 50 productions across 12 cities and a roster of 50+ international DJs, Samuell has established himself as a leading force in European creative nightlife.',
    pressContact: {
      name: 'Samuell Goldfinch',
      email: 'press@samuellgoldfinch.com',
      phone: '+33605883966',
    },
    mediaAppearances: [
      { title: 'The New Wave of Parisian Nightlife', publication: 'TimeOut Paris', date: '2025-03-15', type: 'feature' },
      { title: 'Behind the Lens: Wedding Cinema in France', publication: 'Vogue France', date: '2025-06-20', type: 'interview' },
      { title: 'MIPIM Cannes 2025 Official Aftermovie', publication: 'MIPIM Official', date: '2025-03-10', type: 'video' },
    ],
  });
}

// ─── Showreel Global ──────────────────────────────────────────────────

async function seedShowreel() {
  console.log('\n--- Updating Showreel ---');

  await updateGlobal('showreel', {
    heroReel: {
      muxPlaybackId: 'ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A',
      posterUrl: '/assets/blaze/weddings/DSCF2395.jpg',
      title: 'Showreel 2025',
    },
    highlights: [
      { title: 'Weddings Demoreel', muxPlaybackId: 'ABVHVsPKRIgCyqWD7JOSHSxvR00HVt800oBerw5sQDk00A', posterUrl: '/assets/blaze/weddings/DSCF2395.jpg', category: 'wedding' },
      { title: 'Art Direction', muxPlaybackId: 'QhSdi3vQs0193ZnrH8K00mhoz4ImI5G01kPTOcCgMeqnKA', posterUrl: '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG', category: 'editorial' },
      { title: 'Transdev Aftermovie', muxPlaybackId: 'SvrdUWLKn5e7B6AVE4hblhCTjZsg9g01KI7iCykNLY00Y', posterUrl: '/assets/blaze/weddings/DSCF2395.jpg', category: 'brand' },
      { title: 'Kate Zubok at Le Speakeasy', muxPlaybackId: 'bzlHPIIz3L68lqg6fmMTH02GsYL1AeZnT6ewRQIlokaE', posterUrl: '/assets/kolasi/artists/artist-1.jpg', category: 'music' },
      { title: 'Chateau de Chantilly', muxPlaybackId: '2aAgNa5S5s32fQG8XBUHXrwPUBbEQxn4oyKAjJSV801k', posterUrl: '/assets/kolasi/images/4F8A3195.jpg', category: 'event' },
      { title: '2nd Sun Rooftop', muxPlaybackId: 'RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo', posterUrl: '/assets/kolasi/images/4F8A3750.jpg', category: 'event' },
      { title: 'Hangar Solomun', muxPlaybackId: 'uar02cwjF78qfyUUvSQIMcnQyHVImiF6sJP3Izh7D01JU', posterUrl: '/assets/kolasi/images/4F8A3195.jpg', category: 'music' },
      { title: 'Chantilly Festival', muxPlaybackId: 'CMkL278xE2sFZ32NOKulVt8xjv3PgsNDaX7AdOnHIAU', posterUrl: '/assets/kolasi/images/4F8A3777.jpg', category: 'event' },
    ],
  });
}

// ─── Main Runner ──────────────────────────────────────────────────────

async function main() {
  console.log('=== SG Platform CMS Seed (Full) ===');
  console.log(`Target: ${PAYLOAD_URL}\n`);

  await login();

  // Seed artists first (other collections reference them)
  await seedArtists();
  await seedBlazeProjects();
  await seedKolasiEvents();
  await seedVenuePackages();
  await seedVenueFAQ();
  await seedCaseStudies();
  await seedMilestones();
  await seedTestimonials();
  await seedPosts();
  await seedPricingFactors();
  await seedPages();
  await seedVenueSEOPages();

  // Globals
  await seedGlobalSettings();
  await seedPressKit();
  await seedShowreel();

  console.log('\n=== Full seed complete! ===');
  console.log('Collections seeded: 12');
  console.log('Globals updated: 3');
}

main().catch(console.error);
