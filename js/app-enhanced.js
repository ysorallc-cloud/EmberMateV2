
/**
 * EmberMateV2: Sample Data + Safe Onboarding Add-on
 * Drop-in script that ONLY adds data to existing localStorage keys.
 * Does not change your HTML layout, IDs, or app structure.
 *
 * Usage (recommended):
 *   <script src="./js/app-enhanced.js"></script>
 *   <script src="./js/app.js"></script>
 *
 * Then either append ?demo=1 to your URL or run:
 *   window.EmberMate.loadSampleData();
 * {
  const NS = "EmberMate";
  const ls = window.localStorage;

  function safeParse(key, fallback) {
    try { return JSON.parse(ls.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function safeSet(key, value) {
    ls.setItem(key, JSON.stringify(value));
  }
  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(8,0,0,0);
    return d;
  }
  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }

  const Sample = {
    generateUserSettings() {
      return {
        name: "Sarah Johnson",
        dob: "1990-01-15",
        heightInches: 66,
        bloodType: "O+",
        targetWeight: 145,
        targetDate: addDays(new Date(), 60).toISOString().slice(0,10),
        notifications: { meds: true, vitals: true, goals: true },
        theme: "light",
        lastUpdated: new Date().toISOString()
      };
    },
    generateMedications() {
      const meds = [
        { id: "med-001", name: "Lisinopril", dosage: "10mg", frequency: "daily", time: "08:00", purpose: "Blood pressure", prescribedBy: "Dr. Martinez", startDate: "2025-07-12", active: true, refillDate: "2025-11-15", notes: "Take with breakfast" },
        { id: "med-002", name: "Metformin", dosage: "500mg", frequency: "twice_daily", time: "08:00,20:00", purpose: "Pre-diabetes", prescribedBy: "Dr. Nguyen", startDate: "2025-05-01", active: true, refillDate: "2025-11-08", notes: "" },
        { id: "med-003", name: "Atorvastatin", dosage: "20mg", frequency: "daily", time: "21:00", purpose: "Cholesterol", prescribedBy: "Dr. Lee", startDate: "2025-03-20", active: true, refillDate: "2025-12-01", notes: "Evening" },
        { id: "med-004", name: "Vitamin D3", dosage: "2000 IU", frequency: "daily", time: "09:00", purpose: "Supplement", prescribedBy: "Self", startDate: "2025-01-01", active: true, refillDate: "2026-01-01", notes: "" },
        { id: "med-005", name: "Cetirizine", dosage: "10mg", frequency: "as_needed", time: "", purpose: "Allergies", prescribedBy: "OTC", startDate: "2024-09-01", active: true, refillDate: "", notes: "Take if needed" }
      ];
      return meds;
    },
    generateVitals(days=60) {
      const res = [];
      for (let i = days; i >= 0; i--) {
        const date = daysAgo(i);
        const systolic = 118 + Math.floor(Math.random()*12); // 118-129
        const diastolic = 74 + Math.floor(Math.random()*10); // 74-83
        const heartRate = 62 + Math.floor(Math.random()*18); // 62-79
        const temperature = +(97.8 + Math.random()*1.4).toFixed(1);
        res.push({
          id: `vital-${date.getTime()}`,
          date: date.toISOString(),
          systolic, diastolic, heartRate, temperature,
          notes: i % 7 === 0 ? "Morning reading after walk" : ""
        });
      }
      return res;
    },
    generateWeight(days=90) {
      const res = [];
      let weight = 160;
      for (let i = days; i >= 0; i--) {
        const date = daysAgo(i);
        weight += (Math.random() - 0.55); // gentle trend down
        res.push({
          id: `weight-${date.getTime()}`,
          date: date.toISOString(),
          weight: +weight.toFixed(1),
          notes: i % 10 === 0 ? "Weighed after breakfast" : ""
        });
      }
      return res;
    },
    generateSymptoms() {
      const pool = [
        { name: "Headache", severity: 2, note: "Mild, resolved with water" },
        { name: "Nausea", severity: 1, note: "Short episode, no meds" },
        { name: "Fatigue", severity: 3, note: "After late night" },
        { name: "Dizziness", severity: 2, note: "Stood up too fast" },
        { name: "Allergy", severity: 1, note: "Seasonal" }
      ];
      const res = [];
      for (let i = 0; i < 15; i++) {
        const d = daysAgo( Math.floor(Math.random()*45) );
        const s = pool[Math.floor(Math.random()*pool.length)];
        res.push({
          id: `sym-${d.getTime()}-${i}`,
          date: d.toISOString(),
          symptom: s.name,
          severity: s.severity,
          notes: s.note
        });
      }
      return res.sort((a,b)=> a.date.localeCompare(b.date));
    },
    generateGoals() {
      return [
        { id: "goal-001", name: "Reach Target Weight", description: "Lose 15 pounds through diet and exercise", targetDate: addDays(new Date(), 60).toISOString().slice(0,10), targetValue: 145, currentValue: 153.2, unit: "lbs", category: "weight", progress: 60, completed: false, createdDate: daysAgo(75).toISOString() },
        { id: "goal-002", name: "Walk 8,000 steps daily", description: "Sustain daily step habit", targetDate: addDays(new Date(), 30).toISOString().slice(0,10), targetValue: 8000, currentValue: 7200, unit: "steps", category: "activity", progress: 72, completed: false, createdDate: daysAgo(40).toISOString() },
        { id: "goal-003", name: "Sleep 7+ hours", description: "Consistent sleep routine", targetDate: addDays(new Date(), 21).toISOString().slice(0,10), targetValue: 7, currentValue: 6.6, unit: "hours", category: "sleep", progress: 66, completed: false, createdDate: daysAgo(35).toISOString() }
      ];
    },
    generateMedicationLogs(days=30) {
      const logs = [];
      const meds = this.generateMedications();
      for (let i = days; i >= 0; i--) {
        const d = daysAgo(i);
        meds.forEach(m => {
          // 95% adherence
          const taken = Math.random() > 0.05;
          logs.push({
            id: `log-${m.id}-${d.getTime()}`,
            medId: m.id,
            date: d.toISOString(),
            taken,
            notes: taken ? "" : "Missed dose"
          });
        });
      }
      return logs;
    },
    generateAchievements() {
      return [
        { id: "achv-001", name: "First Login", earned: true, earnedDate: daysAgo(89).toISOString() },
        { id: "achv-002", name: "Logged 7 Days in a Row", earned: true, earnedDate: daysAgo(60).toISOString() },
        { id: "achv-003", name: "100% Med Adherence (30d)", earned: true, earnedDate: daysAgo(2).toISOString() },
        { id: "achv-004", name: "Goal Streak: 14 days", earned: true, earnedDate: daysAgo(10).toISOString() }
      ];
    },
    dataset() {
      return {
        settings: this.generateUserSettings(),
        medications: this.generateMedications(),
        vitals: this.generateVitals(),
        weight: this.generateWeight(),
        symptoms: this.generateSymptoms(),
        goals: this.generateGoals(),
        medicationLogs: this.generateMedicationLogs(),
        achievements: this.generateAchievements()
      };
    }
  };

  // Only add to existing fields and keys. If arrays already exist, append unique items.
  function mergeData(existing, incoming) {
    const result = { ...existing };
    for (const [key, value] of Object.entries(incoming)) {
      const prev = existing[key];
      if (Array.isArray(prev) && Array.isArray(value)) {
        const seen = new Set(prev.map(x => x.id ?? JSON.stringify(x)));
        const merged = prev.slice();
        value.forEach(item => {
          const id = item.id ?? JSON.stringify(item);
          if (!seen.has(id)) merged.push(item);
        });
        result[key] = merged;
      } else if (prev && typeof prev === "object" && typeof value === "object") {
        result[key] = { ...value, ...prev }; // keep existing user overrides
      } else if (prev == null) {
        result[key] = value;
      } else {
        // keep existing primitive
        result[key] = prev;
      }
    }
    return result;
  }

  function loadSampleData(force=false) {
    const keys = [
      "settings",
      "medications",
      "vitals",
      "weight",
      "symptoms",
      "goals",
      "medicationLogs",
      "achievements"
    ];

    const existing = {};
    keys.forEach(k => existing[k] = safeParse(k, Array.isArray(Sample.dataset()[k]) ? [] : null));

    const merged = mergeData(existing, Sample.dataset());
    keys.forEach(k => safeSet(k, merged[k]));

    // Helpful breadcrumbs for the host app
    safeSet(NS + ":sampleLoadedAt", new Date().toISOString());
    if (force) safeSet(NS + ":force", true);
    console.info("[EmberMate] Sample data loaded");
  }

  // Public API
  window.EmberMate = window.EmberMate || {};
  window.EmberMate.loadSampleData = () => loadSampleData(true);

  // Auto-load for demo URLs or first-time users (non-destructive)
  const url = new URL(window.location.href);
  const wantsDemo = url.searchParams.get("demo") === "1";
  const firstRun = !ls.getItem(NS + ":onboarded");
  if (wantsDemo || firstRun) {
    loadSampleData(false);
  }

  // Onboarding helper (optional, no DOM coupling)
  window.addEventListener("load", () => {
    try {
      if (!ls.getItem(NS + ":onboarded")) {
        ls.setItem(NS + ":onboarded", "true");
        console.info("[EmberMate] Onboarding marker set. No UI changes applied.");
      }
    } catch(e) { /* ignore */ }
  });
})();
