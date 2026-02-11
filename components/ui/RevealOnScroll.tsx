'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGSAP, gsap, prefersReducedMotion, EASING, DURATION } from '@/lib/gsap-utils';

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
}

export default function RevealOnScroll({
  children,
  direction = 'up',
  distance = 40,
  duration = DURATION.scrollReveal,
  delay = 0,
  stagger = 0,
  className = '',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    registerGSAP();

    const el = ref.current;
    if (!el) return;

    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const sign = direction === 'up' || direction === 'left' ? 1 : -1;

    const from: Record<string, number> = { opacity: 0 };
    from[axis] = distance * sign;

    if (stagger > 0) {
      gsap.from(el.children, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        ...from,
        stagger,
        duration,
        delay,
        ease: EASING.reveal,
      });
    } else {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        ...from,
        duration,
        delay,
        ease: EASING.reveal,
      });
    }
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
