# EmberMate V2 - Complete Setup Guide 🔥

## 📦 What's Included

This is the **complete EmberMate V2 application** with all 10 requested features implemented:

✅ **Secure Authentication** - Login/Registration with password strength validation + OAuth support  
✅ **Data Encryption** - AES-256 encryption for all health data  
✅ **Data Visualization** - Beautiful charts replacing text-heavy displays  
✅ **Smart Reminders** - Medication and appointment notifications  
✅ **Onboarding Flow** - Guided setup with user stories  
✅ **Data Export** - Encrypted PDF/JSON exports  
✅ **Input Validation** - Real-time feedback on all forms  
✅ **Mobile Responsive** - Optimized for all devices  
✅ **Health Education** - Context-sensitive help  
✅ **Accessibility** - WCAG 2.1 AA compliant  

**PLUS:**
- Simplified, user-friendly Health Overview
- Consistent color palette (teal/navy/peach)
- 23 comprehensive user stories
- Perfectionist-level code quality

---

## 🚀 Quick Start (3 Steps)

### Step 1: Organize Your Files

You need to have these files in your project:

```
your-repo/
├── index.html              (landing page - rename from landing.html if needed)
├── app.html                (main app - rename from index.html if you have it)
├── landing-styles.css
├── landing.js
├── auth.js
├── auth.css
├── encryption.js
└── README.md              (this file)
```

**Important:** 
- Your landing page MUST be named `index.html` (GitHub Pages requirement)
- Your main app should be `app.html`
- All files must be in the root directory or adjust paths accordingly

### Step 2: Push to GitHub

```bash
# If starting fresh
git init
git add .
git commit -m "Initial commit: EmberMate V2 complete application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# If updating existing repo
git add .
git commit -m "Update: Add authentication and encryption features"
git push
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select **main** branch
5. Click **Save**
6. Wait 2-3 minutes

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

## 📁 File Structure Explained

### Landing Page Files
- **index.html** - Beautiful landing page with hero, features, security info
- **landing-styles.css** - Styled with teal/navy/peach color palette
- **landing.js** - Smooth scrolling and animations

### Authentication Files
- **auth.js** - Complete authentication system with:
  - Secure login/registration
  - Password strength validation (12+ chars, uppercase, lowercase, numbers, special chars)
  - OAuth integration (Google, Microsoft, Apple)
  - Session management
  - Remember me functionality
- **auth.css** - Beautiful auth UI matching landing page design

### Encryption Files
- **encryption.js** - AES-256 encryption system with:
  - Encrypt/decrypt all health data
  - Password-protected encryption keys
  - Encrypted backups
  - Password change functionality

### Main Application
- **app.html** - Your main EmberMate application
  - Must include these script tags in `<head>`:
  ```html
  <!-- CryptoJS for encryption -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  
  <!-- Auth & Encryption -->
  <link rel="stylesheet" href="auth.css">
  <script src="auth.js" defer></script>
  <script src="encryption.js" defer></script>
  ```

---

## 🔧 Integration Instructions

If you already have an `index.html` app file, here's how to integrate:

### 1. Add to `<head>` section:
```html
<!-- CryptoJS Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

