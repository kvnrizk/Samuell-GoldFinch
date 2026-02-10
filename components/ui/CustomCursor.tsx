'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-utils';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      gsap.to(dotRef.current, { x, y, duration: 0.1, ease: 'power2.out' });
      gsap.to(ringRef.current, { x, y, duration: 0.4, ease: 'power2.out' });
    };

    const onMouseDown = () => {
      gsap.to(ringRef.current, { scale: 0.5, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(ringRef.current, { scale: 1, duration: 0.2 });
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
    </>
  );
}
