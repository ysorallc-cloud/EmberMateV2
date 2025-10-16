// EmberMate - Finalized Production JavaScript

// Global state
let globalUndoStack = [];
let tempIdCounter = 0;
const MAX_UNDO_STACK = 50;

// HIPAA Disclaimer
function dismissHipaaDisclaimer() {
    const disclaimer = document.getElementById('hipaaDisclaimer');
    if (disclaimer) {
        disclaimer.classList.add('hidden');
        document.body.classList.add('hipaa-dismissed');
        localStorage.setItem('hipaaDisclaimerDismissed', 'true');
    }
}

// Check if disclaimer was dismissed
window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('hipaaDisclaimerDismissed') === 'true') {
        const disclaimer = document.getElementById('hipaaDisclaimer');
        if (disclaimer) {
            disclaimer.classList.add('hidden');
            document.body.classList.add('hipaa-dismissed');
        }
    }
});

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
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    }
}

function toggleSidebar() {
    console.log('toggleSidebar called'); // Debug
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    console.log('Sidebar:', sidebar); // Debug
    console.log('Hamburger:', hamburger); // Debug
    
    if (sidebar) {
        const isOpen = sidebar.classList.contains('mobile-open');
        console.log('Is currently open:', isOpen); // Debug
        
        sidebar.classList.toggle('mobile-open');
        document.body.classList.toggle('sidebar-open');
        
        // Add visual feedback to hamburger
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
        
        console.log('After toggle, classes:', sidebar.className); // Debug
    } else {
        console.error('Sidebar element not found!');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('DOMContentLoaded', function() {
    // Close sidebar when clicking backdrop
    document.body.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open')) {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.querySelector('.hamburger');
            
            // Check if click is on backdrop (not on sidebar or hamburger)
            if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
                sidebar.classList.remove('mobile-open');
                document.body.classList.remove('sidebar-open');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        }
    });
});

// Tab Switching
function switchTrackTab(tab) {
    // Update tab active states
    const trackTabs = document.querySelectorAll('#page-track .tab');
    trackTabs.forEach(t => t.classList.remove('active'));
    
    // Find and activate the clicked tab
    trackTabs.forEach(t => {
        if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${tab}'`)) {
            t.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.track-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`track-${tab}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

function switchCareTab(tab) {
    // Update tab active states
    const careTabs = document.querySelectorAll('#page-care .tab');
    careTabs.forEach(t => t.classList.remove('active'));
    
    // Find and activate the clicked tab
    careTabs.forEach(t => {
        if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${tab}'`)) {
            t.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.care-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`care-${tab}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Undo System
function updateUndoButton() {
    const undoBtn = document.getElementById('undoBtn');
    if (!undoBtn) return;
    
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
        case 'weight':
            tableId = 'weightTable';
            rowTemplate = createWeightRow();
            break;
        case 'journal':
            tableId = 'journalTable';
            rowTemplate = createJournalRow();
            break;
        case 'appointments':
            tableId = 'appointmentsTable';
            rowTemplate = createAppointmentRow();
            break;
        case 'careteam':
            tableId = 'careTeamTable';
            rowTemplate = createCareTeamRow();
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
        <td><span class="badge badge-success"><span class="badge-dot"></span>Normal</span></td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createWeightRow() {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><strong>Today</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">0</td>
        <td class="editable-cell" onclick="makeEditable(this)">98.6</td>
        <td class="editable-cell" onclick="makeEditable(this)">Morning reading</td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createJournalRow() {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><strong>Today</strong></td>
        <td><span class="badge badge-success">😊 Good</span></td>
        <td><span class="badge badge-success">⚡ High</span></td>
        <td class="editable-cell" onclick="makeEditable(this)">Type your journal entry here...</td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createAppointmentRow() {
    const row = document.createElement('tr');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    row.innerHTML = `
        <td><strong>${dateStr}, ${timeStr}</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">Dr. Name</td>
        <td><span class="badge badge-neutral">Check-up</span></td>
        <td class="editable-cell" onclick="makeEditable(this)">Location TBD</td>
        <td class="editable-cell" onclick="makeEditable(this)">Notes</td>
        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
    `;
    return row;
}

function createCareTeamRow() {
    const row = document.createElement('tr');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    row.innerHTML = `
        <td class="editable-cell" onclick="makeEditable(this)"><strong>Dr. Name</strong></td>
        <td class="editable-cell" onclick="makeEditable(this)">Specialty</td>
        <td class="editable-cell" onclick="makeEditable(this)">(555) 000-0000</td>
        <td class="editable-cell" onclick="makeEditable(this)">email@example.com</td>
        <td>${dateStr}</td>
        <td>
            <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 13px;">Contact</button>
        </td>
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
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// Initialize Charts
function initializeCharts() {
    // Blood Pressure Chart
    const bpCtx = document.getElementById('bpChart');
    if (bpCtx && typeof Chart !== 'undefined') {
        new Chart(bpCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Systolic',
                        data: [135, 132, 130, 128],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Diastolic',
                        data: [88, 86, 84, 82],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Medication Adherence Chart
    const adherenceCtx = document.getElementById('adherenceChart');
    if (adherenceCtx && typeof Chart !== 'undefined') {
        new Chart(adherenceCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Medications Taken',
                    data: [3, 3, 3, 3, 3, 3, 3],
                    backgroundColor: '#10b981',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Glucose Chart
    const glucoseCtx = document.getElementById('glucoseChart');
    if (glucoseCtx && typeof Chart !== 'undefined') {
        new Chart(glucoseCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Glucose (mg/dL)',
                    data: [112, 108, 105, 103],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUndoButton();
    initializeCharts();
    showToast('Welcome to EmberMate! 💚');
});

console.log('EmberMate - Production Ready ✓');
