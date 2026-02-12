'use client';

import { useEffect } from 'react';
import { gsap } from '@/lib/gsap-utils';

/* ─────────────────────────────────────────────────────────
   Halo — 3D card tilt + radial shine + inner parallax
          + magnetic pull on CTA buttons
   ───────────────────────────────────────────────────────── */

const GLOW = '.pillar-glass, a.group, [data-halo]';
const TILT = '.pillar-glass, a.group';
const MAGNETIC = 'a.rounded-full, button.rounded-full';

export default function CursorHalo() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let activeEl: HTMLElement | null = null;
    let glowDiv: HTMLDivElement | null = null;
    let isTilt = false;
    let activeMag: HTMLElement | null = null;

    /* ── Glow / Shine ──────────────────────────────────── */

    function injectGlow(el: HTMLElement, tilt: boolean) {
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      const div = document.createElement('div');
      div.className = tilt ? 'cursor-halo-glow cursor-halo-shine' : 'cursor-halo-glow';

      const c = el.dataset.haloColor;
      if (c) div.style.setProperty('--halo-color', c);

      el.appendChild(div);
      requestAnimationFrame(() => { div.style.opacity = '1'; });
      return div;
    }

    function removeGlow() {
      if (!glowDiv) return;
      glowDiv.style.opacity = '0';
      const ref = glowDiv;
      setTimeout(() => ref.remove(), 400);
      glowDiv = null;
    }

    /* ── 3D Tilt reset ─────────────────────────────────── */

    function resetTilt(el: HTMLElement) {
      el.style.willChange = '';
      gsap.to(el, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 0.6, ease: 'power3.out', overwrite: true,
      });
      // Reset number parallax
      el.querySelectorAll<HTMLElement>('.pillar-num').forEach((n) => {
        gsap.to(n, { x: 0, y: 0, duration: 0.6, ease: 'power3.out', overwrite: true });
      });
    }

    /* ── Magnetic ──────────────────────────────────────── */

    function releaseMagnetic() {
      if (!activeMag) return;
      gsap.to(activeMag, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      activeMag = null;
    }

    /* ── Main handler ──────────────────────────────────── */

    function onMove(e: MouseEvent) {
      const t = e.target as HTMLElement;

      // ── Glow + Tilt target detection ──
      const card = t.closest<HTMLElement>(GLOW);

      if (card !== activeEl) {
        removeGlow();
        if (activeEl && isTilt) resetTilt(activeEl);

        activeEl = card;
        isTilt = card ? card.matches(TILT) : false;

        if (card) {
          glowDiv = injectGlow(card, isTilt);
          if (isTilt) {
            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform';
          }
        }
      }

      if (activeEl && glowDiv) {
        const r = activeEl.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;

        // Update glow / shine position
        glowDiv.style.setProperty('--halo-x', `${px}px`);
        glowDiv.style.setProperty('--halo-y', `${py}px`);

        // 3D Tilt + inner parallax
        if (isTilt) {
          const cx = px / r.width - 0.5;   // -0.5 → 0.5
          const cy = py / r.height - 0.5;

          gsap.to(activeEl, {
            rotateX: -cy * 8,
            rotateY: cx * 8,
            transformPerspective: 800,
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true,
          });

          // Number watermarks float in cursor direction
          activeEl.querySelectorAll<HTMLElement>('.pillar-num').forEach((n) => {
            gsap.to(n, {
              x: cx * 12, y: cy * 12,
              duration: 0.4, ease: 'power2.out', overwrite: true,
            });
          });
        }
      }

      // ── Magnetic ──
      const mag = t.closest<HTMLElement>(MAGNETIC);

      if (mag !== activeMag) {
        releaseMagnetic();
        activeMag = mag;
      }

      if (mag) {
        const r = mag.getBoundingClientRect();
        gsap.to(mag, {
          x: (e.clientX - r.left - r.width / 2) * 0.06,
          y: (e.clientY - r.top - r.height / 2) * 0.15,
          duration: 0.3, ease: 'power2.out', overwrite: true,
        });
      }
    }

    function onLeave() {
      if (activeEl && isTilt) resetTilt(activeEl);
      removeGlow();
      activeEl = null;
      isTilt = false;
      releaseMagnetic();
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      removeGlow();
      if (activeEl && isTilt) resetTilt(activeEl);
    };
  }, []);

  return null;
}
