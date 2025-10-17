# 🎨 EmberMate Visual Guide - New Features

## 📋 Data Table View - Visual Walkthrough

### Opening the Data Table

**Step 1: Click Settings Menu**
```
┌──────────────────────────────────────┐
│  🔥 EmberMate              🌙  ⚙️   │  ← Click here
└──────────────────────────────────────┘
```

**Step 2: Dropdown Menu Appears**
```
                        ┌─────────────────────┐
                        │ 🎓 View Tutorial    │ ← NEW!
                        │ 📋 View Data Table  │ ← Click this
                        │ 📊 Export as JSON   │
                        │ 📄 Export as CSV    │
                        │ 📥 Import Data      │
                        │ 🔄 Load Sample Data │
                        └─────────────────────┘
```

---

## 📊 Blood Pressure Table View

### Full Table Layout
```
╔════════════════════════════════════════════════════════════════════════╗
║                     📋 Data Table View                              ×  ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  ┌────────────┬────────────┬────────────┬────────────┐                ║
║  │ [BP Active]│ Heart Rate │   Weight   │  Glucose   │ [Export CSV]  ║
║  └────────────┴────────────┴────────────┴────────────┘                ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────────┐  ║
║  │ Date       │ Time  │ Systolic │ Diastolic │ Status             │  ║
║  ├─────────────────────────────────────────────────────────────────┤  ║
║  │ Jan 15, 25 │ 8:00  │   120    │    80     │ ✅ Normal          │  ║
║  │ Jan 14, 25 │ 8:15  │   118    │    76     │ ✅ Normal          │  ║
║  │ Jan 13, 25 │ 8:30  │   125    │    82     │ ⚠️ Elevated        │  ║
║  │ Jan 12, 25 │ 8:00  │   132    │    85     │ 🔴 High            │  ║
║  │ Jan 11, 25 │ 8:45  │   119    │    78     │ ✅ Normal          │  ║
║  │ Jan 10, 25 │ 8:20  │   121    │    79     │ ✅ Normal          │  ║
║  │ Jan 09, 25 │ 8:10  │   117    │    75     │ ✅ Normal          │  ║
║  │ Jan 08, 25 │ 8:00  │   123    │    81     │ ⚠️ Elevated        │  ║
║  │    ...     │  ...  │   ...    │    ...    │    ...             │  ║
║  └─────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║  ╔═══════════════════════════════════════════════════════════════╗   ║
║  ║  Total Readings: 30  │  Avg: 122/79  │  Max: 135  │  Min: 115 ║   ║
║  ╚═══════════════════════════════════════════════════════════════╝   ║
║                                                                         ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Status Color Legend
- ✅ **Green** = Normal (Systolic < 120 AND Diastolic < 80)
- ⚠️ **Yellow** = Elevated (Systolic 120-129 AND Diastolic < 80)
- 🔴 **Red** = High (Systolic ≥ 130 OR Diastolic ≥ 80)

---

## ❤️ Heart Rate Table View

```
╔════════════════════════════════════════════════════════════════════════╗
║                     📋 Data Table View                              ×  ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  ┌────────────┬────────────┬────────────┬────────────┐                ║
║  │ Blood Pres │[HR Active] │   Weight   │  Glucose   │ [Export CSV]  ║
║  └────────────┴────────────┴────────────┴────────────┘                ║
║                                                                         ║
║  ┌──────────────────────────────────────────────────────────────┐     ║
║  │ Date       │ Time  │ Heart Rate │ Status                     │     ║
║  ├──────────────────────────────────────────────────────────────┤     ║
║  │ Jan 15, 25 │ 8:00  │   72 bpm   │ ✅ Normal                  │     ║
║  │ Jan 14, 25 │ 8:15  │   68 bpm   │ ✅ Normal                  │     ║
║  │ Jan 13, 25 │ 8:30  │   75 bpm   │ ✅ Normal                  │     ║
║  │ Jan 12, 25 │ 8:00  │   82 bpm   │ ✅ Normal                  │     ║
║  │ Jan 11, 25 │ 8:45  │   58 bpm   │ ⚠️ Low                     │     ║
║  │ Jan 10, 25 │ 8:20  │   105 bpm  │ 🔴 High                    │     ║
║  │ Jan 09, 25 │ 8:10  │   70 bpm   │ ✅ Normal                  │     ║
║  │ Jan 08, 25 │ 8:00  │   73 bpm   │ ✅ Normal                  │     ║
║  │    ...     │  ...  │    ...     │    ...                     │     ║
║  └──────────────────────────────────────────────────────────────┘     ║
║                                                                         ║
║  ╔═══════════════════════════════════════════════════════════════╗   ║
║  ║  Total: 30  │  Average: 72 bpm  │  Max: 105  │  Min: 58      ║   ║
║  ╚═══════════════════════════════════════════════════════════════╝   ║
║                                                                         ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Status Criteria
- ✅ **Normal** = 60-100 bpm
- ⚠️ **Low** = < 60 bpm
- 🔴 **High** = > 100 bpm

