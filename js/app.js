/**
 * EmberMate V2 - Main Application
 * Minimal working version to display health data
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  function initApp() {
    console.log('[HealthTracker] Initializing...');
    
    // Initialize navigation
    initNavigation();
    
    // Load initial view
    showDashboard();
    
    console.log('[HealthTracker] Ready!');
  }

  function initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('href').substring(1);
        showView(view);
        
        // Update active state
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
      });
    });
  }

  function showView(viewName) {
    const main = document.getElementById('main');
    if (!main) return;
    
    switch(viewName) {
      case 'dashboard':
        showDashboard();
        break;
      case 'medications':
        showMedications();
        break;
      case 'vitals':
        showVitals();
        break;
      case 'symptoms':
        showSymptoms();
        break;
      case 'weight':
        showWeight();
        break;
      case 'goals':
        showGoals();
        break;
      case 'bulk-entry':
        showBulkEntry();
        break;
      case 'reports':
        showReports();
        break;
      case 'settings':
        showSettings();
        break;
      default:
        showDashboard();
    }
  }

  function showDashboard() {
    const main = document.getElementById('main');
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    const vitals = JSON.parse(localStorage.getItem('vitals') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    
    const recentVital = vitals[vitals.length - 1] || {};
    const activeMeds = medications.filter(m => m.active).length;
    const activeGoals = goals.filter(g => !g.completed).length;
    
    main.innerHTML = `
      <div class="dashboard-view">
        <h1>Welcome, ${settings.name || 'User'}!</h1>
        <p class="subtitle">Here's your health overview for today</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">💊</div>
            <div class="stat-content">
              <h3>Active Medications</h3>
              <p class="stat-value">${activeMeds}</p>
              <p class="stat-label">medications tracked</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">❤️</div>
            <div class="stat-content">
              <h3>Latest Vitals</h3>
              <p class="stat-value">${recentVital.systolic || '--'}/${recentVital.diastolic || '--'}</p>
              <p class="stat-label">Blood Pressure</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3>Active Goals</h3>
              <p class="stat-value">${activeGoals}</p>
              <p class="stat-label">goals in progress</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <h3>Tracking Days</h3>
              <p class="stat-value">${vitals.length}</p>
              <p class="stat-label">days of data</p>
            </div>
          </div>
        </div>
        
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="window.location.hash='#medications'">
              💊 View Medications
            </button>
            <button class="btn btn-secondary" onclick="window.location.hash='#vitals'">
              ❤️ Record Vitals
            </button>
            <button class="btn btn-secondary" onclick="window.location.hash='#weight'">
              ⚖️ Track Weight
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function showMedications() {
    const main = document.getElementById('main');
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    
    const medsList = medications.map(med => `
      <div class="med-card">
        <h3>${med.name} - ${med.dosage}</h3>
        <p>Frequency: ${med.frequency.replace('_', ' ')}</p>
        <p>Purpose: ${med.purpose}</p>
        <p>Prescribed by: ${med.prescribedBy}</p>
        ${med.refillDate ? `<p>Refill Date: ${new Date(med.refillDate).toLocaleDateString()}</p>` : ''}
        ${med.notes ? `<p>Notes: ${med.notes}</p>` : ''}
      </div>
    `).join('');
    
    main.innerHTML = `
      <div class="medications-view">
        <h1>💊 Medications</h1>
        <div class="medications-list">
          ${medsList || '<p>No medications tracked yet.</p>'}
        </div>
      </div>
    `;
  }

  function showVitals() {
    const main = document.getElementById('main');
    const vitals = JSON.parse(localStorage.getItem('vitals') || '[]');
    
    // Show last 10 vitals
    const recentVitals = vitals.slice(-10).reverse();
    
    const vitalsList = recentVitals.map(vital => `
      <div class="vital-card">
        <p><strong>${new Date(vital.date).toLocaleDateString()}</strong></p>
        <p>BP: ${vital.systolic}/${vital.diastolic} | HR: ${vital.heartRate} | Temp: ${vital.temperature}°F</p>
        ${vital.notes ? `<p>Notes: ${vital.notes}</p>` : ''}
      </div>
    `).join('');
    
    main.innerHTML = `
      <div class="vitals-view">
        <h1>❤️ Vitals Tracking</h1>
        <div class="vitals-list">
          <h2>Recent Readings</h2>
          ${vitalsList || '<p>No vitals recorded yet.</p>'}
        </div>
      </div>
    `;
  }

  function showSymptoms() {
    const main = document.getElementById('main');
    const symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
    
    const symptomsList = symptoms.slice(-10).reverse().map(s => `
      <div class="symptom-card">
        <p><strong>${new Date(s.date).toLocaleDateString()}</strong> - ${s.symptom}</p>
        <p>Severity: ${'⭐'.repeat(s.severity)}</p>
        ${s.notes ? `<p>Notes: ${s.notes}</p>` : ''}
      </div>
    `).join('');
    
    main.innerHTML = `
      <div class="symptoms-view">
        <h1>📝 Symptoms & Side Effects</h1>
        <div class="symptoms-list">
          ${symptomsList || '<p>No symptoms recorded yet.</p>'}
        </div>
      </div>
    `;
  }

  function showWeight() {
    const main = document.getElementById('main');
    const weights = JSON.parse(localStorage.getItem('weight') || '[]');
    
    const recentWeights = weights.slice(-10).reverse();
    
    const weightList = recentWeights.map(w => `
      <div class="weight-entry">
        <p><strong>${new Date(w.date).toLocaleDateString()}</strong>: ${w.weight} lbs</p>
        ${w.notes ? `<p>Notes: ${w.notes}</p>` : ''}
      </div>
    `).join('');
    
    main.innerHTML = `
      <div class="weight-view">
        <h1>⚖️ Weight Tracking</h1>
        <div class="weight-list">
          ${weightList || '<p>No weight entries yet.</p>'}
        </div>
      </div>
    `;
  }

  function showGoals() {
    const main = document.getElementById('main');
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    
    const goalsList = goals.map(goal => `
      <div class="goal-card">
        <h3>${goal.name}</h3>
        <p>${goal.description}</p>
        <p>Progress: ${goal.progress}% | Target: ${goal.targetValue} ${goal.unit}</p>
        <p>Target Date: ${new Date(goal.targetDate).toLocaleDateString()}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${goal.progress}%"></div>
        </div>
      </div>
    `).join('');
    
    main.innerHTML = `
      <div class="goals-view">
        <h1>🎯 Goals & Achievements</h1>
        <div class="goals-list">
          ${goalsList || '<p>No goals set yet.</p>'}
        </div>
      </div>
    `;
  }

  function showBulkEntry() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="bulk-entry-view">
        <h1>📋 Bulk Data Entry</h1>
        <p>Import CSV data or enter multiple records at once.</p>
        <p class="notice">This feature is coming soon!</p>
      </div>
    `;
  }

  function showReports() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="reports-view">
        <h1>📈 Reports & Export</h1>
        <div class="export-buttons">
          <button class="btn btn-primary" onclick="exportData()">Export All Data (JSON)</button>
        </div>
      </div>
    `;
  }

  function showSettings() {
    const main = document.getElementById('main');
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    main.innerHTML = `
      <div class="settings-view">
        <h1>⚙️ Settings</h1>
        <div class="settings-content">
          <p><strong>Name:</strong> ${settings.name || 'Not set'}</p>
          <p><strong>Date of Birth:</strong> ${settings.dob || 'Not set'}</p>
          <p><strong>Blood Type:</strong> ${settings.bloodType || 'Not set'}</p>
          <p><strong>Theme:</strong> ${settings.theme || 'light'}</p>
        </div>
      </div>
    `;
  }

  // Make exportData global
  window.exportData = function() {
    const data = {
      settings: JSON.parse(localStorage.getItem('settings') || '{}'),
      medications: JSON.parse(localStorage.getItem('medications') || '[]'),
      vitals: JSON.parse(localStorage.getItem('vitals') || '[]'),
      weight: JSON.parse(localStorage.getItem('weight') || '[]'),
      symptoms: JSON.parse(localStorage.getItem('symptoms') || '[]'),
      goals: JSON.parse(localStorage.getItem('goals') || '[]'),
      achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

})();
