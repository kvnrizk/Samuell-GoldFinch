'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Audit',
    description: 'We visit your venue, study your crowd, and map the opportunity.',
  },
  {
    number: '02',
    title: 'Programming Plan',
    description: 'We build a weekly identity: artists, schedule, content strategy, pricing.',
  },
  {
    number: '03',
    title: 'Launch + Content Loop',
    description: 'We go live, produce content every session, and optimize monthly.',
  },
];

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const items = containerRef.current.querySelectorAll('.process-step');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
    });

    tl.from(items, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="grid md:grid-cols-3 gap-6">
      {steps.map((step, i) => (
        <div key={i} className="process-step relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-full border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e] font-mono text-sm font-semibold">
              {step.number}
            </span>
            {i < steps.length - 1 && (
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-[#c8a96e]/30 to-transparent" />
            )}
          </div>
          <h3 className="font-serif text-lg font-semibold text-stone-100 mb-2">{step.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
