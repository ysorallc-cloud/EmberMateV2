// EmberMate - Health Management Dashboard JavaScript

// Global state
let globalUndoStack = [];
let tempIdCounter = 0;
const MAX_UNDO_STACK = 50;

// ====================
// HIPAA Disclaimer
// ====================
function dismissHipaaDisclaimer() {
    const disclaimer = document.getElementById('hipaaDisclaimer');
    if (disclaimer) {
        disclaimer.style.display = 'none';
        localStorage.setItem('hipaaDisclaimerDismissed', 'true');
    }
}

// Check if disclaimer was dismissed
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('hipaaDisclaimerDismissed') === 'true') {
        const disclaimer = document.getElementById('hipaaDisclaimer');
        if (disclaimer) {
            disclaimer.style.display = 'none';
        }
    }
    
    // Initialize charts if on insights page
    if (document.getElementById('bpChart')) {
        initializeCharts();
    }
});

// ====================
// Navigation
// ====================
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
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
    
    if (mainContent) {
        mainContent.classList.toggle('expanded');
    }
}

// ====================
// Track Tabs
// ====================
function switchTrackTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.track-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const tabContent = document.getElementById(`track-${tab}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// ====================
// Care Tabs
// ====================
function switchCareTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.care-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const tabContent = document.getElementById(`care-${tab}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// ====================
// Editable Cells
// ====================
function makeEditable(cell) {
    const currentValue = cell.textContent.trim();
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.style.cssText = 'width: 100%; padding: 4px; border: 2px solid var(--primary-green); border-radius: 4px; font-size: 14px;';
    
    // Save the current value to undo stack
    saveToUndoStack({
        action: 'edit',
        element: cell,
        oldValue: currentValue
    });
    
    input.addEventListener('blur', function() {
        const newValue = input.value;
        cell.innerHTML = newValue.includes('<strong>') ? newValue : newValue;
        
        if (newValue !== currentValue) {
            showToast('✓ Updated successfully');
            enableUndo();
        }
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
    
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.select();
}

// ====================
// Medication Status Cycling
// ====================
function cycleMedStatus(badge) {
    const statuses = [
        { class: 'badge-success', text: 'Taken' },
        { class: 'badge-warning', text: 'Due Soon' },
        { class: 'badge-neutral', text: 'Pending' },
        { class: 'badge-danger', text: 'Missed' }
    ];
    
    let currentIndex = 0;
    for (let i = 0; i < statuses.length; i++) {
        if (badge.classList.contains(statuses[i].class)) {
            currentIndex = i;
            break;
        }
    }
    
    // Remove current class
    badge.classList.remove(statuses[currentIndex].class);
    
    // Add next class (cycle through)
    const nextIndex = (currentIndex + 1) % statuses.length;
    badge.classList.add(statuses[nextIndex].class);
    
    // Update text (keep the dot)
    const dot = badge.querySelector('.badge-dot');
    badge.innerHTML = '';
    if (dot) {
        badge.appendChild(dot.cloneNode(true));
    } else {
        const newDot = document.createElement('span');
        newDot.className = 'badge-dot';
        badge.appendChild(newDot);
    }
    badge.appendChild(document.createTextNode(statuses[nextIndex].text));
    
    showToast(`Status updated to: ${statuses[nextIndex].text}`);
    enableUndo();
}

// ====================
// Row Management
// ====================
function deleteRow(button) {
    const row = button.closest('tr');
    const table = row.closest('table');
    const rowData = [];
    
    // Save row data for undo
    row.querySelectorAll('td').forEach(cell => {
        rowData.push(cell.innerHTML);
    });
    
    saveToUndoStack({
        action: 'delete',
        table: table,
        rowData: rowData,
        rowIndex: Array.from(table.querySelectorAll('tbody tr')).indexOf(row)
    });
    
    row.remove();
    showToast('✓ Row deleted');
    enableUndo();
}

function addInlineRow(tableType) {
    let tableId, newRow;
    
    switch(tableType) {
        case 'medications':
            tableId = 'medicationsTable';
            newRow = `
                <tr>
                    <td class="editable-cell" onclick="makeEditable(this)"><strong>New Medication</strong></td>
                    <td class="editable-cell" onclick="makeEditable(this)">Dosage</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Time</td>
                    <td>Frequency</td>
                    <td><span class="badge badge-neutral" onclick="cycleMedStatus(this)"><span class="badge-dot"></span>Pending</span></td>
                    <td><span class="badge badge-neutral">None</span></td>
                    <td class="editable-cell" onclick="makeEditable(this)">Provider</td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
                </tr>
            `;
            break;
        case 'bp':
            tableId = 'bpTable';
            newRow = `
                <tr>
                    <td><strong>Now</strong></td>
                    <td class="editable-cell" onclick="makeEditable(this)">120</td>
                    <td class="editable-cell" onclick="makeEditable(this)">80</td>
                    <td class="editable-cell" onclick="makeEditable(this)">72 BPM</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Sitting</td>
                    <td><span class="badge badge-success"><span class="badge-dot"></span>Normal</span></td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
                </tr>
            `;
            break;
        case 'glucose':
            tableId = 'glucoseTable';
            newRow = `
                <tr>
                    <td><strong>Now</strong></td>
                    <td class="editable-cell" onclick="makeEditable(this)">100</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Context</td>
                    <td class="editable-cell" onclick="makeEditable(this)">—</td>
                    <td><span class="badge badge-success"><span class="badge-dot"></span>Normal</span></td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
                </tr>
            `;
            break;
        case 'weight':
            tableId = 'weightTable';
            newRow = `
                <tr>
                    <td><strong>Today</strong></td>
                    <td class="editable-cell" onclick="makeEditable(this)">0</td>
                    <td class="editable-cell" onclick="makeEditable(this)">98.6</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Notes</td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
                </tr>
            `;
            break;
        case 'journal':
            tableId = 'journalTable';
            newRow = `
                <tr>
                    <td><strong>Today</strong></td>
                    <td><span class="badge badge-neutral">😐 Okay</span></td>
                    <td><span class="badge badge-neutral">🔋 Moderate</span></td>
                    <td class="editable-cell" onclick="makeEditable(this)">Enter your notes here...</td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
                </tr>
            `;
            break;
        case 'appointments':
            tableId = 'appointmentsTable';
            newRow = `
                <tr>
                    <td><strong>Date & Time</strong></td>
                    <td class="editable-cell" onclick="makeEditable(this)">Provider Name</td>
                    <td><span class="badge badge-neutral">Type</span></td>
                    <td class="editable-cell" onclick="makeEditable(this)">Location</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Notes</td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 13px;" onclick="deleteRow(this)">🗑️</button></td>
                </tr>
            `;
            break;
        case 'careteam':
            tableId = 'careTeamTable';
            newRow = `
                <tr>
                    <td class="editable-cell" onclick="makeEditable(this)"><strong>Provider Name</strong></td>
                    <td class="editable-cell" onclick="makeEditable(this)">Specialty</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Phone</td>
                    <td class="editable-cell" onclick="makeEditable(this)">Email</td>
                    <td>—</td>
                    <td><button class="btn btn-secondary" style="padding: 4px 12px; font-size: 13px;">Contact</button></td>
                </tr>
            `;
            break;
    }
    
    const table = document.getElementById(tableId);
    if (table) {
        const tbody = table.querySelector('tbody');
        tbody.insertAdjacentHTML('afterbegin', newRow);
        showToast('✓ New row added');
        enableUndo();
    }
}

// ====================
// Undo Functionality
// ====================
function saveToUndoStack(action) {
    globalUndoStack.push(action);
    if (globalUndoStack.length > MAX_UNDO_STACK) {
        globalUndoStack.shift();
    }
}

function enableUndo() {
    const undoBtn = document.getElementById('undoBtn');
    if (undoBtn) {
        undoBtn.style.opacity = '1';
    }
}

function performUndo() {
    if (globalUndoStack.length === 0) {
        showToast('Nothing to undo');
        return;
    }
    
    const lastAction = globalUndoStack.pop();
    
    switch(lastAction.action) {
        case 'edit':
            if (lastAction.element) {
                lastAction.element.innerHTML = lastAction.oldValue;
            }
            break;
        case 'delete':
            if (lastAction.table && lastAction.rowData) {
                const tbody = lastAction.table.querySelector('tbody');
                const newRow = tbody.insertRow(lastAction.rowIndex);
                lastAction.rowData.forEach(cellHTML => {
                    const cell = newRow.insertCell();
                    cell.innerHTML = cellHTML;
                });
            }
            break;
    }
    
    showToast('↶ Undo completed');
    
    if (globalUndoStack.length === 0) {
        const undoBtn = document.getElementById('undoBtn');
        if (undoBtn) {
            undoBtn.style.opacity = '0.5';
        }
    }
}

// ====================
// Toast Notifications
// ====================
function showToast(message) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        background: linear-gradient(135deg, var(--primary-green), var(--primary-green-dark));
        color: white;
        padding: 14px 20px;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        font-weight: 600;
        animation: slideInUp 0.3s ease, slideOutDown 0.3s ease 2.7s;
    `;
    
    // Add animation keyframes if not present
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutDown {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ====================
// Charts (Chart.js)
// ====================
function initializeCharts() {
    // Blood Pressure Chart
    const bpCtx = document.getElementById('bpChart');
    if (bpCtx) {
        new Chart(bpCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Systolic',
                    data: [125, 128, 122, 130, 128, 126, 128],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Diastolic',
                    data: [78, 82, 76, 85, 82, 80, 82],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 150
                    }
                }
            }
        });
    }
    
    // Medication Adherence Chart
    const adherenceCtx = document.getElementById('adherenceChart');
    if (adherenceCtx) {
        new Chart(adherenceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Taken', 'Missed'],
                datasets: [{
                    data: [21, 0],
                    backgroundColor: ['#10b981', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Blood Glucose Chart
    const glucoseCtx = document.getElementById('glucoseChart');
    if (glucoseCtx) {
        new Chart(glucoseCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Blood Glucose (mg/dL)',
                    data: [98, 102, 95, 105, 100, 98, 96],
                    backgroundColor: '#8b5cf6',
                    borderColor: '#7c3aed',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 130
                    }
                }
            }
        });
    }
}
