// ============================================
// HEALTH TRACKER - JAVASCRIPT APPLICATION
// HIPAA-Compliant & Fully Deidentified
// No Personal Information Collection
// ============================================

// ============================================
// PRIVACY & SECURITY NOTICE
// ============================================
/*
 * PRIVACY GUARANTEE:
 * - All data stored locally in browser only
 * - No external servers or APIs contacted
 * - No personal identifying information collected
 * - No names, addresses, phone numbers, emails
 * - All motivational content is generic
 * - Sample data uses completely generic placeholders
 * 
 * HIPAA COMPLIANCE NOTES:
 * - This is a client-side only application
 * - No PHI (Protected Health Information) transmitted
 * - Data never leaves user's device
 * - Users responsible for device security
 * - Recommend: Device encryption, password protection, auto-lock
 */

// ============================================
// ONBOARDING SYSTEM
// ============================================

let currentOnboardingStep = 0;
const totalOnboardingSteps = 5;

function checkFirstVisit() {
    const hasVisited = localStorage.getItem('healthtracker_visited');
    if (!hasVisited) {
        setTimeout(() => {
            showOnboarding();
        }, 500);
    }
}

function showOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    overlay.classList.add('active');
    currentOnboardingStep = 0;
    updateOnboardingStep();
}

function viewTutorial() {
    showOnboarding();
}

function hideOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    overlay.classList.remove('active');
    localStorage.setItem('healthtracker_visited', 'true');
}

function updateOnboardingStep() {
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const currentStep = document.querySelector(`.onboarding-step[data-step="${currentOnboardingStep}"]`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index < currentOnboardingStep) {
            dot.classList.add('completed');
        } else if (index === currentOnboardingStep) {
            dot.classList.add('active');
        }
    });
    
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const skipBtn = document.getElementById('skipOnboarding');
    
    if (currentOnboardingStep === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    if (currentOnboardingStep === totalOnboardingSteps - 1) {
        nextBtn.style.display = 'none';
        skipBtn.textContent = 'Close';
    } else {
        nextBtn.style.display = 'inline-block';
        skipBtn.textContent = 'Skip Tour';
    }
}

function nextOnboardingStep() {
    if (currentOnboardingStep < totalOnboardingSteps - 1) {
        currentOnboardingStep++;
        updateOnboardingStep();
    }
}

function prevOnboardingStep() {
    if (currentOnboardingStep > 0) {
        currentOnboardingStep--;
        updateOnboardingStep();
    }
}

function skipOnboarding() {
    hideOnboarding();
    
    if (appState.vitals.bloodPressure.length === 0) {
        setTimeout(() => {
            if (confirm('Would you like to load sample data to explore the application?')) {
                generateSampleData();
            }
        }, 500);
    }
}

function completeOnboardingWithSampleData() {
    hideOnboarding();
    generateSampleData();
}

function completeOnboardingFresh() {
    hideOnboarding();
    showToast('Welcome! Click the + buttons to get started! 🎉');
}

// ============================================
// DATA STORAGE & STATE
// ============================================

let appState = {
    theme: 'light',
    streak: 0,
    lastCheckIn: null,
    vitals: {
        bloodPressure: [],
        heartRate: [],
        weight: [],
        glucose: []
    },
    medications: [],
    appointments: [],
    goals: [],
    achievements: [],
    medicationChecks: {}
};

// ============================================
// MOTIVATIONAL QUOTES - DEIDENTIFIED
// No author attribution for HIPAA compliance
// ============================================

