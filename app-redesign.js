// EmberMate - Redesigned JavaScript

// Global state
let globalUndoStack = [];
let tempIdCounter = 0;
const MAX_UNDO_STACK = 50;

// Charts and data model
let charts = { bp: null, glucose: null, adherence: null };
const dataModel = {
    days: [], // array of Date objects
    systolic: [],
    diastolic: [],
    heartRate: [],
    glucose: [],
    weight: [],
    medication: {
        name: 'Metformin',
        middayTaken: [] // boolean array aligned to days
    }
};

function generateDemoData(totalDays) {
    const today = new Date();
    const days = [];
    const systolic = [];
    const diastolic = [];
    const heartRate = [];
    const glucose = [];
    const weight = [];
    const middayTaken = [];

    let baseSys = 132;
    let baseDia = 85;
    let baseHr = 72;
    let baseGlu = 108;
    let baseW = 176;

    for (let i = totalDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d);

        // Simulate cycles and noise
        const weekPhase = Math.sin((2 * Math.PI * (totalDays - i)) / 7);
        const monthPhase = Math.sin((2 * Math.PI * (totalDays - i)) / 30);

        const noisySys = Math.round(baseSys + 4 * weekPhase + 2 * monthPhase + (Math.random() * 6 - 3));
        const noisyDia = Math.round(baseDia + 3 * weekPhase + 1 * monthPhase + (Math.random() * 5 - 2.5));
        const noisyHr = Math.round(baseHr + 5 * weekPhase + (Math.random() * 6 - 3));
        const noisyGlu = Math.round(baseGlu + 4 * monthPhase + (Math.random() * 8 - 4));
        const noisyW = Math.round((baseW + 0.1 * monthPhase + (Math.random() * 0.8 - 0.4)) * 10) / 10;

        // Simulate missed midday dose pattern roughly every 3rd day
        const missed = ((totalDays - i) % 3 === 0) || Math.random() < 0.15;
        middayTaken.push(!missed);

        // If missed, elevate BP slightly
        systolic.push(noisySys + (missed ? 6 : 0));
        diastolic.push(noisyDia + (missed ? 3 : 0));

        // Heart rate peaks tend to precede glucose dips the next day
        const hrPeak = Math.random() < 0.35;
        heartRate.push(noisyHr + (hrPeak ? 10 : 0));
        const glucoseDip = hrPeak ? -10 : 0;
        glucose.push(noisyGlu + glucoseDip);

        weight.push(noisyW);
    }

    dataModel.days = days;
    dataModel.systolic = systolic;
    dataModel.diastolic = diastolic;
    dataModel.heartRate = heartRate;
    dataModel.glucose = glucose;
    dataModel.weight = weight;
    dataModel.medication.middayTaken = middayTaken;
}

function sliceDataByDays(daysBack) {
    const n = dataModel.days.length;
    const start = Math.max(0, n - daysBack);
    return {
        days: dataModel.days.slice(start),
        systolic: dataModel.systolic.slice(start),
        diastolic: dataModel.diastolic.slice(start),
        heartRate: dataModel.heartRate.slice(start),
        glucose: dataModel.glucose.slice(start),
        weight: dataModel.weight.slice(start),
        middayTaken: dataModel.medication.middayTaken.slice(start)
    };
}

// Local, on-device quotes to preserve privacy
const LOCAL_QUOTES = [
    { text: "Caring for yourself is not selfish—it's essential.", author: 'Eleanor Brownn' },
    { text: 'What gets measured gets managed.', author: 'Peter Drucker' },
    { text: 'Small daily improvements compound into big results.', author: 'Unknown' },
    { text: 'The best time to start was yesterday. The next best is now.', author: 'Unknown' },
    { text: 'Health is a relationship between you and your body.', author: 'Terri Guillemets' },
    { text: 'We are what we repeatedly do. Excellence, then, is a habit.', author: 'Will Durant' },
    { text: 'Slow progress is still progress.', author: 'Unknown' },
    { text: 'Consistency is more important than perfection.', author: 'Unknown' }
];

function setDailyQuotes() {
    const cards = Array.from(document.querySelectorAll('.quote-card'));
    if (cards.length === 0) return;
    const dayIndex = Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000));
    cards.forEach((card, idx) => {
        const qIdx = (dayIndex + idx) % LOCAL_QUOTES.length;
        const q = LOCAL_QUOTES[qIdx];
        const textEl = card.querySelector('.quote-text');
        const authorEl = card.querySelector('.quote-author');
        if (textEl) textEl.textContent = `"${q.text}"`;
        if (authorEl) authorEl.textContent = `— ${q.author}`;
    });
}

