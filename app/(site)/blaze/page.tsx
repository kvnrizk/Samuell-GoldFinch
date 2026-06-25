import type { Metadata } from 'next';
import { getAllBlazeProjects } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import BlazeClient from './BlazeClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blaze Production — Cinematic Film & Photography',
  description: 'Cinematic storytelling and visual precision for weddings, editorials, and diplomatic events. Based in Paris.',
  alternates: { canonical: '/blaze' },
};

export default async function BlazePage() {
  const projects = await safeCms(getAllBlazeProjects(), [], 'blaze projects');
  return <BlazeClient projects={projects as any} />;
}
