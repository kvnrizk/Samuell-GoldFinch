'use client';

interface GlassCardProps {
  children: React.ReactNode;
  featured?: boolean;
  className?: string;
}

export function GlassCard({ children, featured = false, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-xl border rounded-2xl p-8
        transition-all duration-300
        ${featured
          ? 'border-[#c8a96e]/30 shadow-[0_0_40px_rgba(200,169,110,0.08)]'
          : 'hover:shadow-[0_0_30px_rgba(200,169,110,0.05)]'
        }
        ${className}
      `}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--text) 3%, var(--bg-card))',
        borderColor: featured ? undefined : 'var(--border)',
      }}
    >
      {children}
    </div>
  );
}
