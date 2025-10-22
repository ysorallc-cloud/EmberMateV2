// ========================================
// SAMPLE DATA LOADER MODULE
// Add this to your app.js file
// ========================================

const SampleDataLoader = {
  STORAGE_KEY: 'healthTrackerData',
  SAMPLE_DATA_URL: './sample-data.json',

  // Initialize the sample data loader
  init() {
    this.createLoadButton();
    this.checkForSampleData();
  },

  // Create the "Load Sample Data" button
  createLoadButton() {
    // Find the dashboard page
    const dashboardPage = document.getElementById('page-dashboard');
    if (!dashboardPage) {
      console.warn('Dashboard page not found');
      return;
    }

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      gap: 10px;
      flex-direction: column;
    `;

    // Create Load Sample Data button
    const loadButton = document.createElement('button');
    loadButton.id = 'load-sample-data-btn';
    loadButton.className = 'btn btn-primary';
    loadButton.innerHTML = '📊 Load Sample Data';
    loadButton.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 25px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    `;

    loadButton.addEventListener('mouseover', () => {
      loadButton.style.transform = 'translateY(-2px)';
      loadButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
    });

    loadButton.addEventListener('mouseout', () => {
      loadButton.style.transform = 'translateY(0)';
      loadButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });

    loadButton.onclick = () => this.showLoadModal();

    // Create Clear Sample Data button (only show if data exists)
    const clearButton = document.createElement('button');
    clearButton.id = 'clear-sample-data-btn';
    clearButton.className = 'btn btn-danger';
    clearButton.innerHTML = '🗑️ Clear Data';
    clearButton.style.cssText = `
      background: #dc3545;
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
      transition: all 0.3s ease;
      display: none;
    `;

    clearButton.addEventListener('mouseover', () => {
      clearButton.style.transform = 'translateY(-2px)';
      clearButton.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.5)';
    });

    clearButton.addEventListener('mouseout', () => {
      clearButton.style.transform = 'translateY(0)';
      clearButton.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)';
    });

    clearButton.onclick = () => this.clearSampleData();

    buttonContainer.appendChild(loadButton);
    buttonContainer.appendChild(clearButton);
    document.body.appendChild(buttonContainer);

    // Show clear button if sample data exists
    this.updateButtonVisibility();
  },

  // Check if sample data is already loaded
  checkForSampleData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.metadata && parsed.metadata.description?.includes('Sample data')) {
          this.showToast('Sample data is currently loaded', 'info');
        }
      } catch (e) {
        console.error('Error checking sample data:', e);
      }
    }
  },

  // Update button visibility based on data presence
  updateButtonVisibility() {
    const clearButton = document.getElementById('clear-sample-data-btn');
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (clearButton && data) {
      clearButton.style.display = 'block';
    }
  },

  // Show modal for loading sample data
  showLoadModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    modalContent.innerHTML = `
      <h2 style="color: #333; margin-bottom: 15px; font-size: 1.8em;">📊 Load Sample Data</h2>
      <p style="color: #666; margin-bottom: 25px;">
        This will load a complete 90-day health journey with medications, vitals, symptoms, and achievements.
      </p>

      <div style="background: #f0f7ff; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 25px; border-radius: 8px;">
        <h3 style="color: #667eea; margin-bottom: 10px; font-size: 1.2em;">What You'll Get:</h3>
        <ul style="margin-left: 20px; color: #555;">
          <li style="margin: 8px 0;"><strong>Patient:</strong> Alex Johnson, 52 years old</li>
          <li style="margin: 8px 0;"><strong>Duration:</strong> 90-day journey (July-October 2025)</li>
          <li style="margin: 8px 0;"><strong>Medications:</strong> 6 prescriptions with detailed info</li>
          <li style="margin: 8px 0;"><strong>Vitals:</strong> 90+ BP readings, weight tracking</li>
          <li style="margin: 8px 0;"><strong>Progress:</strong> 15 lbs weight loss, BP improvement</li>
          <li style="margin: 8px 0;"><strong>Total:</strong> 550+ data points</li>
        </ul>
      </div>

      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px; border-radius: 8px;">
        <strong style="color: #856404;">⚠️ Warning:</strong>
        <p style="color: #856404; margin-top: 5px; margin-bottom: 0;">
          This will replace any existing data. Make sure to export your current data first if you want to keep it!
        </p>
      </div>

      <div style="display: flex; gap: 15px; justify-content: flex-end;">
        <button id="cancel-load" style="
          padding: 12px 25px;
          border: 2px solid #ccc;
          border-radius: 10px;
          background: white;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Cancel</button>
        
        <button id="confirm-load" style="
          padding: 12px 25px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Load Sample Data</button>
      </div>

      <div id="load-file-section" style="margin-top: 25px; padding-top: 25px; border-top: 2px solid #eee;">
        <h3 style="color: #333; margin-bottom: 15px;">Or Upload sample-data.json:</h3>
        <div style="
          border: 2px dashed #ccc;
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        " id="file-drop-zone">
          <input type="file" id="sample-file-input" accept=".json" style="display: none;">
          <label for="sample-file-input" style="
            color: #667eea;
            font-weight: 600;
            cursor: pointer;
            display: block;
          ">
            📁 Click to select sample-data.json
          </label>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('cancel-load').onclick = () => modal.remove();
    document.getElementById('confirm-load').onclick = async () => {
      modal.remove();
      await this.loadSampleData();
    };
    document.getElementById('sample-file-input').onchange = (e) => {
      modal.remove();
      this.loadFromFile(e);
    };

    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  },

  // Load sample data from URL
  async loadSampleData() {
    try {
      this.showToast('Loading sample data...', 'info');

      const response = await fetch(this.SAMPLE_DATA_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status}`);
      }

      const sampleData = await response.json();
      
      // Store in localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleData));
      
      this.showToast('✅ Sample data loaded! Refreshing page...', 'success');
      
      // Update button visibility
      this.updateButtonVisibility();
      
      // Reload the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error loading sample data:', error);
      this.showToast(`❌ Error: ${error.message}. Make sure sample-data.json is in the same directory.`, 'error');
    }
  },

  // Load sample data from file upload
  loadFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const sampleData = JSON.parse(e.target.result);
        
        // Store in localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleData));
        
        this.showToast('✅ Sample data loaded from file! Refreshing page...', 'success');
        
        // Update button visibility
        this.updateButtonVisibility();
        
        // Reload the page
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } catch (error) {
        console.error('Error parsing JSON:', error);
        this.showToast('❌ Invalid JSON file. Please select a valid sample-data.json file.', 'error');
      }
    };
    
    reader.onerror = () => {
      this.showToast('❌ Error reading file. Please try again.', 'error');
    };
    
    reader.readAsText(file);
  },

  // Clear sample data
  clearSampleData() {
    if (!confirm('Are you sure you want to clear all health tracking data? This cannot be undone!')) {
      return;
    }

    localStorage.removeItem(this.STORAGE_KEY);
    this.showToast('🗑️ All data cleared! Refreshing page...', 'success');

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 10px;
      font-weight: 600;
      z-index: 10001;
      max-width: 400px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease;
    `;

    const colors = {
      success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
      error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
      info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
    };

    const style = colors[type] || colors.info;
    toast.style.background = style.bg;
    toast.style.color = style.color;
    toast.style.border = `1px solid ${style.border}`;
    toast.textContent = message;

    // Add animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, type === 'success' || type === 'error' ? 3000 : 2000);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SampleDataLoader.init());
} else {
  SampleDataLoader.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SampleDataLoader;
}
