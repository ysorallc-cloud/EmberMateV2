# Health Tracker

A privacy-focused health tracking application built with Next.js 14, designed for quick daily check-ins and medication tracking. This application prioritizes user privacy by storing all data locally and implementing strict PII protection.

## Features

### 🏠 Dashboard
- Quick-glance overview of today's medications, vitals, and health status
- Compact tiles showing medication adherence, weight trends, and blood pressure
- Floating action button for instant daily check-in
- Real-time alerts for overdue doses and health anomalies

### 📋 Daily Check-In (30-second flow)
- **Step 1**: One-tap medication tracking (taken/skipped)
- **Step 2**: Quick vitals entry with smart defaults and +/- buttons
- **Step 3**: Optional voice notes with PII filtering
- Optimized for minimal clicks and cognitive load

### 💊 Medication Management
- Complete CRUD interface for medications
- Flexible scheduling (multiple times per day, specific days)
- Refill tracking and adherence monitoring
- Smart reminders and overdue alerts

### 📊 Vitals & Trends
- Track blood pressure, heart rate, weight, temperature, SpO2
- Interactive charts and trend analysis
- Anomaly detection with customizable thresholds
- Export/import functionality for data portability

### 🔒 Privacy & Security
- **Local-first**: All data stored in IndexedDB, no cloud sync
- **PII Protection**: Real-time filtering of sensitive information
- **HIPAA Disclaimer**: Clear warnings about non-compliance
- **CSP Headers**: Content Security Policy for additional security
- **No Analytics**: Privacy-focused by default

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Database**: IndexedDB via Dexie for offline-first storage
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation
- **Voice**: Web Speech API with graceful degradation
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Accessibility**: WAI-ARIA compliant, keyboard navigation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd health-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Testing

### Unit Tests
```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
```

### End-to-End Tests
```bash
npm run test:e2e      # Run Playwright tests
npm run test:e2e:ui   # Run with UI
```

### All Tests
```bash
npm run test:all      # Run both unit and e2e tests
```

## Usage

### First Time Setup
1. Accept the privacy disclaimer
2. Add your medications in the Medications page
3. Record your first vitals in the Vitals page
4. Use the floating action button for daily check-ins

### Daily Workflow
1. Click the "+" button on the dashboard
2. Mark medications as taken/skipped
3. Record current vitals (uses previous values as defaults)
4. Add optional voice notes
5. Complete check-in

### Data Management
- **Export**: Settings page → Export Data (JSON format)
- **Import**: Settings page → Import Data
- **Clear**: Settings page → Clear All Data (permanent)

## Privacy & Security

### Data Storage
- All data is stored locally in your browser's IndexedDB
- No data is sent to external servers
- Data persists across browser sessions
- Export/import for data portability

### PII Protection
- Real-time filtering of email addresses, phone numbers, SSNs
- Address and medical record number detection
- Automatic sanitization with user warnings
- No storage of personally identifiable information

### Security Features
- Content Security Policy (CSP) headers
- XSS protection
- Clickjacking prevention
- Secure referrer policy
- No third-party tracking

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Color contrast ratio ≥ 4.5:1

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Note**: Voice input requires HTTPS in production and is not supported in all browsers.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

**IMPORTANT**: This application is for informational purposes only and is NOT HIPAA compliant. Do not enter sensitive personal health information, medical record numbers, or any data that could identify you or others. Use responsibly and consult healthcare professionals for medical advice.