function buildBpChart(daysWindow) {
    const ctx = document.getElementById('bpChart');
    if (!ctx) return;
    const slice = sliceDataByDays(daysWindow);
    const labels = slice.days.map(d => d.toLocaleDateString());

    const datasets = [
        {
            label: 'Systolic',
            data: slice.systolic,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.08)',
            tension: 0.35,
            yAxisID: 'y'
        },
        {
            label: 'Diastolic',
            data: slice.diastolic,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.08)',
            tension: 0.35,
            yAxisID: 'y'
        }
    ];

    // Optional overlays (visible controlled later)
    datasets.push({
        label: 'Weight (lbs)',
        data: slice.weight,
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107,114,128,0.08)',
        borderDash: [4, 4],
        tension: 0.3,
        yAxisID: 'yWeight',
        hidden: !document.getElementById('overlayWeight') || !document.getElementById('overlayWeight').checked
    });
    datasets.push({
        label: 'Glucose (mg/dL)',
        data: slice.glucose,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        borderDash: [6, 4],
        tension: 0.3,
        yAxisID: 'yGlucose',
        hidden: !document.getElementById('overlayGlucose') || !document.getElementById('overlayGlucose').checked
    });
    datasets.push({
        label: 'Heart Rate (BPM)',
        data: slice.heartRate,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.08)',
        borderDash: [2, 2],
        tension: 0.3,
        yAxisID: 'yHeart',
        hidden: !document.getElementById('overlayHeartRate') || !document.getElementById('overlayHeartRate').checked
    });

    if (charts.bp) {
        charts.bp.data.labels = labels;
        charts.bp.data.datasets = datasets;
        charts.bp.update();
        return;
    }

    charts.bp = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'nearest', intersect: false },
            plugins: { legend: { position: 'top' }, tooltip: { enabled: true } },
            scales: {
                y: { title: { display: true, text: 'BP (mmHg)' } },
                yWeight: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Weight' } },
                yGlucose: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Glucose' } },
                yHeart: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'BPM' } }
            }
        }
    });
}

function buildGlucoseChart(daysWindow) {
    const ctx = document.getElementById('glucoseChart');
    if (!ctx) return;
    const slice = sliceDataByDays(daysWindow);
    const labels = slice.days.map(d => d.toLocaleDateString());
    const datasets = [{
        label: 'Glucose (mg/dL)',
        data: slice.glucose,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        tension: 0.35
    }];

    if (charts.glucose) {
        charts.glucose.data.labels = labels;
        charts.glucose.data.datasets = datasets;
        charts.glucose.update();
        return;
    }

    charts.glucose = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'nearest', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: { y: { title: { display: true, text: 'mg/dL' } } }
        }
    });
}

function buildAdherenceChart(daysWindow) {
    const ctx = document.getElementById('adherenceChart');
    if (!ctx) return;
    const slice = sliceDataByDays(daysWindow);
    const labels = slice.days.map(d => d.toLocaleDateString());
    const takenSeries = slice.middayTaken.map(v => (v ? 1 : 0));
    const datasets = [{
        type: 'bar',
        label: 'Midday Dose Taken',
        data: takenSeries,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.3)'
    }];

    if (charts.adherence) {
        charts.adherence.data.labels = labels;
        charts.adherence.data.datasets = datasets;
        charts.adherence.update();
        return;
    }

    charts.adherence = new Chart(ctx, {
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } },
            scales: {
                y: { beginAtZero: true, suggestedMax: 1, ticks: { stepSize: 1 }, title: { display: true, text: 'Taken (1) / Missed (0)' } }
            }
        }
    });
}

function computeCorrelation(a, b) {
    const n = Math.min(a.length, b.length);
    if (n === 0) return 0;
    let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;
    for (let i = 0; i < n; i++) {
        const x = a[i];
        const y = b[i];
        sumA += x; sumB += y; sumAB += x * y; sumA2 += x * x; sumB2 += y * y;
    }
    const cov = sumAB / n - (sumA / n) * (sumB / n);
    const varA = sumA2 / n - (sumA / n) * (sumA / n);
    const varB = sumB2 / n - (sumB / n) * (sumB / n);
    const denom = Math.sqrt(varA * varB) || 1;
    return cov / denom;
}

