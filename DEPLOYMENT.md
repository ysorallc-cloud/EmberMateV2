# HealthTracker Pro - Deployment Guide

## 📋 Overview

This is a comprehensive health tracking web application designed for individuals who need to strictly monitor medications, vitals, symptoms, weight, and health goals. The application is fully self-contained and runs entirely in the browser with no backend required.

## ⚠️ Important Notice

**This application is NOT HIPAA compliant** and should not be used to store Protected Health Information (PHI) that requires HIPAA compliance. This is a personal tracking tool for individual use only.

## 🚀 Quick Start

### Option 1: Open Directly
1. Open `index.html` in any modern web browser
2. Accept the HIPAA disclaimer to begin using the application

### Option 2: Deploy to Vercel (Recommended)

#### Using Vercel CLI:
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Navigate to your project directory
cd your-project-folder

# Deploy
vercel
```

#### Using Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository or drag & drop files
4. Click "Deploy"

### Option 3: Deploy to Netlify

#### Using Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to your project directory
cd your-project-folder

# Deploy
netlify deploy
```

#### Using Netlify Dashboard:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Click "Deploy"

## 📁 File Structure

```
healthtracker-pro/
├── index.html          # Main HTML file with all page structures
├── styles.css          # Complete styling and responsive design
├── app.js             # All JavaScript functionality
└── README.md          # This file
```

## 🌟 Features

### Core Functionality
- ✅ **Dashboard** - At-a-glance overview of health metrics
- ✅ **Medication Management** - Track medications with logging system
- ✅ **Vitals Tracking** - Blood pressure, heart rate, temperature, oxygen
- ✅ **Symptoms & Side Effects** - Log symptoms with severity ratings
- ✅ **Weight Tracking** - Monitor weight with BMI calculations
- ✅ **Goals & Achievements** - Set health goals and unlock achievements
- ✅ **Bulk Data Entry** - Enter multiple records at once
- ✅ **Reports & Export** - Generate reports and export data
- ✅ **Import/Export** - JSON and CSV data management
- ✅ **Print Support** - Print-optimized reports

### Technical Features
- 🔒 **Local Storage Only** - All data stored in browser localStorage
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Dark theme with clean, professional design
- 📊 **Interactive Charts** - Visual representation of health data
- 🏆 **Achievement System** - Gamification to encourage consistency
- 📈 **Streak Tracking** - Monitor consecutive days of tracking
- 💾 **No Backend Required** - Fully client-side application

## 🔧 Configuration

### Updating File Paths

If you're deploying to a subfolder or need to adjust paths, update these references in `index.html`:

```html
<!-- Current paths (root level) -->
<link rel="stylesheet" href="./styles.css" />
<script src="./app.js"></script>

<!-- For subfolder deployment -->
<link rel="stylesheet" href="./assets/styles.css" />
<script src="./js/app.js"></script>
```

### Content Security Policy

The application includes a CSP header. If you need to modify it:

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           img-src 'self' data:;
           style-src 'self' 'unsafe-inline';
           script-src 'self' 'unsafe-inline';
           connect-src 'self';
           font-src 'self' data:;
           frame-ancestors 'none';
           base-uri 'self';
           form-action 'self'">
```

## 📱 Browser Compatibility

Tested and works with:
- ✅ Google Chrome (recommended)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari

Requirements:
- JavaScript enabled
- LocalStorage support
- HTML5 Canvas support (for charts)

## 🎯 Usage Guide

### First-Time Setup
1. Accept the HIPAA disclaimer
2. Go to Settings and enter personal information
3. Add your medications
4. Set health goals
5. Start tracking!

### Daily Use
1. **Dashboard** - Check today's medications and stats
2. **Log Medications** - Check off medications as you take them
3. **Record Vitals** - Enter blood pressure and other measurements
4. **Track Weight** - Weekly weight check-ins
5. **Log Symptoms** - Note any symptoms or side effects

### Data Management
- **Export** - Regular backups recommended (JSON format)
- **Import** - Restore from previous backups
- **Reports** - Generate date-range reports for healthcare providers
- **Print** - Print reports for medical appointments

## 🔐 Privacy & Security

### What the App Does
- Stores all data locally in browser localStorage
- Does NOT transmit data to any servers
- Does NOT require account creation
- Operates completely offline

### What Users Should Do
- Use only on personal devices
- Keep devices password-protected
- Regular data backups using export feature
- Do not use on shared computers
- Clear browser data to remove all information

### What the App Does NOT Do
- Does NOT comply with HIPAA regulations
- Does NOT encrypt data at rest
- Does NOT provide data recovery if browser data cleared
- Does NOT sync across devices
- Does NOT provide medical advice

## 🛠️ Troubleshooting

### Data Not Saving
- Check if JavaScript is enabled
- Ensure not in Private/Incognito mode
- Check browser storage quota

### Charts Not Displaying
- Ensure browser supports HTML5 Canvas
- Try refreshing the page
- Check browser console for errors

### Lost Data
- Data cannot be recovered if browser data cleared
- Restore from JSON backup export
- This is why regular backups are critical!

## 📊 Data Structure

The application stores data in this format:

```json
{
  "medications": [],
  "vitals": [],
  "symptoms": [],
  "weights": [],
  "goals": [],
  "medicationLog": [],
  "achievements": [],
  "settings": {},
  "hipaaAccepted": true
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
  --bg: #0b0b0c;
  --surface: #121315;
  --text: #e7e7ea;
  --primary: #7dd3fc;
  --danger: #fda4af;
  /* etc. */
}
```

### Achievements
Add/modify achievements in `app.js`:

```javascript
getDefaultAchievements() {
  return [
    { id: 'your_achievement', name: 'Name', icon: '🎯', description: 'Description', earned: false, date: null }
  ];
}
```

## 📈 Future Enhancements (Optional)

Potential features to add:
- Medication refill reminders
- Export to PDF
- Integration with health devices
- Cloud backup option (with encryption)
- Multi-language support
- Custom themes

## 🤝 Support

For issues:
1. Check browser console for errors
2. Verify browser compatibility
3. Ensure JavaScript and localStorage enabled
4. Try in a different browser
5. Clear cache and reload

## ⚖️ Legal

### Disclaimer
This software is provided "as is", without warranty of any kind. The developers are not responsible for any health decisions made based on data tracked in this application.

### Medical Advice
This is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.

### HIPAA Compliance
This application is **NOT HIPAA compliant** and should not be used in any capacity that requires HIPAA compliance.

## 📄 License

This project is provided for personal use. Feel free to modify and customize for your needs.

---

## 🚀 Vercel-Specific Deployment

### vercel.json (Optional)

Create this file for custom configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### .vercelignore (Optional)

```
README.md
.git
node_modules
```

### Environment Variables

No environment variables needed - this is a fully static application!

---

**Remember**: Your health data is valuable. Back it up regularly! 💾

**Created**: 2025
**Version**: 1.0.0
