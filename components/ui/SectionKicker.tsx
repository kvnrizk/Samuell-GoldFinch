'use client';

export function SectionKicker({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ivory/20 bg-ivory/5 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-ivory" />
      <span className="ui-kicker font-mono text-ivory font-medium">
        {label}
      </span>
    </div>
  );
}
