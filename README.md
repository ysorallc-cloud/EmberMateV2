# EmberMate 💚

Your Personal Health Companion for managing medications, tracking vitals, scheduling appointments, and maintaining your wellness journey.

![EmberMate Demo](https://img.shields.io/badge/demo-live-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## ⚠️ Important Notice

**This is a demonstration application and is NOT HIPAA compliant.** Do not enter real personal health information. This application is for educational and demonstration purposes only.

## ✨ Features

### 📊 Dashboard
- Real-time health overview
- Medication reminders
- Upcoming appointment alerts
- Health streak tracking

### 💊 Medication Management
- Track medication schedules
- Log doses taken
- Report side effects
- Medication adherence tracking

### 📈 Vitals Tracking
- Blood pressure monitoring
- Blood glucose logging
- Heart rate tracking
- Automated alerts for abnormal readings

### 📅 Appointment Management
- Schedule medical appointments
- Transportation coordination
- Provider contact information
- Appointment reminders

### 📊 Analytics
- Comprehensive health trends
- Interactive charts and graphs
- Exportable reports
- Pattern detection and insights

### 📝 Health Journal
- Daily health notes
- Mood tracking
- Symptom logging
- Activity tracking

## 🚀 Getting Started

### Prerequisites

None! This is a pure HTML/CSS/JavaScript application with no build dependencies.

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/embermate.git
cd embermate
```

2. Open `index.html` in your browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

Then visit `http://localhost:8000`

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**Option 1: Using Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option 2: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

Your app will be live at: `https://embermate.vercel.app`

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select "main" branch as source
4. Your site will be live at: `https://yourusername.github.io/embermate`

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

Or using Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js
- **Fonts**: Google Fonts (Inter)
- **Icons**: Unicode Emojis
- **Storage**: LocalStorage for user preferences

## 📁 Project Structure

```
embermate/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── app.js             # Application logic
├── vercel.json        # Vercel deployment config
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🎨 Customization

### Color Scheme

The app uses CSS custom properties for easy theming. Edit `styles.css`:

```css
:root {
    --primary-teal: #2D9B9B;
    --secondary-navy: #1E3A5F;
    --accent-peach: #FFB347;
    /* ... more variables */
}
```

### Adding New Features

The application is modular. Key functions in `app.js`:

- `navigateTo(page)` - Handle navigation
- `showToast(message)` - Display notifications
- `openModal(modalId)` - Open modals
- `toggleMedStatus()` - Update medication status

## 🔐 Security & Privacy

- **No backend**: All data stored locally in browser
- **No external APIs**: Except CDN resources (fonts, Chart.js)
- **No tracking**: No analytics or tracking scripts
- **HTTPS**: Enforced when deployed to Vercel/Netlify
- **XSS Protection**: Security headers configured

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by modern healthcare applications
- Chart.js for beautiful data visualizations
- Inter font family by Rasmus Andersson

## 📧 Contact

Project Link: [https://github.com/yourusername/embermate](https://github.com/yourusername/embermate)

---

**Remember**: This is a demo application. Always consult with healthcare professionals for medical advice and use certified, HIPAA-compliant software for managing real health information.

Made with 💚 by EmberMate Team
