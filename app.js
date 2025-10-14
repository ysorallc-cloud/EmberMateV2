// =====================================================
// EMBERMATE - APPLICATION LOGIC
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupSidebar();
    setupTrackTabs();
    setupMedicationTracking();
    setupMoodButtons();
}

// =====================================================
// NAVIGATION SYSTEM
// =====================================================

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            const targetPageElement = document.getElementById(`${targetPage}-page`);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
            
            // Close sidebar on mobile
            const sidebar = document.getElementById('sidebar');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// =====================================================
// SIDEBAR TOGGLE
// =====================================================

function setupSidebar() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// =====================================================
// TRACK TABS
// =====================================================

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
            const targetContent = document.getElementById(`${targetTrack}-track`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// =====================================================
// MEDICATION TRACKING
// =====================================================

function setupMedicationTracking() {
    const medItems = document.querySelectorAll('.med-item.pending');
    
    medItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('pending')) {
                // Mark as completed
                this.classList.remove('pending');
                this.classList.add('completed');
                
                // Update checkbox
                const checkbox = this.querySelector('.med-checkbox');
                checkbox.textContent = '✓';
                checkbox.style.backgroundColor = 'var(--success)';
                checkbox.style.color = 'white';
                checkbox.style.border = 'none';
                
                // Update info text
                const info = this.querySelector('.med-info p');
                const medName = this.querySelector('.med-info h4').textContent;
                const currentTime = new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                info.textContent = `Taken at ${currentTime}`;
                
                // Show notification
                showNotification(`Great job! ${medName} marked as taken.`, 'success');
                
                // Update badge count
                updateMedicationBadge();
            }
        });
    });
}

function updateMedicationBadge() {
    const completedCount = document.querySelectorAll('.med-item.completed').length;
    const totalCount = document.querySelectorAll('.med-item').length;
    
    // Update stat card
    const statValue = document.querySelector('.medications-card .stat-value');
    if (statValue) {
        statValue.textContent = `${completedCount}/${totalCount}`;
    }
    
    // Update tab badge
    const tabBadge = document.querySelector('[data-track="medications"] .tab-badge');
    if (tabBadge) {
        tabBadge.textContent = `${completedCount}/${totalCount}`;
    }
    
    // Update stat badge if all completed
    if (completedCount === totalCount) {
        const statBadge = document.querySelector('.medications-card .stat-badge');
        if (statBadge) {
            statBadge.textContent = 'Perfect!';
            statBadge.className = 'stat-badge success';
        }
        showNotification('🎉 Amazing! All medications taken today!', 'success');
    }
}

// =====================================================
// MOOD BUTTONS
// =====================================================

function setupMoodButtons() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected to clicked button
            this.classList.add('selected');
        });
    });
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    const bgColor = getNotificationColor(type);
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.3rem;">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 140px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-size: 0.95rem;
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
        success: '#7FA88C',
        info: '#82B5B8',
        warning: '#E6A87C',
        error: '#D89090'
    };
    return colors[type] || colors.info;
}

// =====================================================
// ADD ANIMATION STYLES
// =====================================================

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
`;
document.head.appendChild(style);

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Add any additional utility functions here
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
