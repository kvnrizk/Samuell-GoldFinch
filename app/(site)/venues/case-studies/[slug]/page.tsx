import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import CaseStudyDetail from './CaseStudyDetail';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await safeCms(getCaseStudyBySlug(slug), null, `case study metadata ${slug}`);
  if (!cs) return { title: 'Case Study Not Found' };

  const ogImage = (cs as any).coverImage?.url;
  return {
    title: `${cs.venueName} — Case Study`,
    description: cs.outcome || `See how we transformed ${cs.venueName} with curated programming.`,
    alternates: { canonical: `/venues/case-studies/${slug}` },
    openGraph: {
      title: `${cs.venueName} — Case Study`,
      description: cs.outcome || `See how we transformed ${cs.venueName} with curated programming.`,
      type: 'article',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  };
}

export async function generateStaticParams() {
  const caseStudies = await safeCms(getCaseStudies(), [], 'case study static params');
  return caseStudies.map((cs) => ({ slug: (cs as unknown as Record<string, string>).slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await safeCms(getCaseStudyBySlug(slug), null, `case study ${slug}`);
  if (!cs) notFound();

  return <CaseStudyDetail caseStudy={cs as any} />;
}
