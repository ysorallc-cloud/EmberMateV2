// ===================================
// EMBERMATE - APPLICATION LOGIC
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupTrackTabs();
    setupButtons();
}

// ===================================
// NAVIGATION SYSTEM
// ===================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            const targetPageElement = document.getElementById(`${targetPage}-page`);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
            
            // Update page title
            const pageText = this.querySelector('span:last-child').textContent;
            if (pageTitle) {
                pageTitle.textContent = pageText;
            }
            
            // Close mobile menu if open
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });
}

// Helper function for programmatic navigation
function navigateToPage(pageName) {
    const navItem = document.querySelector(`[data-page="${pageName}"]`);
    if (navItem) {
        navItem.click();
    }
}

// ===================================
// MOBILE MENU
// ===================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }
}

// ===================================
// TRACK PAGE TABS
// ===================================

function setupTrackTabs() {
    const trackTabs = document.querySelectorAll('.track-tab');
    const trackContents = document.querySelectorAll('.track-content');
    
    trackTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTrack = this.getAttribute('data-track');
            
            // Update active tab
            trackTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target content
            trackContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(`${targetTrack}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ===================================
// BUTTON INTERACTIONS
// ===================================

function setupButtons() {
    // Add Medication button
    const addMedicationBtn = document.querySelector('#medications-content .add-btn');
    if (addMedicationBtn) {
        addMedicationBtn.addEventListener('click', function() {
            showNotification('Add medication feature coming soon!', 'info');
        });
    }
    
    // Add Vitals button
    const addVitalsBtn = document.querySelector('#vitals-content .add-btn');
    if (addVitalsBtn) {
        addVitalsBtn.addEventListener('click', function() {
            showNotification('Log vitals feature coming soon!', 'info');
        });
    }
    
    // Add Journal button
    const addJournalBtn = document.querySelector('#journal-content .add-btn');
    if (addJournalBtn) {
        addJournalBtn.addEventListener('click', function() {
            showNotification('New journal entry feature coming soon!', 'info');
        });
    }
    
    // Save Profile button
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            showNotification('Profile saved successfully!', 'success');
        });
    }
    
    // Help button
    const helpBtn = document.querySelector('.help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            showHelpModal();
        });
    }
    
    // Medication checkboxes
    setupMedicationCheckboxes();
}

// ===================================
// MEDICATION TRACKING
// ===================================

function setupMedicationCheckboxes() {
    const medicationItems = document.querySelectorAll('.medication-item.pending');
    
    medicationItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('pending')) {
                this.classList.remove('pending');
                this.classList.add('completed');
                
                const checkbox = this.querySelector('.med-checkbox');
                checkbox.textContent = '✓';
                checkbox.style.backgroundColor = 'var(--success)';
                checkbox.style.color = 'white';
                checkbox.style.border = 'none';
                
                const info = this.querySelector('.med-info p');
                const medName = this.querySelector('.med-info h4').textContent;
                info.textContent = `Taken at ${getCurrentTime()}`;
                
                showNotification(`Great job! ${medName} logged as taken.`, 'success');
                
                // Update status badge
                updateMedicationBadge();
            }
        });
    });
}

function updateMedicationBadge() {
    const completedCount = document.querySelectorAll('.medication-item.completed').length;
    const totalCount = document.querySelectorAll('.medication-item').length;
    
    const badge = document.querySelector('.medications-status .status-badge');
    const tabBadge = document.querySelector('[data-track="medications"] .status-badge');
    
    if (badge) {
        badge.textContent = `${completedCount} of ${totalCount} taken today`;
        
        if (completedCount === totalCount) {
            badge.className = 'status-badge success';
            showNotification('Amazing! All medications taken today! 🎉', 'success');
        }
    }
    
    if (tabBadge) {
        tabBadge.textContent = `${completedCount}/${totalCount} today`;
    }
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        info: 'ℹ',
        warning: '⚠',
        error: '✕'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#6B9080',
        info: '#87AAAA',
        warning: '#E6A757',
        error: '#D56062'
    };
    return colors[type] || colors.info;
}

// ===================================
// HELP MODAL
// ===================================

function showHelpModal() {
    // Remove existing modal
    const existingModal = document.querySelector('.help-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'help-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="help-modal">
            <div class="help-modal-header">
                <h2>How to Use EmberMate</h2>
                <button class="close-modal" onclick="this.closest('.help-modal-overlay').remove()">✕</button>
            </div>
            <div class="help-modal-content">
                <div class="help-section">
                    <h3>📊 Dashboard</h3>
                    <p>View your health overview, recent activity, and quick status updates for medications, vitals, and journal entries.</p>
                </div>
                <div class="help-section">
                    <h3>📝 Track</h3>
                    <p><strong>Medications:</strong> Click on pending medications to mark them as taken. Track your daily completion.</p>
                    <p><strong>Vitals:</strong> Log your blood pressure, heart rate, and weight regularly to monitor trends.</p>
                    <p><strong>Journal:</strong> Reflect on your health journey with regular journal entries.</p>
                </div>
                <div class="help-section">
                    <h3>🏆 Status Badges</h3>
                    <p>Earn badges by maintaining consistency! Complete all daily medications, log vitals regularly, and write journal entries to unlock achievements.</p>
                </div>
                <div class="help-section">
                    <h3>💡 Insights</h3>
                    <p>View personalized insights based on your tracking data and see your earned achievements.</p>
                </div>
                <div class="help-section">
                    <h3>👤 Profile</h3>
                    <p>Manage your personal information and set health goals to stay motivated.</p>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 4000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===================================
// ADD ANIMATION STYLES
// ===================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .notification-message {
        font-size: 0.95rem;
    }
    
    .help-modal {
        background-color: white;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    
    .help-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid #D4C4B0;
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 1;
    }
    
    .help-modal-header h2 {
        color: #1D0D0A;
        margin: 0;
        font-size: 1.5rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #5C4D44;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .close-modal:hover {
        background-color: #F5EBE0;
        color: #1D0D0A;
    }
    
    .help-modal-content {
        padding: 1.5rem;
    }
    
    .help-section {
        margin-bottom: 1.5rem;
    }
    
    .help-section:last-child {
        margin-bottom: 0;
    }
    
    .help-section h3 {
        color: #1D0D0A;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
    }
    
    .help-section p {
        color: #5C4D44;
        line-height: 1.6;
        margin-bottom: 0.5rem;
    }
    
    .help-section p:last-child {
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);

// ===================================
// EXPOSE FUNCTIONS GLOBALLY
// ===================================

window.navigateToPage = navigateToPage;
window.showNotification = showNotification;
window.showHelpModal = showHelpModal;
