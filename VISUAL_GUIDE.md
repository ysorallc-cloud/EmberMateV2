# 🎨 EmberMate Visual Guide

## 📂 Project Structure

```
EmberMate/
│
├── 🌐 LANDING PAGE
│   ├── landing.html          → Beautiful entry point
│   ├── landing-styles.css    → Champagne + modern styling
│   └── landing.js            → Mobile menu & smooth scroll
│
├── 💚 DASHBOARD APP
│   ├── index.html            → Main health tracking interface
│   ├── styles.css            → All dashboard styles
│   └── app.js                → Full functionality
│
└── 📚 DOCUMENTATION
    ├── PROJECT_SUMMARY.md         → Complete overview
    ├── LANDING_PAGE_README.md     → Landing page details
    ├── UPDATED_FIXES.md           → Recent fixes
    └── CHANGES_SUMMARY.md         → Initial changes
```

## 🎯 Design Features

### Landing Page (landing.html)

```
┌─────────────────────────────────────────┐
│  💚 EmberMate         [Try Demo] ──────┼─ Fixed nav
├─────────────────────────────────────────┤
│                                         │
│  Health tracking shouldn't              │
│  feel like another chore                │ ← Hero
│                                         │
│  [Try the Demo]                         │
│              [App Preview Card] ──────► │ ← Rotating preview
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         🎯 We Get It                    │ ← Reality check
│    [4 relatable scenario cards]        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    Everything in one place,             │
│    nothing overwhelming                 │ ← Features
│  [6 feature cards with icons]          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│       Simple by design                  │ ← How it works
│   1️⃣ Start tracking                     │
│   2️⃣ Daily check-ins                    │
│   3️⃣ See the full picture               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Made for real people, real situations  │ ← Who it's for
│    [4 persona cards with emojis]       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   "I don't have to remember             │
│    everything anymore..."               │ ← Testimonials
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔒 Your data stays yours               │ ← Privacy
│                                         │
├─────────────────────────────────────────┤
│                                         │
│        Try it for yourself              │
│      [Launch EmberMate] ────────────┐   │ ← Final CTA
│                                     │   │
└─────────────────────────────────────┼───┘
                                      │
                                      ▼
```

### Dashboard (index.html)

```
┌─────────────────────────────────────────┐
│  ☰ 💚 EmberMate  [🔍]  [↶] [🔔] [U] │ ← Fixed navbar
├──┬──────────────────────────────────────┤
│📊│  ⚠️ HIPAA Demo Notice [×]           │ ← HIPAA banner
│📝│──────────────────────────────────────│
│📈│  Health Overview                     │
│👥│  Monday, October 13, 2025            │
│⚙ │                                      │
│  │  ✨ "Caring for yourself is not..."  │ ← Quote card
│S │                                      │
│I │  💡 Welcome! Click any card...       │ ← Instructions
│D │                                      │
│E │  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│B │  │💊 3│ │📅  │ │📈  │ │🔥 7│        │ ← Stat cards
│A │  │Due │ │Tmrw│ │BP  │ │Days│        │
│R │  └────┘ └────┘ └────┘ └────┘        │
│  │                                      │
│  │  📋 Today's Tasks                    │ ← Tables
│  │  ┌─────────────────────────────────┐│
│  │  │ Task    │ Time │ Status │Actions││
│  │  ├─────────────────────────────────┤│
│  │  │ Lisinop │ 8AM  │ ✓ Done │ [Log] ││
│  │  │ Metform │ 12PM │ ⚠ Due  │[Mark] ││
│  │  └─────────────────────────────────┘│
│  │                                      │
│  │  📊 Recent Activity                  │
│  │  [Activity table]                    │
│  │                                      │
└──┴──────────────────────────────────────┘
```

## 🎨 Color Palette

### Primary Colors
```
Champagne:  ▓▓▓▓  #f5f1e8  (Background)
White:      ████  #ffffff  (Cards)
Blue:       ████  #2563eb  (Primary actions)
Warm Beige: ▓▓▓▓  #e8dcc8  (Borders)
```

