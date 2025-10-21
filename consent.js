export const Consent = {
  key: 'embermate_consent',
  version: 2,
  init(){
    migrateIfNeeded();
    const saved = this.get();
    if (!saved || saved.version !== this.version){
      const def = geoDefaults();
      localStorage.setItem(this.key, JSON.stringify(def));
      showBanner('Consent policy updated. Please review your choices.');
    }
    // wire banner
    document.getElementById('consent-accept')?.addEventListener('click', ()=>{
      this.set({ necessary:true, performance:true, errors:true, tele:true });
      hideBanner();
    });
    document.getElementById('consent-customize')?.addEventListener('click', ()=>{ location.hash = '#settings'; hideBanner(); });
  },
  get(){ try{ return JSON.parse(localStorage.getItem(this.key) || 'null'); }catch{ return null } },
  set(patch){
    const prev = this.get() || geoDefaults();
    const next = { ...prev, ...patch, version: this.version, ts: Date.now() };
    // append receipt
    const receipt = { ts: new Date().toISOString(), version: this.version, region: regionHint(), choices: { necessary:true, performance:!!next.performance, errors:!!next.errors, tele:!!next.tele }, ua: navigator.userAgent, lang: navigator.language || 'en-US' };
    const hist = Array.isArray(next.history) ? next.history : [];
    next.history = hist.concat([receipt]).slice(-50);
    localStorage.setItem(this.key, JSON.stringify(next));
  },
  revoke(){ localStorage.removeItem(this.key); showBanner('Consent reset. Choose your preferences.'); },
  allow(cat){ const c = this.get(); if (!c) return false; if (cat==='performance') return !!c.performance; if (cat==='errors') return !!c.errors; if (cat==='tele') return !!c.tele; return !!c.necessary; }
};

function regionHint(){
  try{
    const lang = navigator.language || 'en-US';
    const region = lang.split('-')[1] || 'US';
    return region.toUpperCase();
  }catch{ return 'US' }
}

function euLike(r){ return ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO'].includes(r); }

function geoDefaults(){
  const dnt = (navigator.doNotTrack == '1' || window.doNotTrack == '1');
  const r = regionHint();
  const eu = euLike(r);
  return { version: 2, necessary: true, performance: !dnt && !eu, errors: !dnt && !eu, tele: !dnt && !eu, ts: Date.now(), history: [] };
}

function migrateIfNeeded(){
  try{
    const raw = localStorage.getItem('embermate_consent'); if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj && !obj.version){
      const migrated = { version: 2, necessary: true, performance: !!obj.performance, errors: !!obj.errors, tele: !!obj.tele, ts: Date.now(), history: [{ ts: new Date().toISOString(), version: 2, migrated: true, from: 1, choices: { performance: !!obj.performance, errors: !!obj.errors, tele: !!obj.tele } }] };
      localStorage.setItem('embermate_consent', JSON.stringify(migrated));
      showBanner('We updated our consent model. Please confirm your choices.');
    }
  }catch{}
}

function showBanner(note){
  document.getElementById('consent-version-note').textContent = note || '';
  document.getElementById('consent-banner')?.classList.remove('hidden');
}
function hideBanner(){ document.getElementById('consent-banner')?.classList.add('hidden'); }
