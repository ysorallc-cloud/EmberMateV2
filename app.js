// app.js — compatibility layer for current index.html structure

document.addEventListener('DOMContentLoaded', () => {
  // Nothing fancy on load; your HTML uses inline onclick handlers.
});

/* ---------- Header / Notices ---------- */
function dismissHipaaDisclaimer() {
  const el = document.getElementById('hipaaDisclaimer');
  if (el) el.style.display = 'none';
}

/* ---------- Sidebar ---------- */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

function performUndo() {
  // Stub for your undo button; fill in when you add state tracking.
  showToast('Nothing to undo yet.', 'info');
}

/* ---------- Page navigation ---------- */
// Ex: navigateTo('dashboard') -> shows #page-dashboard
function navigateTo(section) {
  const targetId = `page-${section}`;
  document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');

  // Sidebar active state
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  // Best effort: mark the matching item active if its onclick contains the section
  document.querySelectorAll('.sidebar-item').forEach(i => {
    if ((i.getAttribute('onclick') || '').includes(`'${section}'`)) i.classList.add('active');
  });

  // Close sidebar on small screens
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 768) sidebar.classList.remove('open');
}

/* ---------- Track tabs ---------- */
// HTML calls switchTrackTab('medications' | 'vitals' | 'journal')
function switchTrackTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.track-tab-content').forEach(c => c.classList.remove('active'));
  const activeTab = document.querySelector(`.tab[onclick*="${tab}"]`);
  const activePanel = document.getElementById(`track-${tab}`);
  if (activeTab) activeTab.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

/* ---------- Inline editing helpers ---------- */
function makeEditable(td) {
  if (!td) return;
  td.setAttribute('contenteditable', 'true');
  td.focus();
  td.addEventListener('blur', () => td.removeAttribute('contenteditable'), { once: true });
}

function deleteRow(btn) {
  const tr = btn.closest('tr');
  if (tr) tr.remove();
}

/* ---------- Add-row helpers (kept simple) ---------- */
function addInlineRow(kind) {
  const map = {
    medications: 'medicationsTable',
    bp: 'bpTable',
    glucose: 'glucoseTable',
    weight: 'weightTable',
    journal: 'journalTable'
  };
  const table = document.getElementById(map[kind]);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = guessTemplate(kind);
  tbody.appendChild(tr);
}

function guessTemplate(kind) {
  switch (kind) {
    case 'medications':
      return `
        <td class="editable-cell" onclick="makeEditable(this)"><strong>New Med</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">10mg</td>
        <td class="editable-cell" onclick="makeEditable(this)">8:00 AM</td>
        <td class="editable-cell" onclick="makeEditable(this)">Once daily</td>
        <td><span class="badge badge-neutral" onclick="cycleMedStatus(this)"><span class="badge-dot"></span>Pending</span></td>
        <td class="editable-cell" onclick="makeEditable(this)">—</td>
        <td class="editable-cell" onclick="makeEditable(this)">Prescriber</td>
        <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:13px;" onclick="deleteRow(this)">🗑️</button></td>`;
    case 'bp':
      return `
        <td><strong>${new Date().toLocaleString()}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">120</td>
        <td class="editable-cell" onclick="makeEditable(this)">80</td>
        <td class="editable-cell" onclick="makeEditable(this)">70 BPM</td>
        <td class="editable-cell" onclick="makeEditable(this)">Sitting</td>
        <td><span class="badge badge-neutral"><span class="badge-dot"></span>Pending</span></td>
        <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:13px;" onclick="deleteRow(this)">🗑️</button></td>`;
    case 'glucose':
      return `
        <td><strong>${new Date().toLocaleString()}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">100</td>
        <td class="editable-cell" onclick="makeEditable(this)">Fasting</td>
        <td class="editable-cell" onclick="makeEditable(this)">—</td>
        <td><span class="badge badge-neutral"><span class="badge-dot"></span>Pending</span></td>
        <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:13px;" onclick="deleteRow(this)">🗑️</button></td>`;
    case 'weight':
      return `
        <td><strong>${new Date().toLocaleDateString()}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">170</td>
        <td class="editable-cell" onclick="makeEditable(this)">98.6</td>
        <td class="editable-cell" onclick="makeEditable(this)">—</td>
        <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:13px;" onclick="deleteRow(this)">🗑️</button></td>`;
    case 'journal':
      return `
        <td><strong>${new Date().toLocaleDateString()}</strong></td>
        <td><span class="badge badge-neutral">😐 Okay</span></td>
        <td><span class="badge badge-neutral">🔋 Moderate</span></td>
        <td class="editable-cell" onclick="makeEditable(this)">New note…</td>
        <td><button class="btn btn-secondary" style="padding:4px 8px;font-size:13px;" onclick="deleteRow(this)">🗑️</button></td>`;
    default:
      return `<td colspan="8">New row</td>`;
  }
}

/* ---------- Medication status cycle ---------- */
function cycleMedStatus(el) {
  if (!el) return;
  const states = [
    { cls: 'badge-neutral', text: 'Pending' },
    { cls: 'badge-warning', text: 'Due Soon' },
    { cls: 'badge-success', text: 'Taken' }
  ];
  const current = states.findIndex(s => el.classList.contains(s.cls));
  const next = (current + 1) % states.length;
  el.className = `badge ${states[next].cls}`;
  el.innerHTML = `<span class="badge-dot"></span>${states[next].text}`;
}

/* ---------- Tiny toast ---------- */
function showToast(msg, type = 'info') {
  const old = document.querySelector('.notification');
  if (old) old.remove();
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = msg;
  Object.assign(n.style, {
    position: 'fixed', top: '90px', right: '16px', zIndex: 10000,
    background: 'rgba(0,0,0,.8)', color: '#fff', padding: '10px 14px',
    borderRadius: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,.2)'
  });
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2000);
}
