'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGSAP() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const EASING = {
  reveal: 'power3.out',
  transition: 'power2.inOut',
  heroTitle: 'expo.out',
} as const;

export const DURATION = {
  scrollReveal: 1,
  hover: 0.3,
  pageTransition: 0.5,
  carousel: 0.65,
} as const;

export { gsap, ScrollTrigger };