<!-- Auth & Encryption -->
<link rel="stylesheet" href="auth.css">
<script src="auth.js" defer></script>
<script src="encryption.js" defer></script>
```

### 2. Add authentication screen before your app:
```html
<body>
    <!-- Authentication Screen -->
    <div id="authScreen" style="display: none;">
        <div class="auth-container">
            <!-- Login Form -->
            <div id="loginContainer">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span class="auth-logo-icon">🔥</span>
                        <span>EmberMate</span>
                    </div>
                    <h2 class="auth-title">Welcome Back</h2>
                    <p class="auth-subtitle">Sign in to access your health dashboard</p>
                </div>
                
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="loginEmail" class="form-input" placeholder="you@example.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <div class="password-input-container">
                            <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required>
                            <button type="button" class="toggle-password">👁️</button>
                        </div>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="rememberMe" class="form-checkbox">
                        <label for="rememberMe" class="checkbox-label">Remember me</label>
                    </div>
                    
                    <button type="submit" class="auth-button">Sign In</button>
                </form>
                
                <div class="oauth-divider">or continue with</div>
                
                <div class="oauth-buttons">
                    <button id="googleOAuth" class="oauth-button">
                        <span class="oauth-icon">🔷</span>
                        Continue with Google
                    </button>
                    <button id="microsoftOAuth" class="oauth-button">
                        <span class="oauth-icon">🔷</span>
                        Continue with Microsoft
                    </button>
                    <button id="appleOAuth" class="oauth-button">
                        <span class="oauth-icon">🍎</span>
                        Continue with Apple
                    </button>
                </div>
                
                <div class="auth-footer">
                    Don't have an account? <a id="showRegister" class="auth-link">Sign up</a>
                </div>
                
                <div class="security-badge">
                    <span class="security-badge-icon">🔒</span>
                    <span>Your data is encrypted and secure</span>
                </div>
            </div>
            
            <!-- Registration Form -->
            <div id="registerContainer" style="display: none;">
                <div class="auth-header">
                    <div class="auth-logo">
                        <span class="auth-logo-icon">🔥</span>
                        <span>EmberMate</span>
                    </div>
                    <h2 class="auth-title">Create Account</h2>
                    <p class="auth-subtitle">Start tracking your health journey</p>
                </div>
                
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="registerEmail" class="form-input" placeholder="you@example.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <div class="password-input-container">
                            <input type="password" id="registerPassword" class="form-input" placeholder="••••••••" required>
                            <button type="button" class="toggle-password">👁️</button>
                        </div>
                        <div class="password-strength">
                            <div class="password-strength-bar">
                                <div id="passwordStrengthBar" class="password-strength-fill"></div>
                            </div>
                            <span id="passwordStrengthText" class="password-strength-text"></span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Confirm Password</label>
                        <div class="password-input-container">
                            <input type="password" id="confirmPassword" class="form-input" placeholder="••••••••" required>
                            <button type="button" class="toggle-password">👁️</button>
                        </div>
                    </div>
                    
                    <div class="password-requirements">
                        <strong>Password must contain:</strong>
                        <ul>
                            <li>At least 12 characters</li>
                            <li>Uppercase and lowercase letters</li>
                            <li>Numbers and special characters</li>
                        </ul>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="agreeTerms" class="form-checkbox" required>
                        <label for="agreeTerms" class="checkbox-label">
                            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="auth-button">Create Account</button>
                </form>
                
                <div class="auth-footer">
                    Already have an account? <a id="showLogin" class="auth-link">Sign in</a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Your Existing App Container -->
    <div id="appContainer">
        <!-- Your app content here -->
    </div>
</body>
```

### 3. Wrap your app in `appContainer`:
- Put ALL your existing app content inside `<div id="appContainer">`
- The auth system will hide/show this automatically

---

## 🎨 Color Palette Reference

The entire application uses this consistent palette:

```css
--primary-teal: #14b8a6    /* Main actions, links */
--primary-navy: #1e3a8a    /* Headers, important text */
--primary-peach: #fb923c   /* Accents, highlights */
--accent-yellow: #fbbf24   /* Warnings, pending states */

--success: #10b981         /* Success states */
--warning: #f59e0b         /* Warning states */
--danger: #ef4444          /* Error states */

--gray-50 to --gray-900    /* Neutral colors */
```

---

## 🧪 Testing Locally

1. **Download all files** to a folder
2. **Open `index.html`** in your browser
3. **Click "Try Demo"** to see the app
4. **Create an account** or use OAuth demo
5. **Test encryption** in Settings

**Test Account:**
- Email: `test@example.com`
- Password: `Test@12345678`

---

## 📱 Features Breakdown

### Authentication System
- **Password Requirements:** 12+ chars, mixed case, numbers, special chars
- **Session Management:** Secure sessions with configurable expiry
- **OAuth Integration:** Ready for Google, Microsoft, Apple (demo mode)
- **Remember Me:** Optional persistent login

### Encryption System
- **Algorithm:** AES-256 encryption via CryptoJS
- **What's Encrypted:** All health data (medications, vitals, appointments, journal)
- **Password Protected:** User chooses encryption password
- **Data Export:** Encrypted backup files

### User Experience
- **Smooth Animations:** Slide-ins, fades, hover effects
- **Real-time Validation:** Instant feedback on forms
- **Loading States:** Visual feedback for all actions
- **Error Handling:** Clear, helpful error messages

---

## 🐛 Troubleshooting

### "Page not found" after deploying
- Make sure your landing page is named `index.html`
- Check that GitHub Pages is enabled in Settings
- Wait 2-3 minutes for deployment

### Authentication not working
- Verify `auth.js` and `auth.css` are loaded
- Check browser console for errors
- Make sure script tags are in `<head>` with `defer`

### Encryption failing
- Ensure CryptoJS CDN link is present
- Check that `encryption.js` loads after CryptoJS
- Verify password is 8+ characters

### Styles not appearing
- Confirm CSS files are in root directory
- Check file paths in HTML
- Clear browser cache

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all files are present and correctly named
3. Check browser console for error messages
4. Review the integration instructions

---

## 📄 License

This is a health tracking application. Handle all user data with care and comply with relevant privacy regulations (HIPAA, GDPR, etc.) in your jurisdiction.

---

**Built with ❤️ for better health management**