const motivationalQuotes = [
    { quote: "Take care of your body. It's the only place you have to live." },
    { quote: "Health is not about the weight you lose, but the life you gain." },
    { quote: "Your body hears everything your mind says. Stay positive." },
    { quote: "The greatest wealth is health." },
    { quote: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear." },
    { quote: "Take care of yourself, be healthy, and always believe you can be successful in anything you truly want." },
    { quote: "Health is a state of complete harmony of the body, mind and spirit." },
    { quote: "The first wealth is health." },
    { quote: "A healthy outside starts from the inside." },
    { quote: "It is health that is real wealth and not pieces of gold and silver." },
    { quote: "Small daily improvements are the key to long-term results." },
    { quote: "Your health is an investment, not an expense." },
    { quote: "Progress, not perfection, is what we should be asking of ourselves." },
    { quote: "Every step forward is progress, no matter how small." },
    { quote: "Be patient with yourself. Self-growth is tender; it's holy ground." }
];

// ============================================
// ACHIEVEMENTS SYSTEM
// ============================================

const achievementDefinitions = [
    { id: 'first_entry', name: 'First Steps', icon: '🌱', rarity: 'common', condition: () => appState.vitals.bloodPressure.length >= 1 },
    { id: 'week_streak', name: 'Week Warrior', icon: '🔥', rarity: 'rare', condition: () => appState.streak >= 7 },
    { id: 'two_week_streak', name: 'Fortnight Fighter', icon: '💪', rarity: 'epic', condition: () => appState.streak >= 14 },
    { id: 'month_streak', name: 'Monthly Master', icon: '👑', rarity: 'legendary', condition: () => appState.streak >= 30 },
    { id: 'medication_adherent', name: 'Medication Master', icon: '💊', rarity: 'rare', condition: () => appState.medications.length >= 3 },
    { id: 'goal_setter', name: 'Goal Getter', icon: '🎯', rarity: 'common', condition: () => appState.goals.length >= 1 },
    { id: 'appointment_keeper', name: 'Schedule Star', icon: '📅', rarity: 'common', condition: () => appState.appointments.length >= 1 },
    { id: 'data_collector', name: 'Data Devotee', icon: '📊', rarity: 'epic', condition: () => appState.vitals.bloodPressure.length >= 30 },
    { id: 'health_champion', name: 'Health Hero', icon: '🏆', rarity: 'legendary', condition: () => appState.streak >= 60 },
    { id: 'quick_logger', name: 'Quick Logger', icon: '⚡', rarity: 'common', condition: () => appState.vitals.bloodPressure.length >= 5 },
    { id: 'vital_victor', name: 'Vital Victor', icon: '💪', rarity: 'rare', condition: () => appState.vitals.bloodPressure.length >= 15 && appState.vitals.heartRate.length >= 15 },
    { id: 'data_dynamo', name: 'Data Dynamo', icon: '📈', rarity: 'common', condition: () => appState.vitals.bloodPressure.length + appState.vitals.heartRate.length + appState.vitals.weight.length + appState.vitals.glucose.length >= 50 },
    { id: 'perfect_month', name: 'Perfect Month', icon: '🌟', rarity: 'legendary', condition: () => appState.streak >= 30 && appState.vitals.bloodPressure.length >= 30 },
    { id: 'profile_pro', name: 'Profile Pro', icon: '🎨', rarity: 'common', condition: () => appState.medications.length >= 1 && appState.appointments.length >= 1 && appState.goals.length >= 1 },
    { id: 'never_miss', name: 'Never Miss', icon: '🔔', rarity: 'rare', condition: () => appState.appointments.length >= 3 },
    { id: 'century_club', name: 'Century Club', icon: '💯', rarity: 'epic', condition: () => appState.vitals.bloodPressure.length >= 100 },
    { id: 'consistency_king', name: 'Consistency Champion', icon: '🎯', rarity: 'epic', condition: () => appState.streak >= 21 },
    { id: 'early_bird', name: 'Early Bird', icon: '🏅', rarity: 'common', condition: () => appState.vitals.bloodPressure.length >= 3 }
];

// ============================================
// SAMPLE DATA - FULLY DEIDENTIFIED
// ============================================

function generateSampleData() {
    const now = new Date();
    
    // Generate 30 days of realistic sample data
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        appState.vitals.bloodPressure.push({
            date: date.toISOString(),
            systolic: 115 + Math.random() * 15,
            diastolic: 70 + Math.random() * 10
        });
        appState.vitals.heartRate.push({
            date: date.toISOString(),
            value: 68 + Math.random() * 12
        });
        appState.vitals.weight.push({
            date: date.toISOString(),
            value: 175 - (i * 0.2) + Math.random() * 2
        });
        appState.vitals.glucose.push({
            date: date.toISOString(),
            value: 95 + Math.random() * 15
        });
    }
    
    // Generic sample medications - NO IDENTIFYING INFO
    appState.medications = [
        { id: Date.now() + 1, name: 'Medication A', dosage: '50mg', time: '08:00' },
        { id: Date.now() + 2, name: 'Supplement B', dosage: '1000 IU', time: '09:00' },
        { id: Date.now() + 3, name: 'Vitamin C', dosage: '1 tablet', time: '08:00' }
    ];
    
    // Generic sample appointments - NO IDENTIFYING INFO
    const futureDate1 = new Date(now);
    futureDate1.setDate(futureDate1.getDate() + 7);
    const futureDate2 = new Date(now);
    futureDate2.setDate(futureDate2.getDate() + 14);
    
    appState.appointments = [
        {
            id: Date.now() + 1,
            title: 'Health Checkup',
            date: futureDate1.toISOString().split('T')[0],
            time: '10:00',
            location: 'Medical Clinic'
        },
        {
            id: Date.now() + 2,
            title: 'Lab Results Review',
            date: futureDate2.toISOString().split('T')[0],
            time: '14:30',
            location: 'Health Center'
        }
    ];
    
    // Generic health goals
    appState.goals = [
        { id: Date.now() + 1, name: 'Daily physical activity', target: 30, current: 15 },
        { id: Date.now() + 2, name: 'Adequate hydration', target: 30, current: 20 },
        { id: Date.now() + 3, name: 'Stress management practice', target: 30, current: 8 }
    ];
    
    appState.streak = 15;
    appState.lastCheckIn = now.toISOString();
    
    saveData();
    showToast('Sample data loaded successfully! 🎉');
    refreshDashboard();
}

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

