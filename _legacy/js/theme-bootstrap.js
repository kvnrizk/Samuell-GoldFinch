// Early theme bootstrap: enforce persisted theme before CSS loads
(function(){
  try{
    var doc = document;
    var html = doc.documentElement;
    var body = doc.body;
    var stored = localStorage.getItem('theme');
    var initial = stored || 'dark';
    if(!stored) localStorage.setItem('theme', initial);

    function applyTheme(target){
      if(!target) return;
      target.classList.remove('light','dark');
      target.classList.add(initial);
    }

    applyTheme(html);
    if(body) applyTheme(body);
    else doc.addEventListener('DOMContentLoaded', function once(){
      applyTheme(doc.body);
    }, { once: true });
  }catch(e){ /* noop */ }
})();