---

## ⚖️ Weight Table View

```
╔════════════════════════════════════════════════════════════════════════╗
║                     📋 Data Table View                              ×  ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  ┌────────────┬────────────┬────────────┬────────────┐                ║
║  │ Blood Pres │ Heart Rate │[Wt Active] │  Glucose   │ [Export CSV]  ║
║  └────────────┴────────────┴────────────┴────────────┘                ║
║                                                                         ║
║  ┌──────────────────────────────────────────────────────────────┐     ║
║  │ Date       │ Time  │ Weight     │ Change                     │     ║
║  ├──────────────────────────────────────────────────────────────┤     ║
║  │ Jan 15, 25 │ 8:00  │ 172.5 lbs  │ ↘️ -0.5 lbs                │     ║
║  │ Jan 14, 25 │ 8:15  │ 173.0 lbs  │ ↘️ -0.3 lbs                │     ║
║  │ Jan 13, 25 │ 8:30  │ 173.3 lbs  │ ↘️ -0.2 lbs                │     ║
║  │ Jan 12, 25 │ 8:00  │ 173.5 lbs  │ —                          │     ║
║  │ Jan 11, 25 │ 8:45  │ 173.5 lbs  │ ↘️ -0.4 lbs                │     ║
║  │ Jan 10, 25 │ 8:20  │ 173.9 lbs  │ ↗️ +0.2 lbs                │     ║
║  │ Jan 09, 25 │ 8:10  │ 173.7 lbs  │ ↘️ -0.6 lbs                │     ║
║  │ Jan 08, 25 │ 8:00  │ 174.3 lbs  │ ↘️ -0.3 lbs                │     ║
║  │    ...     │  ...  │    ...     │    ...                     │     ║
║  └──────────────────────────────────────────────────────────────┘     ║
║                                                                         ║
║  ╔═══════════════════════════════════════════════════════════════╗   ║
║  ║  Total: 30  │  Current: 172.5  │  Avg: 173.4  │  Change: -2.8 ║   ║
║  ╚═══════════════════════════════════════════════════════════════╝   ║
║                                                                         ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Change Indicators
- ↗️ = Weight increased
- ↘️ = Weight decreased
- — = No change from previous

---

## 🩸 Glucose Table View

```
╔════════════════════════════════════════════════════════════════════════╗
║                     📋 Data Table View                              ×  ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  ┌────────────┬────────────┬────────────┬────────────┐                ║
║  │ Blood Pres │ Heart Rate │   Weight   │[Gluc Actv] │ [Export CSV]  ║
║  └────────────┴────────────┴────────────┴────────────┘                ║
║                                                                         ║
║  ┌──────────────────────────────────────────────────────────────┐     ║
║  │ Date       │ Time  │ Glucose    │ Status                     │     ║
║  ├──────────────────────────────────────────────────────────────┤     ║
║  │ Jan 15, 25 │ 8:00  │  95 mg/dL  │ ✅ Normal                  │     ║
║  │ Jan 14, 25 │ 8:15  │  92 mg/dL  │ ✅ Normal                  │     ║
║  │ Jan 13, 25 │ 8:30  │  88 mg/dL  │ ✅ Normal                  │     ║
║  │ Jan 12, 25 │ 8:00  │  98 mg/dL  │ ✅ Normal                  │     ║
║  │ Jan 11, 25 │ 8:45  │  65 mg/dL  │ ⚠️ Low                     │     ║
║  │ Jan 10, 25 │ 8:20  │ 112 mg/dL  │ 🔴 High                    │     ║
║  │ Jan 09, 25 │ 8:10  │  94 mg/dL  │ ✅ Normal                  │     ║
║  │ Jan 08, 25 │ 8:00  │  90 mg/dL  │ ✅ Normal                  │     ║
║  │    ...     │  ...  │    ...     │    ...                     │     ║
║  └──────────────────────────────────────────────────────────────┘     ║
║                                                                         ║
║  ╔═══════════════════════════════════════════════════════════════╗   ║
║  ║  Total: 30  │  Average: 93  │  Maximum: 112  │  Minimum: 65  ║   ║
║  ╚═══════════════════════════════════════════════════════════════╝   ║
║                                                                         ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Status Criteria
- ✅ **Normal** = 70-100 mg/dL
- ⚠️ **Low** = < 70 mg/dL
- 🔴 **High** = > 100 mg/dL

---

## 🎓 Tutorial Access - Visual Flow

