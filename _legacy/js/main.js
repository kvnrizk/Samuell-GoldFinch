/* Main JS: consolidated behaviors for index.html
   - Requires: GSAP (+ ScrollTrigger) and Barba loaded with defer before this file
   - Loads on DOMContentLoaded and registers window.load hooks where needed
*/
(function(){
  'use strict';

  const ENABLE_BARBA = false;
  const scheduleIdle = (cb, timeout = 600) => {
    if(typeof window.requestIdleCallback === 'function'){
      window.requestIdleCallback(cb, { timeout });
    }else{
      setTimeout(cb, 1);
    }
  };

  /* Guarded Tailwind loader
     - Ensures the Tailwind CDN is only injected once even if multiple pages included it.
     - Pages can set `window.__tailwind_config = { ... }` to provide page-specific config.
     - This runs early so Tailwind is available shortly after this script executes.
  */
  (function ensureTailwind(){
    try{
      if(window.__tailwind_loaded) return;
      // If the page already included the CDN script (older state), detect and mark loaded
      var existing = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if(existing){ window.__tailwind_loaded = true; return; }

      // If no Tailwind needed (no tailwind-utility classes present), skip injection to save bytes
      // Heuristic: only inject when the document contains a class-like token that Tailwind provides.
      var need = document.querySelector('[class*="tw-"]') || document.querySelector('[class*="max-w-"]') || document.querySelector('[class*="mx-auto"]') || document.querySelector('[class*="grid"]') || document.querySelector('[class*="text-"]');
      // If nothing obvious, still load on pages that explicitly opted-in via window.__tailwind_config
      if(!need && !window.__tailwind_config) return;

      // Apply page config (if present) to window.tailwind before loading the CDN so it picks it up
      if(window.__tailwind_config && !window.tailwind) window.tailwind = {};
      if(window.__tailwind_config) window.tailwind.config = window.__tailwind_config;

      var s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      s.defer = true;
      s.onload = function(){ window.__tailwind_loaded = true; };
      s.onerror = function(){ console.warn('Tailwind CDN failed to load'); };
      document.head.appendChild(s);
    }catch(e){ console.warn('ensureTailwind failed', e); }
  })();

  // Helper: safe query
  const $ = sel => document.querySelector(sel);

  if(typeof window.toggleTheme !== 'function'){
    window.toggleTheme = function(){};
  }

  function refreshLayoutAfterThemeOrLoad(){
    try{
      const header = document.querySelector('.site-header, .app-header, header');
      const main = document.querySelector('main');
      if(header && main){
        const h = header.offsetHeight || 64;
        main.style.paddingTop = h + 'px';
      }
      const isMobile = (function(){
        try{ return window.matchMedia ? window.matchMedia('(max-width: 768px)').matches : (window.innerWidth && window.innerWidth <= 768); }
        catch(e){ return window.innerWidth && window.innerWidth <= 768; }
      })();
      const revealEls = document.querySelectorAll('[data-reveal]');
      revealEls.forEach(el => {
        try{
          const rect = el.getBoundingClientRect();
          const forceVisible = el.classList.contains('force-visible-mobile') || (typeof el.closest === 'function' && el.closest('.force-visible-mobile'));
          if((isMobile && rect.top < 1200) || forceVisible){
            el.classList.add('is-visible');
          }
        }catch(e){ /* noop */ }
      });
    }catch(e){ /* noop */ }
  }

  function syncMobileViewportClass(){
    try{
      const html = document.documentElement;
      const body = document.body;
      if(!html) return;
      const apply = (isMobile) => {
        if(isMobile){
          html.classList.add('mobile-view');
          if(body) body.classList.add('mobile-view');
        }else{
          html.classList.remove('mobile-view');
          if(body) body.classList.remove('mobile-view');
        }
      };
      const mq = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;
      if(mq){
        apply(mq.matches);
        if(!syncMobileViewportClass.__bound){
          const handler = e => apply(e.matches);
          if(typeof mq.addEventListener === 'function') mq.addEventListener('change', handler);
          else if(typeof mq.addListener === 'function') mq.addListener(handler);
          window.addEventListener('resize', () => apply((window.innerWidth || 0) <= 768));
          syncMobileViewportClass.__bound = true;
        }
      }else{
        apply((window.innerWidth || 0) <= 768);
      }
    }catch(e){ /* noop */ }
  }
  syncMobileViewportClass();

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      refreshLayoutAfterThemeOrLoad();
      initHeaderControls();
      syncMobileViewportClass();
    }, 120);
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      refreshLayoutAfterThemeOrLoad();
      syncMobileViewportClass();
    }, 120);
  });

  function initMobileNav(){
    const menuBtn = document.getElementById('menuToggle');
    const overlay = document.querySelector('.site-nav-overlay');
    const panel = document.getElementById('siteNavPanel');
    if(!menuBtn || !overlay || !panel || menuBtn.__wired) return;
    menuBtn.__wired = true;
    if(!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex','-1');

    const open = () => {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      try{ panel.focus(); }catch(e){ /* noop */ }
    };

    const close = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      try{ menuBtn.focus(); }catch(e){ /* noop */ }
    };

    menuBtn.addEventListener('click', () => {
      if(overlay.classList.contains('open')) close();
      else open();
    });

    overlay.addEventListener('click', (e) => {
      if(e.target === overlay) close();
    });

    panel.addEventListener('click', (e) => {
      const target = e.target;
      if(target && target.tagName === 'A') close();
    });

    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  function initHeaderControls(){
    initMobileNav();
    const themeBtn = document.querySelector('#themeToggle,[data-theme-toggle]');
    if(themeBtn && !themeBtn.__headerWired){
      themeBtn.__headerWired = true;
      themeBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        if(typeof window.toggleTheme === 'function') window.toggleTheme();
        else if(typeof toggleTheme === 'function') toggleTheme();
        if(typeof refreshLayoutAfterThemeOrLoad === 'function') refreshLayoutAfterThemeOrLoad();
      });
    }
  }

  let currentTheme = null;

  function initThemeToggle(){
    const html = document.documentElement;
    const body = document.body;
    const btn = document.getElementById('themeToggle');
    if(!html || !body) return;
    const labelNode = btn ? btn.querySelector('[data-theme-label]') : null;
    const srNode = btn ? btn.querySelector('[data-theme-sr]') : null;
    const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const stored = localStorage.getItem('theme');
    if(stored){
      currentTheme = stored;
    }else{
      currentTheme = 'dark';
      localStorage.setItem('theme','dark');
    }

    if(btn && !btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Toggle theme');

    function updateButton(isDark){
      if(!btn) return;
      const visible = isDark ? 'Dark' : 'Light';
      const srText = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      if(labelNode) labelNode.textContent = visible;
      else btn.textContent = visible;
      if(srNode) srNode.textContent = srText;
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', 'Toggle theme');
      btn.dataset.theme = isDark ? 'dark' : 'light';
    }

    function applyTheme(theme, persist){
      const isDark = theme === 'dark';
      html.classList.toggle('dark', isDark);
      html.classList.toggle('light', !isDark);
      body.classList.toggle('dark', isDark);
      body.classList.toggle('light', !isDark);
      if(persist) localStorage.setItem('theme', theme);
      updateButton(isDark);
      currentTheme = theme;
      try{ refreshLayoutAfterThemeOrLoad(); }
      catch(e){ /* noop */ }
    }

    applyTheme(currentTheme, false);
    if(btn) btn.__themeInit = true;

    if(media && typeof media.addEventListener === 'function' && !media.__themeListener){
      const handler = evt => {
        if(localStorage.getItem('theme')) return;
        applyTheme(evt.matches ? 'dark' : 'light', false);
      };
      media.addEventListener('change', handler);
      media.__themeListener = handler;
    }

    window.toggleTheme = function(){
      const next = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    };
  }

  function initRevealSections(){
    const nodes = document.querySelectorAll('[data-reveal]');
    nodes.forEach(el => el.classList.add('is-visible'));
  }

  function staticInit(){
    if(staticInit.__ran) return;
    staticInit.__ran = true;
    // Small mobile fix: some browsers (iOS Safari) will auto-zoom when a button/link
    // is focused on navigation. If we detect a touch device and an activeElement
    // that is an interactive control, blur it to avoid the browser jump/zoom.
    try{
      if(('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)){
        setTimeout(function(){
          try{ const ae = document.activeElement; if(ae && /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) ae.blur(); }catch(e){}
        }, 30);
      }
    }catch(e){}
    // Year
    const yearEl = $('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

    /* -------------------- Theme bootstrap & toggle -------------------- */
    initThemeToggle();
    initHeaderControls();

    /* -------------------- Header / main padding sync -------------------- */
    (function(){
      const header = document.querySelector('header.site-header') || document.querySelector('header.app-header');
      const main = document.querySelector('main');
      if(!header || !main) return;
      function syncPadding(){
        try{
          const rect = header.getBoundingClientRect();
          const h = Math.ceil(rect.height);
          // add a single px of breathing room to avoid overlap on small rounding differences
          main.style.paddingTop = (h + 0) + 'px';
        }catch(e){}
      }
      // run on load + resize
      window.addEventListener('load', syncPadding);
      window.addEventListener('resize', syncPadding);
      // also observe header size changes (mobile nav toggles, fonts loading)
      try{
        const mo = new ResizeObserver(syncPadding);
        mo.observe(header);
      }catch(e){}
      // initial call
      syncPadding();
    })();

    /* -------------------- Cursor (delegated hover handling) -------------------- */
    (function(){
      const cursor = document.getElementById('cursor');
      if(!cursor) return;
      let mouseX = innerWidth/2, mouseY = innerHeight/2, x = mouseX, y = mouseY;
      const speed = 0.16;
      window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, {passive:true});
      function raf(){ x += (mouseX - x) * speed; y += (mouseY - y) * speed; cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; requestAnimationFrame(raf); }
      raf();
      // Delegated hover: single listener reduces many listeners on large pages
      const hoverSelector = 'a, button, .card-pop, .rounded-cta';
      let lastTarget = null;
      document.addEventListener('pointerover', (e)=>{
        const t = e.target.closest ? e.target.closest(hoverSelector) : null;
        if(t && t !== lastTarget){ cursor.classList.add('cursor--grow'); lastTarget = t; }
      }, {passive:true});
      document.addEventListener('pointerout', (e)=>{
        const t = e.target.closest ? e.target.closest(hoverSelector) : null;
        if(!t || t === lastTarget){ cursor.classList.remove('cursor--grow'); lastTarget = null; }
      }, {passive:true});
      if('ontouchstart' in window || navigator.maxTouchPoints > 0) cursor.style.display = 'none';
    })();

    function initOrbitCarousels(){
      const carousels = Array.from(document.querySelectorAll('[data-orbit-carousel]'));
      if(!carousels.length) return;

      const swipeThreshold = 48;
      const supportsPointerEvents = typeof window !== 'undefined' && window.PointerEvent;
      const interactiveSelector = 'a[href], button, [role="button"], .rounded-cta, [data-orbit-ignore-drag]';
      const isInteractiveTarget = (evt) => {
        const target = evt?.target;
        return !!(target && target.closest && target.closest(interactiveSelector));
      };
      const getPointerClientX = (evt) => {
        if(evt?.touches && evt.touches.length) return evt.touches[0].clientX;
        if(evt?.changedTouches && evt.changedTouches.length) return evt.changedTouches[0].clientX;
        return typeof evt?.clientX === 'number' ? evt.clientX : null;
      };

      const prefersMotion = (() => {
        try{
          const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
          return () => !(mq && mq.matches);
        }catch(e){ return () => true; }
      })();

      const applyState = (slides, index) => {
        const total = slides.length;
        if(!total) return;
        const hasSides = total > 2;
        const leftIndex = hasSides ? (index - 1 + total) % total : null;
        const rightIndex = hasSides ? (index + 1) % total : null;
        slides.forEach((slide, idx) => {
          slide.classList.remove('is-active','is-left','is-right','is-off');
          if(idx === index) slide.classList.add('is-active');
          else if(hasSides && idx === leftIndex) slide.classList.add('is-left');
          else if(hasSides && idx === rightIndex) slide.classList.add('is-right');
          else slide.classList.add('is-off');
        });
      };

      carousels.forEach(carousel => {
        if(carousel.__orbitInit) return;
        carousel.__orbitInit = true;
        const slides = Array.from(carousel.querySelectorAll('[data-orbit-slide]'));
        if(!slides.length) return;

        const stage = carousel.querySelector('.orbit-stage');
        if(stage && !stage.hasAttribute('tabindex')) stage.setAttribute('tabindex','0');
        slides.forEach(slide => {
          if(!slide.hasAttribute('role')) slide.setAttribute('role','listitem');
        });

        let index = 0;
        const total = slides.length;
        const autoplayEnabled = carousel.getAttribute('data-autoplay') !== 'false' && prefersMotion();
        const interval = Math.max(3800, parseInt(carousel.getAttribute('data-autoplay-interval') || '5200', 10) || 5200);
        let timer = null;

        const go = (delta) => {
          index = (index + delta + total) % total;
          applyState(slides, index);
        };
        const next = () => go(1);
        const prev = () => go(-1);

        const stopAutoplay = () => { if(timer){ clearInterval(timer); timer = null; } };
        const startAutoplay = () => {
          if(!autoplayEnabled || total <= 1) return;
          stopAutoplay();
          timer = setInterval(next, interval);
        };
        const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };

        const prevBtn = carousel.querySelector('[data-orbit-prev]');
        const nextBtn = carousel.querySelector('[data-orbit-next]');
        prevBtn && prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
        nextBtn && nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });

        const pause = () => stopAutoplay();
        const resume = () => startAutoplay();
        carousel.addEventListener('pointerenter', pause);
        carousel.addEventListener('pointerleave', resume);
        carousel.addEventListener('focusin', pause);
        carousel.addEventListener('focusout', resume);

        if(stage){
          stage.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowRight'){ e.preventDefault(); next(); restartAutoplay(); }
            else if(e.key === 'ArrowLeft'){ e.preventDefault(); prev(); restartAutoplay(); }
          });

          const dragState = { active:false, startX:0, lastX:0 };
          const startDrag = (evt) => {
            const x = getPointerClientX(evt);
            if(typeof x !== 'number') return;
            dragState.active = true;
            dragState.startX = x;
            dragState.lastX = x;
            carousel.classList.add('is-dragging');
            stopAutoplay();
          };
          const moveDrag = (evt) => {
            if(!dragState.active) return;
            const x = getPointerClientX(evt);
            if(typeof x !== 'number') return;
            dragState.lastX = x;
          };
          const endDrag = (evt) => {
            if(!dragState.active) return;
            const x = getPointerClientX(evt);
            const delta = (typeof x === 'number' ? x : dragState.lastX) - dragState.startX;
            dragState.active = false;
            dragState.startX = 0;
            dragState.lastX = 0;
            carousel.classList.remove('is-dragging');
            if(Math.abs(delta) > swipeThreshold){
              if(delta < 0) next();
              else prev();
              restartAutoplay();
            }else{
              startAutoplay();
            }
          };

          if(supportsPointerEvents){
            stage.addEventListener('pointerdown', (evt) => {
              if(evt.pointerType === 'mouse' && evt.button !== 0) return;
              if(isInteractiveTarget(evt)) return;
              startDrag(evt);
              if(stage.setPointerCapture) try{ stage.setPointerCapture(evt.pointerId); }catch(e){/* noop */}
            }, { passive:true });
            stage.addEventListener('pointermove', (evt) => {
              if(evt.pointerType === 'mouse' && !dragState.active) return;
              moveDrag(evt);
            }, { passive:true });
            stage.addEventListener('pointerup', (evt) => {
              if(evt.pointerType === 'mouse' && evt.button !== 0) return;
              endDrag(evt);
              if(stage.releasePointerCapture) try{ stage.releasePointerCapture(evt.pointerId); }catch(e){/* noop */}
            });
            stage.addEventListener('pointercancel', (evt) => {
              endDrag(evt);
              if(stage.releasePointerCapture) try{ stage.releasePointerCapture(evt.pointerId); }catch(e){/* noop */}
            });
          }else{
            stage.addEventListener('touchstart', (evt) => {
              if(isInteractiveTarget(evt)) return;
              startDrag(evt);
            }, { passive:true });
            stage.addEventListener('touchmove', moveDrag, { passive:true });
            stage.addEventListener('touchend', endDrag);
            stage.addEventListener('touchcancel', endDrag);
            stage.addEventListener('mousedown', (evt) => {
              if(evt.button !== 0 || isInteractiveTarget(evt)) return;
              startDrag(evt);
            });
            stage.addEventListener('mousemove', moveDrag);
            stage.addEventListener('mouseup', endDrag);
          }
        }

        applyState(slides, index);
        startAutoplay();
      });
    }

    window.initOrbitCarousels = initOrbitCarousels;

    const queueOrbitInit = () => {
      try{ initOrbitCarousels(); }
      catch(e){ console.warn('initOrbitCarousels failed', e); }
    };

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scheduleIdle(queueOrbitInit), { once:true });
    else scheduleIdle(queueOrbitInit);

    /* -------------------- Lazy-load videos -------------------- */
    function lazyLoadInlineVideos(){
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Skip videos explicitly marked as "no-mobile" so we don't try to load large hero/background videos on touch devices
      const vids = Array.from(document.querySelectorAll('video')).filter(v => (v.hasAttribute('data-video') || v.hasAttribute('data-src') || v.querySelector('source[src]')) && v.dataset.nomobile !== '1');
      if(!vids.length) return;

      const MAX_AUTOPLAY_ATTEMPTS = 4;
      const RETRY_DELAYS = [450, 900, 1500, 2200];

      const attachAutoplayDiagnostics = ()=>{
        if(window.__lazyVideoDiag) return;
        window.__lazyVideoDiag = {
          events: [],
          log(evt){
            const payload = {
              ts: Date.now(),
              src: evt?.detail?.src || null,
              attempts: evt?.detail?.attempts || 0,
              error: evt?.detail?.error || null
            };
            this.events.push(payload);
            if(this.events.length > 20) this.events.shift();
            if(window.__lazyVideoDiag.verbose) console.info('[lazyVideoDiag]', payload);
          }
        };
        window.addEventListener('lazyVideoAutoplayBlocked', e => window.__lazyVideoDiag.log(e), { passive:true });
      };
      attachAutoplayDiagnostics();

      const reportAutoplayFailure = (v, err, attempts)=>{
        v.dataset.autoplayBlocked = '1';
        if(err && (err.name || err.message)) v.dataset.autoplayError = err.name || err.message;
        const detail = {
          attempts,
          src: v.currentSrc || v.getAttribute('src') || v.dataset.video || v.dataset.src || null,
          error: err ? { name: err.name, message: err.message, code: err.code } : null
        };
        try{ v.dispatchEvent(new CustomEvent('videoAutoplayBlocked', { bubbles:true, detail })); }
        catch(e){ /* noop */ }
        try{ window.dispatchEvent(new CustomEvent('lazyVideoAutoplayBlocked', { detail: Object.assign({ video: v }, detail) })); }
        catch(e){ /* noop */ }
        console.warn('Lazy video autoplay failed', detail);
      };

      const playWithRetry = (v, attempt=0)=>{
        const nextAttempt = attempt + 1;
        v.dataset.playAttempts = String(nextAttempt);
        try{
          const p = v.play();
          if(p && typeof p.then === 'function'){
            p.catch((err)=> {
              if(nextAttempt >= MAX_AUTOPLAY_ATTEMPTS){
                reportAutoplayFailure(v, err, nextAttempt);
                return;
              }
              const delay = RETRY_DELAYS[Math.min(nextAttempt, RETRY_DELAYS.length - 1)] || 900;
              setTimeout(()=> playWithRetry(v, nextAttempt), delay);
            });
          }
        }catch(err){
          if(nextAttempt >= MAX_AUTOPLAY_ATTEMPTS){
            reportAutoplayFailure(v, err, nextAttempt);
            return;
          }
          const delay = RETRY_DELAYS[Math.min(nextAttempt, RETRY_DELAYS.length - 1)] || 900;
          setTimeout(()=> playWithRetry(v, nextAttempt), delay);
        }
      };

      const loadVideo = (v)=>{
        const src = v.getAttribute('data-video') || v.getAttribute('data-src') || (v.querySelector('source') && v.querySelector('source').getAttribute('src')) || v.getAttribute('src');
        if(!src) return false;
        const mime = src.match(/\.mov$/i) ? 'video/quicktime' : 'video/mp4';
        const existing = v.querySelector('source');
        if(existing){
          existing.setAttribute('src', src);
          if(mime) existing.setAttribute('type', mime);
        } else {
          const s = document.createElement('source');
          s.setAttribute('src', src);
          if(mime) s.setAttribute('type', mime);
          v.appendChild(s);
        }
        try{ if(!v.getAttribute('src')) v.setAttribute('src', src); }catch(e){}
        v.setAttribute('playsinline','');
        v.setAttribute('muted','');
        v.setAttribute('loop','');
        v.dataset.loaded = '1';
        try{ v.load(); }catch(e){}

        const motionAllowed = !prefersReduced || v.dataset.motionOk === '1' || v.classList.contains('motion-ok');
        if(!motionAllowed){
          try{ v.removeAttribute('autoplay'); v.pause(); }catch(e){}
          return true;
        }
        playWithRetry(v);
        return true;
      };

      const io = new IntersectionObserver((entries)=>{ entries.forEach(entry=>{
        const v = entry.target;
        if(entry.isIntersecting && !v.dataset.loaded){
          loadVideo(v);
        } else if(!entry.isIntersecting && v.dataset.loaded){
          // do not pause videos explicitly marked as no-pause (e.g., key hero/kolasi videos)
          if(v.dataset.nopause === '1' || v.classList.contains('no-pause')) return;
          try{ v.pause(); }catch(e){}
        }
      }); }, {rootMargin:'200px 0px'});

      vids.forEach(v=> {
        v.addEventListener('error', ()=>{ v.dataset.error = '1'; }, { once:true });
        io.observe(v);
      });

      // Attach hover-play only when explicitly requested via data-hover-play on the wrapper.
      // This avoids accidental autoplay on large sections like Kolasi and reduces CPU/network spikes.
      document.querySelectorAll('[data-hover-play]').forEach(wrap=>{
        const v = wrap.querySelector('video');
        if(!v) return;
        wrap.addEventListener('mouseenter', ()=>{
          if(prefersReduced) return;
          v.play().catch(e => console.warn('video play failed', e));
        });
      });
    }
  // Ensure lazy video loader runs (we're already inside DOMContentLoaded)
  scheduleIdle(()=>{
    try{ lazyLoadInlineVideos(); }
    catch(e){ console.warn('lazyLoadInlineVideos failed', e); }
  });

  /* -------------------- Lazy-load images with data-src -------------------- */
  function lazySwapImages(){
    if(lazySwapImages.__ran) return; lazySwapImages.__ran = true;
    const imgs = Array.from(document.querySelectorAll('img.lazy-img[data-src]'));
    if(!imgs.length) return;
    const io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if(!src) return;
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.remove('lazy-img');
        io.unobserve(img);
      });
    }, { rootMargin:'200px 0px', threshold:0.01 });
    imgs.forEach(img=> io.observe(img));
  }
  scheduleIdle(lazySwapImages);

    /* -------------------- Smooth scroll reveal placeholder -------------------- */
    initRevealSections();

    /* -------------------- GSAP reveals -------------------- */
    function initGSAP(){ if(!window.gsap || !window.ScrollTrigger) return; gsap.registerPlugin(ScrollTrigger); gsap.utils.toArray('.card-pop, .showcase-card').forEach(el=>{ gsap.from(el, { y: 24, opacity: 0, duration: .9, scrollTrigger:{ trigger: el, start:'top 85%' }, ease:'power3.out' }); }); }
    window.addEventListener('load', initGSAP);

    /* -------------------- Barba transitions init -------------------- */
    /* -------------------- Nav: set aria-current dynamically -------------------- */
    (function setNavAriaCurrent(){
      try{
        const links = document.querySelectorAll('nav a[href]');
        // Normalize current location pathname (treat '' as '/')
        const current = (location.pathname || '/').replace(/\/+$/, '') || '/';
        links.forEach(a => {
          try{
            const href = a.getAttribute('href');
            if(!href) return;
            // Resolve relative hrefs to absolute to compare pathnames reliably
            const linkUrl = new URL(href, location.origin);
            const linkPath = (linkUrl.pathname || '/').replace(/\/+$/, '') || '/';
            if(linkPath === current) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
          }catch(e){}
        });
      }catch(e){}
    })();

    try{ refreshLayoutAfterThemeOrLoad(); }
    catch(e){ /* noop */ }

  } // staticInit end

  function initBarba(){
    if(!ENABLE_BARBA || !window.barba) return false;
    const wrapper = document.querySelector('[data-barba="wrapper"]');
    const container = document.querySelector('[data-barba="container"]');
    if(!wrapper || !container) return false;
    barba.hooks.after(() => {
      staticInit.__ran = false;
      staticInit();
    });

    try{
      barba.init({
        transitions: [{
          name: 'opacity-transition',
          leave(data){ return gsap.to(data.current.container, { opacity:0, duration:0.35 }); },
          enter(data){ return gsap.from(data.next.container, { opacity:0, duration:0.35 }); }
        }]
      });
    }catch(e){
      console.warn('Barba init failed, falling back to static init', e);
      staticInit.__ran = false;
      runStaticInit();
      return false;
    }
    return true;
  }

  function runStaticInit(){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', staticInit, { once:true });
    else staticInit();
  }

  function boot(){
    if(ENABLE_BARBA && window.barba){
      try{
        const started = initBarba();
        if(started){
          runStaticInit();
          return;
        }
      }catch(e){
        console.warn('Barba init failed, falling back to static init', e);
        runStaticInit();
        return;
      }
    }
    runStaticInit();
  }

  boot();

  // Initialization to enforce video attributes globally (after DOMContentLoaded handler closure)
  (function enforceVideoAttrs(){
    try{
      const videos = Array.from(document.querySelectorAll('video'));
      videos.forEach(v => {
        try{
          // Do not force autoplay or inject sources globally; allow lazy loader to manage when videos should load.
          v.muted = true; v.playsInline = true;
          // mark no-pause based on class
          if(v.classList.contains('no-pause')) v.dataset.nopause = '1';
        }catch(e){ /* noop */ }
      });
    }catch(e){ /* noop */ }
  })();

  /* -------------------- Video play/pause controls & single-play enforcement -------------------- */
  (function(){
    function isExempt(v){
      if(!v) return false;
      return (v.classList && (v.classList.contains('no-pause') || v.classList.contains('autoplay-keep'))) || v.getAttribute('data-kolasi-autoplay') === '1' || v.dataset && v.dataset.nopause === '1';
    }

    function ensureSrc(v){
      if(!v || v.dataset.loaded) return;
      const src = v.getAttribute('data-video') || v.getAttribute('data-src');
      if(!src) return;
      const existing = v.querySelector('source');
      const mime = src.match(/\.mov$/i)? 'video/quicktime' : 'video/mp4';
      if(existing){ existing.setAttribute('src', src); if(mime) existing.setAttribute('type', mime); }
      else { const s = document.createElement('source'); s.setAttribute('src', src); if(mime) s.setAttribute('type', mime); v.appendChild(s); }
      try{ if(!v.getAttribute('src')) v.setAttribute('src', src); }catch(e){}
      try{ v.load(); }catch(e){}
      v.dataset.loaded = '1';
    }

    function setupControls(){
      const vids = Array.from(document.querySelectorAll('video.lazy-video'));
      if(!vids.length) return;
      vids.forEach(v => {
        try{
          // skip exempt videos (hero, autoplay-keep) â€” they may autoplay by design
          if(isExempt(v)) return;
          // remove autoplay to avoid multiple auto-playing instances
          v.removeAttribute('autoplay');

          // Ensure video is keyboard-focusable for accessibility
          if(!v.hasAttribute('tabindex')) v.setAttribute('tabindex','0');

          // Click the video to toggle play/pause (no injected overlay button)
          v.addEventListener('click', function(e){
            // ignore clicks intended for native controls
            if(e.target && e.target.controls) return;
            ensureSrc(v);
            // pause other non-exempt videos on the page
            Array.from(document.querySelectorAll('video.lazy-video')).forEach(function(o){ if(o === v) return; if(isExempt(o)) return; try{ if(!o.paused) o.pause(); }catch(e){} });
            try{ if(v.paused) v.play().catch(e => console.warn('video play failed', e)); else v.pause(); }catch(e){}
          });

          // keyboard support: Enter or Space toggles play/pause
          v.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); v.click(); } });

          // minimal state attribute for styling hooks if needed
          v.addEventListener('play', function(){ v.setAttribute('data-playing','1'); });
          v.addEventListener('pause', function(){ v.removeAttribute('data-playing'); });

        }catch(e){ /* fail gracefully */ }
      });
    }

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupControls); else setupControls();
  })();

  /* -------------------- Theme default guard -------------------- */
  (function(){
    try{
      const html = document.documentElement;
      const storedTheme = localStorage.getItem('theme');
      if(!storedTheme){
        try{ localStorage.setItem('theme','dark'); }catch(e){}
        if(!html.classList.contains('dark') && !html.classList.contains('light')){
          html.classList.add('dark');
          if(document.body) document.body.classList.add('dark');
        }
      }
    }catch(e){ console.warn('theme default guard failed', e); }
  })();

  /* -------------------- iOS mobile hero video fallback -------------------- */
  // moved to `js/home.js` so other pages are not forced to load hero assets
})();
