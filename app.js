// EmberMate - Care Management Dashboard
// Simple interactions and functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add medication button
    const addMedBtn = document.querySelector('.section#medications .btn-add');
    if (addMedBtn) {
        addMedBtn.addEventListener('click', function() {
            alert('Add medication form would open here');
        });
    }

    // Add appointment button
    const addApptBtn = document.querySelector('.section#appointments .btn-add');
    if (addApptBtn) {
        addApptBtn.addEventListener('click', function() {
            alert('Add appointment form would open here');
        });
    }

    // Add note button
    const addNoteBtn = document.querySelector('.section#notes .btn-add');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', function() {
            alert('Add note form would open here');
        });
    }

    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-action');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Edit form would open here');
        });
    });

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('span:last-child').textContent;
            alert(`${actionText} functionality would open here`);
        });
    });

    // Smooth scroll for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href !== '#home') {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});
