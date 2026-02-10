import type { Metadata } from 'next';
import BlazeClient from './BlazeClient';

export const metadata: Metadata = {
  title: 'Blaze Production — Cinematic Film & Photography | Samuell Goldfinch',
  description: 'Cinematic storytelling and visual precision for weddings, editorials, and diplomatic events. Based in Paris.',
};

export const revalidate = 60;

export default function BlazePage() {
  return <BlazeClient />;
}
