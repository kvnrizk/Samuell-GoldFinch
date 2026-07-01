import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/fetchers';
import JournalPostDetail from './JournalPostDetail';

export const revalidate = 60;

export async function generateStaticParams() {
  let cmsPosts: any[] = [];
  try {
    cmsPosts = await getAllPosts();
  } catch { /* CMS unavailable */ }

  const seen = new Set<string>();
  return cmsPosts
    .filter((p: any) => p.slug && !seen.has(p.slug) && seen.add(p.slug))
    .map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  let post: any = null;
  try {
    post = await getPostBySlug(slug);
  } catch { /* CMS unavailable */ }

  if (!post) return { title: 'Post Not Found — Samuell Goldfinch' };

  const title = post.seo?.metaTitle || `${post.title} — Samuell Goldfinch Journal`;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const ogImage = post.seo?.ogImage?.url || post.coverImage?.url;

  return {
    title,
    description,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: any = null;
  try {
    post = await getPostBySlug(slug);
  } catch { /* CMS unavailable */ }

  if (!post) notFound();

  let relatedPosts: any[] = [];
  try {
    relatedPosts = await getRelatedPosts(post.category, slug);
  } catch { /* CMS unavailable */ }

  return <JournalPostDetail post={post} relatedPosts={relatedPosts} />;
}
