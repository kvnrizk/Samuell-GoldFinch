'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-utils';

/* ─────────────────────────────────────────────────────────
   Custom Cursor — dot + ring + contextual bubble morph
   ───────────────────────────────────────────────────────── */

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const bubble = bubbleRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !bubble || !label) return;

    let state: 'default' | 'explore' | 'hidden' = 'default';

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Position all elements
      gsap.to(dot, { x, y, duration: 0.1, ease: 'power2.out' });
      gsap.to(ring, { x, y, duration: 0.3, ease: 'power2.out' });
      gsap.to(bubble, { x, y, duration: 0.15, ease: 'power2.out' });

      // Detect context
      const t = e.target as HTMLElement;
      const card = t.closest<HTMLElement>('a.group');
      const btn = t.closest<HTMLElement>('button, a.rounded-full');

      let next: typeof state = 'default';
      if (btn) next = 'hidden';
      else if (card) next = 'explore';

      if (next === state) return;
      state = next;

      switch (next) {
        case 'explore':
          label.textContent = 'Explore';
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
          gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2 });
          gsap.to(bubble, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
          break;
        case 'hidden':
          gsap.to(dot, { scale: 0.5, opacity: 0.4, duration: 0.2 });
          gsap.to(ring, { scale: 0.6, opacity: 0.2, duration: 0.2 });
          gsap.to(bubble, { scale: 0, opacity: 0, duration: 0.2 });
          break;
        default:
          gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25 });
          gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
          gsap.to(bubble, { scale: 0, opacity: 0, duration: 0.25 });
          break;
      }
    };

    const onMouseDown = () => {
      if (state === 'default') {
        gsap.to(ring, { scale: 0.5, duration: 0.15 });
      } else if (state === 'explore') {
        gsap.to(bubble, { scale: 0.85, duration: 0.15 });
      }
    };

    const onMouseUp = () => {
      if (state === 'default') {
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      } else if (state === 'explore') {
        gsap.to(bubble, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        className="cursor-ring hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={bubbleRef}
        className="cursor-bubble hidden md:block"
        style={{ transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }}
      >
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
