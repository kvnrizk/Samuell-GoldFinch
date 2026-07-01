'use client';

import { GlassCard } from './GlassCard';

interface PricingCardProps {
  name: string;
  tagline?: string;
  deliverables: string[];
  featured?: boolean;
  onCTA?: () => void;
  ctaLabel?: string;
}

export function PricingCard({ name, tagline, deliverables, featured = false, onCTA, ctaLabel = 'Get Started' }: PricingCardProps) {
  return (
    <GlassCard featured={featured} className="flex flex-col">
      {featured && (
        <span className="self-start text-[10px] font-mono uppercase tracking-[0.2em] text-ivory bg-ivory/10 px-3 py-1 rounded-full mb-4 font-medium">
          Most Popular
        </span>
      )}
      <h3 className="font-serif text-xl font-semibold text-stone-100 mb-1">{name}</h3>
      {tagline && <p className="text-sm text-zinc-500 mb-6">{tagline}</p>}
      <ul className="space-y-3 mb-8 flex-1">
        {deliverables.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="text-ivory mt-0.5 text-xs">&#10003;</span>
            {item}
          </li>
        ))}
      </ul>
      <button
        onClick={onCTA}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
          featured
            ? 'bg-ivory text-midnight hover:bg-[#e4e4e7] active:scale-[0.98]'
            : 'border border-ivory text-ivory hover:bg-ivory/8'
        }`}
      >
        {ctaLabel}
      </button>
    </GlassCard>
  );
}
