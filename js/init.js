/**
 * EmberMate Initialization Script
 * Handles sample data loading, quick export, import utilities, and modal interactions
 * This file should be loaded LAST after all other app scripts
 */

// ============================================================================
// Sample Data Auto-Loader
// ============================================================================
(async function initializeSampleData() {
  const SAMPLE_DATA_LOADED_KEY = 'sampleDataLoaded';
  const SAMPLE_DATA_VERSION_KEY = 'sampleDataVersion';
  const CURRENT_VERSION = '1.0.0';

  // Check if sample data has already been loaded
  const hasLoadedSampleData = localStorage.getItem(SAMPLE_DATA_LOADED_KEY);
  const loadedVersion = localStorage.getItem(SAMPLE_DATA_VERSION_KEY);

  // Only load sample data if:
  // 1. Never loaded before, OR
  // 2. Version has changed
  if (hasLoadedSampleData === 'true' && loadedVersion === CURRENT_VERSION) {
    console.log('Sample data already loaded (version ' + CURRENT_VERSION + ')');
    return;
  }

  // Check if user already has data (don't overwrite existing data)
  const hasExistingData = localStorage.getItem('medications') || 
                         localStorage.getItem('vitals') || 
                         localStorage.getItem('appointments');

  if (hasExistingData && hasLoadedSampleData !== 'true') {
    console.log('User has existing data, skipping sample data load');
    localStorage.setItem(SAMPLE_DATA_LOADED_KEY, 'true');
    localStorage.setItem(SAMPLE_DATA_VERSION_KEY, CURRENT_VERSION);
    return;
  }

  try {
    // Fetch sample data from sample-data.json
    const response = await fetch('sample-data.json');
    
    if (!response.ok) {
      console.warn('Sample data file not found or could not be loaded');
      return;
    }

    const sampleData = await response.json();
    console.log('Loading sample data...');

    // Load each data type into localStorage
    if (sampleData.medications) {
      localStorage.setItem('medications', JSON.stringify(sampleData.medications));
      console.log('✓ Loaded ' + sampleData.medications.length + ' sample medications');
    }

    if (sampleData.vitals) {
      localStorage.setItem('vitals', JSON.stringify(sampleData.vitals));
      console.log('✓ Loaded ' + sampleData.vitals.length + ' sample vitals entries');
    }

    if (sampleData.appointments) {
      localStorage.setItem('appointments', JSON.stringify(sampleData.appointments));
      console.log('✓ Loaded ' + sampleData.appointments.length + ' sample appointments');
    }

    if (sampleData.symptoms) {
      localStorage.setItem('symptoms', JSON.stringify(sampleData.symptoms));
      console.log('✓ Loaded ' + sampleData.symptoms.length + ' sample symptoms');
    }

    if (sampleData.notes) {
      localStorage.setItem('notes', JSON.stringify(sampleData.notes));
      console.log('✓ Loaded ' + sampleData.notes.length + ' sample notes');
    }

    if (sampleData.weight) {
      localStorage.setItem('weight', JSON.stringify(sampleData.weight));
      console.log('✓ Loaded ' + sampleData.weight.length + ' sample weight entries');
    }

    if (sampleData.goals) {
      localStorage.setItem('goals', JSON.stringify(sampleData.goals));
      console.log('✓ Loaded ' + sampleData.goals.length + ' sample goals');
    }

    // Mark sample data as loaded with version
    localStorage.setItem(SAMPLE_DATA_LOADED_KEY, 'true');
    localStorage.setItem(SAMPLE_DATA_VERSION_KEY, CURRENT_VERSION);

    console.log('✓ Sample data loaded successfully!');
    
    // Show success notification if toast function is available
    if (typeof showToast === 'function') {
      showToast('✓ Sample data loaded successfully! Explore the app to see example entries.', 'success');
    }

  } catch (error) {
    console.error('Error loading sample data:', error);
    // Don't block app loading if sample data fails
  }
})();

