// Enhanced Error Handling and Loading States
function showLoadingState(elementId, message = 'Loading...') {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('loading-overlay-content');
    element.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div class="loading-spinner" style="margin: 0 auto 10px;"></div>
        <div style="color: #a8aab2; font-size: 0.9em;">${message}</div>
      </div>
    `;
  }
}

function hideLoadingState(elementId, originalContent = '') {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove('loading-overlay-content');
    if (originalContent) {
      element.innerHTML = originalContent;
    }
  }
}

function showErrorState(elementId, message, icon = '❌') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="error-state">
        <span class="error-icon">${icon}</span>
        <div style="font-weight: 600; margin-bottom: 8px;">Error</div>
        <div>${message}</div>
        <button onclick="retryOperation('${elementId}')" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
          🔄 Retry
        </button>
      </div>
    `;
  }
}

function showSuccessState(elementId, message, icon = '✅') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="success-state">
        <span class="success-icon">${icon}</span>
        <div style="font-weight: 600; margin-bottom: 8px;">Success</div>
        <div>${message}</div>
      </div>
    `;
  }
}

function showEmptyState(elementId, message, icon = '📊', actionText = '', actionCallback = null) {
  const element = document.getElementById(elementId);
  if (element) {
    const actionButton = actionText && actionCallback ? 
      `<button onclick="${actionCallback}" style="background: #7dd3fc; color: #0b0b0c; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 15px;">
        ${actionText}
      </button>` : '';
    
    element.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #a8aab2;">
        <div style="font-size: 3rem; margin-bottom: 15px;">${icon}</div>
        <h4 style="color: #e7e7ea; margin-bottom: 10px;">No Data Yet</h4>
        <p style="margin-bottom: 0;">${message}</p>
        ${actionButton}
      </div>
    `;
  }
}

function retryOperation(elementId) {
  // This will be implemented based on the specific operation
  console.log(`Retrying operation for ${elementId}`);
  if (typeof loadDashboard === 'function') {
    loadDashboard();
  }
}

// Enhanced Toast System
function showToast(message, type = 'info', duration = 3000) {
  const toastRegion = document.getElementById('toast-region');
  if (!toastRegion) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const colors = {
    success: '#86efac',
    error: '#fca5a5',
    warning: '#fde68a',
    info: '#7dd3fc'
  };
  
  toast.style.cssText = `
    background: #121315;
    border: 1px solid ${colors[type]};
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 10px;
    color: #e7e7ea;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease-out;
  `;
  
  toast.innerHTML = `
    <span style="color: ${colors[type]}; font-size: 1.2em;">${icons[type]}</span>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #a8aab2; cursor: pointer; font-size: 1.2em;">×</button>
  `;
  
  toastRegion.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// Make functions globally available
window.showLoadingState = showLoadingState;
window.hideLoadingState = hideLoadingState;
window.showErrorState = showErrorState;
window.showSuccessState = showSuccessState;
window.showEmptyState = showEmptyState;
window.showToast = showToast;

// ======================
// Data Store
// ======================
const HealthStore = {
  init() {
    console.log('[HealthStore] Initializing...');
    this.data = this.load();
    console.log('[HealthStore] Data loaded:', this.data);
    this.checkFirstRun();
    console.log('[HealthStore] First run check completed');
  },

  load() {
    const data = localStorage.getItem('healthTrackerData');
    return data ? JSON.parse(data) : this.getDefaultData();
  },

  getDefaultData() {
    return {
      medications: [],
      vitals: [],
      symptoms: [],
      weights: [],
      goals: [],
      medicationLog: [],
      achievements: this.getDefaultAchievements(),
      settings: {
        ageRange: '',
        height: '',
        targetWeight: '',
        targetDate: '',
        notifications: {
          meds: true,
          vitals: true,
          weight: false,
          goals: true
        }
      },
      hipaaAccepted: false
    };
  },

  getDefaultAchievements() {
    return [
      { id: 'first_med', name: 'Getting Started', icon: '💊', description: 'Log your first medication', earned: false, date: null },
      { id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: 'Track for 7 days straight', earned: false, date: null },
      { id: 'month_streak', name: 'Month Master', icon: '🏆', description: 'Track for 30 days straight', earned: false, date: null },
      { id: 'first_vital', name: 'Vital Signs', icon: '❤️', description: 'Record your first vitals', earned: false, date: null },
      { id: 'weight_10', name: 'Weight Warrior', icon: '⚖️', description: 'Log 10 weight entries', earned: false, date: null },
      { id: 'first_goal', name: 'Goal Setter', icon: '🎯', description: 'Set your first goal', earned: false, date: null },
      { id: 'goal_complete', name: 'Goal Achiever', icon: '🌟', description: 'Complete your first goal', earned: false, date: null },
      { id: 'data_master', name: 'Data Master', icon: '📊', description: 'Have 50+ total entries', earned: false, date: null },
      { id: 'perfect_week', name: 'Perfect Week', icon: '💯', description: 'Take all meds for a week', earned: false, date: null },
      { id: 'health_champ', name: 'Health Champion', icon: '👑', description: 'Earn all other achievements', earned: false, date: null }
    ];
  },

  save() {
    localStorage.setItem('healthTrackerData', JSON.stringify(this.data));
  },

  checkFirstRun() {
    console.log('[HealthStore] Checking first run, hipaaAccepted:', this.data.hipaaAccepted);
    if (!this.data.hipaaAccepted) {
      console.log('[HealthStore] HIPAA not accepted, showing modal...');
      showHIPAAModal();
    } else {
      console.log('[HealthStore] HIPAA already accepted, skipping modal');
    }
  },

  // Medications
  addMedication(med) {
    med.id = Date.now().toString();
    this.data.medications.push(med);
    this.save();
    this.checkAchievement('first_med');
    return med.id;
  },

  getMedications() {
    return this.data.medications;
  },

  updateMedication(id, updates) {
    const index = this.data.medications.findIndex(m => m.id === id);
    if (index !== -1) {
      this.data.medications[index] = { ...this.data.medications[index], ...updates };
      this.save();
    }
  },

  deleteMedication(id) {
    this.data.medications = this.data.medications.filter(m => m.id !== id);
    this.save();
  },

  // Medication Log
  logMedication(medId, time, date = new Date().toISOString()) {
    this.data.medicationLog.push({
      id: Date.now().toString(),
      medId,
      time,
      date,
      taken: true
    });
    this.save();
    this.checkPerfectWeek();
  },

  getMedicationLog(date = null) {
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      return this.data.medicationLog.filter(log => log.date.startsWith(today));
    }
    return this.data.medicationLog.filter(log => log.date.startsWith(date));
  },

  // Vitals
  addVital(vital) {
    vital.id = Date.now().toString();
    vital.date = vital.date || new Date().toISOString();
    this.data.vitals.push(vital);
    this.save();
    this.checkAchievement('first_vital');
    return vital.id;
  },

  getVitals() {
    return this.data.vitals.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  deleteVital(id) {
    this.data.vitals = this.data.vitals.filter(v => v.id !== id);
    this.save();
  },

  // Symptoms
  addSymptom(symptom) {
    symptom.id = Date.now().toString();
    symptom.date = symptom.date || new Date().toISOString();
    this.data.symptoms.push(symptom);
    this.save();
    return symptom.id;
  },

  getSymptoms() {
    return this.data.symptoms.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  deleteSymptom(id) {
    this.data.symptoms = this.data.symptoms.filter(s => s.id !== id);
    this.save();
  },

  // Weight
  addWeight(weight) {
    weight.id = Date.now().toString();
    weight.date = weight.date || new Date().toISOString();
    this.data.weights.push(weight);
    this.save();
    if (this.data.weights.length >= 10) {
      this.checkAchievement('weight_10');
    }
    return weight.id;
  },

  getWeights() {
    return this.data.weights.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  deleteWeight(id) {
    this.data.weights = this.data.weights.filter(w => w.id !== id);
    this.save();
  },

  // Goals
  addGoal(goal) {
    goal.id = Date.now().toString();
    goal.createdDate = new Date().toISOString();
    goal.progress = 0;
    goal.completed = false;
    this.data.goals.push(goal);
    this.save();
    this.checkAchievement('first_goal');
    return goal.id;
  },

  getGoals() {
    return this.data.goals;
  },

  updateGoal(id, updates) {
    const index = this.data.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      this.data.goals[index] = { ...this.data.goals[index], ...updates };
      if (updates.completed && !this.data.goals[index].completedDate) {
        this.data.goals[index].completedDate = new Date().toISOString();
        this.checkAchievement('goal_complete');
      }
      this.save();
    }
  },

  deleteGoal(id) {
    this.data.goals = this.data.goals.filter(g => g.id !== id);
    this.save();
  },

  // Achievements
  checkAchievement(achievementId) {
    const achievement = this.data.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.earned) {
      achievement.earned = true;
      achievement.date = new Date().toISOString();
      this.save();
      showAchievement(achievement);
      
      // Check if all achievements are earned for Health Champion
      const allExceptChamp = this.data.achievements.filter(a => a.id !== 'health_champ');
      if (allExceptChamp.every(a => a.earned)) {
        setTimeout(() => this.checkAchievement('health_champ'), 1000);
      }
    }
  },

  checkPerfectWeek() {
    // Check if all medications were taken for 7 consecutive days
    const today = new Date();
    let perfectDays = 0;
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const medsForDay = this.data.medications.length;
      const logForDay = this.data.medicationLog.filter(log => log.date.startsWith(dateStr)).length;
      
      if (medsForDay > 0 && logForDay >= medsForDay) {
        perfectDays++;
      } else {
        break;
      }
    }
    
    if (perfectDays >= 7) {
      this.checkAchievement('perfect_week');
    }
  },

  // Settings
  updateSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  },

  // Data Management
  exportData() {
    return JSON.stringify(this.data, null, 2);
  },

  importData(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      // Merge data
      this.data.medications = [...this.data.medications, ...(imported.medications || [])];
      this.data.vitals = [...this.data.vitals, ...(imported.vitals || [])];
      this.data.symptoms = [...this.data.symptoms, ...(imported.symptoms || [])];
      this.data.weights = [...this.data.weights, ...(imported.weights || [])];
      this.data.goals = [...this.data.goals, ...(imported.goals || [])];
      this.data.medicationLog = [...this.data.medicationLog, ...(imported.medicationLog || [])];
      
      // Remove duplicates by ID
      this.data.medications = this.removeDuplicates(this.data.medications);
      this.data.vitals = this.removeDuplicates(this.data.vitals);
      this.data.symptoms = this.removeDuplicates(this.data.symptoms);
      this.data.weights = this.removeDuplicates(this.data.weights);
      this.data.goals = this.removeDuplicates(this.data.goals);
      this.data.medicationLog = this.removeDuplicates(this.data.medicationLog);
      
      this.save();
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  },

  removeDuplicates(array) {
    const seen = new Set();
    return array.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  },

  clearAllData() {
    if (confirm('⚠️ WARNING: This will permanently delete ALL your health data. This cannot be undone!\n\nAre you absolutely sure?')) {
      if (confirm('⚠️ FINAL WARNING: Click OK to permanently delete all data.')) {
        localStorage.removeItem('healthTrackerData');
        this.data = this.getDefaultData();
        this.save();
        showToast('All data has been cleared', 'success');
        setTimeout(() => location.reload(), 1000);
      }
    }
  },

  // Statistics
  getStats() {
    const totalEntries = this.data.medications.length + this.data.vitals.length + 
                        this.data.weights.length + this.data.symptoms.length;
    
    if (totalEntries >= 50) {
      this.checkAchievement('data_master');
    }

    // Calculate streaks
    const medStreak = this.calculateMedStreak();
    const vitalStreak = this.calculateVitalStreak();
    const weightStreak = this.calculateWeightStreak();

    if (medStreak >= 7 || vitalStreak >= 7 || weightStreak >= 7) {
      this.checkAchievement('week_streak');
    }
    if (medStreak >= 30 || vitalStreak >= 30 || weightStreak >= 30) {
      this.checkAchievement('month_streak');
    }

    return {
      totalEntries,
      medStreak,
      vitalStreak,
      weightStreak
    };
  },

  calculateMedStreak() {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasLog = this.data.medicationLog.some(log => log.date.startsWith(dateStr));
      if (hasLog) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  },

  calculateVitalStreak() {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasVital = this.data.vitals.some(v => v.date.startsWith(dateStr));
      if (hasVital) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  },

  calculateWeightStreak() {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i += 7) { // Weekly tracking
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const weekStart = checkDate.toISOString().split('T')[0];
      
      const checkDateEnd = new Date(today);
      checkDateEnd.setDate(checkDateEnd.getDate() - i + 7);
      const weekEnd = checkDateEnd.toISOString().split('T')[0];
      
      const hasWeight = this.data.weights.some(w => w.date >= weekStart && w.date < weekEnd);
      if (hasWeight) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }
};

// ======================
// UI Functions
// ======================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  const region = document.getElementById('toast-region');
  region.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showAchievement(achievement) {
  const banner = document.getElementById('achievement-banner');
  const title = document.getElementById('achievement-title');
  const message = document.getElementById('achievement-message');
  
  title.textContent = `${achievement.icon} ${achievement.name}`;
  message.textContent = achievement.description;
  
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 5000);
}

function closeAchievement() {
  document.getElementById('achievement-banner').style.display = 'none';
}

function showHIPAAModal() {
  const modal = document.getElementById('hipaa-modal');
  modal.style.display = 'grid';
  
  const checkbox = document.getElementById('hipaa-acknowledge');
  const acceptBtn = document.getElementById('hipaa-accept');
  
  // Remove existing event listeners to prevent duplicates
  checkbox.removeEventListener('change', handleHIPAACheckboxChange);
  acceptBtn.removeEventListener('click', handleHIPAAAccept);
  
  // Add event listeners
  checkbox.addEventListener('change', handleHIPAACheckboxChange);
  acceptBtn.addEventListener('click', handleHIPAAAccept);
}

function handleHIPAACheckboxChange() {
  const checkbox = document.getElementById('hipaa-acknowledge');
  const acceptBtn = document.getElementById('hipaa-accept');
  acceptBtn.disabled = !checkbox.checked;
}

function handleHIPAAAccept() {
  HealthStore.data.hipaaAccepted = true;
  HealthStore.save();
  const modal = document.getElementById('hipaa-modal');
  modal.style.display = 'none';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateString) {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

// ======================
// Navigation
// ======================

function initNavigation() {
  const navLinks = document.querySelectorAll('[data-nav]');
  const pages = document.querySelectorAll('[data-page]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('href').substring(1);
      
      // Update nav active state
      navLinks.forEach(l => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
      
      // Show target page
      pages.forEach(p => p.hidden = true);
      const page = document.getElementById(`page-${targetPage}`);
      if (page) {
        page.hidden = false;
        loadPage(targetPage);
      }
    });
  });
  
  // Show dashboard by default
  const dashboardPage = document.getElementById('page-dashboard');
  if (dashboardPage) {
    dashboardPage.hidden = false;
    loadPage('dashboard');
  }
}

function loadPage(pageName) {
  switch(pageName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'medications':
      loadMedications();
      break;
    case 'vitals':
      loadVitals();
      break;
    case 'symptoms':
      loadSymptoms();
      break;
    case 'weight':
      loadWeight();
      break;
    case 'goals':
      loadGoals();
      break;
    case 'bulk-entry':
      loadBulkEntry();
      break;
    case 'reports':
      loadReports();
      break;
    case 'settings':
      loadSettings();
      break;
    case 'alerts':
      loadAlerts();
      break;
  }
}

