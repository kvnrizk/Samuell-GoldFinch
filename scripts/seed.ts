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

// Collections the seed writes to. If any already has records, we abort to
// prevent accidental duplicate rows from a double-run.
const TARGET_COLLECTIONS = [
  'artists',
  'blaze-projects',
  'kolasi-events',
  'venue-packages',
  'venue-faq',
  'case-studies',
  'milestones',
  'venue-seo-pages',
];

async function assertAllTargetsEmpty() {
  console.log('\n--- Checking target collections are empty ---');
  const nonEmpty: Array<{ slug: string; count: number }> = [];
  for (const slug of TARGET_COLLECTIONS) {
    const res = await fetch(`${API}/${slug}?limit=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const data = await res.json();
    const count = Number(data?.totalDocs ?? 0);
    console.log(`  ${slug}: ${count} docs`);
    if (count > 0) nonEmpty.push({ slug, count });
  }
  if (nonEmpty.length > 0) {
    console.error('\nAborting — the following collections already have records:');
    for (const n of nonEmpty) console.error(`  - ${n.slug}: ${n.count}`);
    console.error('\nRe-running the seed would create duplicates. Either clear those collections via /admin and retry, or pass --force to override this check.');
    if (!process.argv.includes('--force')) process.exit(1);
    console.warn('\n--force passed — continuing anyway. DUPLICATES MAY BE CREATED.');
  }
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

  await assertAllTargetsEmpty();

  // Seed artists first (other collections reference them)
  await seedArtists();
  await seedBlazeProjects();
  await seedKolasiEvents();
  await seedVenuePackages();
  await seedVenueFAQ();
  await seedCaseStudies();
  await seedMilestones();
  await seedVenueSEOPages();

  // Globals
  await seedGlobalSettings();
  await seedShowreel();

  console.log('\n=== Full seed complete! ===');
  console.log('Collections seeded: 8');
  console.log('Globals updated: 2');
}

main().catch(console.error);
