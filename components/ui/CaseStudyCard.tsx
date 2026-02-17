'use client';

import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/cloudinary';
import { GlassCard } from './GlassCard';

interface CaseStudyCardProps {
  venueName: string;
  slug: string;
  coverImageUrl?: string;
  role?: string;
  frequency?: string;
  outcome?: string;
}

export function CaseStudyCard({ venueName, slug, coverImageUrl, role, frequency, outcome }: CaseStudyCardProps) {
  return (
    <a href={`/venues/case-studies/${slug}`} className="block group">
      <GlassCard className="overflow-hidden !p-0">
        {coverImageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={venueName}
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="font-serif text-lg font-semibold text-stone-100 mb-2">{venueName}</h3>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-3">
            {role && <span>{role}</span>}
            {frequency && <span>· {frequency}</span>}
          </div>
          {outcome && (
            <p className="text-sm text-[#c8a96e] font-medium">{outcome}</p>
          )}
        </div>
      </GlassCard>
    </a>
  );
}