function loadData() {
    const saved = localStorage.getItem('healthtracker_data');
    if (saved) {
        try {
            appState = JSON.parse(saved);
            updateStreak();
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

function saveData() {
    localStorage.setItem('healthtracker_data', JSON.stringify(appState));
}

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('healthtracker_theme') || 'light';
    appState.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

function toggleTheme() {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', appState.theme);
    localStorage.setItem('healthtracker_theme', appState.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = appState.theme === 'light' ? '🌙' : '☀️';
}

// ============================================
// STREAK MANAGEMENT
// ============================================

function updateStreak() {
    if (!appState.lastCheckIn) {
        appState.streak = 0;
        return;
    }
    
    const now = new Date();
    const lastCheck = new Date(appState.lastCheckIn);
    const diffTime = Math.abs(now - lastCheck);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        // Same day, keep streak
    } else if (diffDays === 1) {
        // Next day, increment streak
        appState.streak++;
        appState.lastCheckIn = now.toISOString();
        saveData();
    } else {
        // Missed a day, reset streak
        appState.streak = 1;
        appState.lastCheckIn = now.toISOString();
        saveData();
    }
}

function displayStreak() {
    const streakNumber = document.getElementById('streakNumber');
    const streakMessage = document.getElementById('streakMessage');
    const streakFire = document.getElementById('streakFire');
    
    streakNumber.textContent = appState.streak;
    
    if (appState.streak === 0) {
        streakMessage.textContent = "Start your journey today!";
        streakFire.textContent = '🔥';
    } else if (appState.streak < 7) {
        streakMessage.textContent = "Great start! Keep it up!";
        streakFire.textContent = '🔥';
    } else if (appState.streak < 14) {
        streakMessage.textContent = "One week strong! 💪";
        streakFire.textContent = '🔥🔥';
    } else if (appState.streak < 30) {
        streakMessage.textContent = "You're on fire! 🚀";
        streakFire.textContent = '🔥🔥🔥';
    } else {
        streakMessage.textContent = "Legendary streak! 👑";
        streakFire.textContent = '🔥🔥🔥🔥';
    }
}

// ============================================
// QUICK STATS
// ============================================

function updateQuickStats() {
    const bp = appState.vitals.bloodPressure;
    const hr = appState.vitals.heartRate;
    const weight = appState.vitals.weight;
    const glucose = appState.vitals.glucose;
    
    if (bp.length > 0) {
        const latest = bp[bp.length - 1];
        document.getElementById('bpValue').textContent = 
            `${Math.round(latest.systolic)}/${Math.round(latest.diastolic)}`;
    }
    
    if (hr.length > 0) {
        const latest = hr[hr.length - 1];
        document.getElementById('hrValue').textContent = Math.round(latest.value);
    }
    
    if (weight.length > 0) {
        const latest = weight[weight.length - 1];
        document.getElementById('weightValue').textContent = Math.round(latest.value);
    }
    
    if (glucose.length > 0) {
        const latest = glucose[glucose.length - 1];
        document.getElementById('glucoseValue').textContent = Math.round(latest.value);
    }
}

// ============================================
// AI INSIGHTS
// ============================================

function generateAIInsights() {
    const insights = [];
    const bp = appState.vitals.bloodPressure;
    const hr = appState.vitals.heartRate;
    const weight = appState.vitals.weight;
    
    if (bp.length >= 7) {
        const recent = bp.slice(-7);
        const avgSystolic = recent.reduce((sum, r) => sum + r.systolic, 0) / recent.length;
        const avgDiastolic = recent.reduce((sum, r) => sum + r.diastolic, 0) / recent.length;
        
        if (avgSystolic > 130 || avgDiastolic > 80) {
            insights.push({
                icon: '⚠️',
                text: `Your average blood pressure over the last week is ${Math.round(avgSystolic)}/${Math.round(avgDiastolic)} mmHg, which is slightly elevated. Consider discussing this with your healthcare provider.`
            });
        } else if (avgSystolic < 120 && avgDiastolic < 80) {
            insights.push({
                icon: '✅',
                text: `Great news! Your blood pressure has been in the optimal range (${Math.round(avgSystolic)}/${Math.round(avgDiastolic)} mmHg) over the past week.`
            });
        }
        
        const firstWeek = bp.slice(0, 7).reduce((sum, r) => sum + r.systolic, 0) / 7;
        const lastWeek = recent.reduce((sum, r) => sum + r.systolic, 0) / 7;
        const change = lastWeek - firstWeek;
        
        if (Math.abs(change) > 5) {
            const direction = change > 0 ? 'increased' : 'decreased';
            insights.push({
                icon: '📈',
                text: `Your blood pressure has ${direction} by ${Math.abs(Math.round(change))} mmHg over the monitoring period.`
            });
        }
    }
    
    if (hr.length >= 7) {
        const recent = hr.slice(-7);
        const avgHR = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
        
        if (avgHR > 100) {
            insights.push({
                icon: '💓',
                text: `Your average heart rate (${Math.round(avgHR)} bpm) is elevated. Ensure you're well-rested and managing stress.`
            });
        } else if (avgHR >= 60 && avgHR <= 100) {
            insights.push({
                icon: '💚',
                text: `Your resting heart rate (${Math.round(avgHR)} bpm) is within the normal range.`
            });
        }
    }
    
    if (weight.length >= 14) {
        const firstHalf = weight.slice(0, 7).reduce((sum, w) => sum + w.value, 0) / 7;
        const secondHalf = weight.slice(-7).reduce((sum, w) => sum + w.value, 0) / 7;
        const change = secondHalf - firstHalf;
        
        if (Math.abs(change) > 2) {
            const direction = change > 0 ? 'gained' : 'lost';
            insights.push({
                icon: '⚖️',
                text: `You've ${direction} ${Math.abs(change).toFixed(1)} lbs over the past two weeks. ${change < 0 ? 'Great progress!' : 'Keep monitoring your weight.'}`
            });
        }
    }
    
    const today = new Date().toDateString();
    const checkedToday = Object.keys(appState.medicationChecks).filter(key => {
        const date = new Date(parseInt(key.split('_')[1])).toDateString();
        return date === today && appState.medicationChecks[key];
    }).length;
    
    if (appState.medications.length > 0) {
        const adherenceRate = (checkedToday / appState.medications.length) * 100;
        if (adherenceRate === 100) {
            insights.push({
                icon: '🎉',
                text: `Perfect medication adherence today! You've taken all ${appState.medications.length} medications.`
            });
        } else if (adherenceRate > 0) {
            insights.push({
                icon: '💊',
                text: `You've taken ${checkedToday} of ${appState.medications.length} medications today. Don't forget the rest!`
            });
        }
    }
    
    if (insights.length === 0) {
        insights.push({
            icon: '🌟',
            text: 'Keep logging your health data to receive personalized insights!'
        });
    }
    
    return insights;
}

function displayAIInsights() {
    const container = document.getElementById('insightsContainer');
    const insights = generateAIInsights();
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <span class="insight-icon">${insight.icon}</span>
            <p class="insight-text">${insight.text}</p>
        </div>
    `).join('');
}

// ============================================
// MEDICATIONS
// ============================================

function displayMedications() {
    const container = document.getElementById('medicationList');
    
    if (appState.medications.length === 0) {
        container.innerHTML = '<p class="empty-state">No medications added yet</p>';
        return;
    }
    
    const today = new Date().toDateString();
    
    container.innerHTML = appState.medications.map(med => {
        const checkKey = `${med.id}_${new Date().setHours(0,0,0,0)}`;
        const isChecked = appState.medicationChecks[checkKey] || false;
        
        return `
            <div class="medication-item">
                <div class="medication-info">
                    <span class="medication-name">${med.name}</span>
                    <div>
                        <span class="medication-dosage">${med.dosage}</span>
                        <span class="medication-time"> • ${med.time}</span>
                    </div>
                </div>
                <input 
                    type="checkbox" 
                    class="medication-checkbox" 
                    ${isChecked ? 'checked' : ''}
                    onchange="toggleMedication(${med.id})"
                >
            </div>
        `;
    }).join('');
}

function toggleMedication(medId) {
    const checkKey = `${medId}_${new Date().setHours(0,0,0,0)}`;
    appState.medicationChecks[checkKey] = !appState.medicationChecks[checkKey];
    saveData();
    displayAIInsights();
}

function addMedication() {
    const name = document.getElementById('medName').value;
    const dosage = document.getElementById('medDosage').value;
    const time = document.getElementById('medTime').value;
    
    if (!name || !dosage || !time) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    appState.medications.push({
        id: Date.now(),
        name,
        dosage,
        time
    });
    
    saveData();
    closeModal('medicationModal');
    displayMedications();
    updateAchievements();
    showToast('Medication added! 💊');
    
    document.getElementById('medName').value = '';
    document.getElementById('medDosage').value = '';
    document.getElementById('medTime').value = '';
}

// ============================================
// APPOINTMENTS
// ============================================

function displayAppointments() {
    const container = document.getElementById('appointmentsList');
    
    if (appState.appointments.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming appointments</p>';
        return;
    }
    
    const now = new Date();
    const sortedAppointments = appState.appointments
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    container.innerHTML = sortedAppointments.map(appt => {
        const apptDate = new Date(appt.date + 'T' + appt.time);
        const diffTime = apptDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let countdown = '';
        if (diffDays === 0) {
            countdown = 'Today!';
        } else if (diffDays === 1) {
            countdown = 'Tomorrow';
        } else if (diffDays > 1) {
            countdown = `In ${diffDays} days`;
        } else {
            countdown = 'Past appointment';
        }
        
        return `
            <div class="appointment-item">
                <div class="appointment-title">${appt.title}</div>
                <div class="appointment-datetime">📅 ${formatDate(appt.date)} at ${appt.time}</div>
                <div class="appointment-location">📍 ${appt.location}</div>
                <div class="appointment-countdown">${countdown}</div>
            </div>
        `;
    }).join('');
}

function addAppointment() {
    const title = document.getElementById('apptTitle').value;
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const location = document.getElementById('apptLocation').value;
    
    if (!title || !date || !time || !location) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    appState.appointments.push({
        id: Date.now(),
        title,
        date,
        time,
        location
    });
    
    saveData();
    closeModal('appointmentModal');
    displayAppointments();
    updateAchievements();
    showToast('Appointment added! 📅');
    
    document.getElementById('apptTitle').value = '';
    document.getElementById('apptDate').value = '';
    document.getElementById('apptTime').value = '';
    document.getElementById('apptLocation').value = '';
}

// ============================================
// GOALS
// ============================================

function displayGoals() {
    const container = document.getElementById('goalsList');
    
    if (appState.goals.length === 0) {
        container.innerHTML = '<p class="empty-state">Set your first health goal!</p>';
        return;
    }
    
    container.innerHTML = appState.goals.map(goal => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        
        return `
            <div class="goal-item">
                <div class="goal-header">
                    <span class="goal-name">${goal.name}</span>
                    <span class="goal-percentage">${Math.round(percentage)}%</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="goal-stats">
                    <span>${goal.current} / ${goal.target}</span>
                    <span>${goal.target - goal.current} remaining</span>
                </div>
            </div>
        `;
    }).join('');
}

function addGoal() {
    const name = document.getElementById('goalName').value;
    const target = parseInt(document.getElementById('goalTarget').value);
    const current = parseInt(document.getElementById('goalProgress').value) || 0;
    
    if (!name || !target) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    appState.goals.push({
        id: Date.now(),
        name,
        target,
        current
    });
    
    saveData();
    closeModal('goalModal');
    displayGoals();
    updateAchievements();
    showToast('Goal added! 🎯');
    
    document.getElementById('goalName').value = '';
    document.getElementById('goalTarget').value = '';
    document.getElementById('goalProgress').value = '';
}

// ============================================
// ADD VITALS
// ============================================

function addVitals() {
    const dateTimeInput = document.getElementById('vitalsDateTime').value;
    const systolic = parseFloat(document.getElementById('vitalsSystolic').value);
    const diastolic = parseFloat(document.getElementById('vitalsDiastolic').value);
    const heartRate = parseFloat(document.getElementById('vitalsHeartRate').value);
    const weight = parseFloat(document.getElementById('vitalsWeight').value);
    const glucose = parseFloat(document.getElementById('vitalsGlucose').value);
    
    if (!systolic && !diastolic && !heartRate && !weight && !glucose) {
        showToast('Please enter at least one vital sign', 'error');
        return;
    }
    
    const timestamp = dateTimeInput ? new Date(dateTimeInput).toISOString() : new Date().toISOString();
    
    let addedCount = 0;
    
    if (systolic && diastolic) {
        appState.vitals.bloodPressure.push({
            date: timestamp,
            systolic: systolic,
            diastolic: diastolic
        });
        addedCount++;
    } else if (systolic || diastolic) {
        showToast('Please enter both systolic and diastolic for blood pressure', 'error');
        return;
    }
    
    if (heartRate) {
        appState.vitals.heartRate.push({
            date: timestamp,
            value: heartRate
        });
        addedCount++;
    }
    
    if (weight) {
        appState.vitals.weight.push({
            date: timestamp,
            value: weight
        });
        addedCount++;
    }
    
    if (glucose) {
        appState.vitals.glucose.push({
            date: timestamp,
            value: glucose
        });
        addedCount++;
    }
    
    appState.vitals.bloodPressure.sort((a, b) => new Date(a.date) - new Date(b.date));
    appState.vitals.heartRate.sort((a, b) => new Date(a.date) - new Date(b.date));
    appState.vitals.weight.sort((a, b) => new Date(a.date) - new Date(b.date));
    appState.vitals.glucose.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    saveData();
    closeModal('vitalsModal');
    refreshDashboard();
    showToast(`${addedCount} vital sign${addedCount > 1 ? 's' : ''} added! 💓`);
    
    updateStreak();
    
    document.getElementById('vitalsDateTime').value = '';
    document.getElementById('vitalsSystolic').value = '';
    document.getElementById('vitalsDiastolic').value = '';
    document.getElementById('vitalsHeartRate').value = '';
    document.getElementById('vitalsWeight').value = '';
    document.getElementById('vitalsGlucose').value = '';
}

// ============================================
// CHARTS
// ============================================

let vitalsChart = null;
let currentTimeScale = 7;
let overlayMode = false;

function initChart() {
    const ctx = document.getElementById('vitalsChart').getContext('2d');
    vitalsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Blood Pressure',
                data: [],
                borderColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--chart-bp').trim(),
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--chart-bp').trim(),
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-primary').trim(),
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--bg-secondary').trim(),
                    titleColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--text-primary').trim(),
                    bodyColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--text-secondary').trim(),
                    borderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--border-color').trim(),
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += Math.round(context.parsed.y * 100) / 100;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary').trim()
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary').trim()
                    }
                }
            }
        }
    });
    
    updateChart('bp');
}

function updateChart(type) {
    if (overlayMode) {
        updateOverlayChart();
        return;
    }
    
    let data = [];
    let label = '';
    let color = '';
    
    switch(type) {
        case 'bp':
            data = appState.vitals.bloodPressure.slice(-currentTimeScale).map(d => d.systolic);
            label = 'Blood Pressure (Systolic)';
            color = getComputedStyle(document.documentElement)
                .getPropertyValue('--chart-bp').trim();
            break;
        case 'hr':
            data = appState.vitals.heartRate.slice(-currentTimeScale).map(d => d.value);
            label = 'Heart Rate';
            color = getComputedStyle(document.documentElement)
                .getPropertyValue('--chart-hr').trim();
            break;
        case 'weight':
            data = appState.vitals.weight.slice(-currentTimeScale).map(d => d.value);
            label = 'Weight';
            color = getComputedStyle(document.documentElement)
                .getPropertyValue('--chart-weight').trim();
            break;
        case 'glucose':
            data = appState.vitals.glucose.slice(-currentTimeScale).map(d => d.value);
            label = 'Glucose';
            color = getComputedStyle(document.documentElement)
                .getPropertyValue('--chart-glucose').trim();
            break;
    }
    
    const labels = data.map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - 1 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    vitalsChart.data.labels = labels;
    vitalsChart.data.datasets = [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
    }];
    vitalsChart.options.plugins.legend.display = false;
    vitalsChart.update();
}

function updateOverlayChart() {
    const selectedVitals = Array.from(document.querySelectorAll('.overlay-option:checked'))
        .map(checkbox => checkbox.value);
    
    if (selectedVitals.length === 0) {
        vitalsChart.data.labels = [];
        vitalsChart.data.datasets = [];
        vitalsChart.update();
        return;
    }
    
    const datasets = [];
    const vitalConfigs = {
        bp: {
            label: 'Blood Pressure (Systolic)',
            data: appState.vitals.bloodPressure.slice(-currentTimeScale).map(d => d.systolic),
            color: getComputedStyle(document.documentElement).getPropertyValue('--chart-bp').trim(),
            yAxisID: 'y'
        },
        hr: {
            label: 'Heart Rate',
            data: appState.vitals.heartRate.slice(-currentTimeScale).map(d => d.value),
            color: getComputedStyle(document.documentElement).getPropertyValue('--chart-hr').trim(),
            yAxisID: 'y'
        },
        weight: {
            label: 'Weight',
            data: appState.vitals.weight.slice(-currentTimeScale).map(d => d.value),
            color: getComputedStyle(document.documentElement).getPropertyValue('--chart-weight').trim(),
            yAxisID: 'y1'
        },
        glucose: {
            label: 'Glucose',
            data: appState.vitals.glucose.slice(-currentTimeScale).map(d => d.value),
            color: getComputedStyle(document.documentElement).getPropertyValue('--chart-glucose').trim(),
            yAxisID: 'y'
        }
    };
    
    let maxLength = 0;
    selectedVitals.forEach(vital => {
        const config = vitalConfigs[vital];
        if (config && config.data.length > maxLength) {
            maxLength = config.data.length;
        }
    });
    
    const labels = Array.from({length: maxLength}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (maxLength - 1 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    selectedVitals.forEach(vital => {
        const config = vitalConfigs[vital];
        if (config) {
            datasets.push({
                label: config.label,
                data: config.data,
                borderColor: config.color,
                backgroundColor: config.color + '20',
                tension: 0.4,
                fill: false,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: config.color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                yAxisID: config.yAxisID
            });
        }
    });
    
    vitalsChart.data.labels = labels;
    vitalsChart.data.datasets = datasets;
    vitalsChart.options.plugins.legend.display = true;
    
    if (selectedVitals.includes('weight')) {
        vitalsChart.options.scales.y1 = {
            type: 'linear',
            position: 'right',
            grid: {
                drawOnChartArea: false
            },
            ticks: {
                color: getComputedStyle(document.documentElement)
                    .getPropertyValue('--text-secondary').trim()
            }
        };
    } else {
        delete vitalsChart.options.scales.y1;
    }
    
    vitalsChart.update();
}

// ============================================
// MOTIVATION - DEIDENTIFIED
// ============================================

function displayMotivation() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationQuote').textContent = `"${quote.quote}"`;
    document.getElementById('motivationAuthor').textContent = '';  // No author attribution
}

// ============================================
// ACHIEVEMENTS
// ============================================

function updateAchievements() {
    appState.achievements = achievementDefinitions.filter(achievement => 
        achievement.condition()
    ).map(a => a.id);
    saveData();
    displayAchievements();
}

function displayAchievements() {
    const container = document.getElementById('achievementsGrid');
    
    container.innerHTML = achievementDefinitions.map(achievement => {
        const unlocked = appState.achievements.includes(achievement.id);
        
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" 
                 title="${achievement.name}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-rarity ${achievement.rarity}">${achievement.rarity}</div>
            </div>
        `;
    }).join('');
    
    const totalAchievements = achievementDefinitions.length;
    const unlockedAchievements = appState.achievements.length;
    const percentage = Math.round((unlockedAchievements / totalAchievements) * 100);
    
    const countElement = document.getElementById('achievementCount');
    const progressBar = document.getElementById('achievementProgressBar');
    
    if (countElement) {
        countElement.textContent = `${unlockedAchievements}/${totalAchievements} (${percentage}%)`;
    }
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// ============================================
// EXPORT/IMPORT
// ============================================

function exportAsJSON() {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Data exported as JSON! 📊');
}

function exportAsCSV() {
    let csv = 'Date,Systolic BP,Diastolic BP,Heart Rate,Weight,Glucose\n';
    
    const maxLength = Math.max(
        appState.vitals.bloodPressure.length,
        appState.vitals.heartRate.length,
        appState.vitals.weight.length,
        appState.vitals.glucose.length
    );
    
    for (let i = 0; i < maxLength; i++) {
        const bp = appState.vitals.bloodPressure[i];
        const hr = appState.vitals.heartRate[i];
        const w = appState.vitals.weight[i];
        const g = appState.vitals.glucose[i];
        
        const date = bp?.date || hr?.date || w?.date || g?.date || '';
        const formattedDate = date ? new Date(date).toLocaleDateString() : '';
        
        csv += `${formattedDate},`;
        csv += `${bp ? Math.round(bp.systolic) : ''},`;
        csv += `${bp ? Math.round(bp.diastolic) : ''},`;
        csv += `${hr ? Math.round(hr.value) : ''},`;
        csv += `${w ? Math.round(w.value) : ''},`;
        csv += `${g ? Math.round(g.value) : ''}\n`;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Data exported as CSV! 📄');
}

function importData() {
    const input = document.getElementById('fileInput');
    input.click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            appState = imported;
            saveData();
            refreshDashboard();
            showToast('Data imported successfully! 🎉');
        } catch (error) {
            showToast('Error importing data. Please check the file.', 'error');
        }
    };
    reader.readAsText(file);
}

// ============================================
// DATA TABLE VIEW
// ============================================

let currentTableType = 'bloodPressure';

function openDataTable() {
    openModal('dataTableModal');
    displayDataTable('bloodPressure');
}

function displayDataTable(type) {
    currentTableType = type;
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const tableStats = document.getElementById('tableStats');
    
    document.querySelectorAll('.table-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-table') === type) {
            tab.classList.add('active');
        }
    });
    
    let data = [];
    let headers = [];
    let stats = {};
    
    switch(type) {
        case 'bloodPressure':
            data = appState.vitals.bloodPressure;
            headers = ['Date', 'Time', 'Systolic', 'Diastolic', 'Status'];
            if (data.length > 0) {
                const avgSystolic = data.reduce((sum, d) => sum + d.systolic, 0) / data.length;
                const avgDiastolic = data.reduce((sum, d) => sum + d.diastolic, 0) / data.length;
                const maxSystolic = Math.max(...data.map(d => d.systolic));
                const minSystolic = Math.min(...data.map(d => d.systolic));
                stats = {
                    'Total Readings': data.length,
                    'Avg Systolic': Math.round(avgSystolic) + ' mmHg',
                    'Avg Diastolic': Math.round(avgDiastolic) + ' mmHg',
                    'Max Systolic': Math.round(maxSystolic) + ' mmHg',
                    'Min Systolic': Math.round(minSystolic) + ' mmHg'
                };
            }
            break;
        case 'heartRate':
            data = appState.vitals.heartRate;
            headers = ['Date', 'Time', 'Heart Rate', 'Status'];
            if (data.length > 0) {
                const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;
                const max = Math.max(...data.map(d => d.value));
                const min = Math.min(...data.map(d => d.value));
                stats = {
                    'Total Readings': data.length,
                    'Average': Math.round(avg) + ' bpm',
                    'Maximum': Math.round(max) + ' bpm',
                    'Minimum': Math.round(min) + ' bpm'
                };
            }
            break;
        case 'weight':
            data = appState.vitals.weight;
            headers = ['Date', 'Time', 'Weight', 'Change'];
            if (data.length > 0) {
                const current = data[data.length - 1].value;
                const start = data[0].value;
                const change = current - start;
                const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;
                stats = {
                    'Total Readings': data.length,
                    'Current': current.toFixed(1) + ' lbs',
                    'Average': avg.toFixed(1) + ' lbs',
                    'Total Change': (change >= 0 ? '+' : '') + change.toFixed(1) + ' lbs'
                };
            }
            break;
        case 'glucose':
            data = appState.vitals.glucose;
            headers = ['Date', 'Time', 'Glucose', 'Status'];
            if (data.length > 0) {
                const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;
                const max = Math.max(...data.map(d => d.value));
                const min = Math.min(...data.map(d => d.value));
                stats = {
                    'Total Readings': data.length,
                    'Average': Math.round(avg) + ' mg/dL',
                    'Maximum': Math.round(max) + ' mg/dL',
                    'Minimum': Math.round(min) + ' mg/dL'
                };
            }
            break;
    }
    
    tableHead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="table-empty">No data recorded yet</td></tr>';
        tableStats.innerHTML = '';
        return;
    }
    
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tableBody.innerHTML = sortedData.map(item => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        switch(type) {
            case 'bloodPressure':
                const bpStatus = item.systolic < 120 && item.diastolic < 80 ? '✅ Normal' :
                               item.systolic < 130 && item.diastolic < 80 ? '⚠️ Elevated' :
                               '🔴 High';
                return `<tr>
                    <td>${dateStr}</td>
                    <td>${timeStr}</td>
                    <td><strong>${Math.round(item.systolic)}</strong></td>
                    <td><strong>${Math.round(item.diastolic)}</strong></td>
                    <td>${bpStatus}</td>
                </tr>`;
            case 'heartRate':
                const hrStatus = item.value >= 60 && item.value <= 100 ? '✅ Normal' :
                               item.value < 60 ? '⚠️ Low' : '🔴 High';
                return `<tr>
                    <td>${dateStr}</td>
                    <td>${timeStr}</td>
                    <td><strong>${Math.round(item.value)} bpm</strong></td>
                    <td>${hrStatus}</td>
                </tr>`;
            case 'weight':
                const index = data.indexOf(item);
                const prevWeight = index > 0 ? data[index - 1].value : item.value;
                const weightChange = item.value - prevWeight;
                const changeStr = weightChange === 0 ? '—' : 
                                (weightChange > 0 ? '↗️ +' : '↘️ ') + Math.abs(weightChange).toFixed(1) + ' lbs';
                return `<tr>
                    <td>${dateStr}</td>
                    <td>${timeStr}</td>
                    <td><strong>${item.value.toFixed(1)} lbs</strong></td>
                    <td>${changeStr}</td>
                </tr>`;
            case 'glucose':
                const glucoseStatus = item.value >= 70 && item.value <= 100 ? '✅ Normal' :
                                    item.value < 70 ? '⚠️ Low' : '🔴 High';
                return `<tr>
                    <td>${dateStr}</td>
                    <td>${timeStr}</td>
                    <td><strong>${Math.round(item.value)} mg/dL</strong></td>
                    <td>${glucoseStatus}</td>
                </tr>`;
        }
    }).join('');
    
    tableStats.innerHTML = Object.entries(stats).map(([label, value]) => `
        <div class="stat-item">
            <div class="stat-item-label">${label}</div>
            <div class="stat-item-value">${value}</div>
        </div>
    `).join('');
}

