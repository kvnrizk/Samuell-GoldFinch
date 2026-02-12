import type { Metadata } from 'next';
import { getBlazeProjectBySlug, getAllBlazeProjects, getAdjacentBlazeProjects } from '@/lib/fetchers';
import BlazeProjectDetail from './BlazeProjectDetail';
import { notFound } from 'next/navigation';

export const revalidate = 60;

/* ── Static fallback data (used until CMS is seeded) ── */
const staticProjects: Record<string, any> = {
  'stouh-beirut': {
    title: 'Stouh Beirut Rooftop',
    slug: 'stouh-beirut',
    category: 'Event',
    client: 'Stouh Beirut',
    location: 'Paris, France',
    date: '2025-06-15',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'Golden-hour diplomacy on the Parisian skyline. A rooftop celebration blending Lebanese hospitality with Parisian elegance, captured with cinematic precision across every moment of the evening.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'From the intimate conversations to the grand gestures, every frame tells the story of a night where two cultures met above the city of light.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/blaze/stouh_beirut/2E2A1724.jpg' } },
      { image: { url: '/assets/blaze/stouh_beirut/2E2A2072.jpg' } },
      { image: { url: '/assets/blaze/stouh_beirut/2E2A1243.jpg' } },
      { image: { url: '/assets/blaze/stouh_beirut/4F8A9365.jpg' } },
      { image: { url: '/assets/blaze/stouh_beirut/IMG_6348.jpg' } },
      { image: { url: '/assets/blaze/stouh_beirut/IMG_6351.jpg' } },
    ],
  },
  'embassy-of-lebanon': {
    title: 'Embassy of Lebanon',
    slug: 'embassy-of-lebanon',
    category: 'Diplomatic',
    client: 'Embassy of Lebanon',
    location: 'Paris, France',
    date: '2025-04-20',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'Diplomatic ceremonies captured with cinematic restraint. An exclusive evening at the Embassy of Lebanon in Paris, where tradition meets contemporary elegance.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'Every detail was preserved with discretion and artistry — from the grand reception halls to the candid moments of cultural exchange between distinguished guests.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/blaze/ambassy/0C5A9134.jpg' } },
      { image: { url: '/assets/blaze/ambassy/0C5A9139.jpg' } },
      { image: { url: '/assets/blaze/ambassy/0C5A9196.jpg' } },
      { image: { url: '/assets/blaze/ambassy/4F8A9987.jpg' } },
      { image: { url: '/assets/blaze/ambassy/4F8A9996.jpg' } },
      { image: { url: '/assets/blaze/ambassy/0C5A9206.jpg' } },
    ],
  },
  'weddings': {
    title: 'Weddings',
    slug: 'weddings',
    category: 'Wedding',
    client: 'Private Clients',
    location: 'Paris & International',
    date: '2025-09-10',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'Stories of connection and timeless elegance. Each wedding film is a deeply personal work — a cinematic love letter crafted from the real emotions, stolen glances, and unscripted moments of your day.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'From intimate elopements in the French countryside to grand celebrations in Beirut, we bring a director\'s eye and an editor\'s precision to the most important day of your life.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/blaze/weddings/DSCF2395.jpg' } },
      { image: { url: '/assets/blaze/weddings/IMG_0100.jpg' } },
      { image: { url: '/assets/blaze/weddings/IMG_0084.jpg' } },
      { image: { url: '/assets/blaze/weddings/IMG_0068.jpg' } },
      { image: { url: '/assets/blaze/weddings/IMG_0079.jpg' } },
      { image: { url: '/assets/blaze/weddings/0G0A7811.jpg' } },
    ],
  },
  'editorial-brand': {
    title: 'Editorial & Brand',
    slug: 'editorial-brand',
    category: 'Editorial',
    client: 'Various Brands',
    location: 'Paris & International',
    date: '2025-11-01',
    description: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'The language of identity told through crafted imagery. Brand films, lookbooks, and editorial content that capture the essence of who you are and what you stand for.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'Working with brands from fashion to hospitality, we translate vision into visual narratives that resonate with audiences and elevate your presence across every platform.' }],
          },
        ],
      },
    },
    gallery: [
      { image: { url: '/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.JPG' } },
      { image: { url: '/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg' } },
      { image: { url: '/assets/blaze/editorial_and_brand/pexels-angel-ayala-321556-28976231.jpg' } },
      { image: { url: '/assets/blaze/editorial_and_brand/pexels-fabrice-busching-1777473881-30235864.jpg' } },
      { image: { url: '/assets/blaze/editorial_and_brand/pexels-valentina-maros-128709290-13283497.jpg' } },
    ],
  },
};

const staticSlugs = Object.keys(staticProjects);
const staticOrder = ['stouh-beirut', 'embassy-of-lebanon', 'weddings', 'editorial-brand'];

function getStaticAdjacent(slug: string) {
  const idx = staticOrder.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };
  const prevSlug = idx > 0 ? staticOrder[idx - 1] : staticOrder[staticOrder.length - 1];
  const nextSlug = idx < staticOrder.length - 1 ? staticOrder[idx + 1] : staticOrder[0];
  return {
    prev: staticProjects[prevSlug],
    next: staticProjects[nextSlug],
  };
}

/* ── Route generation ── */

export async function generateStaticParams() {
  const projects = await getAllBlazeProjects();
  const cmsSlugs = (projects as any[])
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug }));

  // Include static fallback slugs so they're pre-rendered
  const fallbackSlugs = staticSlugs.map((slug) => ({ slug }));
  const allSlugs = [...cmsSlugs, ...fallbackSlugs];

  // Deduplicate
  const seen = new Set<string>();
  return allSlugs.filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmsProject = await getBlazeProjectBySlug(slug);
  const project = (cmsProject as any) || staticProjects[slug];
  if (!project) return {};

  const title = project.seo?.metaTitle || `${project.title} — Blaze by Samuell Goldfinch`;
  const description =
    project.seo?.metaDescription ||
    `${project.title} — ${project.category} production by Blaze. ${project.location || ''}`;
  const ogImage = project.seo?.ogImage?.url || project.gallery?.[0]?.image?.url;

  return {
    title,
    description,
    alternates: { canonical: `/blaze/${slug}` },
    openGraph: {
      title: project.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlazeProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try CMS first, fall back to static data
  const cmsProject = await getBlazeProjectBySlug(slug);
  const project = (cmsProject as any) || staticProjects[slug];
  if (!project) notFound();

  // Adjacent projects: CMS or static
  let adjacent;
  if (cmsProject) {
    adjacent = await getAdjacentBlazeProjects(slug);
  } else {
    adjacent = getStaticAdjacent(slug);
  }

  return (
    <BlazeProjectDetail
      project={project}
      prevProject={adjacent.prev as any}
      nextProject={adjacent.next as any}
    />
  );
}