// ======================
// Quick Add Modals
// ======================

function showQuickVitalsModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px;">
      <h3 style="color: #e7e7ea; margin: 0 0 20px 0;">❤️ Add Vitals</h3>
      <div style="display: grid; gap: 15px;">
        <input type="number" id="quick-systolic" placeholder="Systolic (top number)" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea;">
        <input type="number" id="quick-diastolic" placeholder="Diastolic (bottom number)" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea;">
        <input type="number" id="quick-heartrate" placeholder="Heart Rate (optional)" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea;">
        <div style="display: flex; gap: 10px;">
          <button onclick="saveQuickVitals()" style="flex: 1; padding: 12px; background: #86efac; color: #0b0b0c; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Save</button>
          <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #333; color: #e7e7ea; border: 1px solid #555; border-radius: 8px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('quick-systolic').focus();
}

function showQuickWeightModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px;">
      <h3 style="color: #e7e7ea; margin: 0 0 20px 0;">⚖️ Add Weight</h3>
      <div style="display: grid; gap: 15px;">
        <input type="number" id="quick-weight" placeholder="Weight (lbs)" step="0.1" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea;">
        <div style="display: flex; gap: 10px;">
          <button onclick="saveQuickWeight()" style="flex: 1; padding: 12px; background: #fbbf24; color: #0b0b0c; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Save</button>
          <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #333; color: #e7e7ea; border: 1px solid #555; border-radius: 8px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('quick-weight').focus();
}

function showQuickMedModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px;">
      <h3 style="color: #e7e7ea; margin: 0 0 20px 0;">💊 Log Medication</h3>
      <div style="display: grid; gap: 15px;">
        <select id="quick-medication" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea;">
          <option value="">Select medication...</option>
        </select>
        <div style="display: flex; gap: 10px;">
          <button onclick="saveQuickMed()" style="flex: 1; padding: 12px; background: #7dd3fc; color: #0b0b0c; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Log</button>
          <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #333; color: #e7e7ea; border: 1px solid #555; border-radius: 8px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  // Populate medications
  const medSelect = modal.querySelector('#quick-medication');
  const medications = HealthStore.getMedications();
  medications.forEach(med => {
    const option = document.createElement('option');
    option.value = med.name;
    option.textContent = med.name;
    medSelect.appendChild(option);
  });
  
  document.body.appendChild(modal);
}

function showQuickSymptomModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px;">
      <h3 style="color: #e7e7ea; margin: 0 0 20px 0;">📝 Add Symptom</h3>
      <div style="display: grid; gap: 15px;">
        <input type="text" id="quick-symptom-type" placeholder="Symptom type (e.g., headache, nausea)" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea;">
        <textarea id="quick-symptom-notes" placeholder="Notes (optional)" rows="3" style="padding: 12px; border: 1px solid #333; border-radius: 8px; background: #1a1a1a; color: #e7e7ea; resize: vertical;"></textarea>
        <div style="display: flex; gap: 10px;">
          <button onclick="saveQuickSymptom()" style="flex: 1; padding: 12px; background: #c084fc; color: #0b0b0c; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Save</button>
          <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #333; color: #e7e7ea; border: 1px solid #555; border-radius: 8px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('quick-symptom-type').focus();
}

function saveQuickVitals() {
  const systolic = parseInt(document.getElementById('quick-systolic').value);
  const diastolic = parseInt(document.getElementById('quick-diastolic').value);
  const heartRate = parseInt(document.getElementById('quick-heartrate').value) || null;
  
  if (!systolic || !diastolic) {
    alert('Please enter both systolic and diastolic values');
    return;
  }
  
  HealthStore.addVital({ systolic, diastolic, heartRate });
  closeModal();
  loadDashboard();
  showToast('Vitals logged successfully!', 'success');
}

function saveQuickWeight() {
  const weight = parseFloat(document.getElementById('quick-weight').value);
  
  if (!weight || weight <= 0) {
    alert('Please enter a valid weight');
    return;
  }
  
  HealthStore.addWeight({ value: weight });
  closeModal();
  loadDashboard();
  showToast('Weight logged successfully!', 'success');
}

function saveQuickMed() {
  const medication = document.getElementById('quick-medication').value;
  
  if (!medication) {
    alert('Please select a medication');
    return;
  }
  
  HealthStore.addMedicationLog({ medication, taken: true });
  closeModal();
  loadDashboard();
  showToast('Medication logged successfully!', 'success');
}

function saveQuickSymptom() {
  const type = document.getElementById('quick-symptom-type').value.trim();
  const notes = document.getElementById('quick-symptom-notes').value.trim();
  
  if (!type) {
    alert('Please enter a symptom type');
    return;
  }
  
  HealthStore.addSymptom({ type, notes });
  closeModal();
  loadDashboard();
  showToast('Symptom logged successfully!', 'success');
}

function closeModal() {
  const modal = document.querySelector('[style*="position: fixed"]');
  if (modal) {
    modal.remove();
  }
}

// ======================
// Dashboard
// ======================

function loadDashboard() {
  try {
    console.log('[Dashboard] Starting dashboard load...');
    
    // Show loading state for dashboard
    showLoadingState('dashboard-stats', 'Loading health statistics...');
    
    // Update date
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      dateElement.textContent = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    // Load data with error handling
    setTimeout(() => {
      try {
        // Quick Stats
        updateDashboardStats();
        
        // Load trend analysis
        loadTrendAnalysis();
        
        // Load medication status
        loadMedicationStatus();
        
        // Upcoming Medications
        updateUpcomingMeds();
        
        // Recent Vitals Chart
        drawMiniVitalsChart();
        
        // Load advanced analytics
        loadAdvancedAnalytics();
        
        // Streaks
        const stats = HealthStore.getStats();
        const streakMeds = document.getElementById('streak-meds');
        const streakVitals = document.getElementById('streak-vitals');
        const streakWeight = document.getElementById('streak-weight');
        
        if (streakMeds) streakMeds.textContent = `${stats.medStreak} days`;
        if (streakVitals) streakVitals.textContent = `${stats.vitalStreak} days`;
        if (streakWeight) streakWeight.textContent = `${stats.weightStreak} weeks`;
        
        console.log('[Dashboard] Dashboard loaded successfully');
        
      } catch (error) {
        console.error('[Dashboard] Error loading dashboard components:', error);
        showErrorState('dashboard-stats', 'Failed to load dashboard data. Please try refreshing the page.');
      }
    }, 500); // Small delay to show loading state
    
  } catch (error) {
    console.error('[Dashboard] Critical error in loadDashboard:', error);
    showErrorState('dashboard-stats', 'Critical error loading dashboard. Please refresh the page.');
  }
}

function loadTrendAnalysis() {
  const vitals = HealthStore.getVitals();
  const weights = HealthStore.getWeights();
  const trendAnalysis = document.getElementById('trend-analysis');
  
  if (!trendAnalysis) return;
  
  // Show empty state if no data
  if (vitals.length === 0 && weights.length === 0) {
    showEmptyState('trend-analysis', 
      'Start tracking your vitals and weight to see health trends over time.',
      '📈',
      'Add First Vital',
      'document.getElementById("quick-add-vitals").click()'
    );
    return;
  }
  
  let analysis = [];
  
  // Blood pressure trend
  if (vitals.length >= 2) {
    const latest = vitals[0];
    const previous = vitals[1];
    const systolicChange = latest.systolic - previous.systolic;
    const diastolicChange = latest.diastolic - previous.diastolic;
    
    if (Math.abs(systolicChange) > 5 || Math.abs(diastolicChange) > 5) {
      const direction = systolicChange > 0 ? 'increased' : 'decreased';
      analysis.push(`BP ${direction} by ${Math.abs(systolicChange)}/${Math.abs(diastolicChange)}`);
    } else {
      analysis.push('BP stable');
    }
  }
  
  // Weight trend
  if (weights.length >= 2) {
    const latest = weights[0];
    const previous = weights[1];
    const change = latest.value - previous.value;
    
    if (Math.abs(change) > 0.5) {
      const direction = change > 0 ? 'gained' : 'lost';
      analysis.push(`Weight ${direction} ${Math.abs(change).toFixed(1)} lbs`);
    } else {
      analysis.push('Weight stable');
    }
  }
  
  trendAnalysis.innerHTML = analysis.length > 0 ? 
    analysis.join(' • ') : 
    'No recent trends detected';
}

function loadMedicationStatus() {
  const medications = HealthStore.getMedications();
  const medicationLog = HealthStore.getMedicationLog();
  const today = new Date().toDateString();
  const statusEl = document.getElementById('medication-status');
  
  if (!statusEl) return;
  
  const activeMeds = medications.filter(m => m.active);
  const takenToday = medicationLog.filter(log => 
    log.date === today && log.taken
  );
  
  const adherence = activeMeds.length > 0 ? 
    Math.round((takenToday.length / activeMeds.length) * 100) : 0;
  
  statusEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span>Today's Adherence:</span>
      <span style="color: ${adherence >= 80 ? '#86efac' : adherence >= 60 ? '#fde68a' : '#fda4af'};">
        ${adherence}%
      </span>
    </div>
    <div style="font-size: 0.9em;">
      ${takenToday.length}/${activeMeds.length} medications taken
    </div>
  `;
}

function loadAdvancedAnalytics() {
  loadBloodPressureTrendChart();
  loadWeightTrendChart();
  loadWeeklySummary();
}

function loadBloodPressureTrendChart() {
  const canvas = document.getElementById('bp-trend-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const vitals = HealthStore.getVitals().slice(0, 14); // Last 14 days
  
  if (vitals.length < 2) {
    ctx.fillStyle = '#a8aab2';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Not enough data', canvas.width/2, canvas.height/2);
    return;
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = (canvas.height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw systolic line
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 2;
  ctx.beginPath();
  vitals.forEach((vital, index) => {
    const x = (canvas.width / (vitals.length - 1)) * index;
    const y = canvas.height - ((vital.systolic - 80) / 60) * canvas.height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw diastolic line
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  vitals.forEach((vital, index) => {
    const x = (canvas.width / (vitals.length - 1)) * index;
    const y = canvas.height - ((vital.diastolic - 40) / 40) * canvas.height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw labels
  ctx.fillStyle = '#e7e7ea';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Systolic', 10, 20);
  ctx.fillText('Diastolic', 10, 35);
  
  // Draw legend
  ctx.fillStyle = '#fda4af';
  ctx.fillRect(80, 10, 10, 10);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(80, 25, 10, 10);
}

function loadWeightTrendChart() {
  const canvas = document.getElementById('weight-trend-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const weights = HealthStore.getWeights().slice(0, 14); // Last 14 days
  
  if (weights.length < 2) {
    ctx.fillStyle = '#a8aab2';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Not enough data', canvas.width/2, canvas.height/2);
    return;
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Find min/max for scaling
  const values = weights.map(w => w.value);
  const minWeight = Math.min(...values);
  const maxWeight = Math.max(...values);
  const range = maxWeight - minWeight;
  
  // Draw grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = (canvas.height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw weight line
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  weights.forEach((weight, index) => {
    const x = (canvas.width / (weights.length - 1)) * index;
    const y = canvas.height - ((weight.value - minWeight) / range) * canvas.height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw data points
  ctx.fillStyle = '#fde68a';
  weights.forEach((weight, index) => {
    const x = (canvas.width / (weights.length - 1)) * index;
    const y = canvas.height - ((weight.value - minWeight) / range) * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Draw labels
  ctx.fillStyle = '#e7e7ea';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`${minWeight.toFixed(1)} lbs`, 10, canvas.height - 10);
  ctx.fillText(`${maxWeight.toFixed(1)} lbs`, 10, 20);
}

function loadWeeklySummary() {
  const summaryEl = document.getElementById('weekly-summary');
  if (!summaryEl) return;
  
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const vitals = HealthStore.getVitals().filter(v => 
    new Date(v.date) >= weekAgo
  );
  const weights = HealthStore.getWeights().filter(w => 
    new Date(w.date) >= weekAgo
  );
  const symptoms = HealthStore.getSymptoms().filter(s => 
    new Date(s.date) >= weekAgo
  );
  
  const avgSystolic = vitals.length > 0 ? 
    Math.round(vitals.reduce((sum, v) => sum + v.systolic, 0) / vitals.length) : 0;
  const avgDiastolic = vitals.length > 0 ? 
    Math.round(vitals.reduce((sum, v) => sum + v.diastolic, 0) / vitals.length) : 0;
  
  summaryEl.innerHTML = `
    <div style="margin-bottom: 10px;">
      <strong>This Week:</strong>
    </div>
    <div style="font-size: 0.9em; line-height: 1.4;">
      <div>📊 ${vitals.length} BP readings</div>
      <div>⚖️ ${weights.length} weight entries</div>
      <div>📝 ${symptoms.length} symptoms logged</div>
      ${avgSystolic > 0 ? `<div>📈 Avg BP: ${avgSystolic}/${avgDiastolic}</div>` : ''}
    </div>
  `;
}

function updateDashboardStats() {
  const meds = HealthStore.getMedications();
  const vitals = HealthStore.getVitals();
  const weights = HealthStore.getWeights();
  const goals = HealthStore.getGoals();
  const medLog = HealthStore.getMedicationLog();
  
  // Medications today
  document.getElementById('stat-meds-today').textContent = meds.length;
  document.getElementById('stat-meds-taken').textContent = `${medLog.length} taken`;
  
  // Latest Blood Pressure
  if (vitals.length > 0) {
    const latest = vitals[0];
    document.getElementById('stat-bp-latest').textContent = `${latest.systolic}/${latest.diastolic}`;
    document.getElementById('stat-bp-status').textContent = getBPStatus(latest.systolic, latest.diastolic);
  }
  
  // Current Weight
  if (weights.length > 0) {
    const latest = weights[0];
    document.getElementById('stat-weight-latest').textContent = `${latest.value} lbs`;
    
    if (weights.length > 1) {
      const previous = weights[1];
      const change = latest.value - previous.value;
      const sign = change > 0 ? '+' : '';
      document.getElementById('stat-weight-change').textContent = `${sign}${change.toFixed(1)} lbs`;
    }
  }
  
  // Goals
  const activeGoals = goals.filter(g => !g.completed);
  const avgProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;
  
  document.getElementById('stat-goals-progress').textContent = `${avgProgress}%`;
  document.getElementById('stat-goals-active').textContent = `${activeGoals.length} active goals`;
}

function updateUpcomingMeds() {
  const container = document.getElementById('upcoming-meds');
  const meds = HealthStore.getMedications();
  
  if (meds.length === 0) {
    container.innerHTML = '<p class="empty-state">No medications scheduled for today</p>';
    return;
  }
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  let html = '';
  meds.forEach(med => {
    if (med.times) {
      const times = med.times.split(',').map(t => t.trim());
      times.forEach(time => {
        const [hour, minute] = time.split(':').map(Number);
        const medTime = hour * 60 + minute;
        const nowTime = currentHour * 60 + currentMinute;
        
        if (medTime >= nowTime) {
          html += `
            <div class="med-log-item">
              <input type="checkbox" class="med-log-checkbox" data-med-id="${med.id}" data-time="${time}">
              <span class="med-log-time">${time}</span>
              <span class="med-log-name">${med.name}</span>
              <span class="med-log-dosage">${med.dosage}</span>
            </div>
          `;
        }
      });
    }
  });
  
  if (html) {
    container.innerHTML = html;
    
    // Add event listeners
    container.querySelectorAll('.med-log-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          HealthStore.logMedication(e.target.dataset.medId, e.target.dataset.time);
          showToast('Medication logged!', 'success');
          updateDashboardStats();
        }
      });
    });
  } else {
    container.innerHTML = '<p class="empty-state">All medications taken for today!</p>';
  }
}

function getBPStatus(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'High (Stage 1)';
  return 'High (Stage 2)';
}

function drawMiniVitalsChart() {
  const canvas = document.getElementById('chart-vitals-mini');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const vitals = HealthStore.getVitals().slice(0, 7).reverse();
  
  if (vitals.length === 0) {
    ctx.fillStyle = '#a8aab2';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No vitals data yet', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // Simple line chart
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw axes
  ctx.strokeStyle = '#191a1d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw systolic line
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const maxSystolic = Math.max(...vitals.map(v => v.systolic));
  const minSystolic = Math.min(...vitals.map(v => v.systolic));
  const rangeSystolic = maxSystolic - minSystolic || 1;
  
  vitals.forEach((v, i) => {
    const x = padding + (chartWidth / (vitals.length - 1 || 1)) * i;
    const y = height - padding - ((v.systolic - minSystolic) / rangeSystolic) * chartHeight;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#7dd3fc';
  ctx.font = '12px sans-serif';
  ctx.fillText('Blood Pressure Trend (Last 7 Days)', padding, 20);
}

// ======================
// Medications Page
// ======================

function loadMedications() {
  const container = document.getElementById('medications-list');
  const meds = HealthStore.getMedications();
  
  if (meds.length === 0) {
    container.innerHTML = '<p class="empty-state">No medications added yet. Click "+ Add Medication" to get started.</p>';
    return;
  }
  
  let html = '';
  meds.forEach(med => {
    html += `
      <div class="med-item">
        <div class="med-info">
          <h4>${med.name}</h4>
          <p>${med.dosage} • ${med.frequency}</p>
          <p><small>Times: ${med.times || 'Not specified'}</small></p>
          ${med.purpose ? `<p><small>For: ${med.purpose}</small></p>` : ''}
        </div>
        <div class="med-actions">
          <button class="btn btn-small" onclick="editMedication('${med.id}')">Edit</button>
          <button class="btn btn-small btn-danger" onclick="deleteMedication('${med.id}')">Delete</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Update medication log
  updateMedicationLog();
}