function generateAIInsights() {
    const list = document.getElementById('aiInsightsList');
    if (!list) return;
    list.innerHTML = '';

    const N = Math.min(30, dataModel.days.length);
    const slice = sliceDataByDays(N);

    // Insight 1: BP correlates with missed midday dose
    const bpHigh = slice.systolic.map((s, i) => (s >= 140 || slice.diastolic[i] >= 90) ? 1 : 0);
    const missed = slice.middayTaken.map(t => (t ? 0 : 1));
    const corr = computeCorrelation(bpHigh, missed);
    const missedOnHighDays = bpHigh.reduce((acc, v, i) => {
        return acc + (v === 1 && missed[i] === 1 ? 1 : 0);
    }, 0);
    const totalHighDays = bpHigh.reduce((a, v) => a + (v === 1 ? 1 : 0), 0) || 1;
    const pct = Math.round((missedOnHighDays / totalHighDays) * 100);
    const medName = dataModel.medication.name;
    const insight1 = `Your blood pressure readings correlate with missing your midday ${medName} dose ${pct}% of the time (r=${corr.toFixed(2)}).`;

    // Insight 2: HR peaks precede glucose dips
    // Define peak/dip relative to rolling median
    const hrMedian = median(slice.heartRate);
    const gluMedian = median(slice.glucose);
    const hrPeaks = slice.heartRate.map(v => (v >= hrMedian + 10) ? 1 : 0);
    const gluDrops = slice.glucose.map(v => (v <= gluMedian - 10) ? 1 : 0);
    // Lead HR by 1 day
    const hrLead = hrPeaks.slice(0, -1);
    const gluDropAligned = gluDrops.slice(1);
    const leadCorr = computeCorrelation(hrLead, gluDropAligned);
    const coOccur = hrLead.reduce((acc, v, i) => acc + (v === 1 && gluDropAligned[i] === 1 ? 1 : 0), 0);
    const totalHrPeaks = hrLead.reduce((a, v) => a + (v === 1 ? 1 : 0), 0) || 1;
    const pct2 = Math.round((coOccur / totalHrPeaks) * 100);
    const insight2 = `Your heart rate peaks are followed by glucose drops the next day about ${pct2}% of the time (r=${leadCorr.toFixed(2)}). Consider discussing with your doctor.`;

    // Insight 3: Weight and BP overlay trend
    const wCorr = computeCorrelation(standardize(slice.weight), standardize(slice.systolic));
    const trendMsg = wCorr > 0.3 ? 'rising together' : (wCorr < -0.3 ? 'moving in opposite directions' : 'showing weak coupling');
    const insight3 = `Weight and systolic BP are ${trendMsg} over the selected window (r=${wCorr.toFixed(2)}).`;

    [insight1, insight2, insight3].forEach(text => {
        const li = document.createElement('li');
        li.className = 'insight-item';
        li.textContent = text;
        list.appendChild(li);
    });
}

