import type { Metadata } from 'next';
import { getMilestones, getGlobalSettings } from '@/lib/fetchers';
import { safeCms } from '@/lib/cms-safe';
import AboutClient from './AboutClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About — Creative Director, Filmmaker & DJ',
  description: 'Film director, international DJ and curator. Samuell Goldfinch crafts cinematic worlds and live experiences that move people.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [cmsMilestones, settings] = await Promise.all([
    safeCms(getMilestones(), [], 'about milestones'),
    safeCms(getGlobalSettings() as unknown as Promise<Record<string, unknown>>, {}, 'about settings'),
  ]);
  return <AboutClient cmsMilestones={cmsMilestones as { title?: string; name?: string; description?: string }[]} settings={settings} />;
}
