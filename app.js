// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');

            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            // Add active class to clicked link and corresponding page
            this.classList.add('active');
            document.getElementById(`${pageName}-page`).classList.add('active');
        });
    });

    // Medication checkbox interaction
    const medCheckboxes = document.querySelectorAll('.med-checkbox:not(.checked)');
    medCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const medicationItem = this.closest('.medication-item');
            
            // Toggle completed state
            this.classList.add('checked');
            this.textContent = '✓';
            medicationItem.classList.remove('pending');
            medicationItem.classList.add('completed');
            
            // Update badge
            const badge = medicationItem.querySelector('.med-badge');
            badge.textContent = 'Completed';
            badge.classList.remove('pending-badge');

            // Show encouraging message
            showEncouragement('Great job! Keep up the good work! 🎉');
        });
    });

    // Add buttons
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (buttonText.includes('Medication')) {
                showEncouragement('Ready to add a new medication! 💊');
            } else if (buttonText.includes('Reading')) {
                showEncouragement('Time to log your vitals! ❤️');
            } else if (buttonText.includes('Journal')) {
                showEncouragement('Share your thoughts with us! 📝');
            }
        });
    });
});

// Show encouraging messages
function showEncouragement(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'encouragement-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #1e88e5, #42a5f5);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(30, 136, 229, 0.3);
        z-index: 1000;
        animation: slideIn 0.4s ease, slideOut 0.4s ease 2.6s;
        font-weight: 500;
    `;

    // Add keyframes if not already present
    if (!document.getElementById('encouragement-keyframes')) {
        const style = document.createElement('style');
        style.id = 'encouragement-keyframes';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
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
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