### From Main Dashboard
```
Step 1: Dashboard View
┌───────────────────────────────────────────────┐
│  🔥 EmberMate                      🌙  ⚙️    │
├───────────────────────────────────────────────┤
│                                                │
│  Welcome back! 👋                             │
│                                                │
│  [Dashboard widgets...]                       │
└───────────────────────────────────────────────┘
                                         ↓ Click gear icon
```

```
Step 2: Menu Opens
                              ┌──────────────────┐
                              │ 🎓 View Tutorial │ ← Click here
                              │ 📋 View Data Tbl │
                              │ 📊 Export JSON   │
                              │ 📄 Export CSV    │
                              │ 📥 Import Data   │
                              │ 🔄 Sample Data   │
                              └──────────────────┘
                                        ↓
```

```
Step 3: Tutorial Opens
╔═══════════════════════════════════════════════════════╗
║                                                        ║
║              ● ○ ○ ○ ○  (Step indicators)            ║
║                                                        ║
║                     🔥                                 ║
║                                                        ║
║           Welcome to EmberMate!                       ║
║                                                        ║
║  Your personal health companion is here to help       ║
║  you track, understand, and improve your health       ║
║  journey.                                             ║
║                                                        ║
║  ┌──────────┬──────────┐  ┌──────────┬──────────┐   ║
║  │ 📊       │ 🤖       │  │ 🏆       │ 🔥       │   ║
║  │ Track    │ Get AI   │  │ Unlock   │ Build    │   ║
║  │ vitals   │ insights │  │ achieve  │ streaks  │   ║
║  └──────────┴──────────┘  └──────────┴──────────┘   ║
║                                                        ║
║  Let's take a quick tour! (2 minutes)                 ║
║                                                        ║
║  [Skip Tour]              [← Back]  [Next →]         ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```

---

## 📥 Import Data Flow

### Visual Steps
```
Step 1: Click Import
┌─────────────────────┐
│ 📥 Import Data      │ ← Click this
└─────────────────────┘
         ↓

Step 2: File Picker Opens
┌──────────────────────────────────┐
│  Select a file to upload         │
│                                   │
│  📁 Documents                     │
│    └─ embermate_backup.json  ✓   │
│                                   │
│         [Cancel]  [Open]          │
└──────────────────────────────────┘
         ↓

Step 3: Confirmation
┌────────────────────────────────────┐
│  ⚠️  Import Data?                  │
│                                    │
│  This will replace all current     │
│  data. Make sure you have a        │
│  backup first!                     │
│                                    │
│      [Cancel]  [Import]            │
└────────────────────────────────────┘
         ↓

Step 4: Success!
┌────────────────────────────────────┐
│  ✅ Data imported successfully! 🎉 │
└────────────────────────────────────┘
```

---

## 📊 Export Table CSV - Visual Flow

```
Step 1: Open Data Table
Settings → View Data Table

Step 2: Select Vital Type
[Blood Pressure] ← Active tab shows data

Step 3: Click Export
                    ┌─────────────────┐
                    │ Export to CSV   │ ← Click this
                    └─────────────────┘

Step 4: File Downloads
📥 embermate_bloodPressure_2025-01-15.csv downloaded!

Step 5: Open in Excel/Sheets
┌──────────────────────────────────────────────────┐
│ A           B       C          D         E       │
├──────────────────────────────────────────────────┤
│ Date        Time    Systolic   Diastolic Status  │
│ 1/15/2025   8:00    120        80        Normal  │
│ 1/14/2025   8:15    118        76        Normal  │
│ 1/13/2025   8:30    125        82        Elevated│
└──────────────────────────────────────────────────┘
```

---

## 📱 Mobile View

### Data Table on Phone
```
┌─────────────────────────┐
│  📋 Data Table      ×   │
├─────────────────────────┤
│                         │
│ [BP] [HR] [Wt] [Gluc]  │
│                         │
│ [Export CSV]            │
│                         │
│ ◄ Scroll horizontally ► │
│ ┌───────────────────┐   │
│ │ Date  │ Time │ ...│   │
│ ├───────────────────┤   │
│ │ Jan15 │ 8:00 │ ...│   │
│ │ Jan14 │ 8:15 │ ...│   │
│ └───────────────────┘   │
│                         │
│ Stats: 30 readings      │
│        Avg: 120/78      │
│                         │
└─────────────────────────┘
```

### Tutorial on Phone
```
┌───────────────────┐
│                   │
│  ● ○ ○ ○ ○       │
│                   │
│      🔥           │
│                   │
│  Welcome to       │
│  EmberMate!       │
│                   │
│  Your personal    │
│  health           │
│  companion        │
│                   │
│  [Skip]           │
│                   │
│  [← Back]  [Next]│
│                   │
└───────────────────┘
```

---

## 🎨 Color Scheme

