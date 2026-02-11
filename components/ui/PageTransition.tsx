'use client';

import { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayChildren(children);
      window.scrollTo(0, 0);
      return;
    }

    const tl = gsap.timeline();

    // Enter: overlay slides in + progress bar
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
      .to(
        overlayRef.current,
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.4,
          ease: 'power2.inOut',
        },
        0,
      )
      .call(() => {
        setDisplayChildren(children);
        window.scrollTo(0, 0);
      })
      // Exit: overlay slides out
      .to(overlayRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.4,
        ease: 'power2.inOut',
        delay: 0.05,
      })
      .to(
        progressRef.current,
        {
          scaleX: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        '-=0.2',
      );

    // Content fade in
    tl.from(
      contentRef.current,
      {
        opacity: 0,
        y: 15,
        duration: 0.4,
        ease: 'power3.out',
      },
      '-=0.3',
    );

    return () => {
      tl.kill();
    };
  }, [pathname, children]);

  return (
    <>
      {/* Gold progress bar */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#c8a96e] z-[60] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[#09090b] z-50 pointer-events-none"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      />
      {/* Content */}
      <div ref={contentRef}>{displayChildren}</div>
    </>
  );
}