function updateMedicationLog() {
  const container = document.getElementById('med-log-today');
  const meds = HealthStore.getMedications();
  const log = HealthStore.getMedicationLog();
  
  if (meds.length === 0) {
    container.innerHTML = '<p class="empty-state">No medications to log</p>';
    return;
  }
  
  let html = '';
  meds.forEach(med => {
    if (med.times) {
      const times = med.times.split(',').map(t => t.trim());
      times.forEach(time => {
        const logged = log.some(l => l.medId === med.id && l.time === time);
        html += `
          <div class="med-log-item">
            <input type="checkbox" class="med-log-checkbox" 
              data-med-id="${med.id}" 
              data-time="${time}"
              ${logged ? 'checked' : ''}>
            <span class="med-log-time">${time}</span>
            <span class="med-log-name">${med.name}</span>
            <span class="med-log-dosage">${med.dosage}</span>
          </div>
        `;
      });
    }
  });
  
  container.innerHTML = html;
  
  // Add event listeners
  container.querySelectorAll('.med-log-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        HealthStore.logMedication(e.target.dataset.medId, e.target.dataset.time);
        showToast('Medication logged!', 'success');
      }
    });
  });
}

function addMedication() {
  const modal = createModal('Add Medication', `
    <div class="form-group">
      <label for="med-name">Medication Name *</label>
      <input type="text" id="med-name" class="form-control" required>
    </div>
    <div class="form-group">
      <label for="med-dosage">Dosage</label>
      <input type="text" id="med-dosage" class="form-control" placeholder="e.g., 10mg, 2 tablets">
    </div>
    <div class="form-group">
      <label for="med-frequency">Frequency *</label>
      <select id="med-frequency" class="form-control" required>
        <option value="daily">Daily</option>
        <option value="twice_daily">Twice Daily</option>
        <option value="three_times_daily">Three Times Daily</option>
        <option value="four_times_daily">Four Times Daily</option>
        <option value="weekly">Weekly</option>
        <option value="as_needed">As Needed</option>
      </select>
    </div>
    <div class="form-group">
      <label for="med-times">Times (comma separated)</label>
      <input type="text" id="med-times" class="form-control" placeholder="e.g., 08:00, 20:00">
    </div>
    <div class="form-group">
      <label for="med-start">Start Date</label>
      <input type="date" id="med-start" class="form-control" value="${new Date().toISOString().split('T')[0]}">
    </div>
    <div class="form-group">
      <label for="med-purpose">Purpose/Condition</label>
      <input type="text" id="med-purpose" class="form-control" placeholder="What is this medication for?">
    </div>
  `, 'Save', () => {
    const name = document.getElementById('med-name').value;
    const dosage = document.getElementById('med-dosage').value;
    const frequency = document.getElementById('med-frequency').value;
    const times = document.getElementById('med-times').value;
    const startDate = document.getElementById('med-start').value;
    const purpose = document.getElementById('med-purpose').value;
    
    if (!name || !frequency) {
      showToast('Please fill in required fields', 'error');
      return;
    }
    
    HealthStore.addMedication({ name, dosage, frequency, times, startDate, purpose });
    showToast('Medication added successfully!', 'success');
    loadMedications();
    modal.remove();
  });
}

function deleteMedication(id) {
  if (confirm('Are you sure you want to delete this medication?')) {
    HealthStore.deleteMedication(id);
    showToast('Medication deleted', 'success');
    loadMedications();
  }
}

// ======================
// Vitals Page
// ======================

