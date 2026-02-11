'use client';

export function SectionKicker({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c8a96e]/20 bg-[#c8a96e]/5 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]" />
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c8a96e] font-medium">
        {label}
      </span>
    </div>
  );
}
