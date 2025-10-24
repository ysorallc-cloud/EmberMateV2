// REMOVE these two import lines completely:
// import { Consent } from './consent.js';
// import { Sampling } from './sampling.js';

const K = { conf:'embermate_tele_conf', q:'embermate_tele_queue', recent:'embermate_tele_recent', audit:'embermate_audit', errors:'embermate_errors', store:'embermate_store', consent:'embermate_consent' };

// REMOVE 'export' here:
const Tele = { breadcrumb(event, meta={}){ emit('crumb', { event, meta }, 'vitals'); }, error(e){ emit('error', normalizeError(e), 'errors'); } };

// REMOVE 'export' here:
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

// ... (all the middle functions stay the same) ...

// REMOVE 'export' here:
function initTelemetry(app){
  // ... (everything inside stays the same) ...
}

function renderMeta(){
  const meta = document.getElementById('queue-meta'); if (!meta) return;
  const q = JSON.parse(localStorage.getItem(K.q)||'[]');
  meta.textContent = 'Queue: ' + q.length + ' items';
}

// REMOVE 'export' here:
const TeleUI = { hookSettings(){ /* wired in initTelemetry + DataTools */ } };
