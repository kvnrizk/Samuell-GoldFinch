'use client';

export function SectionKicker({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f7f7f5]/20 bg-[#f7f7f5]/5 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#f7f7f5]" />
      <span className="ui-kicker font-mono text-[#f7f7f5] font-medium">
        {label}
      </span>
    </div>
  );
}
