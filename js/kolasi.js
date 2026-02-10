(function(){
  'use strict';

  function onReady(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
    else fn();
  }

  function ensureVideoSource(video){
    if(!video) return false;
    if(video.dataset && video.dataset.loaded === '1') return true;
    const src = video.getAttribute('data-src') || video.getAttribute('data-video') || video.getAttribute('src');
    if(!src) return false;
    let source = video.querySelector('source');
    if(!source){
      source = document.createElement('source');
      video.appendChild(source);
    }
    if(source.getAttribute('src') !== src) source.setAttribute('src', src);
    const mime = /\.mov$/i.test(src) ? 'video/quicktime' : 'video/mp4';
    source.setAttribute('type', mime);
    if(video.getAttribute('src') !== src) video.setAttribute('src', src);
    try{ video.load(); }
    catch(e){ /* no-op */ }
    if(video.dataset) video.dataset.loaded = '1';
    return true;
  }

  function initKolasiShowcaseControls(){
    const heading = Array.from(document.querySelectorAll('section.kolasi-section h2')).find(h => /Kolasi Showcase/i.test((h.textContent || '').trim()));
    const section = heading ? heading.closest('section') : null;
    if(!section) return;
    const vids = Array.from(section.querySelectorAll('video.lazy-video'));
    if(!vids.length) return;
    vids.forEach(v => {
      if(!v.hasAttribute('tabindex')) v.setAttribute('tabindex','0');
      const toggle = (evt) => {
        if(evt && evt.target && evt.target.controls) return;
        ensureVideoSource(v);
        try{
          if(v.paused) v.play().catch(()=>{});
          else v.pause();
        }catch(e){ /* ignore */ }
      };
      v.addEventListener('click', toggle);
      v.addEventListener('keydown', (evt) => {
        if(evt.key === 'Enter' || evt.key === ' '){
          evt.preventDefault();
          toggle(evt);
        }
      });
    });
  }

  function initContentCreationLoop(){
    const vid = document.getElementById('contentCreationVid');
    if(!vid || vid.__kolasiLoopInit) return;
    vid.__kolasiLoopInit = true;
    const loopEnd = 19;
    const handleTimeUpdate = () => {
      if(vid.currentTime >= loopEnd){
        try{
          vid.currentTime = 0;
          vid.play().catch(()=>{});
        }catch(e){ /* ignore */ }
      }
    };
    const attach = () => {
      try{
        vid.currentTime = 0;
        vid.play().catch(()=>{});
      }catch(e){ /* ignore */ }
      vid.addEventListener('timeupdate', handleTimeUpdate);
    };
    if(vid.dataset && vid.dataset.loaded === '1') attach();
    else if(window.MutationObserver){
      const observer = new MutationObserver(() => {
        if(vid.dataset && vid.dataset.loaded === '1'){
          observer.disconnect();
          attach();
        }
      });
      observer.observe(vid, { attributes:true, attributeFilter:['data-loaded'] });
    }
  }

  function initPartialLoopClips(){
    const clips = Array.from(document.querySelectorAll('video[data-loop-end]'));
    if(!clips.length) return;
    clips.forEach(clip => {
      if(clip.__kolasiPartialLoop) return;
      const limit = parseFloat(clip.dataset.loopEnd);
      if(!Number.isFinite(limit) || limit <= 0) return;
      clip.__kolasiPartialLoop = true;
      clip.addEventListener('timeupdate', () => {
        if(clip.currentTime >= limit){
          try{
            clip.currentTime = 0;
            clip.play().catch(()=>{});
          }catch(e){ /* ignore */ }
        }
      });
      clip.addEventListener('loadedmetadata', () => {
        if(clip.currentTime >= limit){
          try{ clip.currentTime = 0; }
          catch(e){ /* ignore */ }
        }
      });
    });
  }

  function initLoopPauseObserver(){
    if(!('IntersectionObserver' in window)) return;
    const vids = Array.from(document.querySelectorAll('video.lazy-video[loop]'));
    if(!vids.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if(video.classList && video.classList.contains('no-pause')) return;
        try{
          if(!entry.isIntersecting && !video.paused) video.pause();
        }catch(e){ /* ignore */ }
      });
    }, { threshold:0.25 });
    vids.forEach(video => observer.observe(video));
  }

  function initKolasiHeroVideo(){
    const heroVideo = document.querySelector('.kolasi-page video.hero-video');
    if(!heroVideo || heroVideo.__kolasiHeroInit) return;
    heroVideo.__kolasiHeroInit = true;
    const ensureAttributes = () => {
      heroVideo.muted = true;
      heroVideo.loop = true;
      heroVideo.playsInline = true;
      heroVideo.setAttribute('muted','');
      heroVideo.setAttribute('loop','');
      heroVideo.setAttribute('playsinline','');
      heroVideo.setAttribute('webkit-playsinline','');
      heroVideo.setAttribute('autoplay','');
    };
    const revealControls = () => {
      try{
        heroVideo.controls = true;
        heroVideo.setAttribute('controls','');
      }catch(e){ /* ignore */ }
    };
    const attemptPlay = () => {
      ensureVideoSource(heroVideo);
      ensureAttributes();
      try{
        const maybe = heroVideo.play();
        if(maybe && typeof maybe.then === 'function') maybe.catch(revealControls);
      }catch(e){ revealControls(); }
    };

    ensureVideoSource(heroVideo);
    ensureAttributes();
    heroVideo.addEventListener('canplay', attemptPlay);
    heroVideo.addEventListener('loadeddata', attemptPlay);
    heroVideo.addEventListener('error', revealControls);
    heroVideo.addEventListener('stalled', revealControls);

    document.addEventListener('touchstart', function handleFirstTouch(){
      attemptPlay();
      document.removeEventListener('touchstart', handleFirstTouch);
    }, { once:true });
  }

  function boot(){
    if(!document.body || !document.body.classList.contains('kolasi-page')) return;
    initKolasiHeroVideo();
    initKolasiShowcaseControls();
    initContentCreationLoop();
    initPartialLoopClips();
    initLoopPauseObserver();
  }

  onReady(() => requestAnimationFrame(boot));
})();
