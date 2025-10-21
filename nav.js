export function initNav(app){
  const pages = { overview: q('#page-overview'), records: q('#page-records'), settings: q('#page-settings') };
  const links = [...document.querySelectorAll('[data-nav]')];
  function q(s){ return document.querySelector(s); }
  function show(hash){
    const id = (hash || '#overview').slice(1);
    Object.entries(pages).forEach(([k,el])=>{
      const on = k === id; el.hidden = !on;
      const link = links.find(a => a.getAttribute('href') === '#' + k); link?.setAttribute('aria-current', on ? 'page' : 'false');
    });
    document.dispatchEvent(new CustomEvent('page:change', { detail:{ id } }));
  }
  links.forEach(a => a.addEventListener('click', e=>{ e.preventDefault(); history.replaceState(null,'',a.getAttribute('href')); show(a.getAttribute('href')); }));
  window.addEventListener('hashchange', ()=> show(location.hash));
  show(location.hash || '#overview');
}