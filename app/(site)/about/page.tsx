import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Samuell Goldfinch — Creative Director, Filmmaker & DJ',
  description: 'Film director, international DJ and curator. Samuell Goldfinch crafts cinematic worlds and live experiences that move people.',
};

export const revalidate = 60;

export default function AboutPage() {
  return <AboutClient />;
}
