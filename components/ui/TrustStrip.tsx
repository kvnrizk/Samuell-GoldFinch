'use client';

const logos = [
  { name: 'Le Speakeasy', initials: 'LS' },
  { name: 'Hôtel Costes', initials: 'HC' },
  { name: 'Calypso', initials: 'CL' },
  { name: 'Le Comptoir', initials: 'LC' },
  { name: 'Bar Hemingway', initials: 'BH' },
];

export function TrustStrip() {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex -space-x-2">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm flex items-center justify-center text-[10px] font-mono text-zinc-400 uppercase"
            title={logo.name}
          >
            {logo.initials}
          </div>
        ))}
      </div>
      <span className="text-xs text-zinc-500">
        <span className="text-stone-100 font-semibold">150+</span> live experiences delivered
      </span>
    </div>
  );
}