// ============================================================================
// Quick Export & HIPAA Modal Utilities
// ============================================================================
(function initializeQuickActions() {
  const quickExportBtn = document.getElementById('quick-export');
  const viewHipaaBtn = document.getElementById('view-hipaa');
  
  // Quick Export Button Handler
  if (quickExportBtn) {
    quickExportBtn.addEventListener('click', function() {
      const data = {
        medications: JSON.parse(localStorage.getItem('medications') || '[]'),
        vitals: JSON.parse(localStorage.getItem('vitals') || '[]'),
        appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
        symptoms: JSON.parse(localStorage.getItem('symptoms') || '[]'),
        notes: JSON.parse(localStorage.getItem('notes') || '[]'),
        weight: JSON.parse(localStorage.getItem('weight') || '[]'),
        goals: JSON.parse(localStorage.getItem('goals') || '[]'),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'healthtracker-backup-' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (typeof showToast === 'function') {
        showToast('✓ Data exported successfully', 'success');
      }
    });
  }

  // View HIPAA Notice Button Handler
  if (viewHipaaBtn) {
    viewHipaaBtn.addEventListener('click', function() {
      const modal = document.getElementById('hipaa-modal');
      if (modal) {
        modal.style.display = 'flex';
        
        // Reset checkbox state
        const checkbox = document.getElementById('hipaa-acknowledge');
        const acceptBtn = document.getElementById('hipaa-accept');
        if (checkbox) checkbox.checked = false;
        if (acceptBtn) acceptBtn.disabled = true;
        
        // Add temporary close button text
        if (acceptBtn) acceptBtn.textContent = 'Close';
        acceptBtn.onclick = function() {
          modal.style.display = 'none';
        };
      }
    });
  }
})();

// ============================================================================
// Import Data Utility
// ============================================================================
window.importData = function() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML = 
    '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<h2>📥 Import Backup Data</h2>' +
    '</div>' +
    '<div class="modal-body">' +
    '<p>Select a backup JSON file to import your health data.</p>' +
    '<p><strong>Warning:</strong> This will overwrite your current data.</p>' +
    '<input type="file" id="import-file-input" accept=".json" />' +
    '</div>' +
    '<div class="modal-footer">' +
    '<button class="btn btn-secondary" onclick="this.closest(\'.modal\').remove()">Cancel</button>' +
    '<button class="btn btn-primary" id="import-confirm-btn">Import</button>' +
    '</div>' +
    '</div>';
  
  document.body.appendChild(modal);
  
  const fileInput = document.getElementById('import-file-input');
  const confirmBtn = document.getElementById('import-confirm-btn');
  
  confirmBtn.onclick = function() {
    const file = fileInput.files[0];
    if (!file) {
      if (typeof showToast === 'function') {
        showToast('Please select a file', 'error');
      }
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        // Import each data type
        if (data.medications) localStorage.setItem('medications', JSON.stringify(data.medications));
        if (data.vitals) localStorage.setItem('vitals', JSON.stringify(data.vitals));
        if (data.appointments) localStorage.setItem('appointments', JSON.stringify(data.appointments));
        if (data.symptoms) localStorage.setItem('symptoms', JSON.stringify(data.symptoms));
        if (data.notes) localStorage.setItem('notes', JSON.stringify(data.notes));
        if (data.weight) localStorage.setItem('weight', JSON.stringify(data.weight));
        if (data.goals) localStorage.setItem('goals', JSON.stringify(data.goals));
        
        if (typeof showToast === 'function') {
          showToast('✓ Data imported successfully! Refreshing...', 'success');
        }
        
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        console.error('Import error:', err);
        if (typeof showToast === 'function') {
          showToast('❌ Invalid JSON file', 'error');
        }
      }
    };
    reader.readAsText(file);
    modal.remove();
  };
  
  modal.onclick = function(e) {
    if (e.target === modal) modal.remove();
  };
};

// ============================================================================
// Add CSS Animation for Modals
// ============================================================================
(function addModalAnimations() {
  const style = document.createElement('style');
  style.textContent = 
    '@keyframes slideIn {' +
    'from { transform: translateX(400px); opacity: 0; }' +
    'to { transform: translateX(0); opacity: 1; }' +
    '}';
  document.head.appendChild(style);
})();

// ============================================================================
// Initialization Complete
// ============================================================================
console.log('✓ EmberMate initialization complete');
