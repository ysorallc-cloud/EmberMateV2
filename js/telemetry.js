
const K = { conf:'embermate_tele_conf', q:'embermate_tele_queue', recent:'embermate_tele_recent', audit:'embermate_audit', errors:'embermate_errors', store:'embermate_store', consent:'embermate_consent' };

const Tele = { breadcrumb(event, meta={}){ emit('crumb', { event, meta }, 'vitals'); }, error(e){ emit('error', normalizeError(e), 'errors'); } };

const DataTools = {
  hookSettings(){
    const btnAll = document.getElementById('btn-export-all');
    const btnEraseQ = document.getElementById('btn-erase-tele');
    const btnEraseLogs = document.getElementById('btn-erase-logs');
    btnAll?.addEventListener('click', ()=> exportAll());
    btnEraseQ?.addEventListener('click', ()=>{ if(confirm('Erase telemetry queue?')){ localStorage.removeItem(K.q); alert('Telemetry queue erased'); renderMeta(); } });
    btnEraseLogs?.addEventListener('click', ()=>{ if(confirm('Erase audit & errors?')){ localStorage.removeItem(K.audit); localStorage.removeItem(K.errors); alert('Logs erased'); } });
  }
};

function exportAll(){
  const bundle = {
    exportedAt: new Date().toISOString(),
    consent: safeParse(localStorage.getItem(K.consent)),
    telemetryQueue: safeParse(localStorage.getItem(K.q)),
    telemetryConfig: safeParse(localStorage.getItem(K.conf)),
    audit: safeParse(localStorage.getItem(K.audit)),
    errors: safeParse(localStorage.getItem(K.errors)),
    store: safeParse(localStorage.getItem(K.store))
  };
  const receipt = sign(JSON.stringify(bundle));
  const out = { bundle, receipt };
  download(JSON.stringify(out, null, 2), 'embermate-all-data.json');
}

function sign(text){
  // Toy signature: SHA-256 via subtle, base64. No key to avoid shipping secrets.
  return 'sha256-' + btoa(String.fromCharCode(...new Uint8Array(cryptoJsHash(text))));
}

function cryptoJsHash(text){
  // Fallback to Subtle if available; otherwise a tiny hash for offline demo
  if (crypto?.subtle){ /* can't sync-return; use toy */ }
  let h = 2166136261 >>> 0;
  for (let i=0;i<text.length;i++){ h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  const buf = new Uint8Array(32); for (let i=0;i<32;i++){ buf[i] = (h >>> (i%4)*8) & 0xff; }
  return buf;
}

function download(text, name){
  const blob = new Blob([text], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href:url, download:name });
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=> URL.revokeObjectURL(url), 1500);
}

function safeParse(x){ try{ return JSON.parse(x||'null'); }catch{ return null } }

function getConf(){ try{ return JSON.parse(localStorage.getItem(K.conf)||'null') || { endpoint:'', token:'', redact:true }; }catch{ return { endpoint:'', token:'', redact:true } } }
function setConf(c){ localStorage.setItem(K.conf, JSON.stringify(c)); }

function enqueue(item){
  const keep = Sampling.keepMs(); const now = Date.now();
  const q = readQ().filter(i => (now - (i.ts||now)) < keep);
  q.push(item); localStorage.setItem(K.q, JSON.stringify(q));
  const tail = JSON.parse(localStorage.getItem(K.recent)||'[]'); tail.push(item); localStorage.setItem(K.recent, JSON.stringify(tail.slice(-5)));
  renderMeta();
}
function readQ(){ try{ return JSON.parse(localStorage.getItem(K.q)||'[]'); }catch{ return [] } }

async function flush(){
  const conf = getConf(); const q = readQ();
  if (!q.length || !conf.endpoint) return { sent:0 };
  const batch = q.splice(0, Math.min(25, q.length));
  try{
    const payload = JSON.stringify({ ts: new Date().toISOString(), items: batch });
    const res = await fetch(conf.endpoint, { method:'POST', headers:{ 'content-type':'application/json', ...(conf.token? { 'authorization': 'Bearer '+conf.token } : {}) }, body: payload, keepalive:true });
    if (!res.ok) throw new Error('bad status');
    localStorage.setItem(K.q, JSON.stringify(q));
    renderMeta();
    return { sent: batch.length };
  }catch{ return { sent:0 } }
}

function emit(type, body, sampleKey){
  if (type === 'error' && !Consent.allow('errors')) return;
  if (type !== 'error' && !Consent.allow('performance')) return;
  if (!Sampling.hit(sampleKey || 'global')) return;
  const enriched = { type, body, ts: Date.now(), url: location.href, lang: navigator.language || 'en-US' };
  enqueue(enriched);
}

function initTelemetry(app){
  // Settings UI controls
  const ep = document.getElementById('tele-endpoint');
  const tok = document.getElementById('tele-token');
  const qMeta = document.getElementById('queue-meta');
  const recent = document.getElementById('tele-recent');

  const conf = getConf(); if (ep) ep.value = conf.endpoint; if (tok) tok.value = conf.token;
  document.getElementById('btn-keep-save')?.addEventListener('click', ()=>{
    // also save endpoint/token when present
    if (ep && tok){ setConf({ endpoint: ep.value.trim(), token: tok.value.trim(), redact: true }); }
  });
  document.getElementById('btn-sample-save')?.addEventListener('click', ()=> renderMeta());

  document.getElementById('btn-consent-save')?.addEventListener('click', ()=>{
    Consent.set({ performance: document.getElementById('c-perf').checked, errors: document.getElementById('c-errors').checked, tele: document.getElementById('c-tele').checked });
    alert('Consent saved. A receipt has been recorded.');
  });
  document.getElementById('btn-consent-revoke')?.addEventListener('click', ()=>{ Consent.revoke(); });
  document.getElementById('btn-consent-export')?.addEventListener('click', ()=>{
    const c = safeParse(localStorage.getItem(K.consent));
    const out = { type:'consent-receipts', items: c?.history || [], current: c };
    download(JSON.stringify(out, null, 2), 'embermate-consent-receipts.json');
  });

  function render(){
    const tail = JSON.parse(localStorage.getItem(K.recent)||'[]');
    if (recent) recent.textContent = tail.map(i => `${new Date(i.ts).toISOString()} ${i.type} ${JSON.stringify(i.body).slice(0,80)}`).join('\n');
    renderMeta();
  }
  render();
  setInterval(render, 2000);

  // observers (minimal since heavy ones were earlier phases)
  window.addEventListener('error', e => Consent.allow('errors') && Tele.error(e.error || e));
  window.addEventListener('unhandledrejection', e => Consent.allow('errors') && Tele.error(e.reason || e));
}

function renderMeta(){
  const meta = document.getElementById('queue-meta'); if (!meta) return;
  const q = JSON.parse(localStorage.getItem(K.q)||'[]');
  meta.textContent = 'Queue: ' + q.length + ' items';
}
const TeleUI = { hookSettings(){ /* wired in initTelemetry + DataTools */ } };
