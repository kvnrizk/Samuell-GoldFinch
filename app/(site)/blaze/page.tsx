import type { Metadata } from 'next';
import { getAllBlazeProjects, getFeaturedTestimonials } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import { buildPageMetadata } from '@/lib/seo';
import BlazeClient from './BlazeClient';

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: 'Blaze Production - Cinematic Film & Photography',
  description: 'Cinematic storytelling and visual precision for weddings, editorials, and diplomatic events. Based in Paris.',
  path: '/blaze',
});

export default async function BlazePage() {
  const [projects, testimonials] = await Promise.all([
    safeCms(getAllBlazeProjects(), [], 'blaze projects'),
    safeCms(getFeaturedTestimonials('blaze'), [], 'blaze testimonials'),
  ]);
  return <BlazeClient projects={projects as any} testimonials={testimonials as any} />;
}
