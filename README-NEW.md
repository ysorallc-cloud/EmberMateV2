# EmberMate 💚

> Your Personal Health Companion for managing medications, tracking vitals, scheduling appointments, and maintaining your wellness journey.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Demo](https://img.shields.io/badge/demo-live-brightgreen)

## ⚠️ Important Notice

**This is a demonstration application and is NOT HIPAA compliant.** Do not enter real personal health information. This application is for educational and demonstration purposes only.

---

## 📑 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Security & Privacy](#security--privacy)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 📊 Dashboard
- **Real-time Health Overview**: Get a comprehensive snapshot of your health status at a glance
- **Medication Reminders**: Never miss a dose with intelligent reminder system
- **Upcoming Appointments**: Stay organized with appointment alerts
- **Health Streak Tracking**: Monitor your adherence and maintain healthy habits

### 💊 Medication Management
- **Schedule Tracking**: Manage multiple medication schedules effortlessly
- **Dose Logging**: Record when you take medications with timestamp
- **Side Effect Reporting**: Document and track medication side effects
- **Adherence Analytics**: View your medication compliance over time
- **Refill Reminders**: Get notified when it's time to refill prescriptions

### 📈 Vitals Tracking
- **Blood Pressure Monitoring**: Track systolic and diastolic readings
- **Blood Glucose Logging**: Monitor glucose levels with trend analysis
- **Heart Rate Tracking**: Record and visualize heart rate data
- **Automated Alerts**: Receive warnings for abnormal readings
- **Historical Trends**: View your vitals over time with interactive charts

### 📅 Appointment Management
- **Schedule Medical Appointments**: Organize all your healthcare visits
- **Transportation Coordination**: Add transportation notes and planning
- **Provider Contact Information**: Store and quickly access provider details
- **Appointment Reminders**: Never miss an important medical visit
- **Past Appointment History**: Review previous appointments and notes

### 📊 Analytics & Insights
- **Comprehensive Health Trends**: Visualize your health data over time
- **Interactive Charts**: Powered by Chart.js for beautiful visualizations
- **Exportable Reports**: Download your health data for sharing with providers
- **Pattern Detection**: Identify trends and patterns in your health metrics
- **Custom Date Ranges**: Filter data by specific time periods

### 📝 Health Journal
- **Daily Health Notes**: Document your daily health experiences
- **Mood Tracking**: Monitor emotional wellbeing alongside physical health
- **Symptom Logging**: Record symptoms with severity and duration
- **Activity Tracking**: Log physical activities and exercise
- **Searchable History**: Easily find past journal entries

### 👥 Care Team Management
- **Provider Directory**: Centralized list of all healthcare providers
- **Specialty Tracking**: Organize providers by medical specialty
- **Contact Details**: Quick access to phone numbers and addresses
- **Visit History**: Track which provider you've seen and when

---

## 🚀 Quick Start

### Option 1: Direct File Access
The easiest way to get started:

1. **Download the files** or clone the repository
2. **Open `landing.html`** in your web browser to see the landing page
3. **Click "Launch App"** or open `index.html` directly to use the application

No installation or build process required!

### Option 2: Local Development Server

For a better development experience with live reload:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000/landing.html`

---

## 📦 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools or dependencies required!

### Clone the Repository

```bash
git clone https://github.com/yourusername/embermate.git
cd embermate
```

### File Structure
```
embermate/
├── landing.html              # Landing page
├── landing-styles.css        # Landing page styles
├── landing-script.js         # Landing page JavaScript
├── index.html                # Main application
├── styles.css                # Application styles
├── app.js                    # Application logic
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

**Quick Deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Your app will be live at: `https://your-project.vercel.app`

### Deploy to Netlify

**Quick Deploy:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

**Manual Deployment:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to production
netlify deploy --prod
```

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch as source
4. Save and wait for deployment

Your site will be live at: `https://yourusername.github.io/embermate`

### Deploy to Any Static Host

Simply upload these files to any static hosting service:
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- Surge.sh
- Render

---

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js (v4.4.0)
- **Fonts**: Google Fonts (Inter font family)
- **Icons**: Unicode Emojis (no external icon library needed)
- **Storage**: LocalStorage API for persistent data
- **Hosting**: Static hosting compatible (Vercel, Netlify, GitHub Pages, etc.)

### Why This Stack?

✅ **No Build Process**: Works immediately without compilation  
✅ **No Dependencies**: Everything is self-contained  
✅ **Fast Performance**: Minimal overhead, lightning-fast load times  
✅ **Easy Maintenance**: Simple to understand and modify  
✅ **Wide Compatibility**: Works in all modern browsers  

---

## 🎨 Customization

### Color Scheme

Edit CSS custom properties in `styles.css` and `landing-styles.css`:

```css
:root {
    --primary-teal: #2D9B9B;
    --secondary-navy: #1E3A5F;
    --accent-peach: #FFB347;
    --background: #FFFFFF;
    --text-primary: #1A1A1A;
    --text-secondary: #6B7280;
}
```

### Adding Features

The application is modular with clear separation of concerns:

**Key Functions in `app.js`:**
- `navigateTo(page)` - Handle navigation between sections
- `showToast(message, type)` - Display toast notifications
- `openModal(modalId)` - Open modal dialogs
- `saveToLocalStorage(key, data)` - Persist data locally
- `loadFromLocalStorage(key)` - Retrieve stored data

**Adding a New Page:**
1. Create a new section in `index.html` with `id="your-page"`
2. Add navigation item in the sidebar
3. Implement page logic in `app.js`

### Changing Branding

1. **Logo**: Update the emoji in `.logo-icon` or replace with image
2. **App Name**: Search and replace "EmberMate" throughout files
3. **Tagline**: Update in landing page and footer
4. **Colors**: Modify CSS custom properties as shown above

---

## 🔐 Security & Privacy

### Privacy Features

- ✅ **No Backend**: All data stored locally in your browser
- ✅ **No External APIs**: Except for CDN resources (fonts, Chart.js)
- ✅ **No Tracking**: No analytics, cookies, or tracking scripts
- ✅ **No Authentication**: No accounts, no passwords, no user data collected
- ✅ **Complete Offline**: Works without internet after initial load

### Security Headers

When deployed, ensure these headers are configured:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

These are pre-configured in `vercel.json` for Vercel deployments.

### Data Storage

All user data is stored in the browser's LocalStorage:
- Data persists across sessions
- Data is isolated per domain
- Clearing browser data will remove all information
- No server-side storage or backups

---

## 📱 Browser Support

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| iOS Safari | 14+ | ✅ Fully Supported |
| Chrome Mobile | 90+ | ✅ Fully Supported |

**Required Browser Features:**
- LocalStorage API
- CSS Grid & Flexbox
- ES6+ JavaScript
- Chart.js support

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

Found a bug? [Open an issue](https://github.com/yourusername/embermate/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and version information

### Suggesting Features

Have an idea? [Open an issue](https://github.com/yourusername/embermate/issues) with:
- Feature description
- Use case and benefits
- Implementation suggestions (optional)

### Pull Requests

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes
4. Test thoroughly in multiple browsers
5. Commit your changes: `git commit -m 'Add some AmazingFeature'`
6. Push to the branch: `git push origin feature/AmazingFeature`
7. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Add comments for complex logic
- Follow existing naming conventions
- Keep functions focused and modular
- Test in multiple browsers before submitting

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 EmberMate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Design Inspiration**: Modern healthcare and wellness applications
- **Chart Library**: [Chart.js](https://www.chartjs.org/) for beautiful data visualizations
- **Font**: [Inter](https://rsms.me/inter/) by Rasmus Andersson
- **Icons**: Unicode emoji characters for universal compatibility

---

## 📧 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/embermate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/embermate/discussions)
- **Email**: support@example.com

---

## 🎯 Roadmap

### Planned Features
- [ ] Data export/import functionality
- [ ] Print-friendly health reports
- [ ] Dark mode support
- [ ] Multiple language support (i18n)
- [ ] Enhanced data visualization options
- [ ] Mobile app (PWA) support
- [ ] Voice input for health journal
- [ ] Integration with health device APIs

### Version History
- **v2.0.0** (Current) - Landing page, deidentification, improved UX
- **v1.0.0** - Initial release with core features

---

## ⚠️ Medical Disclaimer

**THIS APPLICATION IS FOR DEMONSTRATION AND EDUCATIONAL PURPOSES ONLY**

EmberMate is not a medical device and is not intended to:
- Diagnose, treat, cure, or prevent any disease
- Replace professional medical advice
- Store real protected health information (PHI)
- Be used in clinical or healthcare settings

**Always consult with qualified healthcare professionals for medical advice and treatment.**

This application is **NOT HIPAA compliant** and should never be used with real personal health information.

---

<div align="center">

**Made with 💚 by the EmberMate Team**

[⬆ Back to Top](#embermate-)

</div>
