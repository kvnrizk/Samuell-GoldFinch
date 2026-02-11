import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/fetchers';
import CaseStudyDetail from './CaseStudyDetail';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: 'Case Study Not Found' };

  return {
    title: `${cs.venueName} — Case Study`,
    description: cs.outcome || `See how we transformed ${cs.venueName} with curated programming.`,
    alternates: { canonical: `/venues/case-studies/${slug}` },
  };
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((cs) => ({ slug: (cs as Record<string, string>).slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Payload returns generic JsonObject types
  return <CaseStudyDetail caseStudy={cs as any} />;
}
