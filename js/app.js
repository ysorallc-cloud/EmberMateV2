// HealthTracker Pro - Main Application
console.log('[HealthTracker] Initializing...');

// ======================
// Data Store
// ======================
const HealthStore = {
  init() {
    this.data = this.load();
    this.checkFirstRun();
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
        name: '',
        dob: '',
        height: '',
        bloodType: '',
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
    if (!this.data.hipaaAccepted) {
      showHIPAAModal();
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
  
  checkbox.addEventListener('change', () => {
    acceptBtn.disabled = !checkbox.checked;
  });
  
  acceptBtn.addEventListener('click', () => {
    HealthStore.data.hipaaAccepted = true;
    HealthStore.save();
    modal.style.display = 'none';
  });
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
  }
}

// ======================
// Dashboard
// ======================

function loadDashboard() {
  // Update date
  document.getElementById('current-date').textContent = 
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Quick Stats
  updateDashboardStats();
  
  // Upcoming Medications
  updateUpcomingMeds();
  
  // Recent Vitals Chart
  drawMiniVitalsChart();
  
  // Streaks
  const stats = HealthStore.getStats();
  document.getElementById('streak-meds').textContent = `${stats.medStreak} days`;
  document.getElementById('streak-vitals').textContent = `${stats.vitalStreak} days`;
  document.getElementById('streak-weight').textContent = `${stats.weightStreak} weeks`;
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
  
  document.getElementById('setting-name').value = settings.name || '';
  document.getElementById('setting-dob').value = settings.dob || '';
  document.getElementById('setting-height').value = settings.height || '';
  document.getElementById('setting-blood-type').value = settings.bloodType || '';
  document.getElementById('setting-target-weight').value = settings.targetWeight || '';
  document.getElementById('setting-target-date').value = settings.targetDate || '';
  
  document.getElementById('notify-meds').checked = settings.notifications.meds;
  document.getElementById('notify-vitals').checked = settings.notifications.vitals;
  document.getElementById('notify-weight').checked = settings.notifications.weight;
  document.getElementById('notify-goals').checked = settings.notifications.goals;
}

document.getElementById('save-personal-info')?.addEventListener('click', () => {
  HealthStore.updateSettings({
    name: document.getElementById('setting-name').value,
    dob: document.getElementById('setting-dob').value,
    height: document.getElementById('setting-height').value,
    bloodType: document.getElementById('setting-blood-type').value
  });
  showToast('Personal information saved!', 'success');
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

// ======================
// Initialize App
// ======================

console.log('[HealthTracker] Initializing store...');
HealthStore.init();

console.log('[HealthTracker] Initializing navigation...');
initNavigation();

console.log('[HealthTracker] Ready!');
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
  
  console.log('[HealthTracker] UI initialized successfully');
}, 100);