### Status Colors
```
✅ Normal/Healthy:
   RGB: (107, 207, 127)
   HEX: #6bcf7f
   
⚠️ Warning/Elevated:
   RGB: (255, 190, 11)
   HEX: #ffbe0b
   
🔴 High/Concerning:
   RGB: (255, 0, 110)
   HEX: #ff006e
```

### Button Colors
```
Primary (Orange):
   RGB: (255, 107, 53)
   HEX: #ff6b35
   
Secondary (Teal):
   RGB: (78, 205, 196)
   HEX: #4ecdc4
```

---

## 🖱️ Interactive Elements

### Hover Effects

**Table Rows:**
```
Before hover:
┌────────────────────────────┐
│ Jan 15 │ 8:00 │ 120/80     │
└────────────────────────────┘

On hover:
┌────────────────────────────┐
│ Jan 15 │ 8:00 │ 120/80     │ ← Background changes
└────────────────────────────┘
```

**Tabs:**
```
Inactive:     Active:
┌─────────┐   ┌─────────┐
│   BP    │   │   BP    │ ← Orange background
└─────────┘   └─────────┘
```

**Export Button:**
```
Normal:           Hover:
[Export CSV]  →   [Export CSV] ← Slightly darker + scale
```

---

## 📐 Layout Measurements

### Modal Sizes
```
Desktop:
- Width: 900px max
- Height: 90vh max
- Padding: 24px

Mobile:
- Width: 95%
- Height: 90vh max
- Padding: 16px
```

### Table Dimensions
```
Column Widths:
- Date: 120px
- Time: 80px
- Value: 100px
- Status: 120px

Row Height:
- Header: 48px
- Body: 44px

Font Sizes:
- Header: 14px bold
- Body: 14px regular
- Stats: 16px bold
```

---

## 🎯 User Journey Map

### New User Path
```
1. First Visit
   ↓
2. Onboarding Shows Automatically
   ↓
3. Learn Features (5 steps)
   ↓
4. Choose: Sample Data or Start Fresh
   ↓
5. Explore Dashboard
   ↓
6. Need Help? → Settings → View Tutorial
```

### Existing User Path
```
1. Return to App
   ↓
2. Dashboard loads
   ↓
3. Need refresher? → Settings → Tutorial
   ↓
4. View data table? → Settings → Data Table
   ↓
5. Export for doctor? → Data Table → Export CSV
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ├─────→ Add Vitals
       │         ↓
       │      LocalStorage
       │         ↓
       ├─────→ View Dashboard (Charts)
       │         ↓
       ├─────→ View Data Table (Tables)
       │         ↓
       └─────→ Export
                 ↓
              CSV/JSON File
                 ↓
              ┌──────────────┐
              │ Doctor/      │
              │ Spreadsheet  │
              └──────────────┘
```

---

## 🎨 Before/After Comparison

### Settings Menu - Before
```
┌─────────────────────┐
│ 📊 Export as JSON   │
│ 📄 Export as CSV    │
│ 📥 Import Data      │
│ 🔄 Load Sample Data │
└─────────────────────┘

4 options total
```

### Settings Menu - After
```
┌─────────────────────┐
│ 🎓 View Tutorial    │ ← NEW!
│ 📋 View Data Table  │ ← NEW!
│ 📊 Export as JSON   │
│ 📄 Export as CSV    │
│ 📥 Import Data      │
│ 🔄 Load Sample Data │
└─────────────────────┘

6 options total
```

---

## 💡 Visual Tips

### Understanding Status Indicators

**Blood Pressure:**
```
✅ 115/75  ← Ideal range
⚠️ 125/75  ← Watch closely
🔴 135/85  ← Consult doctor
```

**Heart Rate:**
```
⚠️ 55 bpm  ← Below normal
✅ 72 bpm  ← Perfect
🔴 108 bpm ← Elevated
```

**Weight:**
```
↘️ -2.5 lbs ← Losing weight
—  0.0 lbs  ← Stable
↗️ +1.2 lbs ← Gaining weight
```

**Glucose:**
```
⚠️ 65 mg/dL ← Low
✅ 92 mg/dL ← Normal
🔴 115 mg/dL ← High
```

---

## 🚀 Quick Actions Guide

### Most Common Tasks

**View Tutorial:**
```
⚙️ → 🎓 (2 clicks)
```

**View All Blood Pressure:**
```
⚙️ → 📋 → Blood Pressure tab (3 clicks)
```

**Export BP for Doctor:**
```
⚙️ → 📋 → BP tab → Export CSV (4 clicks)
```

**Import Backup:**
```
⚙️ → 📥 → Select file (3 clicks)
```

---

**End of Visual Guide** 🎨

All visuals use ASCII art for clarity and work in any text viewer!
