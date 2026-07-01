import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlazeProjectBySlug, getAllBlazeProjects, getAdjacentBlazeProjects } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import BlazeProjectDetail from './BlazeProjectDetail';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await safeCms(getAllBlazeProjects(), [], 'blaze static params');
  const seen = new Set<string>();

  return (projects as any[])
    .filter((project) => project.slug && !seen.has(project.slug) && seen.add(project.slug))
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await safeCms(getBlazeProjectBySlug(slug), null, `blaze metadata ${slug}`) as any;
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

  const project = await safeCms(getBlazeProjectBySlug(slug), null, `blaze project ${slug}`) as any;
  if (!project) notFound();

  const adjacent = await safeCms(
    getAdjacentBlazeProjects(slug),
    { prev: null, next: null },
    `blaze adjacent ${slug}`,
  );

  return (
    <BlazeProjectDetail
      project={project}
      prevProject={adjacent.prev as any}
      nextProject={adjacent.next as any}
    />
  );
}
