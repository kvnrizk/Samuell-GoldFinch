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
        bg-white/[0.03] backdrop-blur-xl border rounded-2xl p-8
        transition-all duration-300
        ${featured
          ? 'border-[#c8a96e]/30 shadow-[0_0_40px_rgba(200,169,110,0.08)]'
          : 'border-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(200,169,110,0.05)]'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
