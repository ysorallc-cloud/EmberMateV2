// EmberMate Encryption Module
// Handles encryption/decryption of health data using AES-256

const EncryptionManager = {
    // Encryption key stored in memory (never persisted)
    encryptionKey: null,
    isEncryptionEnabled: false,
    
    // Storage keys that should be encrypted
    encryptedKeys: [
        'embermate_medications',
        'embermate_bp_readings',
        'embermate_glucose_readings',
        'embermate_weight_readings',
        'embermate_journal_entries',
        'embermate_appointments',
        'embermate_care_team'
    ],

    // Initialize encryption system
    init() {
        console.log('EncryptionManager: Initializing...');
        
        // Check if encryption was previously enabled
        const encryptionStatus = localStorage.getItem('embermate_encryption_enabled');
        this.isEncryptionEnabled = encryptionStatus === 'true';
        
        if (this.isEncryptionEnabled) {
            console.log('EncryptionManager: Encryption is enabled, prompting for password');
            this.promptForPassword();
        }
        
        // Add encryption controls to settings page after DOM loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.addEncryptionControls());
        } else {
            this.addEncryptionControls();
        }
    },

    // Prompt user for password
    promptForPassword() {
        const password = prompt('🔒 Enter your encryption password to unlock your data:');
        if (password) {
            if (this.verifyPassword(password)) {
                this.setEncryptionKey(password);
                alert('✓ Data unlocked successfully!');
            } else {
                alert('❌ Incorrect password. Your data remains encrypted.');
                // Try again
                this.promptForPassword();
            }
        } else {
            alert('⚠️ Password required to access encrypted data.');
            // Try again
            this.promptForPassword();
        }
    },

    // Set up encryption with password
    setupEncryption() {
        const password = prompt('🔐 Create a strong password for data encryption:\n\n⚠️ IMPORTANT: Store this password securely. If lost, your data CANNOT be recovered!');
        
        if (!password || password.length < 8) {
            alert('❌ Password must be at least 8 characters long.');
            return false;
        }

        const confirmPassword = prompt('🔐 Confirm your password:');
        
        if (password !== confirmPassword) {
            alert('❌ Passwords do not match. Please try again.');
            return false;
        }

        this.encryptionKey = password;
        this.isEncryptionEnabled = true;
        
        // Store password hash for verification
        const passwordHash = CryptoJS.SHA256(password).toString();
        localStorage.setItem('embermate_password_hash', passwordHash);
        localStorage.setItem('embermate_encryption_enabled', 'true');
        
        // Encrypt all existing data
        this.encryptAllData();
        
        alert('✓ Encryption enabled successfully!\n\n🔒 Your data is now encrypted. You will need to enter your password each time you use the app.');
        
        // Update UI
        this.updateEncryptionStatus();
        return true;
    },

    // Disable encryption
    disableEncryption() {
        if (!this.isEncryptionEnabled) {
            alert('ℹ️ Encryption is not currently enabled.');
            return;
        }

        const password = prompt('🔐 Enter your password to disable encryption:');
        
        if (!this.verifyPassword(password)) {
            alert('❌ Incorrect password.');
            return false;
        }

        const confirm = window.confirm('⚠️ WARNING: This will decrypt all your data and store it unencrypted.\n\nAre you sure you want to continue?');
        
        if (confirm) {
            this.decryptAllData();
            this.encryptionKey = null;
            this.isEncryptionEnabled = false;
            localStorage.setItem('embermate_encryption_enabled', 'false');
            localStorage.removeItem('embermate_password_hash');
            alert('✓ Encryption disabled. Your data is now stored unencrypted.');
            
            // Update UI
            this.updateEncryptionStatus();
            return true;
        }
        
        return false;
    },

    // Set encryption key
    setEncryptionKey(password) {
        this.encryptionKey = password;
    },

    // Verify password
    verifyPassword(password) {
        if (!password) return false;
        
        const storedHash = localStorage.getItem('embermate_password_hash');
        if (!storedHash) return false;
        
        const passwordHash = CryptoJS.SHA256(password).toString();
        return passwordHash === storedHash;
    },

    // Encrypt data
    encrypt(data) {
        if (!this.encryptionKey) {
            console.error('Encryption key not set');
            return data;
        }
        
        try {
            const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error);
            return data;
        }
    },

    // Decrypt data
    decrypt(encryptedData) {
        if (!this.encryptionKey) {
            console.error('Encryption key not set');
            return encryptedData;
        }
        
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedData;
        }
    },

    // Encrypt all data in localStorage
    encryptAllData() {
        if (!this.encryptionKey) {
            console.error('Encryption key not set');
            return;
        }
        
        this.encryptedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                // Check if already encrypted (starts with U2FsdGVk which is base64 for "Salted__")
                if (!data.startsWith('U2FsdGVk')) {
                    const encrypted = this.encrypt(data);
                    localStorage.setItem(key, encrypted);
                    console.log(`Encrypted: ${key}`);
                }
            }
        });
        
        console.log('All data encrypted');
    },

    // Decrypt all data in localStorage
    decryptAllData() {
        if (!this.encryptionKey) {
            console.error('Encryption key not set');
            return;
        }
        
        this.encryptedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                // Check if encrypted (starts with U2FsdGVk)
                if (data.startsWith('U2FsdGVk')) {
                    const decrypted = this.decrypt(data);
                    if (decrypted) {
                        localStorage.setItem(key, decrypted);
                        console.log(`Decrypted: ${key}`);
                    }
                }
            }
        });
        
        console.log('All data decrypted');
    },

    // Get data (automatically decrypt if needed)
    getData(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        // If encryption is enabled and data looks encrypted, decrypt it
        if (this.isEncryptionEnabled && this.encryptionKey && data.startsWith('U2FsdGVk')) {
            return this.decrypt(data);
        }
        
        return data;
    },

    // Set data (automatically encrypt if needed)
    setData(key, value) {
        if (this.isEncryptionEnabled && this.encryptionKey) {
            const encrypted = this.encrypt(value);
            localStorage.setItem(key, encrypted);
        } else {
            localStorage.setItem(key, value);
        }
    },

    // Add encryption controls to settings page
    addEncryptionControls() {
        // Wait for settings page to exist
        const settingsPage = document.getElementById('page-settings');
        if (!settingsPage) {
            console.log('Settings page not found, will retry...');
            setTimeout(() => this.addEncryptionControls(), 500);
            return;
        }

        // Check if already added
        if (document.getElementById('encryption-settings')) {
            return;
        }

        // Create encryption settings section
        const encryptionSection = document.createElement('div');
        encryptionSection.id = 'encryption-settings';
        encryptionSection.className = 'data-table-container';
        encryptionSection.innerHTML = `
            <div class="table-header">
                <h3 class="table-title">🔐 Data Encryption</h3>
            </div>
            <div style="padding: 24px;">
                <div id="encryption-status-display" style="margin-bottom: 16px; padding: 12px; border-radius: 6px; background: #f3f4f6;">
                    <strong>Status:</strong> <span id="encryption-status-text">Loading...</span>
                </div>
                <p style="margin-bottom: 16px; color: var(--gray-600);">
                    Encrypt your health data with AES-256 encryption. Your password never leaves your device.
                </p>
                <button id="toggle-encryption-btn" class="btn btn-primary" style="margin-right: 12px;">
                    Enable Encryption
                </button>
                <button id="change-password-btn" class="btn btn-secondary" style="display: none;">
                    Change Password
                </button>
            </div>
        `;

        // Insert before Data Management section
        const dataManagementSection = settingsPage.querySelector('.data-table-container');
        if (dataManagementSection) {
            dataManagementSection.parentNode.insertBefore(encryptionSection, dataManagementSection);
        }

        // Add event listeners
        document.getElementById('toggle-encryption-btn').addEventListener('click', () => {
            if (this.isEncryptionEnabled) {
                this.disableEncryption();
            } else {
                this.setupEncryption();
            }
        });

        document.getElementById('change-password-btn').addEventListener('click', () => {
            this.changePassword();
        });

        // Update status display
        this.updateEncryptionStatus();
    },

    // Update encryption status display
    updateEncryptionStatus() {
        const statusText = document.getElementById('encryption-status-text');
        const statusDisplay = document.getElementById('encryption-status-display');
        const toggleBtn = document.getElementById('toggle-encryption-btn');
        const changePasswordBtn = document.getElementById('change-password-btn');

        if (!statusText || !statusDisplay || !toggleBtn) return;

        if (this.isEncryptionEnabled) {
            statusText.textContent = '🔒 Enabled (Data is encrypted)';
            statusDisplay.style.background = '#d1fae5';
            statusDisplay.style.color = '#065f46';
            toggleBtn.textContent = 'Disable Encryption';
            toggleBtn.className = 'btn btn-secondary';
            if (changePasswordBtn) changePasswordBtn.style.display = 'inline-block';
        } else {
            statusText.textContent = '🔓 Disabled (Data is not encrypted)';
            statusDisplay.style.background = '#fee2e2';
            statusDisplay.style.color = '#991b1b';
            toggleBtn.textContent = 'Enable Encryption';
            toggleBtn.className = 'btn btn-primary';
            if (changePasswordBtn) changePasswordBtn.style.display = 'none';
        }
    },

    // Change password
    changePassword() {
        const oldPassword = prompt('🔐 Enter your current password:');
        
        if (!this.verifyPassword(oldPassword)) {
            alert('❌ Incorrect password.');
            return false;
        }

        const newPassword = prompt('🔐 Enter new password (min 8 characters):');
        
        if (!newPassword || newPassword.length < 8) {
            alert('❌ Password must be at least 8 characters long.');
            return false;
        }

        const confirmPassword = prompt('🔐 Confirm new password:');
        
        if (newPassword !== confirmPassword) {
            alert('❌ Passwords do not match.');
            return false;
        }

        // Decrypt with old password
        this.setEncryptionKey(oldPassword);
        this.decryptAllData();

        // Encrypt with new password
        this.setEncryptionKey(newPassword);
        const passwordHash = CryptoJS.SHA256(newPassword).toString();
        localStorage.setItem('embermate_password_hash', passwordHash);
        this.encryptAllData();

        alert('✓ Password changed successfully!');
        return true;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EncryptionManager.init();
    });
} else {
    EncryptionManager.init();
}

// Make it globally available
window.EncryptionManager = EncryptionManager;
