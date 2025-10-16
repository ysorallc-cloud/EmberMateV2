// EmberMate Encryption Module
// Handles AES-256 encryption/decryption of health data using CryptoJS

const EncryptionManager = {
    // Encryption key stored in memory (never persisted)
    encryptionKey: null,
    isEncryptionEnabled: false,
    
    // Initialize encryption system
    init() {
        // Check if encryption was previously enabled
        const encryptionStatus = localStorage.getItem('embermate_encryption_enabled');
        this.isEncryptionEnabled = encryptionStatus === 'true';
        
        console.log('Encryption Manager initialized. Encryption enabled:', this.isEncryptionEnabled);
    },
    
    // Set encryption key
    setEncryptionKey(password) {
        if (!password || password.length < 8) {
            this.showError('Encryption password must be at least 8 characters');
            return false;
        }
        
        this.encryptionKey = password;
        console.log('Encryption key set successfully');
        return true;
    },
    
    // Enable encryption
    enableEncryption(password) {
        if (!password || password.length < 8) {
            this.showError('Encryption password must be at least 8 characters');
            return false;
        }
        
        const confirmPassword = prompt('Confirm encryption password:');
        
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return false;
        }
        
        this.encryptionKey = password;
        this.isEncryptionEnabled = true;
        localStorage.setItem('embermate_encryption_enabled', 'true');
        
        // Encrypt existing data
        this.encryptAllData();
        
        this.showSuccess('Encryption enabled successfully!');
        console.log('Encryption enabled');
        return true;
    },
    
    // Disable encryption
    disableEncryption() {
        if (!this.isEncryptionEnabled) {
            this.showInfo('Encryption is not enabled');
            return;
        }
        
        const password = prompt('Enter your encryption password to disable encryption:');
        
        if (!password || password !== this.encryptionKey) {
            this.showError('Incorrect password');
            return false;
        }
        
        // Decrypt all data
        this.decryptAllData();
        
        this.encryptionKey = null;
        this.isEncryptionEnabled = false;
        localStorage.setItem('embermate_encryption_enabled', 'false');
        
        this.showSuccess('Encryption disabled successfully');
        console.log('Encryption disabled');
        return true;
    },
    
    // Encrypt data
    encrypt(data) {
        if (!this.isEncryptionEnabled || !this.encryptionKey) {
            return data;
        }
        
        try {
            if (typeof CryptoJS === 'undefined') {
                console.error('CryptoJS library not loaded');
                return data;
            }
            
            const dataString = typeof data === 'string' ? data : JSON.stringify(data);
            const encrypted = CryptoJS.AES.encrypt(dataString, this.encryptionKey).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error);
            return data;
        }
    },
    
    // Decrypt data
    decrypt(encryptedData) {
        if (!this.isEncryptionEnabled || !this.encryptionKey) {
            return encryptedData;
        }
        
        try {
            if (typeof CryptoJS === 'undefined') {
                console.error('CryptoJS library not loaded');
                return encryptedData;
            }
            
            const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
            const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedString) {
                console.error('Decryption failed - incorrect password or corrupted data');
                return null;
            }
            
            try {
                return JSON.parse(decryptedString);
            } catch {
                return decryptedString;
            }
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },
    
    // Encrypt all health data
    encryptAllData() {
        console.log('Encrypting all health data...');
        
        const dataKeys = [
            'embermate_medications',
            'embermate_vitals',
            'embermate_appointments',
            'embermate_journal',
            'embermate_care_team',
            'embermate_health_profile'
        ];
        
        dataKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data && !this.isEncrypted(data)) {
                const encrypted = this.encrypt(data);
                localStorage.setItem(key, encrypted);
                console.log(`Encrypted: ${key}`);
            }
        });
        
        console.log('All data encrypted');
    },
    
    // Decrypt all health data
    decryptAllData() {
        console.log('Decrypting all health data...');
        
        const dataKeys = [
            'embermate_medications',
            'embermate_vitals',
            'embermate_appointments',
            'embermate_journal',
            'embermate_care_team',
            'embermate_health_profile'
        ];
        
        dataKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data && this.isEncrypted(data)) {
                const decrypted = this.decrypt(data);
                if (decrypted) {
                    const decryptedString = typeof decrypted === 'string' ? decrypted : JSON.stringify(decrypted);
                    localStorage.setItem(key, decryptedString);
                    console.log(`Decrypted: ${key}`);
                }
            }
        });
        
        console.log('All data decrypted');
    },
    
    // Check if data is encrypted
    isEncrypted(data) {
        if (!data) return false;
        
        // Simple check: encrypted data typically doesn't start with { or [
        const trimmed = data.trim();
        return !trimmed.startsWith('{') && !trimmed.startsWith('[');
    },
    
    // Save encrypted item
    saveEncrypted(key, data) {
        const encrypted = this.encrypt(data);
        localStorage.setItem(key, encrypted);
        console.log(`Saved encrypted: ${key}`);
    },
    
    // Load encrypted item
    loadEncrypted(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        if (this.isEncryptionEnabled && this.isEncrypted(data)) {
            return this.decrypt(data);
        }
        
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    },
    
    // Generate encryption report
    getEncryptionStatus() {
        const dataKeys = [
            'embermate_medications',
            'embermate_vitals',
            'embermate_appointments',
            'embermate_journal',
            'embermate_care_team',
            'embermate_health_profile'
        ];
        
        const status = {
            enabled: this.isEncryptionEnabled,
            hasKey: !!this.encryptionKey,
            encryptedItems: []
        };
        
        dataKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                status.encryptedItems.push({
                    key: key,
                    encrypted: this.isEncrypted(data),
                    size: data.length
                });
            }
        });
        
        return status;
    },
    
    // Change encryption password
    changePassword() {
        if (!this.isEncryptionEnabled) {
            this.showError('Encryption is not enabled');
            return false;
        }
        
        const currentPassword = prompt('Enter your current encryption password:');
        
        if (!currentPassword || currentPassword !== this.encryptionKey) {
            this.showError('Incorrect current password');
            return false;
        }
        
        const newPassword = prompt('Enter new encryption password (min 8 characters):');
        
        if (!newPassword || newPassword.length < 8) {
            this.showError('New password must be at least 8 characters');
            return false;
        }
        
        const confirmPassword = prompt('Confirm new password:');
        
        if (newPassword !== confirmPassword) {
            this.showError('Passwords do not match');
            return false;
        }
        
        // Decrypt with old password
        this.decryptAllData();
        
        // Set new password
        this.encryptionKey = newPassword;
        
        // Encrypt with new password
        this.encryptAllData();
        
        this.showSuccess('Encryption password changed successfully!');
        console.log('Encryption password changed');
        return true;
    },
    
    // Export encrypted backup
    exportEncryptedBackup() {
        const backupData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            encrypted: this.isEncryptionEnabled,
            data: {}
        };
        
        const dataKeys = [
            'embermate_medications',
            'embermate_vitals',
            'embermate_appointments',
            'embermate_journal',
            'embermate_care_team',
            'embermate_health_profile'
        ];
        
        dataKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                backupData.data[key] = data;
            }
        });
        
        return backupData;
    },
    
    // Import encrypted backup
    importEncryptedBackup(backupData) {
        if (!backupData || !backupData.data) {
            this.showError('Invalid backup data');
            return false;
        }
        
        if (backupData.encrypted && !this.encryptionKey) {
            this.showError('Please enter your encryption password first');
            return false;
        }
        
        try {
            Object.keys(backupData.data).forEach(key => {
                localStorage.setItem(key, backupData.data[key]);
            });
            
            this.showSuccess('Backup imported successfully!');
            console.log('Imported backup from:', backupData.exportDate);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            this.showError('Failed to import backup');
            return false;
        }
    },
    
    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    },
    
    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    },
    
    // Show info message
    showInfo(message) {
        this.showNotification(message, 'info');
    },
    
    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `encryption-notification encryption-notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Style notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '0.5rem';
        notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '10000';
        notification.style.fontWeight = '500';
        notification.style.fontSize = '0.875rem';
        notification.style.maxWidth = '300px';
        notification.style.animation = 'slideInRight 0.3s ease-out';
        
        // Type-specific styling
        if (type === 'error') {
            notification.style.background = '#fee2e2';
            notification.style.color = '#991b1b';
            notification.style.border = '1px solid #fecaca';
        } else if (type === 'success') {
            notification.style.background = '#d1fae5';
            notification.style.color = '#065f46';
            notification.style.border = '1px solid #a7f3d0';
        } else {
            notification.style.background = '#dbeafe';
            notification.style.color = '#1e40af';
            notification.style.border = '1px solid #bfdbfe';
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}
`;
document.head.appendChild(style);

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EncryptionManager.init();
    });
} else {
    EncryptionManager.init();
}

// Make available globally
window.EncryptionManager = EncryptionManager;