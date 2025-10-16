// EmberMate Backup & Restore Module
// Handles data export/import functionality

const BackupManager = {
    // Initialize backup functionality
    init() {
        console.log('BackupManager: Initializing...');
        this.addBackupHandlers();
    },

    // Add event handlers to backup buttons
    addBackupHandlers() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.attachHandlers());
        } else {
            this.attachHandlers();
        }
    },

    // Attach handlers to buttons
    attachHandlers() {
        // Find buttons in the settings page
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            const text = button.textContent.trim();
            
            if (text.includes('Export Data')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.exportData();
                });
            } else if (text.includes('Import Data')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.importData();
                });
            } else if (text.includes('Clear All Data')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.clearAllData();
                });
            }
        });
    },

    // Export all data as JSON
    exportData() {
        try {
            // Collect all EmberMate data from localStorage
            const dataToExport = {
                version: '2.0',
                exportDate: new Date().toISOString(),
                encrypted: EncryptionManager.isEncryptionEnabled,
                data: {}
            };

            // Get all localStorage keys that start with 'embermate_'
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('embermate_')) {
                    // Skip encryption settings
                    if (key !== 'embermate_encryption_enabled' && key !== 'embermate_password_hash') {
                        dataToExport.data[key] = localStorage.getItem(key);
                    }
                }
            }

            // Check if there's any data to export
            if (Object.keys(dataToExport.data).length === 0) {
                alert('ℹ️ No data to export. Start tracking your health data first!');
                return;
            }

            // Convert to JSON
            const jsonString = JSON.stringify(dataToExport, null, 2);
            
            // Create blob and download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            link.download = `embermate-backup-${timestamp}.json`;
            link.href = url;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            alert(`✓ Data exported successfully!\n\nFile: embermate-backup-${timestamp}.json\n\n${EncryptionManager.isEncryptionEnabled ? '⚠️ Note: Your exported data is encrypted. You will need your password to import it.' : ''}`);
            
        } catch (error) {
            console.error('Export error:', error);
            alert('❌ Error exporting data. Please try again.');
        }
    },

    // Import data from JSON file
    importData() {
        // Create file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const importedData = JSON.parse(text);
                
                // Validate format
                if (!importedData.version || !importedData.data) {
                    alert('❌ Invalid backup file format.');
                    return;
                }
                
                // Check if data is encrypted
                if (importedData.encrypted) {
                    alert('⚠️ This backup contains encrypted data. Make sure you have encryption enabled and use the correct password.');
                }
                
                // Confirm import
                const confirm = window.confirm(`⚠️ Import data from backup?\n\nExport Date: ${new Date(importedData.exportDate).toLocaleDateString()}\nVersion: ${importedData.version}\nEncrypted: ${importedData.encrypted ? 'Yes' : 'No'}\n\nThis will OVERWRITE your current data. Continue?`);
                
                if (!confirm) return;
                
                // Import data
                let importCount = 0;
                for (const [key, value] of Object.entries(importedData.data)) {
                    localStorage.setItem(key, value);
                    importCount++;
                }
                
                alert(`✓ Data imported successfully!\n\n${importCount} items restored.\n\nPlease refresh the page to see your data.`);
                
                // Reload page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                console.error('Import error:', error);
                alert('❌ Error importing data. Make sure the file is a valid EmberMate backup.');
            }
        };
        
        input.click();
    },

    // Clear all data with confirmation
    clearAllData() {
        const confirm1 = window.confirm('⚠️ WARNING: This will permanently delete ALL your health data!\n\nThis action cannot be undone.\n\nAre you absolutely sure?');
        
        if (!confirm1) return;
        
        const confirm2 = window.confirm('⚠️ FINAL WARNING!\n\nYou are about to delete:\n• All medications\n• All vital signs\n• All journal entries\n• All appointments\n• All care team information\n\nType confirmation is required. Click OK to continue.');
        
        if (!confirm2) return;
        
        const typedConfirmation = prompt('Type "DELETE ALL DATA" to confirm (case-sensitive):');
        
        if (typedConfirmation !== 'DELETE ALL DATA') {
            alert('❌ Confirmation text did not match. Data was NOT deleted.');
            return;
        }
        
        try {
            // Remove all EmberMate data
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('embermate_')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            alert(`✓ All data cleared successfully.\n\n${keysToRemove.length} items removed.\n\nThe page will now refresh.`);
            
            // Reload page
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('Clear data error:', error);
            alert('❌ Error clearing data. Please try again.');
        }
    },

    // Create automatic backup (can be called periodically)
    createAutoBackup() {
        try {
            const dataToExport = {
                version: '2.0',
                exportDate: new Date().toISOString(),
                encrypted: EncryptionManager.isEncryptionEnabled,
                data: {}
            };

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('embermate_')) {
                    if (key !== 'embermate_encryption_enabled' && key !== 'embermate_password_hash') {
                        dataToExport.data[key] = localStorage.getItem(key);
                    }
                }
            }

            const jsonString = JSON.stringify(dataToExport);
            localStorage.setItem('embermate_auto_backup', jsonString);
            localStorage.setItem('embermate_auto_backup_date', new Date().toISOString());
            
            console.log('Auto-backup created successfully');
            
        } catch (error) {
            console.error('Auto-backup error:', error);
        }
    },

    // Restore from automatic backup
    restoreAutoBackup() {
        try {
            const backupData = localStorage.getItem('embermate_auto_backup');
            const backupDate = localStorage.getItem('embermate_auto_backup_date');
            
            if (!backupData) {
                alert('ℹ️ No automatic backup found.');
                return;
            }
            
            const confirm = window.confirm(`Restore from automatic backup?\n\nBackup Date: ${new Date(backupDate).toLocaleString()}\n\nThis will overwrite your current data.`);
            
            if (!confirm) return;
            
            const importedData = JSON.parse(backupData);
            
            for (const [key, value] of Object.entries(importedData.data)) {
                localStorage.setItem(key, value);
            }
            
            alert('✓ Data restored from automatic backup!');
            window.location.reload();
            
        } catch (error) {
            console.error('Restore auto-backup error:', error);
            alert('❌ Error restoring automatic backup.');
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        BackupManager.init();
        
        // Create auto-backup every 24 hours
        setInterval(() => {
            BackupManager.createAutoBackup();
        }, 24 * 60 * 60 * 1000);
        
        // Create initial auto-backup after 5 minutes
        setTimeout(() => {
            BackupManager.createAutoBackup();
        }, 5 * 60 * 1000);
    });
} else {
    BackupManager.init();
}

// Make it globally available
window.BackupManager = BackupManager;
