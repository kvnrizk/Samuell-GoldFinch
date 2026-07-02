'use client';

import type { Locale } from '@/lib/i18n';

const logos = [
  { name: 'Le Speakeasy', initials: 'LS' },
  { name: 'Hôtel Costes', initials: 'HC' },
  { name: 'Calypso', initials: 'CL' },
  { name: 'Le Comptoir', initials: 'LC' },
  { name: 'Bar Hemingway', initials: 'BH' },
];

export function TrustStrip({ locale = 'en' }: { locale?: Locale }) {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex -space-x-2">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm flex items-center justify-center text-[10px] font-mono text-on-media-dim uppercase"
            title={logo.name}
          >
            {logo.initials}
          </div>
        ))}
      </div>
      <span className="text-xs text-on-media-dim">
        <span className="text-on-media font-semibold">150+</span>{' '}
        {locale === 'fr' ? 'experiences live realisees' : 'live experiences delivered'}
      </span>
    </div>
  );
}
