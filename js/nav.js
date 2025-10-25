function initNav(app){
  console.log('[nav.js] Initializing navigation...');
  
  function q(s){ return document.querySelector(s); }
  
  const pages = { 
    dashboard: q('#page-dashboard'), 
    medications: q('#page-medications'), 
    vitals: q('#page-vitals'),
    weight: q('#page-weight'),
    goals: q('#page-goals'),
    reports: q('#page-reports'),
    settings: q('#page-settings') 
  };
  
  // Check which pages are missing and log them
  Object.entries(pages).forEach(([k, el]) => {
    if (!el) {
      console.error('[nav.js] Missing page element:', k);
    }
  });
  
  console.log('[nav.js] Page elements found:', Object.entries(pages).map(([k,v]) => `${k}: ${!!v}`).join(', '));
  
  const links = [...document.querySelectorAll('[data-nav]')];
  function show(hash){
    const id = (hash || '#dashboard').slice(1);
    console.log('[nav.js] Switching to page:', id);
    Object.entries(pages).forEach(([k,el])=>{
      console.log('[nav.js] Checking page:', k, 'element:', !!el);
      const on = k === id; 
      if (el) {
        el.hidden = !on;
        console.log('[nav.js] Page', k, 'hidden:', !on);
      } else {
        console.error('[nav.js] Page element not found:', k, '- skipping');
      }
      const link = links.find(a => a.getAttribute('href') === '#' + k); 
      if (link) {
        link.setAttribute('aria-current', on ? 'page' : 'false');
      }
    });
    document.dispatchEvent(new CustomEvent('page:change', { detail:{ id } }));
    
    // Call the appropriate load function
    if (window.loadPage && typeof window.loadPage === 'function') {
      console.log('[nav.js] Calling loadPage for:', id);
      window.loadPage(id);
    }
  }
  links.forEach(a => a.addEventListener('click', e=>{ e.preventDefault(); history.replaceState(null,'',a.getAttribute('href')); show(a.getAttribute('href')); }));
  window.addEventListener('hashchange', ()=> show(location.hash));
  show(location.hash || '#dashboard');
}
