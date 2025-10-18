/* ============================================
   ONBOARDING TRANSITION FIX
   Add this code to your app.js file
   ============================================ */

// Add this at the beginning of your app.js or in a <script> tag

// Function to show onboarding
function showOnboarding() {
    document.body.classList.add('onboarding-active');
    const onboardingContainer = document.querySelector('.onboarding-container');
    if (onboardingContainer) {
        onboardingContainer.style.display = 'block';
    }
}

// Function to hide onboarding and show main app
function hideOnboarding() {
    document.body.classList.remove('onboarding-active');
    const onboardingContainer = document.querySelector('.onboarding-container');
    if (onboardingContainer) {
        onboardingContainer.style.display = 'none';
    }
}

// Check if user has completed onboarding
function checkOnboardingStatus() {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (hasCompletedOnboarding === 'true') {
        // User has completed onboarding, show main app
        hideOnboarding();
    } else {
        // User hasn't completed onboarding, show onboarding
        showOnboarding();
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkOnboardingStatus();
    
    // Handle "Skip Tour" button
    const skipButton = document.getElementById('skipOnboarding');
    if (skipButton) {
        skipButton.addEventListener('click', function() {
            localStorage.setItem('hasCompletedOnboarding', 'true');
            hideOnboarding();
        });
    }
    
    // Handle "Load Sample Data" button
    const loadSampleButton = document.getElementById('loadSampleDataBtn');
    if (loadSampleButton) {
        loadSampleButton.addEventListener('click', function() {
            localStorage.setItem('hasCompletedOnboarding', 'true');
            // Your existing sample data loading code here
            hideOnboarding();
        });
    }
    
    // Handle "Start Fresh" button
    const startFreshButton = document.getElementById('startFreshBtn');
    if (startFreshButton) {
        startFreshButton.addEventListener('click', function() {
            localStorage.setItem('hasCompletedOnboarding', 'true');
            hideOnboarding();
        });
    }
    
    // Handle "View Tutorial" from menu (to re-show onboarding)
    const viewTutorialButton = document.getElementById('viewTutorial');
    if (viewTutorialButton) {
        viewTutorialButton.addEventListener('click', function() {
            showOnboarding();
        });
    }
});

// Optional: Add a function to reset onboarding (for testing)
function resetOnboarding() {
    localStorage.removeItem('hasCompletedOnboarding');
    showOnboarding();
}

// Make it available globally for debugging
window.resetOnboarding = resetOnboarding;
window.showOnboarding = showOnboarding;
window.hideOnboarding = hideOnboarding;
