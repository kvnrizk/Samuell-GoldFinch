'use client';

import { useEffect, useRef, useState } from 'react';

function useRevealCounter(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    setValue(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startedAt = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return { ref, value };
}

export function CounterStat({ value, label }: { value: number; label: string }) {
  const counter = useRevealCounter(value);

  return (
    <div className="p-4 border-l" style={{ borderColor: 'var(--border-subtle)' }}>
      <p className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        <span ref={counter.ref}>{counter.value}</span>+
      </p>
      <p className="ui-caption mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  );
}
