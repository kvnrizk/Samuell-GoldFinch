const EFFECTIVE_SLOW_TYPES = new Set(['slow-2g', '2g']);

function shouldReduceMotion(){
  try{
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }catch(e){
    return false;
  }
}

function hasSlowConnection(){
  try{
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if(!connection || !connection.effectiveType) return false;
    return EFFECTIVE_SLOW_TYPES.has(connection.effectiveType.toLowerCase());
  }catch(e){
    return false;
  }
}

function loadVideo(video){
  if(video.dataset.heroLoaded) return;
  video.dataset.heroLoaded = '1';
  try{ video.load(); }catch(e){ /* noop */ }
}

function playVideo(video){
  try{
    const playPromise = video.play();
    if(playPromise && typeof playPromise.catch === 'function'){
      playPromise.catch(() => {});
    }
  }catch(e){ /* noop */ }
}

function pauseVideo(video){
  try{
    video.pause();
  }catch(e){ /* noop */ }
}

export function initHeroAutoplay(){
  const video = document.querySelector('video[data-hero-video]');
  if(!video) return;

  const reduceMotion = shouldReduceMotion();
  const slowConnection = hasSlowConnection();

  if(reduceMotion || slowConnection){
    video.removeAttribute('autoplay');
    video.removeAttribute('loop');
    pauseVideo(video);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        loadVideo(video);
        playVideo(video);
      }else{
        pauseVideo(video);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(video);

  document.addEventListener('visibilitychange', () => {
    if(document.hidden){
      pauseVideo(video);
    }else{
      playVideo(video);
    }
  });
}
