// EmberMate Authentication System
// Implements secure login, registration, password management, and OAuth integration

const AuthSystem = {
    // Current user session
    currentUser: null,
    
    // Password requirements
    passwordRequirements: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },
    
    // Initialize authentication system
    init() {
        // Check for existing session
        this.checkSession();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize OAuth buttons
        this.initializeOAuth();
    },
    
    // Check if user has active session
    checkSession() {
        const sessionData = localStorage.getItem('embermate_session');
        const encryptionEnabled = localStorage.getItem('embermate_encryption_enabled');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const sessionExpiry = new Date(session.expiry);
                const now = new Date();
                
                if (sessionExpiry > now) {
                    this.currentUser = session.user;
                    
                    // If encryption is enabled, prompt for password
                    if (encryptionEnabled === 'true') {
                        this.promptForEncryptionPassword();
                    } else {
                        this.showApp();
                    }
                } else {
                    // Session expired
                    this.logout();
                }
            } catch (error) {
                console.error('Session check failed:', error);
                this.logout();
            }
        } else {
            this.showAuthScreen();
        }
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
        
        // Show/hide password toggles
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', () => this.togglePasswordVisibility(button));
        });
        
        // Password strength indicator
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.updatePasswordStrength(passwordInput.value);
            });
        }
        
        // Form switching
        const showRegisterBtn = document.getElementById('showRegister');
        const showLoginBtn = document.getElementById('showLogin');
        
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => this.switchToRegister());
        }
        
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => this.switchToLogin());
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    },
    
    // Handle login
    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        if (!email || !password) {
            this.showError('Please enter both email and password');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }
        
        // Retrieve stored user
        const users = JSON.parse(localStorage.getItem('embermate_users') || '{}');
        const user = users[email];
        
        if (!user) {
            this.showError('Account not found. Please register.');
            return;
        }
        
        // Verify password
        if (!this.verifyPassword(password, user.passwordHash)) {
            this.showError('Incorrect password');
            return;
        }
        
        // Create session
        this.createSession(user, remember);
        
        // Show success
        this.showSuccess('Login successful!');
        
        // Check if encryption is enabled
        const encryptionEnabled = localStorage.getItem('embermate_encryption_enabled');
        if (encryptionEnabled === 'true') {
            this.promptForEncryptionPassword();
        } else {
            setTimeout(() => this.showApp(), 1000);
        }
    },
    
    // Handle registration
    handleRegistration() {
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate inputs
        if (!email || !password || !confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }
        
        if (!agreeTerms) {
            this.showError('Please agree to the terms and conditions');
            return;
        }
        
        // Check password strength
        const strength = this.checkPasswordStrength(password);
        if (strength.score < 3) {
            this.showError('Password is too weak. ' + strength.feedback);
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('embermate_users') || '{}');
        if (users[email]) {
            this.showError('Account already exists. Please login.');
            return;
        }
        
        // Hash password
        const passwordHash = this.hashPassword(password);
        
        // Create user
        const user = {
            email: email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
            profile: {
                name: '',
                phone: '',
                emergencyContact: ''
            }
        };
        
        // Store user
        users[email] = user;
        localStorage.setItem('embermate_users', JSON.stringify(users));
        
        // Show success
        this.showSuccess('Account created successfully! Please login.');
        
        // Switch to login
        setTimeout(() => {
            this.switchToLogin();
            document.getElementById('loginEmail').value = email;
        }, 1500);
    },
    
    // Create user session
    createSession(user, remember) {
        const sessionDuration = remember ? 30 : 1; // 30 days or 1 day
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + sessionDuration);
        
        const session = {
            user: {
                email: user.email,
                profile: user.profile
            },
            expiry: expiry.toISOString(),
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('embermate_session', JSON.stringify(session));
        this.currentUser = session.user;
    },
    
    // Logout
    logout() {
        // Clear session
        localStorage.removeItem('embermate_session');
        this.currentUser = null;
        
        // Clear encryption key if exists
        if (window.EncryptionManager) {
            window.EncryptionManager.encryptionKey = null;
        }
        
        // Show auth screen
        this.showAuthScreen();
        
        // Show success message
        this.showSuccess('Logged out successfully');
    },
    
    // Prompt for encryption password
    promptForEncryptionPassword() {
        const modal = document.getElementById('encryptionPasswordModal');
        if (modal) {
            modal.style.display = 'flex';
            
            const form = document.getElementById('encryptionPasswordForm');
            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const password = document.getElementById('encryptionPassword').value;
                    
                    if (window.EncryptionManager) {
                        window.EncryptionManager.setEncryptionKey(password);
                        modal.style.display = 'none';
                        this.showApp();
                    }
                };
            }
        } else {
            this.showApp();
        }
    },
    
    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Check password strength
    checkPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        // Length check
        if (password.length >= this.passwordRequirements.minLength) {
            score++;
        } else {
            feedback.push(`Must be at least ${this.passwordRequirements.minLength} characters`);
        }
        
        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score++;
        } else if (this.passwordRequirements.requireUppercase) {
            feedback.push('Include uppercase letters');
        }
        
        // Lowercase check
        if (/[a-z]/.test(password)) {
            score++;
        } else if (this.passwordRequirements.requireLowercase) {
            feedback.push('Include lowercase letters');
        }
        
        // Number check
        if (/[0-9]/.test(password)) {
            score++;
        } else if (this.passwordRequirements.requireNumbers) {
            feedback.push('Include numbers');
        }
        
        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score++;
        } else if (this.passwordRequirements.requireSpecialChars) {
            feedback.push('Include special characters');
        }
        
        return {
            score: score,
            feedback: feedback.join(', ')
        };
    },
    
    // Update password strength indicator
    updatePasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrengthText');
        
        if (!strengthBar || !strengthText) return;
        
        const strength = this.checkPasswordStrength(password);
        const percentage = (strength.score / 5) * 100;
        
        strengthBar.style.width = percentage + '%';
        
        let color, text;
        if (strength.score <= 2) {
            color = '#ef4444';
            text = 'Weak';
        } else if (strength.score <= 3) {
            color = '#f59e0b';
            text = 'Fair';
        } else if (strength.score <= 4) {
            color = '#14b8a6';
            text = 'Good';
        } else {
            color = '#10b981';
            text = 'Strong';
        }
        
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    },
    
    // Hash password (simple implementation - use bcrypt in production)
    hashPassword(password) {
        // In production, use a proper hashing library like bcrypt
        // This is a simple hash for demo purposes
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },
    
    // Verify password
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    },
    
    // Toggle password visibility
    togglePasswordVisibility(button) {
        const input = button.previousElementSibling;
        if (input && input.type) {
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '👁️‍🗨️';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        }
    },
    
    // Switch to register form
    switchToRegister() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('registerContainer').style.display = 'block';
    },
    
    // Switch to login form
    switchToLogin() {
        document.getElementById('registerContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    },
    
    // Show authentication screen
    showAuthScreen() {
        const authScreen = document.getElementById('authScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (authScreen) authScreen.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    },
    
    // Show app
    showApp() {
        const authScreen = document.getElementById('authScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (authScreen) authScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        // Update user info in app
        this.updateUserInfo();
    },
    
    // Update user info in app
    updateUserInfo() {
        if (this.currentUser) {
            const userEmailElements = document.querySelectorAll('.user-email');
            userEmailElements.forEach(el => {
                el.textContent = this.currentUser.email;
            });
        }
    },
    
    // Initialize OAuth
    initializeOAuth() {
        // Google OAuth
        const googleBtn = document.getElementById('googleOAuth');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleOAuthLogin('google');
            });
        }
        
        // Microsoft OAuth
        const microsoftBtn = document.getElementById('microsoftOAuth');
        if (microsoftBtn) {
            microsoftBtn.addEventListener('click', () => {
                this.handleOAuthLogin('microsoft');
            });
        }
        
        // Apple OAuth
        const appleBtn = document.getElementById('appleOAuth');
        if (appleBtn) {
            appleBtn.addEventListener('click', () => {
                this.handleOAuthLogin('apple');
            });
        }
    },
    
    // Handle OAuth login
    handleOAuthLogin(provider) {
        // In production, implement actual OAuth flow
        // This is a demo implementation
        this.showInfo(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth would be triggered here. In demo mode, creating a test account...`);
        
        // Create demo account
        const demoEmail = `demo@${provider}.com`;
        const demoUser = {
            email: demoEmail,
            passwordHash: 'oauth_user',
            createdAt: new Date().toISOString(),
            profile: {
                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                phone: '',
                emergencyContact: ''
            },
            authProvider: provider
        };
        
        // Store demo user
        const users = JSON.parse(localStorage.getItem('embermate_users') || '{}');
        users[demoEmail] = demoUser;
        localStorage.setItem('embermate_users', JSON.stringify(users));
        
        // Create session
        this.createSession(demoUser, true);
        
        setTimeout(() => {
            this.showSuccess(`Logged in with ${provider}!`);
            this.showApp();
        }, 1000);
    },
    
    // Show error message
    showError(message) {
        this.showMessage(message, 'error');
    },
    
    // Show success message
    showSuccess(message) {
        this.showMessage(message, 'success');
    },
    
    // Show info message
    showInfo(message) {
        this.showMessage(message, 'info');
    },
    
    // Show message
    showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll('.auth-message').forEach(el => el.remove());
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `auth-message auth-message-${type}`;
        messageEl.textContent = message;
        
        // Find active form
        const loginContainer = document.getElementById('loginContainer');
        const registerContainer = document.getElementById('registerContainer');
        const activeContainer = loginContainer.style.display !== 'none' ? loginContainer : registerContainer;
        
        // Insert message
        if (activeContainer) {
            const form = activeContainer.querySelector('form');
            if (form) {
                form.insertBefore(messageEl, form.firstChild);
            }
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AuthSystem.init();
    });
} else {
    AuthSystem.init();
}

// Make available globally
window.AuthSystem = AuthSystem;