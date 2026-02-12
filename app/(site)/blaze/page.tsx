import type { Metadata } from 'next';
import { getAllBlazeProjects, getFeaturedTestimonials } from '@/lib/fetchers';
import BlazeClient from './BlazeClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blaze Production — Cinematic Film & Photography',
  description: 'Cinematic storytelling and visual precision for weddings, editorials, and diplomatic events. Based in Paris.',
  alternates: { canonical: '/blaze' },
};

export default async function BlazePage() {
  const [projects, testimonials] = await Promise.all([
    getAllBlazeProjects(),
    getFeaturedTestimonials('blaze').catch(() => []),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Payload returns generic JsonObject types
  return <BlazeClient projects={projects as any} testimonials={testimonials as any} />;
}
