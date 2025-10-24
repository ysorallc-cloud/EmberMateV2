// init.js - Application initialization and startup
// This file runs LAST after all dependencies are loaded

(function() {
  'use strict';
  
  console.log('[HealthTracker] Initializing...');

  // Initialize data store
  if (typeof Store !== 'undefined') {
    Store.init();
    console.log('[HealthTracker] Initializing store...');
  }

  // Initialize navigation
  if (typeof Nav !== 'undefined') {
    Nav.init();
    console.log('[HealthTracker] Initializing navigation...');
  }

  // Initialize telemetry (if consent given)
  if (typeof initTelemetry === 'function') {
    initTelemetry();
  }

  console.log('[HealthTracker] Ready!');

  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  function initializeApp() {
    // Initialize the main app
    if (typeof window.HealthTracker !== 'undefined' && typeof window.HealthTracker.init === 'function') {
      window.HealthTracker.init();
      console.log('[HealthTracker] UI initialized successfully');
    }

    // Load sample data if available and needed
    loadSampleDataIfNeeded();

    // **CRITICAL: Remove the loading message and show the app**
    removeLoadingMessage();

    // Show HIPAA disclaimer if not already acknowledged
    checkHIPAADisclaimer();

    console.log('✓ EmberMate initialization complete');
  }

  function removeLoadingMessage() {
    const main = document.getElementById('main');
    if (main) {
      // Remove the "Loading application..." text
      const loadingText = main.querySelector('p');
      if (loadingText && loadingText.textContent.includes('Loading')) {
        loadingText.remove();
      }
      
      // Make sure main is visible
      main.style.display = 'block';
      main.style.opacity = '1';
      main.style.visibility = 'visible';
    }
  }

  function loadSampleDataIfNeeded() {
    // Check if sample data should be loaded
    const SAMPLE_DATA_VERSION = '1.0.0';
    const SAMPLE_DATA_LOADED_KEY = 'sampleDataLoaded';
    const loadedVersion = localStorage.getItem(SAMPLE_DATA_LOADED_KEY);

    // Only load if not already loaded for this version
    if (loadedVersion === SAMPLE_DATA_VERSION) {
      console.log(`Sample data already loaded (version ${SAMPLE_DATA_VERSION})`);
      return;
    }

    // Check if user has any existing data
    const hasExistingData = (
      localStorage.getItem('medications') ||
      localStorage.getItem('vitals') ||
      localStorage.getItem('appointments')
    );

    if (hasExistingData) {
      console.log('User has existing data, skipping sample data load');
      return;
    }

    // Try to load sample data from file
    fetch('sample-data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Sample data file not found');
        }
        return response.json();
      })
      .then(data => {
        // Load sample data into localStorage
        if (data.medications) localStorage.setItem('medications', JSON.stringify(data.medications));
        if (data.vitals) localStorage.setItem('vitals', JSON.stringify(data.vitals));
        if (data.appointments) localStorage.setItem('appointments', JSON.stringify(data.appointments));
        if (data.symptoms) localStorage.setItem('symptoms', JSON.stringify(data.symptoms));
        if (data.notes) localStorage.setItem('notes', JSON.stringify(data.notes));
        if (data.weights) localStorage.setItem('weights', JSON.stringify(data.weights));
        if (data.goals) localStorage.setItem('goals', JSON.stringify(data.goals));

        // Mark sample data as loaded
        localStorage.setItem(SAMPLE_DATA_LOADED_KEY, SAMPLE_DATA_VERSION);

        console.log('✓ Sample data loaded successfully');
        
        // Show success message if showToast is available
        if (typeof showToast === 'function') {
          showToast('✓ Sample data loaded successfully! Explore the app with realistic health tracking examples.', 'success');
        }

        // Refresh the current view to show the new data
        if (typeof Nav !== 'undefined' && typeof Nav.refresh === 'function') {
          Nav.refresh();
        }
      })
      .catch(error => {
        console.log('No sample data to load or error loading:', error.message);
      });
  }

  function checkHIPAADisclaimer() {
    const hasAcknowledged = localStorage.getItem('hipaaAcknowledged');
    if (!hasAcknowledged) {
      const modal = document.getElementById('hipaa-modal');
      if (modal) {
        modal.style.display = 'flex';
        
        // Enable accept button when checkbox is checked
        const checkbox = document.getElementById('hipaa-acknowledge');
        const acceptBtn = document.getElementById('hipaa-accept');
        
        if (checkbox && acceptBtn) {
          checkbox.addEventListener('change', function() {
            acceptBtn.disabled = !this.checked;
          });
          
          acceptBtn.addEventListener('click', function() {
            if (checkbox.checked) {
              localStorage.setItem('hipaaAcknowledged', 'true');
              modal.style.display = 'none';
            }
          });
        }
      }
    }
  }

  // Handle "View Privacy Notice" button
  const viewHipaaBtn = document.getElementById('view-hipaa');
  if (viewHipaaBtn) {
    viewHipaaBtn.addEventListener('click', function() {
      const modal = document.getElementById('hipaa-modal');
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  }

  // Handle quick export button
  const quickExportBtn = document.getElementById('quick-export');
  if (quickExportBtn) {
    quickExportBtn.addEventListener('click', function() {
      // Navigate to reports page
      window.location.hash = '#reports';
    });
  }

})();
