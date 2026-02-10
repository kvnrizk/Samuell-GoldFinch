import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
  description:
    'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
};

export const revalidate = 60;

export default function HomePage() {
  return <HomeClient />;
}
