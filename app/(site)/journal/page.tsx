import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/fetchers';
import JournalClient from './JournalClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Journal — Samuell Goldfinch',
  description: 'Behind the scenes, tips, industry insights and stories from the world of cinematic filmmaking and nightlife curation.',
  alternates: { canonical: '/journal' },
};

export default async function JournalPage() {
  let cmsPosts: any[] = [];
  try {
    cmsPosts = await getAllPosts();
  } catch {
    /* CMS unavailable */
  }

  // CMS-only: never present static/demo posts as real editorial content.
  // JournalClient renders a credible empty state when there are no posts.
  return <JournalClient posts={cmsPosts as any} />;
}