function exportTableAsCSV() {
    const type = currentTableType;
    let csv = '';
    let data = [];
    
    switch(type) {
        case 'bloodPressure':
            csv = 'Date,Time,Systolic (mmHg),Diastolic (mmHg),Status\n';
            data = appState.vitals.bloodPressure;
            data.forEach(item => {
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString();
                const status = item.systolic < 120 && item.diastolic < 80 ? 'Normal' :
                             item.systolic < 130 && item.diastolic < 80 ? 'Elevated' : 'High';
                csv += `${dateStr},${timeStr},${Math.round(item.systolic)},${Math.round(item.diastolic)},${status}\n`;
            });
            break;
        case 'heartRate':
            csv = 'Date,Time,Heart Rate (bpm),Status\n';
            data = appState.vitals.heartRate;
            data.forEach(item => {
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString();
                const status = item.value >= 60 && item.value <= 100 ? 'Normal' :
                             item.value < 60 ? 'Low' : 'High';
                csv += `${dateStr},${timeStr},${Math.round(item.value)},${status}\n`;
            });
            break;
        case 'weight':
            csv = 'Date,Time,Weight (lbs)\n';
            data = appState.vitals.weight;
            data.forEach(item => {
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString();
                csv += `${dateStr},${timeStr},${item.value.toFixed(1)}\n`;
            });
            break;
        case 'glucose':
            csv = 'Date,Time,Glucose (mg/dL),Status\n';
            data = appState.vitals.glucose;
            data.forEach(item => {
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString();
                const status = item.value >= 70 && item.value <= 100 ? 'Normal' :
                             item.value < 70 ? 'Low' : 'High';
                csv += `${dateStr},${timeStr},${Math.round(item.value)},${status}\n`;
            });
            break;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast(`${type} data exported! 📊`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function refreshDashboard() {
    updateQuickStats();
    displayStreak();
    displayAIInsights();
    displayMedications();
    displayAppointments();
    displayGoals();
    displayMotivation();
    updateAchievements();
    if (vitalsChart) {
        const currentType = document.getElementById('chartSelector').value;
        updateChart(currentType);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initTheme();
    initChart();
    refreshDashboard();
    
    checkFirstVisit();
    
    // Onboarding
    document.getElementById('nextStep').addEventListener('click', nextOnboardingStep);
    document.getElementById('prevStep').addEventListener('click', prevOnboardingStep);
    document.getElementById('skipOnboarding').addEventListener('click', skipOnboarding);
    document.getElementById('loadSampleDataBtn').addEventListener('click', completeOnboardingWithSampleData);
    document.getElementById('startFreshBtn').addEventListener('click', completeOnboardingFresh);
    
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index < totalOnboardingSteps) {
                currentOnboardingStep = index;
                updateOnboardingStep();
            }
        });
    });
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Menu
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    document.getElementById('viewTutorial').addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
        viewTutorial();
    });
    document.getElementById('viewDataTable').addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
        openDataTable();
    });
    document.getElementById('exportJson').addEventListener('click', exportAsJSON);
    document.getElementById('exportCsv').addEventListener('click', exportAsCSV);
    document.getElementById('importData').addEventListener('click', importData);
    document.getElementById('resetData').addEventListener('click', () => {
        if (confirm('This will replace your current data with sample data. Continue?')) {
            generateSampleData();
        }
    });
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
    
    document.querySelectorAll('.table-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            displayDataTable(tab.getAttribute('data-table'));
        });
    });
    document.getElementById('exportTableCsv').addEventListener('click', exportTableAsCSV);
    
    document.getElementById('addMedicationBtn').addEventListener('click', () => openModal('medicationModal'));
    document.getElementById('addAppointmentBtn').addEventListener('click', () => openModal('appointmentModal'));
    document.getElementById('addGoalBtn').addEventListener('click', () => openModal('goalModal'));
    
    document.getElementById('logTodayVitalsBtn').addEventListener('click', () => {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('vitalsDateTime').value = localDateTime;
        openModal('vitalsModal');
    });
    
    document.getElementById('addVitalsBtn').addEventListener('click', () => {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('vitalsDateTime').value = localDateTime;
        openModal('vitalsModal');
    });
    
    document.getElementById('saveMedication').addEventListener('click', addMedication);
    document.getElementById('saveAppointment').addEventListener('click', addAppointment);
    document.getElementById('saveGoal').addEventListener('click', addGoal);
    document.getElementById('saveVitals').addEventListener('click', addVitals);
    
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.getAttribute('data-modal'));
        });
    });
    
    document.getElementById('chartSelector').addEventListener('change', (e) => {
        if (!overlayMode) {
            updateChart(e.target.value);
        }
    });
    
    document.querySelectorAll('.time-scale-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.time-scale-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTimeScale = parseInt(e.target.dataset.days);
            const chartType = document.getElementById('chartSelector').value;
            updateChart(chartType);
        });
    });
    
    document.getElementById('overlayToggle').addEventListener('click', () => {
        overlayMode = !overlayMode;
        const overlaySelector = document.getElementById('overlaySelector');
        const chartSelector = document.getElementById('chartSelector');
        
        if (overlayMode) {
            overlaySelector.style.display = 'flex';
            chartSelector.disabled = true;
            chartSelector.style.opacity = '0.5';
            updateOverlayChart();
        } else {
            overlaySelector.style.display = 'none';
            chartSelector.disabled = false;
            chartSelector.style.opacity = '1';
            document.querySelectorAll('.overlay-option').forEach(cb => cb.checked = false);
            updateChart(chartSelector.value);
        }
    });
    
    document.querySelectorAll('.overlay-option').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateOverlayChart();
        });
    });
    
    document.getElementById('refreshQuote').addEventListener('click', displayMotivation);
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

window.toggleMedication = toggleMedication;
