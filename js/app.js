// HealthTracker Pro - Sample Data Generator & Onboarding
// Add this code to the beginning of your app.js file or use as a separate module

// ======================
// Sample Data Generator
// ======================
const SampleDataGenerator = {
  generateSampleData() {
    const now = new Date();
    const sampleData = {
      medications: this.generateMedications(),
      vitals: this.generateVitals(now),
      symptoms: this.generateSymptoms(now),
      weights: this.generateWeights(now),
      goals: this.generateGoals(),
      medicationLog: [],
      achievements: this.getDefaultAchievements(),
      settings: {
        name: 'Sarah Johnson',
        dob: '1985-03-15',
        height: '65',
        bloodType: 'A+',
        targetWeight: '145',
        targetDate: this.addDays(now, 90).toISOString().split('T')[0],
        notifications: {
          meds: true,
          vitals: true,
          weight: true,
          goals: true
        }
      },
      hipaaAccepted: true
    };

    // Generate medication log for the past 30 days
    sampleData.medicationLog = this.generateMedicationLog(sampleData.medications, now);

    return sampleData;
  },

  generateMedications() {
    return [
      {
        id: '1701234567001',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'daily',
        time: '08:00',
        purpose: 'Blood pressure management',
        prescribedBy: 'Dr. Martinez',
        startDate: '2024-09-01',
        active: true,
        refillDate: '2025-11-15',
        notes: 'Take with breakfast'
      },
      {
        id: '1701234567002',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice_daily',
        time: '08:00,20:00',
        purpose: 'Type 2 diabetes management',
        prescribedBy: 'Dr. Martinez',
        startDate: '2024-08-15',
        active: true,
        refillDate: '2025-11-20',
        notes: 'Take with meals to reduce stomach upset'
      },
      {
        id: '1701234567003',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'daily',
        time: '21:00',
        purpose: 'Cholesterol management',
        prescribedBy: 'Dr. Martinez',
        startDate: '2024-07-01',
        active: true,
        refillDate: '2025-12-01',
        notes: 'Take in the evening'
      },
      {
        id: '1701234567004',
        name: 'Vitamin D3',
        dosage: '2000 IU',
        frequency: 'daily',
        time: '08:00',
        purpose: 'Vitamin supplementation',
        prescribedBy: 'Self-care',
        startDate: '2024-06-01',
        active: true,
        refillDate: '2025-10-30',
        notes: 'OTC supplement'
      },
      {
        id: '1701234567005',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'daily',
        time: '08:00',
        purpose: 'Cardiovascular health',
        prescribedBy: 'Dr. Martinez',
        startDate: '2024-09-15',
        active: true,
        refillDate: '2026-01-15',
        notes: 'Low dose aspirin, take with food'
      }
    ];
  },

  generateVitals(now) {
    const vitals = [];
    // Generate vitals for the past 60 days
    for (let i = 0; i < 60; i++) {
      const date = this.addDays(now, -i);
      const dateStr = date.toISOString();
      
      // Blood pressure with slight variation
      const systolic = 125 + Math.floor(Math.random() * 15) - 7;
      const diastolic = 78 + Math.floor(Math.random() * 12) - 6;
      const heartRate = 72 + Math.floor(Math.random() * 16) - 8;
      const temperature = 98.2 + (Math.random() * 1.2) - 0.6;
      
      vitals.push({
        id: `vital-${date.getTime()}`,
        date: dateStr,
        systolic: systolic,
        diastolic: diastolic,
        heartRate: heartRate,
        temperature: parseFloat(temperature.toFixed(1)),
        notes: this.getRandomVitalNote(i)
      });
    }
    return vitals;
  },

  getRandomVitalNote(index) {
    const notes = [
      '',
      '',
      '',
      'Feeling good today',
      'Morning reading',
      'After exercise',
      'Before medication',
      'Feeling a bit stressed',
      'Resting reading',
      'Post-meal'
    ];
    return notes[index % notes.length];
  },

  generateSymptoms(now) {
    const symptoms = [];
    const symptomTypes = [
      { name: 'Mild Headache', severity: 3, medication: 'None', description: 'Dull headache, manageable' },
      { name: 'Fatigue', severity: 4, medication: 'None', description: 'Feeling tired after lunch' },
      { name: 'Dizziness', severity: 5, medication: 'Lisinopril', description: 'Brief dizziness when standing' },
      { name: 'Nausea', severity: 3, medication: 'Metformin', description: 'Mild nausea after taking medication' },
      { name: 'Muscle Aches', severity: 4, medication: 'Atorvastatin', description: 'Mild leg discomfort' },
      { name: 'Dry Mouth', severity: 2, medication: 'Metformin', description: 'Slight dry mouth' }
    ];

    // Generate 15 symptom entries over past 45 days
    for (let i = 0; i < 15; i++) {
      const daysBack = Math.floor(Math.random() * 45);
      const date = this.addDays(now, -daysBack);
      const symptom = symptomTypes[Math.floor(Math.random() * symptomTypes.length)];
      
      symptoms.push({
        id: `symptom-${date.getTime()}-${i}`,
        date: date.toISOString(),
        time: `${8 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        symptom: symptom.name,
        severity: symptom.severity,
        relatedMedication: symptom.medication,
        description: symptom.description
      });
    }
    return symptoms;
  },

  generateWeights(now) {
    const weights = [];
    let currentWeight = 162.5; // Starting weight
    
    // Generate weight entries for past 90 days (weekly)
    for (let i = 0; i < 13; i++) {
      const date = this.addDays(now, -(i * 7));
      
      // Gradual weight loss trend with some variation
      currentWeight = currentWeight + (Math.random() * 2) - 1.2;
      
      weights.push({
        id: `weight-${date.getTime()}`,
        date: date.toISOString(),
        weight: parseFloat(currentWeight.toFixed(1)),
        notes: this.getWeightNote(i)
      });
    }
    return weights;
  },

  getWeightNote(index) {
    const notes = [
      'Morning weigh-in',
      'After workout',
      'Weekly check',
      '',
      'Feeling good about progress',
      'Stayed on track this week',
      '',
      'Weekend weigh-in',
      'Back on track',
      '',
      'Making progress',
      'Monthly check-in',
      ''
    ];
    return notes[index % notes.length];
  },

  generateGoals() {
    const now = new Date();
    return [
      {
        id: 'goal-1701234567001',
        name: 'Reach Target Weight',
        description: 'Lose 15 pounds through healthy diet and exercise',
        targetDate: this.addDays(now, 60).toISOString().split('T')[0],
        targetValue: 145,
        currentValue: 152.3,
        unit: 'lbs',
        category: 'weight',
        progress: 65,
        completed: false,
        createdDate: this.addDays(now, -90).toISOString()
      },
      {
        id: 'goal-1701234567002',
        name: 'Medication Adherence',
        description: '100% medication adherence for 30 days',
        targetDate: this.addDays(now, 15).toISOString().split('T')[0],
        targetValue: 30,
        currentValue: 23,
        unit: 'days',
        category: 'medication',
        progress: 77,
        completed: false,
        createdDate: this.addDays(now, -23).toISOString()
      },
      {
        id: 'goal-1701234567003',
        name: 'Lower Blood Pressure',
        description: 'Achieve consistent readings below 130/85',
        targetDate: this.addDays(now, 45).toISOString().split('T')[0],
        targetValue: 130,
        currentValue: 128,
        unit: 'mmHg systolic',
        category: 'vitals',
        progress: 85,
        completed: false,
        createdDate: this.addDays(now, -60).toISOString()
      },
      {
        id: 'goal-1701234567004',
        name: 'Daily Exercise',
        description: 'Exercise at least 30 minutes, 5 days per week',
        targetDate: this.addDays(now, 30).toISOString().split('T')[0],
        targetValue: 20,
        currentValue: 12,
        unit: 'sessions',
        category: 'lifestyle',
        progress: 60,
        completed: false,
        createdDate: this.addDays(now, -14).toISOString()
      },
      {
        id: 'goal-1701234567005',
        name: 'Track Vitals Daily',
        description: 'Record blood pressure and heart rate every day for a month',
        targetDate: this.addDays(now, -2).toISOString().split('T')[0],
        targetValue: 30,
        currentValue: 30,
        unit: 'days',
        category: 'tracking',
        progress: 100,
        completed: true,
        completedDate: this.addDays(now, -2).toISOString(),
        createdDate: this.addDays(now, -32).toISOString()
      }
    ];
  },

  generateMedicationLog(medications, now) {
    const log = [];
    
    // Generate logs for past 30 days
    for (let day = 0; day < 30; day++) {
      const date = this.addDays(now, -day);
      const dateStr = date.toISOString().split('T')[0];
      
      medications.forEach(med => {
        if (med.active) {
          // 95% adherence rate (occasionally miss a dose)
          const taken = Math.random() > 0.05;
          
          if (taken) {
            if (med.frequency === 'daily') {
              log.push({
                id: `log-${date.getTime()}-${med.id}`,
                medId: med.id,
                time: med.time,
                date: dateStr,
                taken: true
              });
            } else if (med.frequency === 'twice_daily') {
              const times = med.time.split(',');
              times.forEach(time => {
                log.push({
                  id: `log-${date.getTime()}-${med.id}-${time}`,
                  medId: med.id,
                  time: time,
                  date: dateStr,
                  taken: true
                });
              });
            }
          }
        }
      });
    }
    
    return log;
  },

  getDefaultAchievements() {
    return [
      { id: 'first_med', name: 'Getting Started', icon: '💊', description: 'Log your first medication', earned: true, date: '2024-09-01T08:00:00Z' },
      { id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: 'Track for 7 days straight', earned: true, date: '2024-09-08T12:00:00Z' },
      { id: 'month_streak', name: 'Month Master', icon: '🏆', description: 'Track for 30 days straight', earned: true, date: '2024-10-01T09:00:00Z' },
      { id: 'first_vital', name: 'Vital Signs', icon: '❤️', description: 'Record your first vitals', earned: true, date: '2024-09-02T07:30:00Z' },
      { id: 'weight_10', name: 'Weight Warrior', icon: '⚖️', description: 'Log 10 weight entries', earned: true, date: '2024-10-15T08:00:00Z' },
      { id: 'first_goal', name: 'Goal Setter', icon: '🎯', description: 'Set your first goal', earned: true, date: '2024-09-01T10:00:00Z' },
      { id: 'goal_complete', name: 'Goal Achiever', icon: '🌟', description: 'Complete your first goal', earned: true, date: '2024-10-17T14:30:00Z' },
      { id: 'data_master', name: 'Data Master', icon: '📊', description: 'Have 50+ total entries', earned: true, date: '2024-09-20T11:00:00Z' },
      { id: 'perfect_week', name: 'Perfect Week', icon: '💯', description: 'Take all meds for a week', earned: true, date: '2024-09-15T20:00:00Z' },
      { id: 'health_champ', name: 'Health Champion', icon: '👑', description: 'Earn all other achievements', earned: true, date: '2024-10-17T14:35:00Z' }
    ];
  },

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

// ======================
// Onboarding System
// ======================
const OnboardingSystem = {
  init() {
    this.currentStep = 0;
    this.totalSteps = 5;
    this.createOnboardingUI();
  },

  createOnboardingUI() {
    const onboardingHTML = `
      <div id="onboarding-overlay" class="onboarding-overlay">
        <div class="onboarding-modal">
          <div class="onboarding-header">
            <h2 id="onboarding-title">Welcome to HealthTracker Pro</h2>
            <div class="onboarding-progress">
              <div class="progress-bar">
                <div id="onboarding-progress-fill" class="progress-fill" style="width: 0%"></div>
              </div>
              <span id="onboarding-step-counter">Step 1 of 5</span>
            </div>
          </div>
          
          <div class="onboarding-body" id="onboarding-content">
            <!-- Content will be dynamically inserted -->
          </div>
          
          <div class="onboarding-footer">
            <button class="btn btn-secondary" id="onboarding-skip">Skip Tour</button>
            <div class="onboarding-nav-buttons">
              <button class="btn" id="onboarding-back" style="display: none;">← Back</button>
              <button class="btn btn-primary" id="onboarding-next">Next →</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', onboardingHTML);
    this.attachEventListeners();
    this.showStep(0);
  },

  attachEventListeners() {
    document.getElementById('onboarding-next').addEventListener('click', () => this.nextStep());
    document.getElementById('onboarding-back').addEventListener('click', () => this.previousStep());
    document.getElementById('onboarding-skip').addEventListener('click', () => this.skipOnboarding());
  },

  showStep(step) {
    this.currentStep = step;
    const content = document.getElementById('onboarding-content');
    const title = document.getElementById('onboarding-title');
    const progressFill = document.getElementById('onboarding-progress-fill');
    const stepCounter = document.getElementById('onboarding-step-counter');
    const nextBtn = document.getElementById('onboarding-next');
    const backBtn = document.getElementById('onboarding-back');

    // Update progress
    const progress = ((step + 1) / this.totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    stepCounter.textContent = `Step ${step + 1} of ${this.totalSteps}`;

    // Show/hide back button
    backBtn.style.display = step > 0 ? 'inline-block' : 'none';

    // Update next button text
    nextBtn.textContent = step === this.totalSteps - 1 ? 'Get Started! 🚀' : 'Next →';

    // Load step content
    const steps = [
      this.getWelcomeStep(),
      this.getDataOptionsStep(),
      this.getFeaturesStep(),
      this.getPrivacyStep(),
      this.getPersonalizationStep()
    ];

    title.textContent = steps[step].title;
    content.innerHTML = steps[step].content;
  },

  getWelcomeStep() {
    return {
      title: 'Welcome to HealthTracker Pro! 💊',
      content: `
        <div class="onboarding-welcome">
          <div class="welcome-icon">🎉</div>
          <h3>Your Personal Health Management Platform</h3>
          <p class="lead">Track medications, monitor vitals, set health goals, and take control of your wellness journey.</p>
          
          <div class="feature-grid">
            <div class="feature-item">
              <span class="feature-icon">💊</span>
              <h4>Medication Tracking</h4>
              <p>Never miss a dose with reminders and logs</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">❤️</span>
              <h4>Vitals Monitoring</h4>
              <p>Track blood pressure, heart rate, and more</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <h4>Progress Reports</h4>
              <p>Visualize your health trends over time</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <h4>Goal Setting</h4>
              <p>Set and achieve your health objectives</p>
            </div>
          </div>
        </div>
      `
    };
  },

  getDataOptionsStep() {
    return {
      title: 'Choose Your Starting Point',
      content: `
        <div class="onboarding-data-options">
          <p class="lead">How would you like to begin?</p>
          
          <div class="data-option-cards">
            <div class="data-option-card" onclick="OnboardingSystem.selectDataOption('sample')">
              <div class="option-icon">🎯</div>
              <h4>Start with Sample Data</h4>
              <p>Explore the app with pre-populated example data. Perfect for testing and learning the features.</p>
              <ul class="option-features">
                <li>✓ 5 sample medications</li>
                <li>✓ 60 days of vitals history</li>
                <li>✓ Weight tracking data</li>
                <li>✓ Active health goals</li>
                <li>✓ All achievements unlocked</li>
              </ul>
              <button class="btn btn-primary">Use Sample Data</button>
            </div>
            
            <div class="data-option-card" onclick="OnboardingSystem.selectDataOption('blank')">
              <div class="option-icon">📝</div>
              <h4>Start Fresh</h4>
              <p>Begin with a clean slate and add your own health information from scratch.</p>
              <ul class="option-features">
                <li>✓ Empty medication list</li>
                <li>✓ No pre-existing data</li>
                <li>✓ Customize everything</li>
                <li>✓ Your own health journey</li>
                <li>✓ Earn achievements as you go</li>
              </ul>
              <button class="btn">Start from Scratch</button>
            </div>
          </div>
          
          <input type="hidden" id="data-option-choice" value="">
        </div>
      `
    };
  },

  getFeaturesStep() {
    return {
      title: 'Key Features Tour',
      content: `
        <div class="onboarding-features">
          <div class="feature-tour">
            <div class="feature-tour-item">
              <span class="tour-number">1</span>
              <div class="tour-content">
                <h4>📊 Dashboard</h4>
                <p>Your health at a glance - see today's medications, latest vitals, and goal progress all in one place.</p>
              </div>
            </div>
            
            <div class="feature-tour-item">
              <span class="tour-number">2</span>
              <div class="tour-content">
                <h4>💊 Medication Management</h4>
                <p>Add medications with dosage, frequency, and reminders. Mark doses as taken to track adherence.</p>
              </div>
            </div>
            
            <div class="feature-tour-item">
              <span class="tour-number">3</span>
              <div class="tour-content">
                <h4>❤️ Vitals Tracking</h4>
                <p>Record blood pressure, heart rate, and temperature. View trends with interactive charts.</p>
              </div>
            </div>
            
            <div class="feature-tour-item">
              <span class="tour-number">4</span>
              <div class="tour-content">
                <h4>📝 Symptoms & Side Effects</h4>
                <p>Log symptoms, rate severity, and link them to medications to identify patterns.</p>
              </div>
            </div>
            
            <div class="feature-tour-item">
              <span class="tour-number">5</span>
              <div class="tour-content">
                <h4>🎯 Goals & Achievements</h4>
                <p>Set health goals, track progress, and earn badges for maintaining healthy habits.</p>
              </div>
            </div>
            
            <div class="feature-tour-item">
              <span class="tour-number">6</span>
              <div class="tour-content">
                <h4>📈 Reports & Export</h4>
                <p>Generate comprehensive health reports and export your data to share with healthcare providers.</p>
              </div>
            </div>
          </div>
        </div>
      `
    };
  },

  getPrivacyStep() {
    return {
      title: 'Your Privacy & Data Security',
      content: `
        <div class="onboarding-privacy">
          <div class="privacy-icon">🔒</div>
          <h3>Your Health Data Stays on Your Device</h3>
          
          <div class="privacy-points">
            <div class="privacy-point">
              <span class="point-icon">✓</span>
              <div>
                <h4>100% Local Storage</h4>
                <p>All your health data is stored locally in your browser. Nothing is sent to external servers.</p>
              </div>
            </div>
            
            <div class="privacy-point">
              <span class="point-icon">✓</span>
              <div>
                <h4>You're in Control</h4>
                <p>Export your data anytime. Delete everything with one click. It's your data, your choice.</p>
              </div>
            </div>
            
            <div class="privacy-point">
              <span class="point-icon">✓</span>
              <div>
                <h4>No Account Required</h4>
                <p>No registration, no login, no email required. Start tracking immediately.</p>
              </div>
            </div>
          </div>
          
          <div class="privacy-disclaimer">
            <h4>⚠️ Important Notice</h4>
            <p><strong>This application is NOT HIPAA compliant</strong> and should be used for personal tracking only. Always consult healthcare professionals for medical decisions.</p>
          </div>
          
          <div class="privacy-recommendations">
            <h4>Security Best Practices:</h4>
            <ul>
              <li>Use on a personal, password-protected device</li>
              <li>Don't use on shared or public computers</li>
              <li>Regular export backups recommended</li>
              <li>Clear browser data to remove all information</li>
            </ul>
          </div>
        </div>
      `
    };
  },

  getPersonalizationStep() {
    return {
      title: 'Personalize Your Experience',
      content: `
        <div class="onboarding-personalization">
          <p class="lead">Let's set up your profile (you can change this anytime in Settings)</p>
          
          <form id="onboarding-profile-form" class="profile-form">
            <div class="form-group">
              <label for="onboard-name">Your Name (Optional)</label>
              <input type="text" id="onboard-name" class="form-control" placeholder="e.g., Sarah Johnson">
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="onboard-dob">Date of Birth (Optional)</label>
                <input type="date" id="onboard-dob" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="onboard-height">Height (inches)</label>
                <input type="number" id="onboard-height" class="form-control" placeholder="e.g., 65">
              </div>
            </div>
            
            <div class="form-group">
              <label for="onboard-blood-type">Blood Type (Optional)</label>
              <select id="onboard-blood-type" class="form-control">
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>
                <input type="checkbox" id="onboard-notifications" checked>
                Enable notifications for medication reminders
              </label>
            </div>
          </form>
          
          <div class="onboarding-ready">
            <h3>🎉 You're All Set!</h3>
            <p>Ready to start your health tracking journey. Click "Get Started" to begin!</p>
          </div>
        </div>
      `
    };
  },

  selectDataOption(option) {
    document.getElementById('data-option-choice').value = option;
    
    // Visual feedback
    const cards = document.querySelectorAll('.data-option-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Auto-advance after selection
    setTimeout(() => this.nextStep(), 500);
  },

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.completeOnboarding();
    }
  },

  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  },

  skipOnboarding() {
    if (confirm('Are you sure you want to skip the tour? You can always access help from the Settings page.')) {
      this.completeOnboarding();
    }
  },

  completeOnboarding() {
    // Save personalization settings
    const name = document.getElementById('onboard-name')?.value || '';
    const dob = document.getElementById('onboard-dob')?.value || '';
    const height = document.getElementById('onboard-height')?.value || '';
    const bloodType = document.getElementById('onboard-blood-type')?.value || '';
    const notifications = document.getElementById('onboard-notifications')?.checked || true;

    // Check if sample data was selected
    const dataOption = document.getElementById('data-option-choice')?.value;
    
    if (dataOption === 'sample') {
      // Load sample data
      const sampleData = SampleDataGenerator.generateSampleData();
      
      // Override with user's personalization
      if (name) sampleData.settings.name = name;
      if (dob) sampleData.settings.dob = dob;
      if (height) sampleData.settings.height = height;
      if (bloodType) sampleData.settings.bloodType = bloodType;
      sampleData.settings.notifications.meds = notifications;
      
      // Save to localStorage
      localStorage.setItem('healthTrackerData', JSON.stringify(sampleData));
      localStorage.setItem('onboardingComplete', 'true');
      
      // Reload to show sample data
      window.location.reload();
    } else {
      // Start fresh with personalization
      const settings = {
        name,
        dob,
        height,
        bloodType,
        targetWeight: '',
        targetDate: '',
        notifications: {
          meds: notifications,
          vitals: true,
          weight: false,
          goals: true
        }
      };
      
      if (typeof HealthStore !== 'undefined') {
        HealthStore.updateSettings(settings);
      }
      
      localStorage.setItem('onboardingComplete', 'true');
      
      // Close onboarding
      document.getElementById('onboarding-overlay').remove();
    }
  }
};

// ======================
// Auto-initialize on page load
// ======================
document.addEventListener('DOMContentLoaded', () => {
  // Check if onboarding should be shown
  const onboardingComplete = localStorage.getItem('onboardingComplete');
  const hipaaAccepted = localStorage.getItem('hipaaAccepted');
  
  if (!onboardingComplete && hipaaAccepted) {
    // Show onboarding after HIPAA modal
    setTimeout(() => {
      OnboardingSystem.init();
    }, 500);
  }
});

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SampleDataGenerator, OnboardingSystem };
}
