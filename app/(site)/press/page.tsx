import type { Metadata } from 'next';
import { getPressKit } from '@/lib/fetchers';
import PressClient from './PressClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Press Kit — Samuell Goldfinch',
  description: 'Bios, logos, press photos and media appearances for editorial use and bookings.',
  alternates: { canonical: '/press' },
};

/* ── Static fallback (until CMS is populated) ── */
const staticPressKit = {
  shortBio:
    'Samuell Goldfinch is a Paris-based creative director, filmmaker, and international DJ — founder of Blaze Production and Kolasi Agency.',
  mediumBio:
    'Samuell Goldfinch is a Paris-based creative director who bridges cinematic filmmaking with nightlife culture. As founder of Blaze Production, he crafts wedding films, brand content, and editorial projects with a distinctive visual language. Through Kolasi Agency, he curates DJ bookings, event programming, and content production for venues across Europe and the Middle East. His work has taken him to 12+ cities and 150+ live experiences.',
  fullBio: null,
  logos: [],
  pressPhotos: [],
  mediaAppearances: [
    { title: 'The Art of Cinematic Wedding Film', publication: 'Vogue Weddings FR', url: '#', date: '2025-06-01', type: 'feature' },
    { title: 'How Kolasi is Reshaping Paris Nightlife', publication: 'Mixmag', url: '#', date: '2025-04-15', type: 'article' },
    { title: 'Creative Direction in the Age of Social', publication: 'The Creative Review', url: '#', date: '2025-02-20', type: 'interview' },
    { title: 'Behind the Lens: Embassy Events', publication: 'Le Monde Diplomatique', url: '#', date: '2024-11-10', type: 'feature' },
  ],
  pressContact: {
    name: 'Samuell Goldfinch',
    email: 'contact@samuellgoldfinch.com',
    phone: '+33 6 05 88 39 66',
  },
};

export default async function PressPage() {
  let pressKit: any = null;
  try {
    pressKit = await getPressKit();
  } catch {
    /* CMS unavailable */
  }

  // Use CMS data if it has content, otherwise static
  const hasContent = pressKit?.shortBio || pressKit?.mediumBio || (pressKit?.mediaAppearances && pressKit.mediaAppearances.length > 0);
  const data = hasContent ? pressKit : staticPressKit;

  return <PressClient pressKit={data} />;
}
