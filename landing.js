// Landing page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Get Started' || 
                buttonText === 'Start Free' || 
                buttonText === 'Create Free Account') {
                // Redirect to main dashboard
                window.location.href = 'index.html';
            } else if (buttonText === 'Learn More') {
                // Smooth scroll to features
                const features = document.querySelector('.features');
                if (features) {
                    features.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
