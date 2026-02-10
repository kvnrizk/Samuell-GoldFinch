(function(){
  'use strict';

  const scheduleIdle = (cb, timeout = 600) => {
    if(typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout });
    else setTimeout(cb, 1);
  };

  const onReady = (fn) => {
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
    else fn();
  };


  function initGalleryClassification(){
    const figures = document.querySelectorAll('.gallery-grid figure');
    if(!figures.length) return;
    figures.forEach(fig => {
      const img = fig.querySelector('img');
      if(!img) return;
      const classify = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if(!w || !h) return;
        const ratio = w / h;
        fig.classList.remove('portrait','landscape','square');
        if(ratio > 1.15) fig.classList.add('landscape');
        else if(ratio < 0.9) fig.classList.add('portrait');
        else fig.classList.add('square');
      };
      if(img.complete) classify();
      else img.addEventListener('load', classify, { once:true });
    });
  }

  function initBlazeLightbox(){
    const lightbox = document.getElementById('blazeLightbox');
    const lbImg = document.getElementById('blazeLightboxImg');
    if(!lightbox || !lbImg) return;
    const figures = Array.from(document.querySelectorAll('.gallery-grid figure'));
    if(!figures.length) return;
    let currentIndex = -1;
    let lastFocused = null;

    function openLightbox(idx){
      if(idx < 0 || idx >= figures.length) return;
      const fig = figures[idx];
      const img = fig.querySelector('img'); if(!img) return;
      lastFocused = document.activeElement;
      currentIndex = idx;
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbImg.style.width = '';
      lbImg.style.height = '';
      lbImg.onload = function(){
        try{
          const iw = lbImg.naturalWidth || lbImg.width;
          const ih = lbImg.naturalHeight || lbImg.height;
          if(iw && ih){
            if(ih > iw){
              lbImg.style.width = 'auto';
              lbImg.style.height = '86vh';
            }else{
              lbImg.style.width = '92vw';
              lbImg.style.height = 'auto';
            }
          }
        }catch(e){ /* noop */ }
      };
      lightbox.removeAttribute('hidden');
      lightbox.setAttribute('aria-hidden','false');
      lightbox.style.display = 'flex';
      document.body.classList.add('no-scroll');
      const close = lightbox.querySelector('.lb-close');
      if(close) close.focus();
      document.addEventListener('keydown', onKey);
    }

    function closeLightbox(){
      lightbox.setAttribute('aria-hidden','true');
      lightbox.style.display = 'none';
      lightbox.setAttribute('hidden','');
      lbImg.src = '';
      lbImg.onload = null;
      lbImg.style.width = '';
      lbImg.style.height = '';
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
      if(lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function showNext(dir){
      let next = currentIndex + dir;
      if(next < 0) next = figures.length - 1;
      if(next >= figures.length) next = 0;
      openLightbox(next);
    }

    function onKey(e){
      if(e.key === 'Escape') closeLightbox();
      else if(e.key === 'ArrowRight') showNext(1);
      else if(e.key === 'ArrowLeft') showNext(-1);
    }

    const btnClose = lightbox.querySelector('.lb-close');
    const btnPrev = lightbox.querySelector('.lb-prev');
    const btnNext = lightbox.querySelector('.lb-next');
    btnClose && btnClose.addEventListener('click', closeLightbox);
    btnPrev && btnPrev.addEventListener('click', ()=> showNext(-1));
    btnNext && btnNext.addEventListener('click', ()=> showNext(1));
    lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
  }

  function forceBlazeProductionVisible(){
    const bp = document.getElementById('blaze-production');
    if(!bp || bp.__forcedVisible) return;
    const forceVisible = () => {
      if(bp.__forcedVisible) return;
      bp.__forcedVisible = true;
      try{
        bp.classList.add('is-visible');
        bp.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      }catch(e){ /* noop */ }
    };
    requestAnimationFrame(forceVisible);
    window.addEventListener('load', forceVisible, { once:true });
  }

  function loadHeroAutoplayModule(){
    scheduleIdle(() => {
      import('./js/heroAutoplay.js')
        .then(mod => {
          if(mod && typeof mod.initHeroAutoplay === 'function') mod.initHeroAutoplay();
        })
        .catch(err => console.warn('hero autoplay module failed', err));
    }, 900);
  }

  function shouldRun(){
    return document.body && (document.body.classList.contains('blaze-page') || document.querySelector('.blaze-section') || document.querySelector('[data-orbit-carousel]'));
  }

  function boot(){
    if(!shouldRun()) return;
    initGalleryClassification();
    initBlazeLightbox();
    forceBlazeProductionVisible();
    if(typeof window.initOrbitCarousels === 'function') window.initOrbitCarousels();
    loadHeroAutoplayModule();
  }

  onReady(() => requestAnimationFrame(boot));
})();