function median(arr) {
    const v = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(v.length / 2);
    return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

function standardize(arr) {
    const n = arr.length || 1;
    const mean = arr.reduce((a, v) => a + v, 0) / n;
    const variance = arr.reduce((a, v) => a + (v - mean) * (v - mean), 0) / n || 1;
    const std = Math.sqrt(variance) || 1;
    return arr.map(v => (v - mean) / std);
}

function wireChartControls() {
    const bpFilter = document.getElementById('bpTimeFilter');
    if (bpFilter) {
        bpFilter.addEventListener('change', () => {
            buildBpChart(parseInt(bpFilter.value, 10));
            generateAIInsights();
        });
    }
    const glFilter = document.getElementById('glucoseTimeFilter');
    if (glFilter) {
        glFilter.addEventListener('change', () => buildGlucoseChart(parseInt(glFilter.value, 10)));
    }
    const adFilter = document.getElementById('adherenceTimeFilter');
    if (adFilter) {
        adFilter.addEventListener('change', () => buildAdherenceChart(parseInt(adFilter.value, 10)));
    }

    const overlayWeight = document.getElementById('overlayWeight');
    const overlayGlucose = document.getElementById('overlayGlucose');
    const overlayHeart = document.getElementById('overlayHeartRate');
    [overlayWeight, overlayGlucose, overlayHeart].forEach(cb => {
        if (!cb) return;
        cb.addEventListener('change', () => {
            const days = parseInt((bpFilter && bpFilter.value) || '30', 10);
            buildBpChart(days);
        });
    });
}

function wireQuickLog() {
    const fab = document.getElementById('quickLogFab');
    const modal = document.getElementById('quickLogModal');
    const closeBtn = document.getElementById('quickLogClose');
    const cancelBtn = document.getElementById('quickLogCancel');
    const saveBtn = document.getElementById('quickLogSave');

    function openModal() { modal.classList.remove('hidden'); }
    function closeModal() { modal.classList.add('hidden'); }

    if (fab) fab.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const s = parseInt(document.getElementById('ql-systolic').value || '0', 10);
            const d = parseInt(document.getElementById('ql-diastolic').value || '0', 10);
            const hr = parseInt(document.getElementById('ql-hr').value || '0', 10);
            const glu = parseInt(document.getElementById('ql-glucose').value || '0', 10);
            const w = parseFloat(document.getElementById('ql-weight').value || '0');
            const t = parseFloat(document.getElementById('ql-temp').value || '0');

            // Minimal validation
            if (!s || !d) { showToast('Please enter BP values'); return; }

            // Insert rows into tables if present
            insertBPRowWithValues(s, d, hr || 0, 'Sitting');
            if (glu) insertGlucoseRowWithValues(glu, 'After meal', '—');
            if (w) insertWeightRowWithValues(w, t || 98.6, 'Quick log');

            // Update data model with today
            const now = new Date();
            dataModel.days.push(now);
            dataModel.systolic.push(s);
            dataModel.diastolic.push(d);
            dataModel.heartRate.push(hr || 0);
            dataModel.glucose.push(glu || dataModel.glucose[dataModel.glucose.length - 1] || 100);
            dataModel.weight.push(w || dataModel.weight[dataModel.weight.length - 1] || 175);
            dataModel.medication.middayTaken.push(true);

            // Refresh visuals
            const bpDays = parseInt((document.getElementById('bpTimeFilter')?.value) || '30', 10);
            const glDays = parseInt((document.getElementById('glucoseTimeFilter')?.value) || '30', 10);
            const adDays = parseInt((document.getElementById('adherenceTimeFilter')?.value) || '30', 10);
            buildBpChart(bpDays);
            buildGlucoseChart(glDays);
            buildAdherenceChart(adDays);
            generateAIInsights();

            showToast('Vitals logged');
            closeModal();
        });
    }
}

