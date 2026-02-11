'use client';

import { GlassCard } from './GlassCard';

interface PricingCardProps {
  name: string;
  tagline?: string;
  deliverables: string[];
  priceRange?: string;
  featured?: boolean;
  onCTA?: () => void;
}

export function PricingCard({ name, tagline, deliverables, priceRange, featured = false, onCTA }: PricingCardProps) {
  return (
    <GlassCard featured={featured} className="flex flex-col">
      {featured && (
        <span className="self-start text-[10px] font-mono uppercase tracking-[0.2em] text-[#c8a96e] bg-[#c8a96e]/10 px-3 py-1 rounded-full mb-4 font-medium">
          Most Popular
        </span>
      )}
      <h3 className="font-serif text-xl font-semibold text-stone-100 mb-1">{name}</h3>
      {tagline && <p className="text-sm text-zinc-500 mb-6">{tagline}</p>}
      <ul className="space-y-3 mb-8 flex-1">
        {deliverables.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="text-[#c8a96e] mt-0.5 text-xs">&#10003;</span>
            {item}
          </li>
        ))}
      </ul>
      {priceRange && (
        <p className="font-serif text-lg text-stone-100 font-semibold mb-6">{priceRange}</p>
      )}
      <button
        onClick={onCTA}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
          featured
            ? 'bg-[#c8a96e] text-[#09090b] hover:bg-[#d4b87a] active:scale-[0.98]'
            : 'border border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e]/[0.08]'
        }`}
      >
        Get Started
      </button>
    </GlassCard>
  );
}
