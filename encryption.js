/**
 * EmberMate Encryption Module
 * 
 * Provides AES-256 encryption for health data stored in localStorage.
 * No data ever leaves the user's device - encryption happens client-side.
 * 
 * Dependencies: crypto-js (included via CDN in index.html)
 */

const EmberSecurity = {
    isLocked: false,
    password: null,
    
    /**
     * Initialize encryption system on page load
     */
    init() {
        // Check if app is password-protected
        const locked = localStorage.getItem('ember_locked');
        const hasData = localStorage.getItem('medications') || 
                       localStorage.getItem('vitals') || 
                       localStorage.getItem('appointments');
        
        if (locked === 'true' && hasData) {
            this.isLocked = true;
            this.showUnlockScreen();
        }
    },
    
    /**
     * Show password setup screen for first-time users
     */
    showPasswordSetup() {
        const modal = document.createElement('div');
        modal.className = 'security-modal';
        modal.innerHTML = `
            <div class="security-modal-content">
                <div class="security-header">
                    <span class="security-icon">🔒</span>
                    <h2>Protect Your Health Data</h2>
                    <p>Set a master password to encrypt all your health information</p>
                </div>
                <div class="security-form">
                    <div class="form-group">
                        <label>Master Password</label>
                        <input type="password" id="setupPassword" 
                               placeholder="Enter a strong password" 
                               minlength="8" required>
                        <small>Minimum 8 characters. Choose something memorable - there's no password reset.</small>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="confirmPassword" 
                               placeholder="Re-enter password" required>
                    </div>
                    <div class="security-warning">
                        <strong>⚠️ Important:</strong> There is no password recovery. 
                        If you forget this password, you'll lose access to your encrypted data.
                    </div>
                    <div class="security-actions">
                        <button class="btn-secondary" onclick="EmberSecurity.skipEncryption()">
                            Skip (Not Recommended)
                        </button>
                        <button class="btn-primary" onclick="EmberSecurity.setupPassword()">
                            Enable Encryption
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    /**
     * Show unlock screen when app starts with encrypted data
     */
    showUnlockScreen() {
        // Hide main app content
        const appContent = document.getElementById('app-content');
        if (appContent) appContent.style.display = 'none';
        
        const modal = document.createElement('div');
        modal.className = 'security-modal';
        modal.id = 'unlockModal';
        modal.innerHTML = `
            <div class="security-modal-content unlock-screen">
                <div class="security-header">
                    <span class="security-icon">🔐</span>
                    <h2>EmberMate is Locked</h2>
                    <p>Enter your master password to access your health data</p>
                </div>
                <div class="security-form">
                    <div class="form-group">
                        <input type="password" id="unlockPassword" 
                               placeholder="Master password" 
                               onkeypress="if(event.key==='Enter') EmberSecurity.unlock()">
                        <div id="unlockError" class="error-message" style="display:none;"></div>
                    </div>
                    <div class="security-actions">
                        <button class="btn-primary btn-block" onclick="EmberSecurity.unlock()">
                            🔓 Unlock EmberMate
                        </button>
                    </div>
                    <div class="security-footer">
                        <a href="#" onclick="EmberSecurity.showForgotPassword()">Forgot password?</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Focus password field
        setTimeout(() => {
            document.getElementById('unlockPassword')?.focus();
        }, 100);
    },
    
    /**
     * Set up master password and encrypt existing data
     */
    setupPassword() {
        const password = document.getElementById('setupPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        
        if (!password || password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        if (password !== confirm) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // Store password in session (not in localStorage!)
        this.password = password;
        localStorage.setItem('ember_locked', 'true');
        
        // Encrypt all existing data
        this.encryptAllData();
        
        // Remove modal
        document.querySelector('.security-modal').remove();
        
        showToast('🔒 Encryption enabled! Your data is now protected.', 'success');
    },
    
    /**
     * Skip encryption setup (not recommended)
     */
    skipEncryption() {
        if (confirm('Are you sure? Your health data will NOT be encrypted and anyone with access to your device can read it.')) {
            localStorage.setItem('ember_locked', 'false');
            document.querySelector('.security-modal').remove();
            showToast('Encryption skipped. You can enable it later in Settings.', 'warning');
        }
    },
    
    /**
     * Unlock the app with master password
     */
    unlock() {
        const password = document.getElementById('unlockPassword').value;
        
        if (!password) {
            this.showError('Please enter your password');
            return;
        }
        
        // Try to decrypt a test value to verify password
        try {
            const testData = localStorage.getItem('medications');
            if (testData) {
                // Try to decrypt - if it fails, password is wrong
                const decrypted = CryptoJS.AES.decrypt(testData, password);
                const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
                
                if (!decryptedStr) {
                    throw new Error('Invalid password');
                }
                
                // Password is correct!
                this.password = password;
                this.isLocked = false;
                
                // Remove unlock screen
                document.getElementById('unlockModal').remove();
                
                // Show app content
                const appContent = document.getElementById('app-content');
                if (appContent) appContent.style.display = 'block';
                
                showToast('🔓 Welcome back!', 'success');
                
                // Refresh data displays
                if (typeof loadDashboardData === 'function') {
                    loadDashboardData();
                }
            }
        } catch (error) {
            this.showError('Incorrect password. Please try again.');
            document.getElementById('unlockPassword').value = '';
        }
    },
    
    /**
     * Show error message on unlock screen
     */
    showError(message) {
        const errorDiv = document.getElementById('unlockError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    },
    
    /**
     * Show forgot password help
     */
    showForgotPassword() {
        alert(
            '⚠️ Password Recovery Not Available\n\n' +
            'EmberMate uses client-side encryption with no server backup. ' +
            'If you\'ve forgotten your password, your encrypted data cannot be recovered.\n\n' +
            'Options:\n' +
            '1. Keep trying passwords you might have used\n' +
            '2. Contact support if you have a recent unencrypted backup\n' +
            '3. Reset app data (WARNING: This deletes everything)\n\n' +
            'This is the privacy trade-off: your data is 100% secure because only YOU have the key.'
        );
        return false;
    },
    
    /**
     * Encrypt a single piece of data
     */
    encrypt(data) {
        if (!this.password) return data;
        
        try {
            const jsonStr = JSON.stringify(data);
            return CryptoJS.AES.encrypt(jsonStr, this.password).toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return data;
        }
    },
    
    /**
     * Decrypt a single piece of data
     */
    decrypt(encryptedData) {
        if (!this.password || !encryptedData) return encryptedData;
        
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.password);
            const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedStr ? JSON.parse(decryptedStr) : encryptedData;
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },
    
    /**
     * Encrypt all existing localStorage data
     */
    encryptAllData() {
        if (!this.password) return;
        
        const keys = ['medications', 'vitals', 'appointments', 'careTeam', 'journal', 'reminders'];
        
        keys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data && !this.isEncrypted(data)) {
                try {
                    const parsed = JSON.parse(data);
                    const encrypted = this.encrypt(parsed);
                    localStorage.setItem(key, encrypted);
                } catch (error) {
                    console.error(`Error encrypting ${key}:`, error);
                }
            }
        });
    },
    
    /**
     * Check if data is already encrypted
     */
    isEncrypted(data) {
        try {
            JSON.parse(data);
            return false; // If it parses as JSON, it's not encrypted
        } catch {
            return true; // If it doesn't parse, it's likely encrypted
        }
    },
    
    /**
     * Save encrypted data to localStorage
     */
    saveEncrypted(key, data) {
        const encrypted = this.encrypt(data);
        localStorage.setItem(key, encrypted);
    },
    
    /**
     * Load and decrypt data from localStorage
     */
    loadEncrypted(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        if (this.password && this.isEncrypted(data)) {
            return this.decrypt(data);
        }
        
        // Data is not encrypted, return as-is
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    },
    
    /**
     * Change master password
     */
    changePassword(oldPassword, newPassword) {
        if (oldPassword !== this.password) {
            showToast('Current password is incorrect', 'error');
            return false;
        }
        
        // Decrypt all data with old password
        const keys = ['medications', 'vitals', 'appointments', 'careTeam', 'journal', 'reminders'];
        const decryptedData = {};
        
        keys.forEach(key => {
            const data = this.loadEncrypted(key);
            if (data) {
                decryptedData[key] = data;
            }
        });
        
        // Update password
        this.password = newPassword;
        
        // Re-encrypt all data with new password
        Object.keys(decryptedData).forEach(key => {
            this.saveEncrypted(key, decryptedData[key]);
        });
        
        showToast('🔒 Master password updated successfully', 'success');
        return true;
    },
    
    /**
     * Disable encryption (decrypt all data)
     */
    disableEncryption(password) {
        if (password !== this.password) {
            showToast('Password is incorrect', 'error');
            return false;
        }
        
        // Decrypt all data
        const keys = ['medications', 'vitals', 'appointments', 'careTeam', 'journal', 'reminders'];
        
        keys.forEach(key => {
            const data = this.loadEncrypted(key);
            if (data) {
                localStorage.setItem(key, JSON.stringify(data));
            }
        });
        
        // Clear encryption flag
        localStorage.setItem('ember_locked', 'false');
        this.password = null;
        this.isLocked = false;
        
        showToast('Encryption disabled. Your data is no longer protected.', 'warning');
        return true;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EmberSecurity.init());
} else {
    EmberSecurity.init();
}
