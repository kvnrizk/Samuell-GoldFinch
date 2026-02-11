/**
 * CMS Seed Script
 * Run: npx ts-node --skip-project scripts/seed.ts
 *
 * Seeds Payload CMS with initial content for:
 * - Venue Packages (3 tiers)
 * - Venue FAQ (5 items)
 * - Case Studies (3 placeholder venues)
 * - Milestones (5 career milestones)
 * - Global Settings (Calendly URL, WhatsApp)
 */

import 'dotenv/config';

const PAYLOAD_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
const API = `${PAYLOAD_URL}/api`;

// You'll need to login first and get a token
// POST /api/users/login with email + password
let token = '';

async function login() {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@samuellgoldfinch.com',
      password: process.env.PAYLOAD_ADMIN_PASSWORD || 'changeme',
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
  console.log(`Created ${collection}: ${result.doc?.name || result.doc?.venueName || result.doc?.title || result.doc?.question || result.doc?.id}`);
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
  console.log(`Updated global: ${slug}`);
  return result;
}

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
    tagline: 'Full creative direction for your venue\'s nightlife brand',
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

async function seedVenueFAQ() {
  console.log('\n--- Seeding Venue FAQ ---');

  const faqs = [
    {
      question: 'What genres do you programme?',
      answer: 'We cover the full spectrum — from deep house and afro beats to disco, funk, Latin, and live jazz. Every programme is tailored to your venue\'s atmosphere and clientele.',
      sortOrder: 1,
    },
    {
      question: 'Do you work outside Paris?',
      answer: 'Yes. We have active partnerships across France and regularly work in London, Dubai, and Ibiza. Travel fees may apply for remote locations.',
      sortOrder: 2,
    },
    {
      question: 'How fast can you launch?',
      answer: 'After the discovery call, we typically deliver a programming plan within 5 business days. First night can happen 2–3 weeks after sign-off.',
      sortOrder: 3,
    },
    {
      question: 'What if we already have DJs booked?',
      answer: 'No problem. We can work alongside your existing roster, upgrade the quality, or gradually transition to our curated programming.',
      sortOrder: 4,
    },
    {
      question: "What's included in content production?",
      answer: 'Depending on your tier: professional photo/video at each session, social-ready edits, story highlights, and a monthly performance report.',
      sortOrder: 5,
    },
  ];

  for (const faq of faqs) {
    await create('venue-faq', faq);
  }
}

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

async function seedGlobalSettings() {
  console.log('\n--- Updating Global Settings ---');

  await updateGlobal('global-settings', {
    calendlyUrl: 'https://calendly.com/samuellgoldfinch/venue-discovery',
    whatsappNumber: '+33605883966',
  });
}

async function main() {
  console.log('=== SG Platform CMS Seed ===');
  console.log(`Target: ${PAYLOAD_URL}\n`);

  await login();
  await seedVenuePackages();
  await seedVenueFAQ();
  await seedCaseStudies();
  await seedMilestones();
  await seedGlobalSettings();

  console.log('\n=== Seed complete! ===');
}

main().catch(console.error);