function loadVitals() {
  const tbody = document.getElementById('vitals-tbody');
  const vitals = HealthStore.getVitals();
  
  if (vitals.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">No vitals recorded yet. Click "+ Record Vitals" to get started.</td></tr>';
    return;
  }
  
  let html = '';
  vitals.forEach(vital => {
    const bpStatus = getBPStatus(vital.systolic, vital.diastolic);
    html += `
      <tr>
        <td>${formatDateTime(vital.date)}</td>
        <td>${vital.systolic}/${vital.diastolic}</td>
        <td><span class="status-badge status-${bpStatus.toLowerCase().includes('normal') ? 'normal' : bpStatus.toLowerCase().includes('elevated') ? 'elevated' : 'high'}">${bpStatus}</span></td>
        <td>${vital.heartRate || '-'}</td>
        <td>${vital.temperature ? vital.temperature + '°F' : '-'}</td>
        <td>${vital.oxygen ? vital.oxygen + '%' : '-'}</td>
        <td>
          <button class="btn btn-small btn-danger" onclick="deleteVital('${vital.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  drawVitalsChart();
}

function addVital() {
  const modal = createModal('Record Vitals', `
    <div class="form-grid">
      <div class="form-group">
        <label for="vital-systolic">Systolic (top number) *</label>
        <input type="number" id="vital-systolic" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="vital-diastolic">Diastolic (bottom number) *</label>
        <input type="number" id="vital-diastolic" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="vital-hr">Heart Rate (bpm)</label>
        <input type="number" id="vital-hr" class="form-control">
      </div>
      <div class="form-group">
        <label for="vital-temp">Temperature (°F)</label>
        <input type="number" id="vital-temp" class="form-control" step="0.1">
      </div>
      <div class="form-group">
        <label for="vital-o2">Oxygen Saturation (%)</label>
        <input type="number" id="vital-o2" class="form-control" max="100">
      </div>
      <div class="form-group">
        <label for="vital-date">Date & Time</label>
        <input type="datetime-local" id="vital-date" class="form-control" value="${new Date().toISOString().slice(0, 16)}">
      </div>
    </div>
    <div class="form-group">
      <label for="vital-notes">Notes</label>
      <textarea id="vital-notes" class="form-control" placeholder="Any additional notes..."></textarea>
    </div>
  `, 'Save', () => {
    const systolic = document.getElementById('vital-systolic').value;
    const diastolic = document.getElementById('vital-diastolic').value;
    const heartRate = document.getElementById('vital-hr').value;
    const temperature = document.getElementById('vital-temp').value;
    const oxygen = document.getElementById('vital-o2').value;
    const date = document.getElementById('vital-date').value;
    const notes = document.getElementById('vital-notes').value;
    
    if (!systolic || !diastolic) {
      showToast('Please enter blood pressure readings', 'error');
      return;
    }
    
    HealthStore.addVital({
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      heartRate: heartRate ? parseInt(heartRate) : null,
      temperature: temperature ? parseFloat(temperature) : null,
      oxygen: oxygen ? parseInt(oxygen) : null,
      date: new Date(date).toISOString(),
      notes
    });
    
    showToast('Vitals recorded successfully!', 'success');
    loadVitals();
    modal.remove();
  });
}

function deleteVital(id) {
  if (confirm('Are you sure you want to delete this vital record?')) {
    HealthStore.deleteVital(id);
    showToast('Vital record deleted', 'success');
    loadVitals();
  }
}

function drawVitalsChart() {
  const canvas = document.getElementById('chart-vitals');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const vitals = HealthStore.getVitals().slice(0, 30).reverse();
  
  if (vitals.length === 0) {
    ctx.fillStyle = '#a8aab2';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No vitals data to display', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // Chart implementation (simplified)
  const width = canvas.width;
  const height = canvas.height;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  ctx.clearRect(0, 0, width, height);
  
  // Background
  ctx.fillStyle = '#121315';
  ctx.fillRect(0, 0, width, height);
  
  // Grid lines
  ctx.strokeStyle = '#191a1d';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Axes
  ctx.strokeStyle = '#a8aab2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw systolic line
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const maxValue = 180;
  const minValue = 60;
  const range = maxValue - minValue;
  
  vitals.forEach((v, i) => {
    const x = padding + (chartWidth / (vitals.length - 1 || 1)) * i;
    const y = height - padding - ((v.systolic - minValue) / range) * chartHeight;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Draw point
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.stroke();
  
  // Draw diastolic line
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  vitals.forEach((v, i) => {
    const x = padding + (chartWidth / (vitals.length - 1 || 1)) * i;
    const y = height - padding - ((v.diastolic - minValue) / range) * chartHeight;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Draw point
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.stroke();
  
  // Labels
  ctx.fillStyle = '#e7e7ea';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Blood Pressure Trends', width / 2, 30);
  
  // Legend
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(width - padding - 120, padding, 20, 10);
  ctx.fillStyle = '#e7e7ea';
  ctx.textAlign = 'left';
  ctx.fillText('Systolic', width - padding - 95, padding + 10);
  
  ctx.fillStyle = '#fda4af';
  ctx.fillRect(width - padding - 120, padding + 20, 20, 10);
  ctx.fillStyle = '#e7e7ea';
  ctx.fillText('Diastolic', width - padding - 95, padding + 30);
}

// ======================
// Symptoms Page
// ======================

function loadSymptoms() {
  const container = document.getElementById('symptoms-list');
  const symptoms = HealthStore.getSymptoms();
  
  if (symptoms.length === 0) {
    container.innerHTML = '<p class="empty-state">No symptoms logged yet. Click "+ Log Symptom" to get started.</p>';
    return;
  }
  
  let html = '';
  symptoms.forEach(symptom => {
    html += `
      <div class="symptom-item">
        <div class="symptom-info">
          <h4>${symptom.name} <span class="status-badge ${symptom.severity >= 7 ? 'status-high' : symptom.severity >= 4 ? 'status-elevated' : 'status-normal'}">Severity: ${symptom.severity}/10</span></h4>
          <p>${formatDateTime(symptom.date)}</p>
          ${symptom.relatedMed ? `<p><small>Related to: ${symptom.relatedMed}</small></p>` : ''}
          ${symptom.description ? `<p><small>${symptom.description}</small></p>` : ''}
        </div>
        <div class="symptom-actions">
          <button class="btn btn-small btn-danger" onclick="deleteSymptom('${symptom.id}')">Delete</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  drawSymptomChart();
}

function addSymptom() {
  const meds = HealthStore.getMedications();
  const medOptions = meds.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  
  const modal = createModal('Log Symptom', `
    <div class="form-group">
      <label for="symptom-name">Symptom *</label>
      <input type="text" id="symptom-name" class="form-control" placeholder="e.g., Headache, Nausea" required>
    </div>
    <div class="form-group">
      <label for="symptom-severity">Severity (1-10) *</label>
      <input type="range" id="symptom-severity" class="form-control" min="1" max="10" value="5">
      <div style="text-align: center; margin-top: 8px; font-size: 24px; font-weight: bold;" id="severity-display">5</div>
    </div>
    <div class="form-group">
      <label for="symptom-med">Related Medication (if any)</label>
      <select id="symptom-med" class="form-control">
        <option value="">None</option>
        ${medOptions}
      </select>
    </div>
    <div class="form-group">
      <label for="symptom-date">Date & Time</label>
      <input type="datetime-local" id="symptom-date" class="form-control" value="${new Date().toISOString().slice(0, 16)}">
    </div>
    <div class="form-group">
      <label for="symptom-description">Description</label>
      <textarea id="symptom-description" class="form-control" placeholder="Additional details about the symptom..."></textarea>
    </div>
  `, 'Save', () => {
    const name = document.getElementById('symptom-name').value;
    const severity = parseInt(document.getElementById('symptom-severity').value);
    const relatedMed = document.getElementById('symptom-med').value;
    const date = document.getElementById('symptom-date').value;
    const description = document.getElementById('symptom-description').value;
    
    if (!name) {
      showToast('Please enter a symptom name', 'error');
      return;
    }
    
    HealthStore.addSymptom({
      name,
      severity,
      relatedMed: relatedMed || null,
      date: new Date(date).toISOString(),
      description
    });
    
    showToast('Symptom logged successfully!', 'success');
    loadSymptoms();
    modal.remove();
  });
  
  // Update severity display
  document.getElementById('symptom-severity').addEventListener('input', (e) => {
    document.getElementById('severity-display').textContent = e.target.value;
  });
}

function deleteSymptom(id) {
  if (confirm('Are you sure you want to delete this symptom record?')) {
    HealthStore.deleteSymptom(id);
    showToast('Symptom record deleted', 'success');
    loadSymptoms();
  }
}

function drawSymptomChart() {
  const canvas = document.getElementById('chart-symptoms');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const symptoms = HealthStore.getSymptoms();
  
  if (symptoms.length === 0) {
    ctx.fillStyle = '#a8aab2';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No symptom data to display', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // Count symptom frequency
  const symptomCounts = {};
  symptoms.forEach(s => {
    symptomCounts[s.name] = (symptomCounts[s.name] || 0) + 1;
  });
  
  // Simple bar chart
  const width = canvas.width;
  const height = canvas.height;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = '#121315';
  ctx.fillRect(0, 0, width, height);
  
  const entries = Object.entries(symptomCounts).slice(0, 10);
  const maxCount = Math.max(...entries.map(e => e[1]));
  const barWidth = chartWidth / entries.length - 10;
  
  entries.forEach(([name, count], i) => {
    const barHeight = (count / maxCount) * chartHeight;
    const x = padding + i * (barWidth + 10);
    const y = height - padding - barHeight;
    
    // Draw bar
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw label
    ctx.save();
    ctx.translate(x + barWidth / 2, height - padding + 10);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#e7e7ea';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(name, 0, 0);
    ctx.restore();
    
    // Draw count
    ctx.fillStyle = '#e7e7ea';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(count.toString(), x + barWidth / 2, y - 5);
  });
  
  // Title
  ctx.fillStyle = '#e7e7ea';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Symptom Frequency', width / 2, 30);
}

// ======================
// Weight Page
// ======================

function loadWeight() {
  const tbody = document.getElementById('weight-tbody');
  const weights = HealthStore.getWeights();
  
  if (weights.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No weight entries yet. Click "+ Log Weight" to get started.</td></tr>';
    return;
  }
  
  let html = '';
  weights.forEach((weight, index) => {
    const bmi = calculateBMI(weight.value);
    const change = index < weights.length - 1 ? weight.value - weights[index + 1].value : 0;
    const sign = change > 0 ? '+' : '';
    
    html += `
      <tr>
        <td>${formatDate(weight.date)}</td>
        <td>${weight.value} lbs</td>
        <td>${bmi || '-'}</td>
        <td>${change !== 0 ? sign + change.toFixed(1) + ' lbs' : '-'}</td>
        <td>
          <button class="btn btn-small btn-danger" onclick="deleteWeight('${weight.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  
  // Update stats
  updateWeightStats(weights);
  drawWeightChart();
}

function updateWeightStats(weights) {
  if (weights.length === 0) return;
  
  const latest = weights[0];
  const sevenDaysAgo = weights.find(w => {
    const diff = Math.abs(new Date(latest.date) - new Date(w.date));
    return diff >= 7 * 24 * 60 * 60 * 1000;
  });
  const thirtyDaysAgo = weights.find(w => {
    const diff = Math.abs(new Date(latest.date) - new Date(w.date));
    return diff >= 30 * 24 * 60 * 60 * 1000;
  });
  
  document.getElementById('weight-current').textContent = `${latest.value} lbs`;
  
  if (sevenDaysAgo) {
    const change = latest.value - sevenDaysAgo.value;
    const sign = change > 0 ? '+' : '';
    document.getElementById('weight-7day').textContent = `${sign}${change.toFixed(1)} lbs`;
  }
  
  if (thirtyDaysAgo) {
    const change = latest.value - thirtyDaysAgo.value;
    const sign = change > 0 ? '+' : '';
    document.getElementById('weight-30day').textContent = `${sign}${change.toFixed(1)} lbs`;
  }
  
  const bmi = calculateBMI(latest.value);
  document.getElementById('weight-bmi').textContent = bmi || 'Set height in settings';
}

function calculateBMI(weightLbs) {
  const height = parseInt(HealthStore.data.settings.height);
  if (!height) return null;
  
  const bmi = (weightLbs / (height * height)) * 703;
  return bmi.toFixed(1);
}

function addWeight() {
  const modal = createModal('Log Weight', `
    <div class="form-group">
      <label for="weight-value">Weight (lbs) *</label>
      <input type="number" id="weight-value" class="form-control" step="0.1" required>
    </div>
    <div class="form-group">
      <label for="weight-date">Date</label>
      <input type="date" id="weight-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
    </div>
    <div class="form-group">
      <label for="weight-notes">Notes</label>
      <textarea id="weight-notes" class="form-control" placeholder="Optional notes..."></textarea>
    </div>
  `, 'Save', () => {
    const value = document.getElementById('weight-value').value;
    const date = document.getElementById('weight-date').value;
    const notes = document.getElementById('weight-notes').value;
    
    if (!value) {
      showToast('Please enter your weight', 'error');
      return;
    }
    
    HealthStore.addWeight({
      value: parseFloat(value),
      date: new Date(date).toISOString(),
      notes
    });
    
    showToast('Weight logged successfully!', 'success');
    loadWeight();
    modal.remove();
  });
}

function deleteWeight(id) {
  if (confirm('Are you sure you want to delete this weight entry?')) {
    HealthStore.deleteWeight(id);
    showToast('Weight entry deleted', 'success');
    loadWeight();
  }
}

function drawWeightChart() {
  const canvas = document.getElementById('chart-weight');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const weights = HealthStore.getWeights().slice(0, 90).reverse();
  
  if (weights.length === 0) {
    ctx.fillStyle = '#a8aab2';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No weight data to display', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  const width = canvas.width;
  const height = canvas.height;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = '#121315';
  ctx.fillRect(0, 0, width, height);
  
  // Grid
  ctx.strokeStyle = '#191a1d';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Axes
  ctx.strokeStyle = '#a8aab2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Weight line
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const values = weights.map(w => w.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  
  weights.forEach((w, i) => {
    const x = padding + (chartWidth / (weights.length - 1 || 1)) * i;
    const y = height - padding - ((w.value - minValue) / range) * chartHeight;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Draw point
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.stroke();
  
  // Goal line
  const targetWeight = parseFloat(HealthStore.data.settings.targetWeight);
  if (targetWeight && targetWeight >= minValue && targetWeight <= maxValue) {
    const goalY = height - padding - ((targetWeight - minValue) / range) * chartHeight;
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, goalY);
    ctx.lineTo(width - padding, goalY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#fde68a';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Goal: ${targetWeight} lbs`, width - padding - 5, goalY - 5);
  }
  
  // Title
  ctx.fillStyle = '#e7e7ea';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Weight Trend', width / 2, 30);
}

// ======================
// Goals Page
// ======================

function loadGoals() {
  const container = document.getElementById('goals-list');
  const achievementsContainer = document.getElementById('achievements-list');
  const goals = HealthStore.getGoals();
  const achievements = HealthStore.data.achievements;
  
  // Goals
  if (goals.length === 0) {
    container.innerHTML = '<p class="empty-state">No goals set yet. Click "+ Add Goal" to get started.</p>';
  } else {
    let html = '';
    goals.forEach(goal => {
      html += `
        <div class="goal-item">
          <div class="goal-header">
            <h4 class="goal-name">${goal.name}</h4>
            <span class="goal-progress">${goal.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${goal.progress}%"></div>
          </div>
          <p style="margin-top: 8px; font-size: 14px; color: var(--text-muted);">${goal.description}</p>
          ${goal.targetDate ? `<p style="font-size: 13px; color: var(--text-muted);">Target: ${formatDate(goal.targetDate)}</p>` : ''}
          <div class="button-group" style="margin-top: 12px;">
            <button class="btn btn-small" onclick="updateGoalProgress('${goal.id}')">Update Progress</button>
            <button class="btn btn-small btn-danger" onclick="deleteGoal('${goal.id}')">Delete</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }
  
  // Achievements
  let achievementsHtml = '';
  achievements.forEach(achievement => {
    achievementsHtml += `
      <div class="achievement-card ${achievement.earned ? 'earned' : ''}">
        <div class="achievement-icon">${achievement.icon}</div>
        <h4>${achievement.name}</h4>
        <p>${achievement.description}</p>
        ${achievement.earned ? `<p style="margin-top: 8px; font-size: 11px; color: var(--primary);">Earned ${formatDate(achievement.date)}</p>` : ''}
      </div>
    `;
  });
  achievementsContainer.innerHTML = achievementsHtml;
}

function addGoal() {
  const modal = createModal('Add Goal', `
    <div class="form-group">
      <label for="goal-type">Goal Type *</label>
      <select id="goal-type" class="form-control" required>
        <option value="weight">Weight Loss/Gain</option>
        <option value="bp">Blood Pressure Control</option>
        <option value="medication">Medication Adherence</option>
        <option value="exercise">Exercise/Activity</option>
        <option value="custom">Custom Goal</option>
      </select>
    </div>
    <div class="form-group">
      <label for="goal-name">Goal Name *</label>
      <input type="text" id="goal-name" class="form-control" placeholder="e.g., Lose 10 pounds" required>
    </div>
    <div class="form-group">
      <label for="goal-description">Description</label>
      <textarea id="goal-description" class="form-control" placeholder="Describe your goal and how you'll achieve it..."></textarea>
    </div>
    <div class="form-group">
      <label for="goal-target-date">Target Date</label>
      <input type="date" id="goal-target-date" class="form-control">
    </div>
  `, 'Create Goal', () => {
    const type = document.getElementById('goal-type').value;
    const name = document.getElementById('goal-name').value;
    const description = document.getElementById('goal-description').value;
    const targetDate = document.getElementById('goal-target-date').value;
    
    if (!name) {
      showToast('Please enter a goal name', 'error');
      return;
    }
    
    HealthStore.addGoal({
      type,
      name,
      description,
      targetDate: targetDate || null
    });
    
    showToast('Goal created successfully!', 'success');
    loadGoals();
    modal.remove();
  });
}

function updateGoalProgress(id) {
  const goal = HealthStore.getGoals().find(g => g.id === id);
  if (!goal) return;
  
  const modal = createModal('Update Goal Progress', `
    <div class="form-group">
      <label for="goal-progress">Progress (0-100%) *</label>
      <input type="range" id="goal-progress" class="form-control" min="0" max="100" value="${goal.progress}">
      <div style="text-align: center; margin-top: 8px; font-size: 24px; font-weight: bold;" id="progress-display">${goal.progress}%</div>
    </div>
    <div class="form-group">
      <label>
        <input type="checkbox" id="goal-completed"> Mark as completed
      </label>
    </div>
  `, 'Update', () => {
    const progress = parseInt(document.getElementById('goal-progress').value);
    const completed = document.getElementById('goal-completed').checked;
    
    HealthStore.updateGoal(id, { progress, completed: completed || progress === 100 });
    
    showToast('Goal updated!', 'success');
    loadGoals();
    modal.remove();
  });
  
  document.getElementById('goal-progress').addEventListener('input', (e) => {
    document.getElementById('progress-display').textContent = e.target.value + '%';
    if (e.target.value === '100') {
      document.getElementById('goal-completed').checked = true;
    }
  });
}

function deleteGoal(id) {
  if (confirm('Are you sure you want to delete this goal?')) {
    HealthStore.deleteGoal(id);
    showToast('Goal deleted', 'success');
    loadGoals();
  }
}

// ======================
// Bulk Entry Page
// ======================

function loadBulkEntry() {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const sections = document.querySelectorAll('.bulk-section');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      
      tabButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      
      sections.forEach(s => s.style.display = 'none');
      document.getElementById(`bulk-${target}`).style.display = 'block';
    });
  });
  
  // Initialize tables
  initBulkVitals();
  initBulkMedications();
  initBulkWeight();
  initBulkSymptoms();
}

function initBulkVitals() {
  const tbody = document.getElementById('bulk-vitals-tbody');
  
  document.getElementById('bulk-vitals-add-row').addEventListener('click', () => {
    addBulkVitalRow();
  });
  
  document.getElementById('bulk-vitals-save').addEventListener('click', () => {
    saveBulkVitals();
  });
  
  document.getElementById('bulk-vitals-clear').addEventListener('click', () => {
    if (confirm('Clear all rows?')) {
      tbody.innerHTML = '';
    }
  });
  
  // Add 3 initial rows
  for (let i = 0; i < 3; i++) {
    addBulkVitalRow();
  }
}

function addBulkVitalRow() {
  const tbody = document.getElementById('bulk-vitals-tbody');
  const row = document.createElement('tr');
  const today = new Date().toISOString().split('T')[0];
  
  row.innerHTML = `
    <td><input type="date" class="form-control" value="${today}"></td>
    <td><input type="time" class="form-control" value="12:00"></td>
    <td><input type="number" class="form-control" placeholder="120"></td>
    <td><input type="number" class="form-control" placeholder="80"></td>
    <td><input type="number" class="form-control" placeholder="72"></td>
    <td><input type="number" class="form-control" placeholder="98.6" step="0.1"></td>
    <td><input type="number" class="form-control" placeholder="98" max="100"></td>
    <td><button class="btn btn-small btn-danger" onclick="this.closest('tr').remove()">×</button></td>
  `;
  
  tbody.appendChild(row);
}

function saveBulkVitals() {
  const tbody = document.getElementById('bulk-vitals-tbody');
  const rows = tbody.querySelectorAll('tr');
  let saved = 0;
  
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const date = inputs[0].value;
    const time = inputs[1].value;
    const systolic = inputs[2].value;
    const diastolic = inputs[3].value;
    const heartRate = inputs[4].value;
    const temperature = inputs[5].value;
    const oxygen = inputs[6].value;
    
    if (date && systolic && diastolic) {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      HealthStore.addVital({
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        heartRate: heartRate ? parseInt(heartRate) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        oxygen: oxygen ? parseInt(oxygen) : null,
        date: dateTime,
        notes: 'Bulk entry'
      });
      saved++;
      row.remove();
    }
  });
  
  showToast(`Saved ${saved} vital entries!`, 'success');
}

function initBulkMedications() {
  // Similar implementation for medications
  const tbody = document.getElementById('bulk-meds-tbody');
  
  document.getElementById('bulk-meds-add-row').addEventListener('click', () => {
    addBulkMedRow();
  });
  
  document.getElementById('bulk-meds-save').addEventListener('click', () => {
    saveBulkMeds();
  });
  
  document.getElementById('bulk-meds-clear').addEventListener('click', () => {
    if (confirm('Clear all rows?')) {
      tbody.innerHTML = '';
    }
  });
  
  for (let i = 0; i < 3; i++) {
    addBulkMedRow();
  }
}

function addBulkMedRow() {
  const tbody = document.getElementById('bulk-meds-tbody');
  const row = document.createElement('tr');
  const today = new Date().toISOString().split('T')[0];
  
  row.innerHTML = `
    <td><input type="date" class="form-control" value="${today}"></td>
    <td><input type="time" class="form-control" value="08:00"></td>
    <td><input type="text" class="form-control" placeholder="Medication name"></td>
    <td><input type="text" class="form-control" placeholder="10mg"></td>
    <td><input type="checkbox" checked></td>
    <td><button class="btn btn-small btn-danger" onclick="this.closest('tr').remove()">×</button></td>
  `;
  
  tbody.appendChild(row);
}

function saveBulkMeds() {
  const tbody = document.getElementById('bulk-meds-tbody');
  const rows = tbody.querySelectorAll('tr');
  let saved = 0;
  
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const date = inputs[0].value;
    const time = inputs[1].value;
    const name = inputs[2].value;
    const dosage = inputs[3].value;
    const taken = inputs[4].checked;
    
    if (date && time && name && taken) {
      // Find or create medication
      let med = HealthStore.getMedications().find(m => m.name.toLowerCase() === name.toLowerCase());
      if (!med) {
        const medId = HealthStore.addMedication({
          name,
          dosage: dosage || '',
          frequency: 'as_needed',
          times: time,
          startDate: date
        });
        med = { id: medId };
      }
      
      HealthStore.logMedication(med.id, time, `${date}T${time}`);
      saved++;
      row.remove();
    }
  });
  
  showToast(`Saved ${saved} medication logs!`, 'success');
}

function initBulkWeight() {
  const tbody = document.getElementById('bulk-weight-tbody');
  
  document.getElementById('bulk-weight-add-row').addEventListener('click', () => {
    addBulkWeightRow();
  });
  
  document.getElementById('bulk-weight-save').addEventListener('click', () => {
    saveBulkWeight();
  });
  
  document.getElementById('bulk-weight-clear').addEventListener('click', () => {
    if (confirm('Clear all rows?')) {
      tbody.innerHTML = '';
    }
  });
  
  for (let i = 0; i < 3; i++) {
    addBulkWeightRow();
  }
}

function addBulkWeightRow() {
  const tbody = document.getElementById('bulk-weight-tbody');
  const row = document.createElement('tr');
  const today = new Date().toISOString().split('T')[0];
  
  row.innerHTML = `
    <td><input type="date" class="form-control" value="${today}"></td>
    <td><input type="number" class="form-control" placeholder="150" step="0.1"></td>
    <td><input type="text" class="form-control" placeholder="Optional notes"></td>
    <td><button class="btn btn-small btn-danger" onclick="this.closest('tr').remove()">×</button></td>
  `;
  
  tbody.appendChild(row);
}

function saveBulkWeight() {
  const tbody = document.getElementById('bulk-weight-tbody');
  const rows = tbody.querySelectorAll('tr');
  let saved = 0;
  
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const date = inputs[0].value;
    const value = inputs[1].value;
    const notes = inputs[2].value;
    
    if (date && value) {
      HealthStore.addWeight({
        value: parseFloat(value),
        date: new Date(date).toISOString(),
        notes: notes || ''
      });
      saved++;
      row.remove();
    }
  });
  
  showToast(`Saved ${saved} weight entries!`, 'success');
}

function initBulkSymptoms() {
  const tbody = document.getElementById('bulk-symptoms-tbody');
  
  document.getElementById('bulk-symptoms-add-row').addEventListener('click', () => {
    addBulkSymptomRow();
  });
  
  document.getElementById('bulk-symptoms-save').addEventListener('click', () => {
    saveBulkSymptoms();
  });
  
  document.getElementById('bulk-symptoms-clear').addEventListener('click', () => {
    if (confirm('Clear all rows?')) {
      tbody.innerHTML = '';
    }
  });
  
  for (let i = 0; i < 3; i++) {
    addBulkSymptomRow();
  }
}

function addBulkSymptomRow() {
  const tbody = document.getElementById('bulk-symptoms-tbody');
  const row = document.createElement('tr');
  const today = new Date().toISOString().split('T')[0];
  const meds = HealthStore.getMedications();
  const medOptions = meds.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  
  row.innerHTML = `
    <td><input type="date" class="form-control" value="${today}"></td>
    <td><input type="time" class="form-control" value="12:00"></td>
    <td><input type="text" class="form-control" placeholder="Symptom name"></td>
    <td><input type="number" class="form-control" placeholder="5" min="1" max="10"></td>
    <td>
      <select class="form-control">
        <option value="">None</option>
        ${medOptions}
      </select>
    </td>
    <td><input type="text" class="form-control" placeholder="Description"></td>
    <td><button class="btn btn-small btn-danger" onclick="this.closest('tr').remove()">×</button></td>
  `;
  
  tbody.appendChild(row);
}

function saveBulkSymptoms() {
  const tbody = document.getElementById('bulk-symptoms-tbody');
  const rows = tbody.querySelectorAll('tr');
  let saved = 0;
  
  rows.forEach(row => {
    const date = row.cells[0].querySelector('input').value;
    const time = row.cells[1].querySelector('input').value;
    const name = row.cells[2].querySelector('input').value;
    const severity = row.cells[3].querySelector('input').value;
    const relatedMed = row.cells[4].querySelector('select').value;
    const description = row.cells[5].querySelector('input').value;
    
    if (date && name && severity) {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      HealthStore.addSymptom({
        name,
        severity: parseInt(severity),
        relatedMed: relatedMed || null,
        date: dateTime,
        description
      });
      saved++;
      row.remove();
    }
  });
  
  showToast(`Saved ${saved} symptom entries!`, 'success');
}

// ======================
// Reports Page
// ======================

function loadReports() {
  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  document.getElementById('report-start-date').value = thirtyDaysAgo;
  document.getElementById('report-end-date').value = today;
}

document.getElementById('generate-report')?.addEventListener('click', generateReport);
document.getElementById('print-report')?.addEventListener('click', () => window.print());
document.getElementById('export-json')?.addEventListener('click', exportJSON);
document.getElementById('export-csv')?.addEventListener('click', exportCSV);
document.getElementById('import-data')?.addEventListener('click', importData);

function generateReport() {
  const startDate = document.getElementById('report-start-date').value;
  const endDate = document.getElementById('report-end-date').value;
  
  const includeMeds = document.getElementById('report-meds').checked;
  const includeVitals = document.getElementById('report-vitals').checked;
  const includeWeight = document.getElementById('report-weight').checked;
  const includeSymptoms = document.getElementById('report-symptoms').checked;
  const includeGoals = document.getElementById('report-goals').checked;
  
  let reportHtml = '';
  
  // Medications
  if (includeMeds) {
    const meds = HealthStore.getMedications();
    const logs = HealthStore.data.medicationLog.filter(log => 
      log.date >= startDate && log.date <= endDate
    );
    
    reportHtml += `
      <div class="report-section">
        <h3>💊 Medications</h3>
        <p><strong>Current Medications:</strong> ${meds.length}</p>
        <p><strong>Doses Taken:</strong> ${logs.length}</p>
        <table class="data-table">
          <thead>
            <tr><th>Medication</th><th>Dosage</th><th>Frequency</th></tr>
          </thead>
          <tbody>
            ${meds.map(m => `<tr><td>${m.name}</td><td>${m.dosage}</td><td>${m.frequency}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Vitals
  if (includeVitals) {
    const vitals = HealthStore.getVitals().filter(v => 
      v.date >= startDate && v.date <= endDate
    );
    
    reportHtml += `
      <div class="report-section">
        <h3>❤️ Vital Signs</h3>
        <p><strong>Total Readings:</strong> ${vitals.length}</p>
        <table class="data-table">
          <thead>
            <tr><th>Date</th><th>BP</th><th>HR</th><th>Temp</th><th>SpO2</th></tr>
          </thead>
          <tbody>
            ${vitals.slice(0, 20).map(v => `
              <tr>
                <td>${formatDate(v.date)}</td>
                <td>${v.systolic}/${v.diastolic}</td>
                <td>${v.heartRate || '-'}</td>
                <td>${v.temperature ? v.temperature + '°F' : '-'}</td>
                <td>${v.oxygen ? v.oxygen + '%' : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Weight
  if (includeWeight) {
    const weights = HealthStore.getWeights().filter(w => 
      w.date >= startDate && w.date <= endDate
    );
    
    reportHtml += `
      <div class="report-section">
        <h3>⚖️ Weight Tracking</h3>
        <p><strong>Total Entries:</strong> ${weights.length}</p>
        ${weights.length > 0 ? `
          <p><strong>Latest:</strong> ${weights[0].value} lbs</p>
          ${weights.length > 1 ? `<p><strong>Change:</strong> ${(weights[0].value - weights[weights.length - 1].value).toFixed(1)} lbs</p>` : ''}
        ` : ''}
      </div>
    `;
  }
  
  // Symptoms
  if (includeSymptoms) {
    const symptoms = HealthStore.getSymptoms().filter(s => 
      s.date >= startDate && s.date <= endDate
    );
    
    reportHtml += `
      <div class="report-section">
        <h3>📝 Symptoms</h3>
        <p><strong>Total Logged:</strong> ${symptoms.length}</p>
        <table class="data-table">
          <thead>
            <tr><th>Date</th><th>Symptom</th><th>Severity</th></tr>
          </thead>
          <tbody>
            ${symptoms.slice(0, 20).map(s => `
              <tr>
                <td>${formatDate(s.date)}</td>
                <td>${s.name}</td>
                <td>${s.severity}/10</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Goals
  if (includeGoals) {
    const goals = HealthStore.getGoals();
    
    reportHtml += `
      <div class="report-section">
        <h3>🎯 Goals</h3>
        <p><strong>Total Goals:</strong> ${goals.length}</p>
        <p><strong>Active:</strong> ${goals.filter(g => !g.completed).length}</p>
        <p><strong>Completed:</strong> ${goals.filter(g => g.completed).length}</p>
      </div>
    `;
  }
  
  // Show report
  document.getElementById('report-period').textContent = 
    `${formatDate(startDate)} - ${formatDate(endDate)}`;
  document.getElementById('report-content').innerHTML = reportHtml;
  document.getElementById('report-preview').style.display = 'block';
  
  showToast('Report generated!', 'success');
}

function exportJSON() {
  const data = HealthStore.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `healthtracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Data exported successfully!', 'success');
}

function exportCSV() {
  // Export vitals and weight as CSV
  const vitals = HealthStore.getVitals();
  const weights = HealthStore.getWeights();
  
  let csv = 'Type,Date,Value1,Value2,Value3,Value4,Notes\n';
  
  vitals.forEach(v => {
    csv += `Vital,${v.date},${v.systolic},${v.diastolic},${v.heartRate || ''},${v.temperature || ''},${v.notes || ''}\n`;
  });
  
  weights.forEach(w => {
    csv += `Weight,${w.date},${w.value},,,,${w.notes || ''}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `healthtracker-data-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('CSV exported successfully!', 'success');
}

function importData() {
  const fileInput = document.getElementById('import-file');
  const file = fileInput.files[0];
  
  if (!file) {
    showToast('Please select a file to import', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const success = HealthStore.importData(e.target.result);
    if (success) {
      showToast('Data imported successfully!', 'success');
      setTimeout(() => location.reload(), 1000);
    } else {
      showToast('Import failed. Please check the file format.', 'error');
    }
  };
  reader.readAsText(file);
}

// ======================
// Settings Page
// ======================

function loadSettings() {
  const settings = HealthStore.data.settings;
  
  document.getElementById('setting-age-range').value = settings.ageRange || '';
  document.getElementById('setting-height').value = settings.height || '';
  document.getElementById('setting-target-weight').value = settings.targetWeight || '';
  document.getElementById('setting-target-date').value = settings.targetDate || '';
  
  document.getElementById('notify-meds').checked = settings.notifications.meds;
  document.getElementById('notify-vitals').checked = settings.notifications.vitals;
  document.getElementById('notify-weight').checked = settings.notifications.weight;
  document.getElementById('notify-goals').checked = settings.notifications.goals;
}

function loadAlerts() {
  if (!alertSystem) return;
  
  // Load current alert settings into form
  const settings = alertSystem.settings;
  
  document.getElementById('bp-systolic-high').value = settings.bloodPressure.systolicHigh;
  document.getElementById('bp-diastolic-high').value = settings.bloodPressure.diastolicHigh;
  document.getElementById('bp-systolic-low').value = settings.bloodPressure.systolicLow;
  document.getElementById('bp-diastolic-low').value = settings.bloodPressure.diastolicLow;
  
  document.getElementById('weight-gain-threshold').value = settings.weight.gainThreshold;
  document.getElementById('weight-loss-threshold').value = settings.weight.lossThreshold;
  document.getElementById('weight-timeframe').value = settings.weight.timeframe;
  document.getElementById('weight-alert-frequency').value = settings.weight.frequency;
  
  document.getElementById('med-missed-alert').value = settings.medications.missedDoseAlert;
  document.getElementById('med-refill-reminder').value = settings.medications.refillReminder;
  
  document.getElementById('alert-sound').checked = settings.notifications.sound;
  document.getElementById('alert-visual').checked = settings.notifications.visual;
  document.getElementById('alert-dashboard').checked = settings.notifications.dashboard;
  document.getElementById('alert-email').checked = settings.notifications.email;
  
  // Display active alerts
  displayActiveAlerts();
}

function displayActiveAlerts() {
  const alertsList = document.getElementById('alerts-list');
  if (!alertsList || !alertSystem) return;
  
  if (alertSystem.alerts.length === 0) {
    alertsList.innerHTML = '<p style="color: #a8aab2; text-align: center; padding: 20px;">No active alerts</p>';
    return;
  }
  
  const alertsHtml = alertSystem.alerts.map(alert => {
    const severityColors = {
      'high': '#fda4af',
      'medium': '#fde68a',
      'low': '#7dd3fc'
    };
    
    return `
      <div style="background: ${severityColors[alert.severity]}20; border-left: 4px solid ${severityColors[alert.severity]}; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h4 style="color: ${severityColors[alert.severity]}; margin: 0 0 8px 0;">${alert.title}</h4>
            <p style="color: #e7e7ea; margin: 0 0 8px 0;">${alert.message}</p>
            <small style="color: #a8aab2;">${new Date(alert.timestamp).toLocaleString()}</small>
          </div>
          <button onclick="alertSystem.removeAlert('${alert.id}'); displayActiveAlerts();" 
                  style="background: none; border: none; color: #a8aab2; cursor: pointer; font-size: 1.2em; padding: 5px;">×</button>
        </div>
      </div>
    `;
  }).join('');
  
  alertsList.innerHTML = alertsHtml;
}

document.getElementById('save-personal-info')?.addEventListener('click', () => {
  HealthStore.updateSettings({
    ageRange: document.getElementById('setting-age-range').value,
    height: document.getElementById('setting-height').value
  });
  showToast('Health settings saved!', 'success');
});

document.getElementById('save-weight-goal')?.addEventListener('click', () => {
  HealthStore.updateSettings({
    targetWeight: document.getElementById('setting-target-weight').value,
    targetDate: document.getElementById('setting-target-date').value
  });
  showToast('Weight goal saved!', 'success');
});

document.getElementById('save-notifications')?.addEventListener('click', () => {
  HealthStore.updateSettings({
    notifications: {
      meds: document.getElementById('notify-meds').checked,
      vitals: document.getElementById('notify-vitals').checked,
      weight: document.getElementById('notify-weight').checked,
      goals: document.getElementById('notify-goals').checked
    }
  });
  showToast('Notification settings saved!', 'success');
});

document.getElementById('backup-data')?.addEventListener('click', exportJSON);
document.getElementById('clear-all-data')?.addEventListener('click', () => {
  HealthStore.clearAllData();
});

document.getElementById('privacy-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  showHIPAAModal();
});

// ======================
// Modal Helper
// ======================

function createModal(title, bodyHtml, actionText, actionCallback) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'grid';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${title}</h2>
      </div>
      <div class="modal-body">
        ${bodyHtml}
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="this.closest('.modal').remove()">Cancel</button>
        <button class="btn btn-primary" id="modal-action">${actionText}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('#modal-action').addEventListener('click', actionCallback);
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  return modal;
}

// ======================
// Sidebar Actions
// ======================

document.getElementById('quick-export')?.addEventListener('click', exportJSON);
document.getElementById('view-hipaa')?.addEventListener('click', showHIPAAModal);

// ======================
// Add button handlers
// ======================

document.getElementById('add-medication')?.addEventListener('click', addMedication);
document.getElementById('add-vital')?.addEventListener('click', addVital);
document.getElementById('add-symptom')?.addEventListener('click', addSymptom);
document.getElementById('add-weight')?.addEventListener('click', addWeight);
document.getElementById('add-goal')?.addEventListener('click', addGoal);

// Alert system event listeners
document.getElementById('save-alert-settings')?.addEventListener('click', () => {
  if (alertSystem) {
    alertSystem.settings.bloodPressure.systolicHigh = parseInt(document.getElementById('bp-systolic-high').value) || 140;
    alertSystem.settings.bloodPressure.diastolicHigh = parseInt(document.getElementById('bp-diastolic-high').value) || 90;
    alertSystem.settings.bloodPressure.systolicLow = parseInt(document.getElementById('bp-systolic-low').value) || 90;
    alertSystem.settings.bloodPressure.diastolicLow = parseInt(document.getElementById('bp-diastolic-low').value) || 60;
    
    alertSystem.settings.weight.gainThreshold = parseFloat(document.getElementById('weight-gain-threshold').value) || 5;
    alertSystem.settings.weight.lossThreshold = parseFloat(document.getElementById('weight-loss-threshold').value) || 5;
    alertSystem.settings.weight.timeframe = parseInt(document.getElementById('weight-timeframe').value) || 30;
    alertSystem.settings.weight.frequency = document.getElementById('weight-alert-frequency').value || 'daily';
    
    alertSystem.settings.medications.missedDoseAlert = document.getElementById('med-missed-alert').value || '2hours';
    alertSystem.settings.medications.refillReminder = parseInt(document.getElementById('med-refill-reminder').value) || 7;
    
    alertSystem.settings.notifications.sound = document.getElementById('alert-sound').checked;
    alertSystem.settings.notifications.visual = document.getElementById('alert-visual').checked;
    alertSystem.settings.notifications.dashboard = document.getElementById('alert-dashboard').checked;
    alertSystem.settings.notifications.email = document.getElementById('alert-email').checked;
    
    alertSystem.saveAlertSettings();
    showToast('Alert settings saved successfully!', 'success');
  }
});

document.getElementById('test-alerts')?.addEventListener('click', () => {
  if (alertSystem) {
    alertSystem.testAlerts();
  }
});

document.getElementById('clear-alerts')?.addEventListener('click', () => {
  if (alertSystem) {
    alertSystem.clearAllAlerts();
    showToast('All alerts cleared!', 'success');
  }
});

// Quick Add functionality
document.getElementById('quick-add-vitals')?.addEventListener('click', () => {
  showQuickVitalsModal();
});

document.getElementById('quick-add-weight')?.addEventListener('click', () => {
  showQuickWeightModal();
});

document.getElementById('quick-add-med')?.addEventListener('click', () => {
  showQuickMedModal();
});

document.getElementById('quick-add-symptom')?.addEventListener('click', () => {
  showQuickSymptomModal();
});

// Voice Recognition System
class VoiceRecognition {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.init();
  }

  init() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      
      // Check for Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isSafari) {
        // Safari-specific settings
        this.recognition.continuous = false;
        this.recognition.interimResults = false; // Safari works better without interim results
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1; // Safari doesn't support multiple alternatives well
        console.log('Using Safari-specific voice recognition settings');
      } else {
        // Chrome/Edge settings
        this.recognition.continuous = false;
        this.recognition.interimResults = true; // Show interim results
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3; // Get multiple alternatives
        console.log('Using Chrome/Edge voice recognition settings');
      }
      
      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceUI('🎤 Listening...', 'Speak clearly and slowly...');
        this.updateVoiceButton(true);
        this.hideConfirmation();
        console.log('Voice recognition started successfully');
      };
      
      this.recognition.onresult = (event) => {
        console.log('Voice recognition result:', event);
        
        // Check for Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        let bestResult = null;
        let bestConfidence = 0;
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          console.log(`Result ${i}:`, result);
          
          if (result.isFinal) {
            for (let j = 0; j < result.length; j++) {
              const alternative = result[j];
              console.log(`Alternative ${j}:`, alternative);
              
              if (isSafari) {
                // Safari - use first result
                if (!bestResult) {
                  bestResult = alternative.transcript.toLowerCase();
                  bestConfidence = alternative.confidence || 0.8; // Default confidence for Safari
                }
              } else {
                // Chrome/Edge - use best confidence
                if (alternative.confidence > bestConfidence) {
                  bestConfidence = alternative.confidence;
                  bestResult = alternative.transcript.toLowerCase();
                }
              }
            }
          }
        }
        
        if (bestResult) {
          console.log(`Best result: "${bestResult}" (confidence: ${bestConfidence.toFixed(2)})`);
          this.processVoiceCommand(bestResult);
        } else {
          console.log('No final results found');
          this.updateVoiceUI('❓ No Speech Detected', 'Please try speaking again');
        }
      };
      
      this.recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        this.updateVoiceUI('❌ Error', `Voice recognition failed: ${event.error}. Try again.`);
        this.updateVoiceButton(false);
        this.stopListening();
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButton(false);
        console.log('Voice recognition ended');
        // Don't auto-hide, let user confirm or cancel
      };
    } else {
      console.warn('Voice recognition not supported');
      this.isSupported = false;
    }
  }

  startListening() {
    if (!this.isSupported) {
      showToast('Voice recognition not supported in this browser', 'error');
      return;
    }
    
    try {
      this.showVoiceInterface();
      this.updateVoiceUI('🎤 Starting...', 'Initializing voice recognition...');
      this.updateVoiceButton(true);
      this.recognition.start();
      console.log('Voice recognition started');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      showToast('Failed to start voice recognition', 'error');
      this.hideVoiceInterface();
      this.updateVoiceButton(false);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.updateVoiceButton(false);
    this.hideVoiceInterface();
  }

  updateVoiceButton(isListening) {
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) {
      if (isListening) {
        voiceToggle.style.background = '#fda4af';
        voiceToggle.style.boxShadow = '0 2px 8px rgba(253, 164, 175, 0.5)';
        voiceToggle.title = 'Click to Stop Recording';
        voiceToggle.innerHTML = '⏹️ Stop';
      } else {
        voiceToggle.style.background = '#7dd3fc';
        voiceToggle.style.boxShadow = '0 2px 8px rgba(125, 211, 252, 0.3)';
        voiceToggle.title = 'Click to Start Voice Recording';
        voiceToggle.innerHTML = '🎤 Record';
      }
    }
  }

  showVoiceInterface() {
    const voiceInterface = document.getElementById('voice-interface');
    if (voiceInterface) {
      voiceInterface.style.display = 'block';
    }
  }

  hideVoiceInterface() {
    const voiceInterface = document.getElementById('voice-interface');
    if (voiceInterface) {
      voiceInterface.style.display = 'none';
    }
  }

  showConfirmation(command, details) {
    const confirmationEl = document.getElementById('voice-confirmation');
    const detailsEl = document.getElementById('confirmation-details');
    
    if (confirmationEl && detailsEl) {
      detailsEl.innerHTML = details;
      confirmationEl.style.display = 'block';
      this.pendingCommand = command;
      
      // Add a subtle pulse animation to draw attention
      confirmationEl.style.animation = 'pulse 2s infinite';
      
      // Add pulse animation CSS if not already present
      if (!document.getElementById('voice-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'voice-pulse-style';
        style.textContent = `
          @keyframes pulse {
            0% { border-color: #fde68a; }
            50% { border-color: #fbbf24; }
            100% { border-color: #fde68a; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

  hideConfirmation() {
    const confirmationEl = document.getElementById('voice-confirmation');
    if (confirmationEl) {
      confirmationEl.style.display = 'none';
      confirmationEl.style.animation = 'none';
    }
    this.pendingCommand = null;
  }

  updateVoiceUI(status, transcript) {
    const statusEl = document.getElementById('voice-status');
    const transcriptEl = document.getElementById('voice-transcript');
    
    if (statusEl) statusEl.textContent = status;
    if (transcriptEl) transcriptEl.textContent = transcript;
  }

  processVoiceCommand(transcript) {
    console.log('Voice command:', transcript);
    this.updateVoiceUI('🔍 Analyzing...', `"${transcript}"`);
    
    // Parse voice commands
    const commands = this.parseVoiceCommand(transcript);
    console.log(`Found ${commands.length} commands:`, commands);
    
    if (commands.length > 0) {
      const command = commands[0]; // Take the first (best) command
      const details = this.formatCommandDetails(command);
      
      this.updateVoiceUI('📝 Review & Confirm', `"${transcript}"`);
      this.showConfirmation(command, details);
      
      // No auto-timeout - let user decide
    } else {
      console.log('No commands recognized for:', transcript);
      this.updateVoiceUI('❓ Command Not Recognized', `"${transcript}"<br><br><strong>Try these commands:</strong><br>• "Log blood pressure 120 over 80"<br>• "Add weight 215"<br>• "Took Metformin"<br>• "Feeling headache"`);
      // Auto-hide after 8 seconds for unrecognized commands only
      setTimeout(() => {
        this.hideVoiceInterface();
      }, 8000);
    }
  }

  formatCommandDetails(command) {
    switch (command.type) {
      case 'vitals':
        return `📊 <strong>Log Blood Pressure</strong><br>
                Systolic: ${command.data.systolic} mmHg<br>
                Diastolic: ${command.data.diastolic} mmHg<br>
                Heart Rate: ${command.data.heartRate || 72} bpm`;
      
      case 'weight':
        return `⚖️ <strong>Log Weight</strong><br>
                Weight: ${command.data.value} lbs<br>
                Date: ${new Date().toLocaleDateString()}`;
      
      case 'medication':
        return `💊 <strong>Log Medication</strong><br>
                Medication: ${command.data.medicationName}<br>
                Status: Taken<br>
                Time: ${new Date().toLocaleTimeString()}`;
      
      case 'symptom':
        return `📝 <strong>Log Symptom</strong><br>
                Symptom: ${command.data.name}<br>
                Severity: ${command.data.severity}/10<br>
                Date: ${new Date().toLocaleDateString()}`;
      
      case 'query':
        return `🔍 <strong>Query Data</strong><br>
                Requesting: ${command.data.metric}<br>
                Will show latest information`;
      
      default:
        return 'Unknown command type';
    }
  }

  parseVoiceCommand(transcript) {
    const commands = [];
    
    // More flexible blood pressure patterns
    const bpPatterns = [
      /(?:log|add|record|enter)\s+(?:blood\s+pressure|bp|pressure)\s+(\d+)\s+(?:over|slash|and)\s+(\d+)/i,
      /(?:blood\s+pressure|bp|pressure)\s+(\d+)\s+(?:over|slash|and)\s+(\d+)/i,
      /(\d+)\s+(?:over|slash|and)\s+(\d+)\s*(?:blood\s+pressure|bp|pressure)?/i,
      /(?:pressure|bp)\s+(\d+)\s+(?:over|slash|and)\s+(\d+)/i
    ];
    
    for (const pattern of bpPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const systolic = parseInt(match[1]);
        const diastolic = parseInt(match[2]);
        
        // Validate reasonable blood pressure values
        if (systolic >= 70 && systolic <= 250 && diastolic >= 40 && diastolic <= 150) {
          commands.push({
            type: 'vitals',
            action: 'add',
            data: {
              systolic: systolic,
              diastolic: diastolic,
              heartRate: 72
            }
          });
          break;
        }
      }
    }
    
    // More flexible weight patterns
    const weightPatterns = [
      /(?:log|add|record|enter)\s+(?:weight|wt|weigh)\s+(\d+(?:\.\d+)?)/i,
      /(?:weight|wt|weigh)\s+(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s+(?:pounds|lbs|kg|kilograms)/i,
      /(?:weigh|weighing)\s+(\d+(?:\.\d+)?)/i,
      /(?:my\s+)?(?:weight|wt)\s+(?:is\s+)?(\d+(?:\.\d+)?)/i,
      /(?:i\s+)?(?:weigh|weighing)\s+(\d+(?:\.\d+)?)/i
    ];
    
    for (const pattern of weightPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const weight = parseFloat(match[1]);
        console.log(`Weight pattern matched: "${match[0]}" -> ${weight} lbs`);
        
        // Validate reasonable weight values (50-500 lbs)
        if (weight >= 50 && weight <= 500) {
          commands.push({
            type: 'weight',
            action: 'add',
            data: {
              value: weight
            }
          });
          console.log(`Weight command added: ${weight} lbs`);
          break;
        } else {
          console.log(`Weight ${weight} lbs is outside valid range (50-500)`);
        }
      }
    }
    
    // More flexible medication patterns
    const medPatterns = [
      /(?:log|took|taken|took|took)\s+(.+?)(?:\s+(?:medication|med|pill|medicine))?/i,
      /(?:took|taken|took)\s+(.+)/i,
      /(?:medication|med|pill|medicine)\s+(.+)/i
    ];
    
    for (const pattern of medPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const medName = match[1].trim();
        
        // Clean up common speech recognition errors
        const cleanedName = medName
          .replace(/\b(medication|med|pill|medicine)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (cleanedName.length > 1) {
          commands.push({
            type: 'medication',
            action: 'log',
            data: {
              medicationName: cleanedName
            }
          });
          break;
        }
      }
    }
    
    // More flexible symptom patterns
    const symptomPatterns = [
      /(?:have|feeling|symptom|symptoms)\s+(.+?)(?:\s+(?:severity|level)\s+(\d+))?/i,
      /(?:symptom|feeling)\s+(.+)/i,
      /(?:pain|ache|hurt)\s+(.+)/i
    ];
    
    for (const pattern of symptomPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const symptomName = match[1].trim();
        const severity = match[2] ? parseInt(match[2]) : 5;
        
        if (symptomName.length > 1) {
          commands.push({
            type: 'symptom',
            action: 'add',
            data: {
              name: symptomName,
              severity: Math.min(Math.max(severity, 1), 10) // Clamp between 1-10
            }
          });
          break;
        }
      }
    }
    
    // More flexible query patterns
    const queryPatterns = [
      /(?:what|show|tell)\s+(?:me\s+)?(?:my\s+)?(?:latest|last)\s+(?:blood\s+pressure|bp|weight|vitals)/i,
      /(?:how|what)\s+(?:is|are)\s+(?:my\s+)?(?:blood\s+pressure|bp|weight)/i,
      /(?:show|display)\s+(?:my\s+)?(?:blood\s+pressure|bp|weight|vitals)/i
    ];
    
    for (const pattern of queryPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const metric = match[0].toLowerCase().includes('weight') ? 'weight' : 'vitals';
        commands.push({
          type: 'query',
          action: 'latest',
          data: {
            metric: metric
          }
        });
        break;
      }
    }
    
    return commands;
  }

  executeVoiceCommands(commands) {
    let successCount = 0;
    let errorCount = 0;
    
    commands.forEach(command => {
      try {
        switch (command.type) {
          case 'vitals':
            this.addVitalsFromVoice(command.data);
            successCount++;
            break;
          case 'weight':
            this.addWeightFromVoice(command.data);
            successCount++;
            break;
          case 'medication':
            this.logMedicationFromVoice(command.data);
            successCount++;
            break;
          case 'symptom':
            this.addSymptomFromVoice(command.data);
            successCount++;
            break;
          case 'query':
            this.queryDataFromVoice(command.data);
            successCount++;
            break;
        }
      } catch (error) {
        console.error('Error executing voice command:', error);
        errorCount++;
      }
    });
    
    console.log(`Voice commands executed: ${successCount} success, ${errorCount} errors`);
  }

  addVitalsFromVoice(data) {
    const vital = {
      id: 'vital-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      systolic: data.systolic,
      diastolic: data.diastolic,
      heartRate: data.heartRate || 72,
      temperature: 98.6,
      notes: 'Voice command'
    };
    
    console.log('Adding vital from voice:', vital);
    HealthStore.addVital(vital);
    HealthStore.save();
    
    showToast(`Blood pressure ${vital.systolic}/${vital.diastolic} logged!`, 'success');
    console.log('Vital added successfully');
  }

  addWeightFromVoice(data) {
    const weightEntry = {
      id: 'weight-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      value: data.value,
      notes: 'Voice command'
    };
    
    console.log('Adding weight from voice:', weightEntry);
    HealthStore.addWeight(weightEntry);
    HealthStore.save();
    
    showToast(`Weight ${weightEntry.value} lbs logged!`, 'success');
    console.log('Weight added successfully');
  }

  logMedicationFromVoice(data) {
    const medications = HealthStore.getMedications();
    const med = medications.find(m => 
      m.name.toLowerCase().includes(data.medicationName.toLowerCase()) ||
      data.medicationName.toLowerCase().includes(m.name.toLowerCase())
    );
    
    if (med) {
      const logEntry = {
        id: 'log-' + Date.now(),
        medicationId: med.id,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        taken: true,
        notes: 'Voice command'
      };
      
      console.log('Logging medication from voice:', logEntry);
      HealthStore.addMedicationLog(logEntry);
      HealthStore.save();
      
      showToast(`${med.name} logged as taken!`, 'success');
      console.log('Medication logged successfully');
    } else {
      console.log(`Medication "${data.medicationName}" not found in:`, medications.map(m => m.name));
      showToast(`Medication "${data.medicationName}" not found. Available: ${medications.map(m => m.name).join(', ')}`, 'error');
    }
  }

  addSymptomFromVoice(data) {
    const symptom = {
      id: 'symptom-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      name: data.name,
      severity: data.severity,
      note: 'Voice command'
    };
    
    console.log('Adding symptom from voice:', symptom);
    HealthStore.addSymptom(symptom);
    HealthStore.save();
    
    showToast(`Symptom "${symptom.name}" logged with severity ${symptom.severity}!`, 'success');
    console.log('Symptom added successfully');
  }

  queryDataFromVoice(data) {
    if (data.metric === 'vitals') {
      const vitals = HealthStore.getVitals();
      if (vitals.length > 0) {
        const latest = vitals[0];
        showToast(`Latest BP: ${latest.systolic}/${latest.diastolic} mmHg`, 'info');
      } else {
        showToast('No blood pressure data found', 'info');
      }
    } else if (data.metric === 'weight') {
      const weights = HealthStore.getWeights();
      if (weights.length > 0) {
        const latest = weights[0];
        showToast(`Latest weight: ${latest.value} lbs`, 'info');
      } else {
        showToast('No weight data found', 'info');
      }
    }
  }

  showHelp() {
    const helpText = `
Voice Commands (speak clearly):
• "Log blood pressure 120 over 80"
• "Add weight 175.2"
• "Took Metformin"
• "Feeling headache severity 6"
• "What's my latest blood pressure?"

After speaking, confirm the action before it's applied.
    `;
    
    this.updateVoiceUI('📋 Voice Commands', helpText);
    setTimeout(() => this.hideVoiceInterface(), 6000);
  }

  // Test function for debugging
  testVoiceCommand(command) {
    console.log('Testing voice command:', command);
    this.processVoiceCommand(command);
  }

  // Debug function to test weight parsing
  debugWeightCommand(text) {
    console.log('=== DEBUGGING WEIGHT COMMAND ===');
    console.log('Input text:', text);
    
    const weightPatterns = [
      /(?:log|add|record|enter)\s+(?:weight|wt|weigh)\s+(\d+(?:\.\d+)?)/i,
      /(?:weight|wt|weigh)\s+(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s+(?:pounds|lbs|kg|kilograms)/i,
      /(?:weigh|weighing)\s+(\d+(?:\.\d+)?)/i,
      /(?:my\s+)?(?:weight|wt)\s+(?:is\s+)?(\d+(?:\.\d+)?)/i,
      /(?:i\s+)?(?:weigh|weighing)\s+(\d+(?:\.\d+)?)/i
    ];
    
    for (let i = 0; i < weightPatterns.length; i++) {
      const pattern = weightPatterns[i];
      const match = text.match(pattern);
      console.log(`Pattern ${i + 1}:`, pattern);
      console.log(`Match:`, match);
      if (match) {
        const weight = parseFloat(match[1]);
        console.log(`Extracted weight: ${weight} lbs`);
        console.log(`Valid range (50-500): ${weight >= 50 && weight <= 500}`);
      }
    }
    console.log('=== END DEBUG ===');
  }

  // Execute confirmed command
  executeConfirmedCommand(command) {
    this.updateVoiceUI('✅ Executing...', 'Processing your request...');
    this.hideConfirmation();
    
    try {
      switch (command.type) {
        case 'vitals':
          this.addVitalsFromVoice(command.data);
          break;
        case 'weight':
          this.addWeightFromVoice(command.data);
          break;
        case 'medication':
          this.logMedicationFromVoice(command.data);
          break;
        case 'symptom':
          this.addSymptomFromVoice(command.data);
          break;
        case 'query':
          this.queryDataFromVoice(command.data);
          break;
      }
      
      this.updateVoiceUI('✅ Success!', 'Data logged successfully');
      
      // Refresh dashboard to show updates
      setTimeout(() => {
        if (typeof loadDashboard === 'function') {
          loadDashboard();
        }
      }, 500);
      
      // Keep success message visible for 3 seconds, then hide
      setTimeout(() => {
        this.hideVoiceInterface();
      }, 3000);
      
    } catch (error) {
      console.error('Error executing confirmed command:', error);
      this.updateVoiceUI('❌ Error', 'Failed to execute command. Please try again.');
      setTimeout(() => {
        this.hideVoiceInterface();
      }, 3000);
    }
  }
}

// Initialize voice recognition
let voiceRecognition;

function initVoiceRecognition() {
  console.log('Initializing voice recognition...');
  console.log('User agent:', navigator.userAgent);
  
  // Check for Safari specifically
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  console.log('Is Safari:', isSafari);
  
  voiceRecognition = new VoiceRecognition();
  
  if (voiceRecognition.isSupported) {
    console.log('Voice recognition is supported and initialized');
    
    if (isSafari) {
      showToast('🎤 Voice recognition ready! (Safari mode - speak clearly)', 'success');
      console.log('Safari detected - using Safari-specific voice recognition settings');
    } else {
      showToast('🎤 Voice recognition ready! Click the microphone to start recording.', 'success');
    }
    
    // Make debug function available globally
    window.debugWeight = (text) => voiceRecognition.debugWeightCommand(text);
    console.log('Debug function available: debugWeight("add weight 215")');
  } else {
    console.log('Voice recognition not supported in this browser');
    showToast('Voice recognition not supported in this browser. Try Chrome or Edge.', 'warning');
    
    // Disable the voice button if not supported
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) {
      voiceToggle.style.opacity = '0.5';
      voiceToggle.style.cursor = 'not-allowed';
      voiceToggle.title = 'Voice recognition not supported';
    }
  }
}

// Voice Recognition Event Listeners
document.getElementById('voice-toggle')?.addEventListener('click', () => {
  if (voiceRecognition) {
    if (voiceRecognition.isListening) {
      voiceRecognition.stopListening();
    } else {
      voiceRecognition.startListening();
    }
  }
});

document.getElementById('voice-stop')?.addEventListener('click', () => {
  if (voiceRecognition) {
    voiceRecognition.stopListening();
  }
});

document.getElementById('voice-help')?.addEventListener('click', () => {
  if (voiceRecognition) {
    voiceRecognition.showHelp();
  }
});

document.getElementById('voice-test')?.addEventListener('click', () => {
  if (voiceRecognition) {
    // Test with the weight command that failed
    console.log('=== TESTING WEIGHT COMMAND ===');
    voiceRecognition.debugWeightCommand('add weight 215');
    voiceRecognition.testVoiceCommand('add weight 215');
  }
});

// Voice Confirmation Event Listeners
document.getElementById('voice-confirm')?.addEventListener('click', () => {
  if (voiceRecognition && voiceRecognition.pendingCommand) {
    const command = voiceRecognition.pendingCommand;
    voiceRecognition.executeConfirmedCommand(command);
  }
});

document.getElementById('voice-cancel')?.addEventListener('click', () => {
  if (voiceRecognition) {
    voiceRecognition.hideConfirmation();
    voiceRecognition.updateVoiceUI('❌ Cancelled', 'Command cancelled. You can try again or click Stop to close.');
    // Don't auto-hide - let user decide what to do next
  }
});

// Theme Toggle Event Listener
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  toggleTheme();
});

function toggleTheme() {
  console.log('Theme toggle clicked!');
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  
  if (!themeToggle) {
    console.error('Theme toggle button not found!');
    return;
  }
  
  if (body.classList.contains('light-theme')) {
    // Switch to dark theme
    body.classList.remove('light-theme');
    themeToggle.textContent = '🌙';
    themeToggle.title = 'Switch to Light Theme';
    localStorage.setItem('embermate-theme', 'dark');
    console.log('Switched to dark theme');
  } else {
    // Switch to light theme
    body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
    themeToggle.title = 'Switch to Dark Theme';
    localStorage.setItem('embermate-theme', 'light');
    console.log('Switched to light theme');
  }
}

// Initialize theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem('embermate-theme');
  const themeToggle = document.getElementById('theme-toggle');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
    themeToggle.title = 'Switch to Dark Theme';
  } else {
    themeToggle.textContent = '🌙';
    themeToggle.title = 'Switch to Light Theme';
  }
}

// Quick Add Modal Functions
function showQuickVitalsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; align-items: center;
    justify-content: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px; color: #e7e7ea;">
      <h3 style="margin: 0 0 20px 0; color: #e7e7ea;">❤️ Quick Add Vitals</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div>
          <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Systolic</label>
          <input type="number" id="quick-systolic" placeholder="120" style="width: 100%; background: #191a1d; color: #e7e7ea; border: 1px solid #333; padding: 12px; border-radius: 8px;">
        </div>
        <div>
          <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Diastolic</label>
          <input type="number" id="quick-diastolic" placeholder="80" style="width: 100%; background: #191a1d; color: #e7e7ea; border: 1px solid #333; padding: 12px; border-radius: 8px;">
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Heart Rate (optional)</label>
        <input type="number" id="quick-heartrate" placeholder="72" style="width: 100%; background: #191a1d; color: #e7e7ea; border: 1px solid #333; padding: 12px; border-radius: 8px;">
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="this.closest('.modal').remove()" style="flex: 1; background: #fda4af; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
        <button onclick="saveQuickVitals(this)" style="flex: 1; background: #86efac; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Save</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('quick-systolic').focus();
}

function showQuickWeightModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; align-items: center;
    justify-content: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 300px; color: #e7e7ea;">
      <h3 style="margin: 0 0 20px 0; color: #e7e7ea;">⚖️ Quick Add Weight</h3>
      <div style="margin-bottom: 20px;">
        <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Weight (lbs)</label>
        <input type="number" id="quick-weight" placeholder="175.0" step="0.1" style="width: 100%; background: #191a1d; color: #e7e7ea; border: 1px solid #333; padding: 12px; border-radius: 8px;">
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="this.closest('.modal').remove()" style="flex: 1; background: #fda4af; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
        <button onclick="saveQuickWeight(this)" style="flex: 1; background: #fde68a; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Save</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('quick-weight').focus();
}

function showQuickMedModal() {
  const medications = HealthStore.getMedications();
  const medOptions = medications.map(m => `<option value="${m.id}">${m.name} (${m.dosage})</option>`).join('');
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; align-items: center;
    justify-content: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px; color: #e7e7ea;">
      <h3 style="margin: 0 0 20px 0; color: #e7e7ea;">💊 Log Medication</h3>
      <div style="margin-bottom: 20px;">
        <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Medication</label>
        <select id="quick-med-select" style="width: 100%; background: #191a1d; color: #e7e7ea; border: 1px solid #333; padding: 12px; border-radius: 8px;">
          <option value="">Select medication...</option>
          ${medOptions}
        </select>
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="this.closest('.modal').remove()" style="flex: 1; background: #fda4af; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
        <button onclick="saveQuickMed(this)" style="flex: 1; background: #7dd3fc; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Log Taken</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function showQuickSymptomModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; align-items: center;
    justify-content: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: #121315; padding: 30px; border-radius: 16px; width: 90%; max-width: 400px; color: #e7e7ea;">
      <h3 style="margin: 0 0 20px 0; color: #e7e7ea;">📝 Quick Add Symptom</h3>
      <div style="margin-bottom: 20px;">
        <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Symptom</label>
        <input type="text" id="quick-symptom-name" placeholder="e.g., Headache, Fatigue" style="width: 100%; background: #191a1d; color: #e7e7ea; border: 1px solid #333; padding: 12px; border-radius: 8px;">
      </div>
      <div style="margin-bottom: 20px;">
        <label style="color: #a8aab2; display: block; margin-bottom: 5px;">Severity (1-10)</label>
        <input type="range" id="quick-symptom-severity" min="1" max="10" value="5" style="width: 100%;">
        <div style="text-align: center; margin-top: 5px; color: #a8aab2;" id="severity-value">5</div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="this.closest('.modal').remove()" style="flex: 1; background: #fda4af; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
        <button onclick="saveQuickSymptom(this)" style="flex: 1; background: #c4b5fd; color: #0b0b0c; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Save</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('quick-symptom-name').focus();
  
  // Update severity display
  document.getElementById('quick-symptom-severity').addEventListener('input', function() {
    document.getElementById('severity-value').textContent = this.value;
  });
}

// Save functions for Quick Add
function saveQuickVitals(button) {
  const systolic = parseInt(document.getElementById('quick-systolic').value);
  const diastolic = parseInt(document.getElementById('quick-diastolic').value);
  const heartRate = parseInt(document.getElementById('quick-heartrate').value) || null;
  
  if (!systolic || !diastolic) {
    showToast('Please enter both systolic and diastolic values', 'error');
    return;
  }
  
  const vital = {
    id: 'vital-' + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    systolic: systolic,
    diastolic: diastolic,
    heartRate: heartRate,
    temperature: 98.6,
    notes: 'Quick add'
  };
  
  HealthStore.addVital(vital);
  button.closest('.modal').remove();
  showToast('Vitals added successfully!', 'success');
  
  // Refresh dashboard
  if (typeof loadDashboard === 'function') {
    loadDashboard();
  }
}

function saveQuickWeight(button) {
  const weight = parseFloat(document.getElementById('quick-weight').value);
  
  if (!weight) {
    showToast('Please enter a weight value', 'error');
    return;
  }
  
  const weightEntry = {
    id: 'weight-' + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    value: weight,
    notes: 'Quick add'
  };
  
  HealthStore.addWeight(weightEntry);
  button.closest('.modal').remove();
  showToast('Weight logged successfully!', 'success');
  
  // Refresh dashboard
  if (typeof loadDashboard === 'function') {
    loadDashboard();
  }
}

function saveQuickMed(button) {
  const medId = document.getElementById('quick-med-select').value;
  
  if (!medId) {
    showToast('Please select a medication', 'error');
    return;
  }
  
  const logEntry = {
    id: 'log-' + Date.now(),
    medicationId: medId,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    taken: true,
    notes: 'Quick log'
  };
  
  HealthStore.addMedicationLog(logEntry);
  button.closest('.modal').remove();
  showToast('Medication logged successfully!', 'success');
  
  // Refresh dashboard
  if (typeof loadDashboard === 'function') {
    loadDashboard();
  }
}

function saveQuickSymptom(button) {
  const name = document.getElementById('quick-symptom-name').value.trim();
  const severity = parseInt(document.getElementById('quick-symptom-severity').value);
  
  if (!name) {
    showToast('Please enter a symptom name', 'error');
    return;
  }
  
  const symptom = {
    id: 'symptom-' + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    name: name,
    severity: severity,
    note: 'Quick add'
  };
  
  HealthStore.addSymptom(symptom);
  button.closest('.modal').remove();
  showToast('Symptom added successfully!', 'success');
  
  // Refresh dashboard
  if (typeof loadDashboard === 'function') {
    loadDashboard();
  }
}

// ======================
// ALERT SYSTEM FUNCTIONS
// ======================

class AlertSystem {
  constructor() {
    this.alerts = [];
    this.settings = this.getDefaultAlertSettings();
    this.loadAlertSettings();
  }

  getDefaultAlertSettings() {
    return {
      bloodPressure: {
        systolicHigh: 140,
        diastolicHigh: 90,
        systolicLow: 90,
        diastolicLow: 60,
        enabled: true
      },
      weight: {
        gainThreshold: 5,
        lossThreshold: 5,
        timeframe: 30,
        frequency: 'daily',
        enabled: true
      },
      medications: {
        missedDoseAlert: '2hours',
        refillReminder: 7,
        enabled: true
      },
      notifications: {
        sound: true,
        visual: true,
        dashboard: true,
        email: false
      }
    };
  }

  loadAlertSettings() {
    const saved = localStorage.getItem('alertSettings');
    if (saved) {
      this.settings = { ...this.getDefaultAlertSettings(), ...JSON.parse(saved) };
    }
  }

  saveAlertSettings() {
    localStorage.setItem('alertSettings', JSON.stringify(this.settings));
  }

  checkBloodPressureAlerts(vitals) {
    if (!this.settings.bloodPressure.enabled || vitals.length === 0) return;

    const latest = vitals[0];
    const alerts = [];

    if (latest.systolic >= this.settings.bloodPressure.systolicHigh) {
      alerts.push({
        id: 'bp-high-systolic',
        type: 'blood_pressure',
        severity: 'high',
        title: 'High Blood Pressure Alert',
        message: `Systolic pressure is ${latest.systolic} mmHg (threshold: ${this.settings.bloodPressure.systolicHigh})`,
        timestamp: new Date().toISOString(),
        data: latest
      });
    }

    if (latest.diastolic >= this.settings.bloodPressure.diastolicHigh) {
      alerts.push({
        id: 'bp-high-diastolic',
        type: 'blood_pressure',
        severity: 'high',
        title: 'High Blood Pressure Alert',
        message: `Diastolic pressure is ${latest.diastolic} mmHg (threshold: ${this.settings.bloodPressure.diastolicHigh})`,
        timestamp: new Date().toISOString(),
        data: latest
      });
    }

    if (latest.systolic <= this.settings.bloodPressure.systolicLow) {
      alerts.push({
        id: 'bp-low-systolic',
        type: 'blood_pressure',
        severity: 'medium',
        title: 'Low Blood Pressure Alert',
        message: `Systolic pressure is ${latest.systolic} mmHg (threshold: ${this.settings.bloodPressure.systolicLow})`,
        timestamp: new Date().toISOString(),
        data: latest
      });
    }

    if (latest.diastolic <= this.settings.bloodPressure.diastolicLow) {
      alerts.push({
        id: 'bp-low-diastolic',
        type: 'blood_pressure',
        severity: 'medium',
        title: 'Low Blood Pressure Alert',
        message: `Diastolic pressure is ${latest.diastolic} mmHg (threshold: ${this.settings.bloodPressure.diastolicLow})`,
        timestamp: new Date().toISOString(),
        data: latest
      });
    }

    this.addAlerts(alerts);
  }

  checkWeightAlerts(weights) {
    if (!this.settings.weight.enabled || weights.length < 2) return;

    const latest = weights[0];
    const timeframe = this.settings.weight.timeframe;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframe);

    const recentWeights = weights.filter(w => new Date(w.date) >= cutoffDate);
    if (recentWeights.length < 2) return;

    const oldest = recentWeights[recentWeights.length - 1];
    const change = latest.value - oldest.value;
    const alerts = [];

    if (change >= this.settings.weight.gainThreshold) {
      alerts.push({
        id: 'weight-gain',
        type: 'weight',
        severity: 'medium',
        title: 'Weight Gain Alert',
        message: `Weight increased by ${change.toFixed(1)} lbs over ${timeframe} days (threshold: ${this.settings.weight.gainThreshold} lbs)`,
        timestamp: new Date().toISOString(),
        data: { change, timeframe, latest, oldest }
      });
    }

    if (change <= -this.settings.weight.lossThreshold) {
      alerts.push({
        id: 'weight-loss',
        type: 'weight',
        severity: 'medium',
        title: 'Weight Loss Alert',
        message: `Weight decreased by ${Math.abs(change).toFixed(1)} lbs over ${timeframe} days (threshold: ${this.settings.weight.lossThreshold} lbs)`,
        timestamp: new Date().toISOString(),
        data: { change, timeframe, latest, oldest }
      });
    }

    this.addAlerts(alerts);
  }

  checkMedicationAlerts(medications, medicationLog) {
    if (!this.settings.medications.enabled) return;

    const alerts = [];
    const today = new Date().toDateString();

    medications.forEach(med => {
      // Check for missed doses
      const todayLogs = medicationLog.filter(log => 
        log.date === today && log.medicationId === med.id
      );

      if (todayLogs.length === 0 && med.active) {
        const missedHours = this.getMissedHours(med);
        if (missedHours >= this.getMissedThreshold()) {
          alerts.push({
            id: `med-missed-${med.id}`,
            type: 'medication',
            severity: 'high',
            title: 'Missed Medication Alert',
            message: `Missed dose of ${med.name} (${med.dosage}) - ${missedHours} hours overdue`,
            timestamp: new Date().toISOString(),
            data: { medication: med, missedHours }
          });
        }
      }

      // Check for refill reminders
      if (med.refillDate) {
        const refillDate = new Date(med.refillDate);
        const daysUntilRefill = Math.ceil((refillDate - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilRefill <= this.settings.medications.refillReminder && daysUntilRefill >= 0) {
          alerts.push({
            id: `med-refill-${med.id}`,
            type: 'medication',
            severity: 'low',
            title: 'Medication Refill Reminder',
            message: `${med.name} needs refill in ${daysUntilRefill} days`,
            timestamp: new Date().toISOString(),
            data: { medication: med, daysUntilRefill }
          });
        }
      }
    });

    this.addAlerts(alerts);
  }

  getMissedHours(medication) {
    const now = new Date();
    const times = medication.times.split(',').map(t => t.trim());
    
    for (let time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const medTime = new Date();
      medTime.setHours(hours, minutes, 0, 0);
      
      if (now > medTime) {
        return Math.floor((now - medTime) / (1000 * 60 * 60));
      }
    }
    return 0;
  }

  getMissedThreshold() {
    const thresholds = {
      '1hour': 1,
      '2hours': 2,
      '4hours': 4
    };
    return thresholds[this.settings.medications.missedDoseAlert] || 2;
  }

  addAlerts(newAlerts) {
    newAlerts.forEach(alert => {
      // Check if alert already exists
      const exists = this.alerts.some(a => a.id === alert.id);
      if (!exists) {
        this.alerts.push(alert);
        this.showAlert(alert);
      }
    });
    this.saveAlerts();
  }

  showAlert(alert) {
    if (this.settings.notifications.visual) {
      this.showVisualAlert(alert);
    }
    
    if (this.settings.notifications.sound) {
      this.playAlertSound();
    }

    if (this.settings.notifications.dashboard) {
      this.updateDashboardAlerts();
    }
  }

  showVisualAlert(alert) {
    const severityColors = {
      'high': '#fda4af',
      'medium': '#fde68a',
      'low': '#7dd3fc'
    };

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-notification';
    alertDiv.style.cssText = `
      background: ${severityColors[alert.severity]}20;
      border-left: 4px solid ${severityColors[alert.severity]};
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
      color: #e7e7ea;
    `;
    
    alertDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <strong style="color: ${severityColors[alert.severity]};">${alert.title}</strong>
          <p style="margin: 4px 0 0 0; font-size: 0.9em;">${alert.message}</p>
          <small style="color: #a8aab2;">${new Date(alert.timestamp).toLocaleString()}</small>
        </div>
        <button onclick="this.parentElement.parentElement.remove(); alertSystem.removeAlert('${alert.id}')" 
                style="background: none; border: none; color: #a8aab2; cursor: pointer; font-size: 1.2em;">×</button>
      </div>
    `;

    // Add to dashboard alerts
    const dashboardAlerts = document.getElementById('dashboard-alerts');
    const alertNotifications = document.getElementById('alert-notifications');
    
    if (dashboardAlerts && alertNotifications) {
      alertNotifications.appendChild(alertDiv);
      dashboardAlerts.style.display = 'block';
    }
  }

  playAlertSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  updateDashboardAlerts() {
    const dashboardAlerts = document.getElementById('dashboard-alerts');
    const alertNotifications = document.getElementById('alert-notifications');
    
    if (!dashboardAlerts || !alertNotifications) return;

    if (this.alerts.length > 0) {
      dashboardAlerts.style.display = 'block';
    } else {
      dashboardAlerts.style.display = 'none';
    }
  }

  removeAlert(alertId) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.saveAlerts();
    this.updateDashboardAlerts();
  }

  clearAllAlerts() {
    this.alerts = [];
    this.saveAlerts();
    this.updateDashboardAlerts();
    
    const alertNotifications = document.getElementById('alert-notifications');
    if (alertNotifications) {
      alertNotifications.innerHTML = '';
    }
  }

  saveAlerts() {
    localStorage.setItem('healthAlerts', JSON.stringify(this.alerts));
  }

  loadAlerts() {
    const saved = localStorage.getItem('healthAlerts');
    if (saved) {
      this.alerts = JSON.parse(saved);
    }
  }

  runAllChecks() {
    const vitals = HealthStore.getVitals();
    const weights = HealthStore.getWeights();
    const medications = HealthStore.getMedications();
    const medicationLog = HealthStore.getMedicationLog();

    this.checkBloodPressureAlerts(vitals);
    this.checkWeightAlerts(weights);
    this.checkMedicationAlerts(medications, medicationLog);
  }

  testAlerts() {
    const testAlerts = [
      {
        id: 'test-bp-high',
        type: 'blood_pressure',
        severity: 'high',
        title: 'Test: High Blood Pressure Alert',
        message: 'This is a test alert for high blood pressure (150/95 mmHg)',
        timestamp: new Date().toISOString(),
        data: { systolic: 150, diastolic: 95 }
      },
      {
        id: 'test-weight-gain',
        type: 'weight',
        severity: 'medium',
        title: 'Test: Weight Gain Alert',
        message: 'This is a test alert for weight gain (+6 lbs over 30 days)',
        timestamp: new Date().toISOString(),
        data: { change: 6, timeframe: 30 }
      },
      {
        id: 'test-med-missed',
        type: 'medication',
        severity: 'high',
        title: 'Test: Missed Medication Alert',
        message: 'This is a test alert for missed medication (Metformin - 3 hours overdue)',
        timestamp: new Date().toISOString(),
        data: { medication: { name: 'Metformin', dosage: '500mg' }, missedHours: 3 }
      }
    ];

    this.addAlerts(testAlerts);
    showToast('Test alerts generated! Check the dashboard and alerts page.', 'success');
  }
}

// Initialize alert system
let alertSystem;

function initAlertSystem() {
  alertSystem = new AlertSystem();
  alertSystem.loadAlerts();
  
  // Run checks when data is updated
  setTimeout(() => {
    alertSystem.runAllChecks();
  }, 2000);
}

// ======================
// Initialize App
// ======================

console.log('[EmberMate] Initializing store...');
HealthStore.init();

console.log('[EmberMate] Initializing navigation...');
initNavigation();

console.log('[EmberMate] Initializing alert system...');
initAlertSystem();

console.log('[EmberMate] Initializing theme...');
initTheme();

console.log('[EmberMate] Initializing voice recognition...');
initVoiceRecognition();

// Safari compatibility fixes
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) {
  console.log('[EmberMate] Safari detected - applying compatibility fixes');
  
  // Fix Safari localStorage issues
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (e) {
    console.warn('[EmberMate] localStorage not available in Safari private mode');
  }
  
  // Fix Safari CSS issues
  document.body.style.webkitFontSmoothing = 'antialiased';
  
  // Fix Safari button tap issues
  document.querySelectorAll('button').forEach(button => {
    button.style.webkitTapHighlightColor = 'transparent';
  });
}

console.log('[EmberMate] Ready!');
// Hide loading overlay and show app
setTimeout(() => {
  const loadingOverlay = document.querySelector('.loading-overlay') || 
                         document.getElementById('loading-overlay') ||
                         document.querySelector('[class*="loading"]');
  
  if (loadingOverlay) {
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 300);
  }
  
  // Ensure main app content is visible
  const appContent = document.getElementById('app') || 
                     document.querySelector('.app') || 
                     document.querySelector('main') ||
                     document.body;
  
  if (appContent) {
    appContent.style.display = 'block';
    appContent.style.visibility = 'visible';
    appContent.style.opacity = '1';
  }
  
  console.log('[EmberMate] UI initialized successfully');
}, 100);

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('[EmberMate] DOM loaded, initializing app...');
  
  try {
    // Initialize HealthStore
    if (typeof HealthStore === 'undefined') {
      console.error('[EmberMate] HealthStore not found!');
      return;
    }
    console.log('[EmberMate] HealthStore found, initializing...');
    
    // Initialize HealthStore
    HealthStore.init();
    console.log('[EmberMate] HealthStore initialized');
    
    // Initialize navigation
    if (typeof initNavigation === 'function') {
      console.log('[EmberMate] Initializing navigation...');
      initNavigation();
      console.log('[EmberMate] Navigation initialized');
    } else {
      console.warn('[EmberMate] initNavigation function not found');
    }
    
    // Initialize voice recognition
    if (typeof initVoiceRecognition === 'function') {
      console.log('[EmberMate] Initializing voice recognition...');
      initVoiceRecognition();
      console.log('[EmberMate] Voice recognition initialized');
    } else {
      console.warn('[EmberMate] initVoiceRecognition function not found');
    }
    
    // Initialize theme
    if (typeof initTheme === 'function') {
      console.log('[EmberMate] Initializing theme...');
      initTheme();
      console.log('[EmberMate] Theme initialized');
    } else {
      console.warn('[EmberMate] initTheme function not found');
    }
    
    // Load dashboard by default
    if (typeof loadDashboard === 'function') {
      console.log('[EmberMate] Loading dashboard...');
      loadDashboard();
      console.log('[EmberMate] Dashboard loaded');
    } else {
      console.warn('[EmberMate] loadDashboard function not found');
    }
    
    console.log('[EmberMate] App initialization complete!');
  } catch (error) {
    console.error('[EmberMate] Error during initialization:', error);
  }
});

// Fallback initialization for when DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, the event listener above will handle it
  console.log('[EmberMate] DOM still loading, waiting for DOMContentLoaded...');
} else {
  // DOM is already loaded, initialize immediately
  console.log('[EmberMate] DOM already loaded, initializing immediately...');
  
  try {
    if (typeof HealthStore !== 'undefined') {
      console.log('[EmberMate] HealthStore found in fallback, initializing...');
      HealthStore.init();
      console.log('[EmberMate] HealthStore initialized in fallback');
      
      if (typeof initNavigation === 'function') {
        console.log('[EmberMate] Initializing navigation in fallback...');
        initNavigation();
        console.log('[EmberMate] Navigation initialized in fallback');
      }
      if (typeof initVoiceRecognition === 'function') {
        console.log('[EmberMate] Initializing voice recognition in fallback...');
        initVoiceRecognition();
        console.log('[EmberMate] Voice recognition initialized in fallback');
      }
      if (typeof initTheme === 'function') {
        console.log('[EmberMate] Initializing theme in fallback...');
        initTheme();
        console.log('[EmberMate] Theme initialized in fallback');
      }
      if (typeof loadDashboard === 'function') {
        console.log('[EmberMate] Loading dashboard in fallback...');
        loadDashboard();
        console.log('[EmberMate] Dashboard loaded in fallback');
      }
      console.log('[EmberMate] Immediate initialization complete!');
    } else {
      console.error('[EmberMate] HealthStore not found in fallback initialization!');
    }
  } catch (error) {
    console.error('[EmberMate] Error during fallback initialization:', error);
  }
}