### Accent Colors
```
Green:  ████  #10b981  (Success)
Orange: ████  #f59e0b  (Warning)
Red:    ████  #ef4444  (Danger)
Cyan:   ████  #06b6d4  (Info)
```

### Neutrals
```
Gray 900: ████  #111827  (Text)
Gray 700: ████  #374151  (Secondary text)
Gray 500: ▓▓▓▓  #6b7280  (Tertiary text)
Gray 200: ▓▓▓▓  #e5e7eb  (Dividers)
```

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────┐
│         Desktop (> 768px)               │
│  ┌────────────────────────────────────┐ │
│  │ Sidebar Always Visible             │ │
│  │ Two/Three Column Layouts           │ │
│  │ Hamburger Hidden                   │ │
│  │ Full Feature Set                   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Mobile (≤ 768px)                │
│  ┌────────────────────────────────────┐ │
│  │ ☰ Hamburger Menu                   │ │
│  │ Sidebar Slides In                  │ │
│  │ Single Column                      │ │
│  │ Backdrop Overlay                   │ │
│  │ Touch Optimized                    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🎭 Interactive Elements

### Hover States
```
Cards:        Lift up + stronger shadow
Buttons:      Lift up + darker gradient
Tables:       Light background highlight
Stat Cards:   Lift + border color change
Nav Items:    Background + color change
```

### Animations
```
Logo:         Breathing (4s cycle)
Page Load:    Fade in from bottom
Sidebar:      Slide in/out
Backdrop:     Fade in/out
Editable:     Highlight blue border
New Row:      Flash highlight
```

## 🔄 User Flows

### 1. First Visit
```
Landing → Read hero → Scroll features → Click "Try Demo" → Dashboard
```

### 2. Quick Track
```
Dashboard → Click "Track" tab → Add medication → Mark as taken → Done
```

### 3. Edit Data
```
Dashboard → Click any editable cell → Type → Press Enter → Saved
```

### 4. Add Entry
```
Dashboard → "+ Add" button → New row appears → Edit inline → Keep/Delete
```

### 5. Undo Action
```
Dashboard → Do something → Click ↶ → Action undone → Toast confirmation
```

## 💡 Design Philosophy

```
┌─────────────────────────────────────────┐
│                                         │
│    CALM    →  Champagne colors          │
│                Gentle animations         │
│                Generous spacing          │
│                                         │
│    CLEAR   →  Direct language           │
│                Obvious actions           │
│                Visible states            │
│                                         │
│    CARING  →  Empathetic copy           │
│                Relatable scenarios       │
│                Helpful guidance          │
│                                         │
│    SIMPLE  →  Inline editing            │
│                One-click actions         │
│                No hidden features        │
│                                         │
└─────────────────────────────────────────┘
```

## 🎯 Key Interactions

### Landing Page
- Smooth scroll to sections
- Hover effects on cards
- Mobile menu toggle
- CTA buttons → Dashboard

### Dashboard
- Click cells to edit
- Click badges to cycle status
- Click "+ Add" for new rows
- Click trash to delete
- Click ↶ to undo
- Click tabs to switch views
- Click hamburger (mobile)

## 🌟 Special Touches

```
✨ Inspirational quotes on each page
💡 Helpful instruction banners
🎨 Rotating app preview card
🌿 Floating leaf decorations
💚 Breathing heart logo
📊 Interactive charts
🔒 Privacy reassurance
⚡ Instant feedback toasts
```

---

## 🚀 Quick Reference

**Start Here:** `landing.html`
**Main App:** `index.html`
**Questions:** Check README files
**Customize:** Edit CSS variables
**Deploy:** Upload anywhere!

**Colors:** Champagne + Blue + White
**Vibe:** Calm, Clear, Caring, Simple
**Goal:** Make health tracking less burdensome

Made with 💚 for everyday caregivers.
