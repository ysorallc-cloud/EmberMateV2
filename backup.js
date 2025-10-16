/**
 * EmberMate Data Export & Backup Module
 * 
 * Allows users to export their health data in multiple formats
 * and import data from backups or other sources.
 */

const EmberBackup = {
    
    /**
     * Export all health data as JSON
     */
    exportAllData() {
        const data = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '2.0.0',
                appName: 'EmberMate',
                encrypted: localStorage.getItem('ember_locked') === 'true'
            },
            userData: {
                profile: this.loadData('userProfile'),
                settings: this.loadData('userSettings')
            },
            healthData: {
                medications: this.loadData('medications'),
                vitals: this.loadData('vitals'),
                appointments: this.loadData('appointments'),
                careTeam: this.loadData('careTeam'),
                journal: this.loadData('journal'),
                reminders: this.loadData('reminders'),
                gamification: {
                    userXP: this.loadData('userXP'),
                    userLevel: this.loadData('userLevel'),
                    achievements: this.loadData('achievements'),
                    healthShield: this.loadData('healthShield')
                }
            }
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().split('T')[0];
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `embermate-backup-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✅ Health data exported successfully!', 'success');
        
        // Track export for analytics
        if (window.Gamification) {
            window.Gamification.awardXP(5, 'Data Export');
        }
    },
    
    /**
     * Export medications as CSV
     */
    exportMedicationsCSV() {
        const medications = this.loadData('medications') || [];
        
        if (medications.length === 0) {
            showToast('No medications to export', 'warning');
            return;
        }
        
        // CSV headers
        let csv = 'Name,Dosage,Frequency,Time,Prescribed By,Date Prescribed,Notes\n';
        
        // CSV rows
        medications.forEach(med => {
            const row = [
                this.escapeCsv(med.name),
                this.escapeCsv(med.dosage),
                this.escapeCsv(med.frequency),
                this.escapeCsv(med.time),
                this.escapeCsv(med.prescribedBy),
                this.escapeCsv(med.datePrescribed),
                this.escapeCsv(med.notes)
            ];
            csv += row.join(',') + '\n';
        });
        
        this.downloadFile(csv, 'embermate-medications.csv', 'text/csv');
        showToast('✅ Medications exported to CSV', 'success');
    },
    
    /**
     * Export vitals as CSV
     */
    exportVitalsCSV() {
        const vitals = this.loadData('vitals') || [];
        
        if (vitals.length === 0) {
            showToast('No vitals to export', 'warning');
            return;
        }
        
        // CSV headers
        let csv = 'Date,Time,Type,Systolic,Diastolic,Heart Rate,Blood Glucose,Temperature,Weight,Notes\n';
        
        // CSV rows
        vitals.forEach(vital => {
            const row = [
                this.escapeCsv(vital.date),
                this.escapeCsv(vital.time),
                this.escapeCsv(vital.type),
                this.escapeCsv(vital.systolic),
                this.escapeCsv(vital.diastolic),
                this.escapeCsv(vital.heartRate),
                this.escapeCsv(vital.bloodGlucose),
                this.escapeCsv(vital.temperature),
                this.escapeCsv(vital.weight),
                this.escapeCsv(vital.notes)
            ];
            csv += row.join(',') + '\n';
        });
        
        this.downloadFile(csv, 'embermate-vitals.csv', 'text/csv');
        showToast('✅ Vitals exported to CSV', 'success');
    },
    
    /**
     * Export data as PDF (requires html2pdf library)
     */
    async exportToPDF() {
        if (typeof html2pdf === 'undefined') {
            showToast('PDF export library not loaded', 'error');
            return;
        }
        
        // Create PDF content
        const content = document.createElement('div');
        content.style.padding = '40px';
        content.style.fontFamily = 'Arial, sans-serif';
        content.innerHTML = this.generatePDFContent();
        
        const options = {
            margin: 1,
            filename: `embermate-health-report-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        showToast('📄 Generating PDF...', 'info');
        
        try {
            await html2pdf().from(content).set(options).save();
            showToast('✅ PDF exported successfully!', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            showToast('❌ PDF export failed', 'error');
        }
    },
    
    /**
     * Generate HTML content for PDF export
     */
    generatePDFContent() {
        const medications = this.loadData('medications') || [];
        const vitals = this.loadData('vitals') || [];
        const appointments = this.loadData('appointments') || [];
        
        let html = `
            <div style="margin-bottom: 30px;">
                <h1 style="color: #00b4d8; margin-bottom: 10px;">EmberMate Health Report</h1>
                <p style="color: #666; font-size: 14px;">
                    Generated on ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </p>
            </div>
        `;
        
        // Medications section
        if (medications.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #00b4d8; padding-bottom: 10px;">
                        Current Medications
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background: #f5f5f5;">
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Name</th>
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Dosage</th>
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Frequency</th>
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Time</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            medications.forEach(med => {
                html += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(med.name)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(med.dosage)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(med.frequency)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(med.time)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Recent vitals section
        if (vitals.length > 0) {
            const recentVitals = vitals.slice(-10).reverse();
            
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #00b4d8; padding-bottom: 10px;">
                        Recent Vital Signs
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background: #f5f5f5;">
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Date</th>
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Type</th>
                                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Reading</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            recentVitals.forEach(vital => {
                let reading = '';
                if (vital.type === 'Blood Pressure') {
                    reading = `${vital.systolic}/${vital.diastolic} mmHg`;
                } else if (vital.type === 'Blood Glucose') {
                    reading = `${vital.bloodGlucose} mg/dL`;
                } else if (vital.type === 'Heart Rate') {
                    reading = `${vital.heartRate} bpm`;
                }
                
                html += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(vital.date)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(vital.type)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(reading)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        // Upcoming appointments
        if (appointments.length > 0) {
            const upcoming = appointments
                .filter(apt => new Date(apt.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5);
            
            if (upcoming.length > 0) {
                html += `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #333; border-bottom: 2px solid #00b4d8; padding-bottom: 10px;">
                            Upcoming Appointments
                        </h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead>
                                <tr style="background: #f5f5f5;">
                                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Date</th>
                                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Provider</th>
                                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                upcoming.forEach(apt => {
                    html += `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(apt.date)}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(apt.provider)}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">${this.escapeHtml(apt.type)}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }
        }
        
        html += `
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>This report was generated by EmberMate, a privacy-first health tracking dashboard.</p>
                <p>All data is stored locally on your device and never shared with third parties.</p>
            </div>
        `;
        
        return html;
    },
    
    /**
     * Import data from JSON backup
     */
    importData(file) {
        if (!file) {
            showToast('Please select a file to import', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate backup file
                if (!data.metadata || data.metadata.appName !== 'EmberMate') {
                    showToast('❌ Invalid EmberMate backup file', 'error');
                    return;
                }
                
                // Confirm import
                if (!confirm(
                    `Import data from ${new Date(data.metadata.exportDate).toLocaleDateString()}?\n\n` +
                    `This will overwrite your current data. Make sure you have a backup!`
                )) {
                    return;
                }
                
                // Import health data
                if (data.healthData) {
                    Object.keys(data.healthData).forEach(key => {
                        if (key === 'gamification') {
                            // Import gamification data
                            Object.keys(data.healthData.gamification).forEach(gamKey => {
                                this.saveData(gamKey, data.healthData.gamification[gamKey]);
                            });
                        } else {
                            this.saveData(key, data.healthData[key]);
                        }
                    });
                }
                
                // Import user data
                if (data.userData) {
                    Object.keys(data.userData).forEach(key => {
                        this.saveData(key, data.userData[key]);
                    });
                }
                
                showToast('✅ Data imported successfully! Refreshing page...', 'success');
                
                // Reload page to reflect changes
                setTimeout(() => {
                    location.reload();
                }, 2000);
                
            } catch (error) {
                console.error('Import error:', error);
                showToast('❌ Failed to import data. Invalid file format.', 'error');
            }
        };
        
        reader.onerror = () => {
            showToast('❌ Failed to read file', 'error');
        };
        
        reader.readAsText(file);
    },
    
    /**
     * Load data from localStorage (handles encryption)
     */
    loadData(key) {
        if (window.EmberSecurity && window.EmberSecurity.password) {
            return window.EmberSecurity.loadEncrypted(key);
        }
        
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    },
    
    /**
     * Save data to localStorage (handles encryption)
     */
    saveData(key, value) {
        if (window.EmberSecurity && window.EmberSecurity.password) {
            window.EmberSecurity.saveEncrypted(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    
    /**
     * Escape CSV values
     */
    escapeCsv(value) {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    },
    
    /**
     * Escape HTML
     */
    escapeHtml(value) {
        if (value === null || value === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(value);
        return div.innerHTML;
    },
    
    /**
     * Download file helper
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    /**
     * Create automatic backup (can be scheduled)
     */
    createAutoBackup() {
        const lastBackup = localStorage.getItem('lastAutoBackup');
        const now = new Date().getTime();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        // Auto-backup once per day
        if (!lastBackup || (now - parseInt(lastBackup)) > dayInMs) {
            this.exportAllData();
            localStorage.setItem('lastAutoBackup', now.toString());
        }
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check for auto-backup on page load
        EmberBackup.createAutoBackup();
    });
} else {
    EmberBackup.createAutoBackup();
}