function insertBPRowWithValues(sys, dia, hr, position) {
    const table = document.getElementById('bpTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><strong>Today, ${timeStr}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">${sys}</td>
        <td class="editable-cell" onclick="makeEditable(this)">${dia}</td>
        <td class="editable-cell" onclick="makeEditable(this)">${hr} BPM</td>
        <td class="editable-cell" onclick="makeEditable(this)">${position}</td>
        <td><span class="badge ${sys >= 140 || dia >= 90 ? 'badge-danger' : 'badge-success'}"><span class="badge-dot"></span>${sys >= 140 || dia >= 90 ? 'High' : 'Normal'}</span></td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
}

function insertGlucoseRowWithValues(level, context, notes) {
    const table = document.getElementById('glucoseTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><strong>Today, ${timeStr}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">${level}</td>
        <td class="editable-cell" onclick="makeEditable(this)">${context}</td>
        <td class="editable-cell" onclick="makeEditable(this)">${notes}</td>
        <td><span class="badge ${level >= 180 || level < 70 ? 'badge-danger' : 'badge-success'}"><span class="badge-dot"></span>${level >= 180 || level < 70 ? 'Out of Range' : 'Normal'}</span></td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
}

function insertWeightRowWithValues(weightLbs, tempF, notes) {
    const table = document.getElementById('weightTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><strong>Today</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">${weightLbs}</td>
        <td class="editable-cell" onclick="makeEditable(this)">${tempF}</td>
        <td class="editable-cell" onclick="makeEditable(this)">${notes}</td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
}

// HIPAA Disclaimer
function dismissHipaaDisclaimer() {
    document.getElementById('hipaaDisclaimer').classList.add('hidden');
    localStorage.setItem('hipaaDisclaimerDismissed', 'true');
}

// Check if disclaimer was dismissed
if (localStorage.getItem('hipaaDisclaimerDismissed') === 'true') {
    document.getElementById('hipaaDisclaimer').classList.add('hidden');
}

// Navigation
function navigateTo(page) {
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const targetItem = Array.from(document.querySelectorAll('.sidebar-item')).find(item => {
        const onclick = item.getAttribute('onclick');
        return onclick && onclick.includes(`'${page}'`);
    });
    
    if (targetItem) {
        targetItem.classList.add('active');
    }
    
    // Update page containers
    document.querySelectorAll('.page-container').forEach(container => {
        container.classList.remove('active');
    });
    
    const pageElement = document.getElementById(`page-${page}`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Tab Switching
// Replace existing switchTrackTab with this
function switchTrackTab(tab) {
  // Deactivate all tabs and panels
  document.querySelectorAll('#page-track .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.track-tab-content').forEach(c => c.classList.remove('active'));

  // Activate the tab whose onclick references the requested tab
  const match = Array.from(document.querySelectorAll('#page-track .tab')).find(t => {
    const on = t.getAttribute('onclick') || '';
    return on.includes(`'${tab}'`) || on.includes(`"${tab}"`);
  });
  if (match) match.classList.add('active');

  // Activate matching content
  const panel = document.getElementById(`track-${tab}`);
  if (panel) panel.classList.add('active');

}

function switchCareTab(tab) {
    // Update tab active states
    document.querySelectorAll('#page-care .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update content
    document.querySelectorAll('.care-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`care-${tab}`).classList.add('active');
}

// Undo System
function updateUndoButton() {
    const undoBtn = document.getElementById('undoBtn');
    if (globalUndoStack.length > 0) {
        undoBtn.style.opacity = '1';
        undoBtn.style.cursor = 'pointer';
        undoBtn.title = `Undo last action (${globalUndoStack.length} available)`;
    } else {
        undoBtn.style.opacity = '0.5';
        undoBtn.style.cursor = 'not-allowed';
        undoBtn.title = 'No actions to undo';
    }
}

function addToUndoStack(action) {
    globalUndoStack.push(action);
    if (globalUndoStack.length > MAX_UNDO_STACK) {
        globalUndoStack.shift();
    }
    updateUndoButton();
}

function performUndo() {
    if (globalUndoStack.length === 0) {
        showToast('No actions to undo');
        return;
    }

    const lastAction = globalUndoStack.pop();
    
    switch(lastAction.type) {
        case 'rowAdd':
            const rowToRemove = document.querySelector(`tr[data-temp-id="${lastAction.tempId}"]`);
            if (rowToRemove) {
                rowToRemove.remove();
                showToast('Row addition undone');
            }
            break;
            
        case 'rowDelete':
            const table = document.getElementById(lastAction.tableId);
            if (table && lastAction.rowHTML) {
                const tbody = table.querySelector('tbody');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = lastAction.rowHTML;
                const restoredRow = tempDiv.firstChild;
                tbody.insertBefore(restoredRow, tbody.firstChild);
                showToast('Row deletion undone');
            }
            break;
            
        case 'cellEdit':
            const cell = lastAction.cell;
            if (cell) {
                cell.textContent = lastAction.oldValue;
                showToast('Edit undone');
            }
            break;
    }
    
    updateUndoButton();
}

// Inline Editing
function makeEditable(cell) {
    if (cell.classList.contains('editing')) return;
    
    const originalValue = cell.textContent.trim();
    const originalHTML = cell.innerHTML;
    
    cell.classList.add('editing');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalValue;
    input.className = 'inline-edit-input';
    
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    input.select();
    
    function saveEdit() {
        const newValue = input.value.trim();
        cell.classList.remove('editing');
        
        if (newValue && newValue !== originalValue) {
            cell.innerHTML = newValue;
            
            addToUndoStack({
                type: 'cellEdit',
                cell: cell,
                oldValue: originalValue,
                newValue: newValue
            });
            
            showToast('Updated');
        } else {
            cell.innerHTML = originalHTML;
        }
        
        cell.onclick = function() { makeEditable(this); };
    }
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            cell.classList.remove('editing');
            cell.innerHTML = originalHTML;
            cell.onclick = function() { makeEditable(this); };
        }
    });
}

// Inline Row Adding
function addInlineRow(tableType) {
    let tableId, rowTemplate;
    
    switch(tableType) {
        case 'medications':
            tableId = 'medicationsTable';
            rowTemplate = createMedicationRow();
            break;
        case 'bp':
            tableId = 'bpTable';
            rowTemplate = createBPRow();
            break;
        case 'glucose':
            tableId = 'glucoseTable';
            rowTemplate = createGlucoseRow();
            break;
        case 'journal':
            tableId = 'journalTable';
            rowTemplate = createJournalRow();
            break;
        default:
            showToast('Unknown table type');
            return;
    }

    const table = document.getElementById(tableId);
    if (!table) {
        showToast('Table not found');
        return;
    }

    const tbody = table.querySelector('tbody');
    const tempId = `temp-${tempIdCounter++}`;
    rowTemplate.setAttribute('data-temp-id', tempId);
    rowTemplate.classList.add('new-row-highlight');
    
    tbody.insertBefore(rowTemplate, tbody.firstChild);
    
    addToUndoStack({
        type: 'rowAdd',
        tempId: tempId,
        tableId: tableId
    });

    setTimeout(() => {
        const firstEditableCell = rowTemplate.querySelector('.editable-cell');
        if (firstEditableCell) {
            makeEditable(firstEditableCell);
        }
        rowTemplate.classList.remove('new-row-highlight');
    }, 100);

    showToast('New row added');
}

// Row Templates
function createMedicationRow() {
    const row = document.createElement('tr');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    row.innerHTML = `
        <td class="editable-cell" onclick="makeEditable(this)"><strong>New Medication</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">0mg</td>
        <td class="editable-cell" onclick="makeEditable(this)">${timeStr}</td>
        <td>Once daily</td>
        <td><span class="badge badge-neutral" onclick="cycleMedStatus(this)"><span class="badge-dot"></span>Pending</span></td>
        <td><span class="badge badge-neutral">None</span></td>
        <td class="editable-cell" onclick="makeEditable(this)">Doctor Name</td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createBPRow() {
    const row = document.createElement('tr');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    row.innerHTML = `
        <td><strong>Today, ${timeStr}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">120</td>
        <td class="editable-cell" onclick="makeEditable(this)">80</td>
        <td class="editable-cell" onclick="makeEditable(this)">70 BPM</td>
        <td class="editable-cell" onclick="makeEditable(this)">Sitting</td>
        <td><span class="badge badge-success"><span class="badge-dot"></span>Normal</span></td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createGlucoseRow() {
    const row = document.createElement('tr');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    row.innerHTML = `
        <td><strong>Today, ${timeStr}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">100</td>
        <td class="editable-cell" onclick="makeEditable(this)">Fasting</td>
        <td class="editable-cell" onclick="makeEditable(this)">—</td>
        <td><span class="badge badge-success"><span class="badge-dot"></span>In Range</span></td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createJournalRow() {
    const row = document.createElement('tr');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    row.innerHTML = `
        <td><strong>Today, ${timeStr}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">New Entry</td>
        <td><span class="badge badge-success">😊 Good</span></td>
        <td class="editable-cell" onclick="makeEditable(this)" style="max-width: 400px;">Type your journal entry here...</td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

// Delete Row
function deleteRow(button) {
    const row = button.closest('tr');
    if (!row) return;

    if (!confirm('Are you sure you want to delete this row?')) {
        return;
    }

    const table = row.closest('table');
    
    addToUndoStack({
        type: 'rowDelete',
        tableId: table.id,
        rowHTML: row.outerHTML
    });

    row.remove();
    showToast('Row deleted');
}

// Medication Status Cycling
function cycleMedStatus(badge) {
    const statusText = badge.textContent.trim();
    let newStatus, newClass;
    
    const statusCycle = {
        'Pending': { status: 'Taken', class: 'badge-success' },
        'Taken': { status: 'Missed', class: 'badge-danger' },
        'Missed': { status: 'Pending', class: 'badge-neutral' },
        'Due Soon': { status: 'Taken', class: 'badge-success' }
    };
    
    const next = statusCycle[statusText] || { status: 'Pending', class: 'badge-neutral' };
    
    badge.className = `badge ${next.class}`;
    badge.innerHTML = `<span class="badge-dot"></span>${next.status}`;
    
    showToast(`Status updated to ${next.status}`);
}

// Toast Notifications
function showToast(message) {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// Initialize Charts and Insights
function initializeCharts() {
    // Seed model if empty
    if (dataModel.days.length === 0) {
        generateDemoData(90);
    }

    const bpDays = parseInt((document.getElementById('bpTimeFilter')?.value) || '30', 10);
    const glDays = parseInt((document.getElementById('glucoseTimeFilter')?.value) || '30', 10);
    const adDays = parseInt((document.getElementById('adherenceTimeFilter')?.value) || '30', 10);

    buildBpChart(bpDays);
    buildGlucoseChart(glDays);
    buildAdherenceChart(adDays);
    generateAIInsights();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUndoButton();
    initializeCharts();
    wireChartControls();
    wireQuickLog();
    setDailyQuotes();
    showToast('Welcome to EmberMate!');
});

console.log('EmberMate Redesigned - Loaded');
