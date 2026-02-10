(function(){
  'use strict';

  const scheduleIdle = (cb, timeout = 600) => {
    if(typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout });
    else setTimeout(cb, 1);
  };

  const HOME_CLASS = 'home-page';

  const onReady = (fn) => {
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
    else fn();
  };

  function isHome(){
    const body = document.body;
    return !!(body && body.classList.contains(HOME_CLASS));
  }


  function initCinematicModal(){
    const modal = document.getElementById('cinematicModal');
    const video = document.getElementById('cinematicVideo');
    if(!modal || !video) return;
    const closeBtn = modal.querySelector('.modal-close');
    let lastFocused = null;

    function lockScroll(){ try{ document.body.classList.add('no-scroll'); }catch(e){/* noop */} }
    function unlockScroll(){ try{ document.body.classList.remove('no-scroll'); }catch(e){/* noop */} }

    function trapTabKey(e){
      if(e.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(Boolean);
      if(!focusable.length){ e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }

    function onKeyDown(e){
      if(e.key === 'Escape') closeModal();
      else if(e.key === 'Tab') trapTabKey(e);
    }

    function onBackdropClick(e){ if(e.target === modal) closeModal(); }

    function openModal(src){
      if(!src) return;
      lastFocused = document.activeElement;
      modal.setAttribute('aria-hidden','false');
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.style.display = 'block';
      lockScroll();
      try{
        video.setAttribute('src', src);
        video.load();
        video.play().catch(err => console.warn('video play failed', err));
      }catch(e){/* noop */}
      if(window.gsap){
        try{
          gsap.killTweensOf(modal);
          gsap.fromTo(modal, { opacity:0, scale:0.98 }, { opacity:1, scale:1, duration:0.42, ease:'power3.out' });
        }catch(e){/* noop */}
      }else{
        modal.classList.add('modal-animating');
        setTimeout(() => modal.classList.remove('modal-animating'), 420);
      }
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      (focusable[0] || closeBtn || modal).focus();
      document.addEventListener('keydown', onKeyDown);
      modal.addEventListener('click', onBackdropClick);
    }

    function closeModal(){
      document.removeEventListener('keydown', onKeyDown);
      modal.removeEventListener('click', onBackdropClick);
      const cleanup = () => {
        try{
          video.pause();
          video.removeAttribute('src');
          video.load();
        }catch(e){/* noop */}
        modal.setAttribute('aria-hidden','true');
        modal.style.display = 'none';
        unlockScroll();
        if(lastFocused && lastFocused.focus) lastFocused.focus();
      };
      if(window.gsap){
        try{
          gsap.killTweensOf(modal);
          gsap.to(modal, { opacity:0, scale:0.98, duration:0.32, ease:'power3.in', onComplete: cleanup });
          return;
        }catch(e){/* noop */}
      }else{
        modal.classList.add('modal-animating');
        setTimeout(() => {
          modal.classList.remove('modal-animating');
          cleanup();
        }, 320);
        return;
      }
      cleanup();
    }

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const src = btn.getAttribute('data-open-modal');
        if(!src) return;
        openModal(src);
      });
    });
    closeBtn && closeBtn.addEventListener('click', () => closeModal());
  }

  function initGSAP(){
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-title', { y: 24, opacity: 0, duration: 1.0, ease: 'power3.out' });
    gsap.from('.hero-sub', { y: 12, opacity: 0, duration: 0.9, delay: 0.12, ease: 'power3.out' });
    gsap.from('.rounded-cta', {
      y: 10,
      opacity: 0,
      duration: 0.8,
      delay: 0.28,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform'
    });
    gsap.utils.toArray('.card-pop, .showcase-card').forEach(el => {
      gsap.from(el, { y: 24, opacity: 0, duration: 0.9, scrollTrigger:{ trigger: el, start:'top 85%' }, ease:'power3.out' });
    });
  }

  function initHeroPosterReveal(){
    try{
      const html = document.documentElement;
      const storedTheme = localStorage.getItem('theme');
      if(!storedTheme){
        try{ localStorage.setItem('theme','dark'); }catch(e){/* noop */}
        if(!html.classList.contains('dark') && !html.classList.contains('light')){
          html.classList.add('dark');
          if(document.body) document.body.classList.add('dark');
        }
      }
      const heroVideo = document.querySelector('video.hero__video') || document.querySelector('video[data-hero-video]') || document.querySelector('header.hero video');
      if(!heroVideo) return;
      const hero = heroVideo.closest ? heroVideo.closest('.hero') : document.querySelector('.hero');
      const poster = hero ? hero.querySelector('.hero__poster') : document.querySelector('.hero__poster');
      const allowMobile = heroVideo.hasAttribute('data-mobile-play') || heroVideo.dataset.mobilePlay === '1';
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const smallScreen = window.innerWidth && window.innerWidth < 640;
      if(isTouch || smallScreen){
        if(!allowMobile){
          try{ heroVideo.dataset.nomobile = '1'; }catch(e){/* noop */}
          if(hero && poster){
            try{
              hero.classList.remove('video-ready');
              poster.style.opacity = '1';
              poster.style.pointerEvents = 'auto';
            }catch(e){/* noop */}
          }
          return;
        }
        try{
          delete heroVideo.dataset.nomobile;
          heroVideo.removeAttribute('data-nomobile');
        }catch(e){/* noop */}
      }
      if(!hero || !poster) return;
      function reveal(){
        try{
          hero.classList.add('video-ready');
          poster.style.opacity = '0';
          poster.style.pointerEvents = 'none';
        }catch(e){/* noop */}
      }
      heroVideo.addEventListener('playing', reveal, { once:true });
      heroVideo.addEventListener('canplay', () => setTimeout(reveal, 180), { once:true });
      setTimeout(() => { if(!hero.classList.contains('video-ready')) reveal(); }, 2200);
    }catch(e){ console.warn('hero poster reveal failed', e); }
  }

  function ensureMobileHeroSrc(){
    try{
      const isiOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform && /iPhone|iPad|iPod/.test(navigator.platform));
      if(!isiOS) return;
      const vids = Array.from(document.querySelectorAll('video[data-mobile-play="1"], video[data-mobile-play="true"]'));
      vids.forEach(v => {
        try{
          if(v.dataset && v.dataset.loaded) return;
          const src = v.getAttribute('data-src') || v.getAttribute('data-video');
          if(!src) return;
          let existing = v.querySelector('source');
          if(!existing){
            existing = document.createElement('source');
            v.appendChild(existing);
          }
          existing.setAttribute('src', src);
          existing.setAttribute('type', src.match(/\.mov$/i) ? 'video/quicktime' : 'video/mp4');
          if(!v.getAttribute('src')) v.setAttribute('src', src);
          v.setAttribute('playsinline','');
          v.setAttribute('webkit-playsinline','');
          v.setAttribute('muted','');
          v.setAttribute('loop','');
          try{ v.load(); }catch(e){/* noop */}
          document.addEventListener('touchstart', function onFirstTouch(){
            try{ v.play().catch(() => {}); }catch(e){/* noop */}
            document.removeEventListener('touchstart', onFirstTouch);
          }, { once:true });
        }catch(e){/* noop */}
      });
    }catch(e){/* noop */}
  }

  onReady(() => {
    if(!isHome()) return;
    scheduleIdle(() => { if(window.initOrbitCarousels) window.initOrbitCarousels(); });
    initCinematicModal();
    initHeroPosterReveal();
    ensureMobileHeroSrc();
    if(document.readyState === 'complete') initGSAP();
    else window.addEventListener('load', initGSAP, { once:true });
  });
})();
