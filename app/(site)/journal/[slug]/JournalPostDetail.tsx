'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion } from '@/lib/gsap-utils';

interface Post {
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  coverImage?: { url?: string };
  publishedAt?: string;
  featured?: boolean;
  tags?: { tag?: string }[];
  author?: { name?: string };
  content?: any;
}

interface JournalPostDetailProps {
  post: Post;
  relatedPosts: Post[];
}

const categoryLabels: Record<string, string> = {
  'behind-the-scenes': 'Behind the Scenes',
  tips: 'Tips & Guides',
  industry: 'Industry Insights',
  news: 'News & Updates',
  'client-stories': 'Client Stories',
};

function categoryLabel(value?: string) {
  return categoryLabels[value || ''] || value || '';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

function estimateReadTime(text?: string) {
  const words = (text || '').split(/\s+/).length;
  return Math.max(2, Math.round(words / 200)) + ' min read';
}

function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;

  // Payload Lexical rich text: { root: { children: [...] } }
  const root = content?.root?.children;
  if (!root || !Array.isArray(root)) {
    // Plain string fallback — render paragraphs split by double newlines
    if (typeof content === 'string') {
      const paragraphs = content.split(/\n\n+/).filter(Boolean);
      return (
        <div className="space-y-6">
          {paragraphs.map((p: string, i: number) => (
            <p key={i} className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
              {p}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      {root.map((node: any, i: number) => {
        if (node.type === 'paragraph') {
          const text = node.children?.map((c: any) => c.text || '').join('') || '';
          if (!text.trim()) return null;
          return (
            <p key={i} className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
              {text}
            </p>
          );
        }
        if (node.type === 'heading') {
          const text = node.children?.map((c: any) => c.text || '').join('') || '';
          const Tag = (node.tag || 'h3') as keyof React.JSX.IntrinsicElements;
          return (
            <Tag key={i} className="text-xl md:text-2xl font-serif italic mt-10 mb-4">
              {text}
            </Tag>
          );
        }
        if (node.type === 'list') {
          const ListTag = node.listType === 'number' ? 'ol' : 'ul';
          return (
            <ListTag key={i} className={`space-y-2 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
              {(node.children || []).map((li: any, j: number) => (
                <li key={j} className="text-sm md:text-base leading-[1.9] font-light" style={{ color: 'var(--text-dim)' }}>
                  {li.children?.map((c: any) => c.text || '').join('') || ''}
                </li>
              ))}
            </ListTag>
          );
        }
        if (node.type === 'quote') {
          const text = node.children?.map((c: any) =>
            c.children?.map((t: any) => t.text || '').join('') || c.text || ''
          ).join('') || '';
          return (
            <blockquote
              key={i}
              className="border-l-2 pl-6 py-2 my-8 italic text-sm md:text-base leading-[1.9]"
              style={{ borderColor: '#c8a96e', color: 'var(--text-dim)' }}
            >
              {text}
            </blockquote>
          );
        }
        return null;
      })}
    </div>
  );
}

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/journal/${slug}`
    : `/journal/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch { /* fallback ignored */ }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: 'var(--text-mute)' }}>
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] transition-colors hover:border-[#c8a96e] hover:text-[#c8a96e]"
        style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
        aria-label="Share on X"
      >
        𝕏
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] transition-colors hover:border-[#c8a96e] hover:text-[#c8a96e]"
        style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
        aria-label="Share on LinkedIn"
      >
        in
      </a>
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] transition-colors hover:border-[#c8a96e] hover:text-[#c8a96e]"
        style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
        aria-label="Copy link"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      </button>
    </div>
  );
}

export default function JournalPostDetail({ post, relatedPosts }: JournalPostDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const contentText = typeof post.content === 'string'
    ? post.content
    : post.excerpt || '';

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();
    gsap.utils.toArray<HTMLElement>('.post-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--bg)' }}>
      {/* ── Hero Cover ── */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-card)' }} />
        )}
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{ background: 'linear-gradient(to top, var(--bg) 15%, color-mix(in srgb, var(--bg) 50%, transparent) 55%, transparent)' }}
        />
      </section>

      {/* ── Article Header ── */}
      <section className="max-w-3xl mx-auto px-6 -mt-20 md:-mt-28 relative z-10">
        <div className="post-reveal">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-medium mb-6 transition-colors hover:text-[#c8a96e]"
            style={{ color: 'var(--text-mute)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Journal
          </Link>

          <span
            className="inline-block px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.12em] mb-5 border"
            style={{
              borderColor: 'color-mix(in srgb, #c8a96e 40%, transparent)',
              color: '#c8a96e',
              backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {categoryLabel(post.category)}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic leading-[1.05] tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-[11px] mb-8" style={{ color: 'var(--text-mute)' }}>
            {post.author?.name && (
              <>
                <span className="font-medium" style={{ color: 'var(--text-dim)' }}>{post.author.name}</span>
                <span>&middot;</span>
              </>
            )}
            <span>{formatDate(post.publishedAt)}</span>
            <span>&middot;</span>
            <span>{estimateReadTime(contentText)}</span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-[10px] font-medium border"
                  style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
                >
                  {t.tag}
                </span>
              ))}
            </div>
          )}

          <div className="h-[1px] mb-10" style={{ backgroundColor: 'var(--border)' }} />
        </div>
      </section>

      {/* ── Article Content ── */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <div className="post-reveal">
          <RichTextRenderer content={post.content} />
        </div>
      </article>

      {/* ── Share + Divider ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="post-reveal">
          <div className="h-[1px] mb-8" style={{ backgroundColor: 'var(--border)' }} />
          <ShareBar title={post.title} slug={post.slug} />
        </div>
      </section>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <section className="pb-24 md:pb-32 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto pt-20">
            <h2 className="post-reveal text-2xl md:text-3xl font-serif italic mb-12 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/journal/${rp.slug}`}
                  className="post-reveal group rounded-2xl overflow-hidden border flex flex-col transition-colors hover:border-[#c8a96e]/20"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {rp.coverImage?.url ? (
                      <Image
                        src={rp.coverImage.url}
                        alt={rp.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: 'var(--bg-card)' }} />
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: '#c8a96e' }}>
                      {categoryLabel(rp.category)}
                    </span>
                    <h3 className="text-base font-serif mb-2 group-hover:text-[#c8a96e] transition-colors leading-snug">
                      {rp.title}
                    </h3>
                    <p className="text-xs font-light leading-relaxed line-clamp-2 flex-1" style={{ color: 'var(--text-dim)' }}>
                      {rp.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        className="py-32 md:py-40 text-center border-t"
        style={{
          background: 'linear-gradient(to bottom, var(--bg), var(--bg-card))',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 post-reveal">
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight mb-6">
            Let&apos;s Create Together
          </h2>
          <p className="text-sm font-light mb-12 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Inspired by what you read? Whether it&apos;s a film, an event, or a creative collaboration — we&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
