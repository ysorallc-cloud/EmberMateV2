# HealthTracker Pro - Personal Health Management System

A comprehensive web-based health tracking application designed for individuals who need to strictly monitor medications, vital signs, symptoms, weight, and health goals.

## ⚠️ Important Notice

**This application is NOT HIPAA compliant** and should not be used to store Protected Health Information (PHI) that requires HIPAA compliance. This is a personal tracking tool for individual use only. All data is stored locally in your browser.

## 🌟 Features

### 📊 Dashboard
- **At-a-glance overview** of your health metrics
- Quick stats for today's medications, latest blood pressure, current weight, and goal progress
- **Upcoming medications** schedule
- Recent vitals visualization
- **Streak tracking** for medication adherence, vitals checks, and weight logging
- Real-time achievement notifications

### 💊 Medication Management
- Track multiple medications with dosage, frequency, and timing
- **Medication log** to check off doses as taken
- Medication history and adherence tracking
- Visual reminders for upcoming doses
- Support for various frequencies (daily, multiple times daily, weekly, as needed)

### ❤️ Vitals Tracking
- Record blood pressure (systolic/diastolic)
- Track heart rate, temperature, and oxygen saturation
- **Interactive charts** showing trends over time
- Automatic blood pressure status classification
- Detailed notes for each vital check

### 📝 Symptoms & Side Effects
- Log symptoms with severity ratings (1-10)
- Link symptoms to specific medications
- Track symptom frequency with visual charts
- Add detailed descriptions for each symptom
- Helpful for identifying medication side effects

### ⚖️ Weight Tracking
- Record weight measurements over time
- **BMI calculation** (requires height in settings)
- Track 7-day and 30-day weight changes
- Set weight goals with progress tracking
- Visual weight trend charts with goal line overlay

### 🎯 Goals & Achievements
- Set and track various health goals (weight, medication adherence, blood pressure, etc.)
- **10 unlockable achievements** to encourage consistency
- Visual progress bars for active goals
- Motivational messages and encouragement
- Achievement showcase with earned badges

### 📋 Bulk Data Entry
- Enter multiple records at once through table interface
- Separate tabs for vitals, medications, weight, and symptoms
- **Template-based entry** for faster data input
- Add/remove rows dynamically
- Perfect for catching up on missed entries

### 📈 Reports & Export
- Generate custom reports for any date range
- Choose which data types to include
- **Print-friendly format** for sharing with healthcare providers
- Export all data as JSON (for backup)
- Export vitals and weight as CSV
- Import previously exported data

### ⚙️ Settings
- Personal information (name, DOB, height, blood type)
- Weight goals with target dates
- Notification preferences
- **Data management** (backup and clear all data)
- Privacy notice access

## 🚀 Getting Started

### Installation

1. Download all files to a folder on your computer
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. Accept the HIPAA disclaimer to begin using the application

### First-Time Setup

1. **Settings**: Go to Settings page and enter your personal information
2. **Add Medications**: Navigate to Medications and add your current prescriptions
3. **Record Vitals**: Take your first vital signs reading
4. **Set Goals**: Create health goals to work towards

## 📱 Usage Guide

### Adding Medications

1. Click **"+ Add Medication"** on the Medications page
2. Fill in:
   - Medication name (required)
   - Dosage (e.g., "10mg")
   - Frequency (daily, twice daily, etc.)
   - Times to take (e.g., "08:00, 20:00")
   - Start date
   - Purpose/condition
3. Click **Save**

### Logging Medication Intake

1. Go to the Medications page
2. Find the **"Medication Log - Today"** section
3. Check the box next to each time you take a medication
4. Your streak counter will update automatically

### Recording Vitals

1. Click **"+ Record Vitals"** on the Vitals page
2. Enter blood pressure (required), and optionally:
   - Heart rate
   - Temperature
   - Oxygen saturation
   - Notes
3. Click **Save**
4. View your data in charts and tables

### Using Bulk Entry

1. Go to the **Bulk Data Entry** page
2. Select the tab for the type of data (Vitals, Medications, Weight, or Symptoms)
3. Click **"+ Add Row"** to add more entry rows
4. Fill in the table with your data
5. Click **"Save All Entries"** when done

### Generating Reports

1. Navigate to **Reports & Export**
2. Set the date range for your report
3. Choose which data types to include
4. Click **"Generate Report"**
5. Click **"🖨️ Print Report"** to print or save as PDF

## 💾 Data Management

### Backup Your Data

**Highly Recommended**: Regularly backup your health data

1. Go to **Reports & Export** page
2. Click **"Export as JSON"**
3. Save the file to a secure location
4. Consider keeping backups in multiple locations (USB drive, cloud storage, etc.)

### Import Data

1. Go to **Reports & Export** page
2. Click **"Choose File"** under Import Data
3. Select your previously exported JSON file
4. Click **"Import Data"**
5. Data will be merged with existing records

### Clear All Data

⚠️ **Warning**: This action is permanent and cannot be undone!

1. Go to **Settings** page
2. Scroll to **Data Management**
3. Click **"Clear All Data"**
4. Confirm twice
5. All data will be permanently deleted

## 🏆 Achievements System

Unlock achievements by:
- **Getting Started** (💊): Log your first medication
- **Week Warrior** (🔥): Track for 7 days straight
- **Month Master** (🏆): Track for 30 days straight
- **Vital Signs** (❤️): Record your first vitals
- **Weight Warrior** (⚖️): Log 10 weight entries
- **Goal Setter** (🎯): Set your first goal
- **Goal Achiever** (🌟): Complete your first goal
- **Data Master** (📊): Have 50+ total entries
- **Perfect Week** (💯): Take all meds for a week
- **Health Champion** (👑): Earn all other achievements

## 🔒 Privacy & Security

### What This App Does
- Stores all data **locally in your browser** using localStorage
- Does NOT transmit any health data to external servers
- Does NOT require account creation or login
- Operates completely offline after initial load

### What You Should Do
- **Do not use on shared or public computers**
- Keep your device password-protected
- Regularly backup your data using the export feature
- Clear browser data to remove all information if needed
- Do not share sensitive health information via unsecured channels

### What This App Does NOT Do
- Does NOT comply with HIPAA regulations
- Does NOT encrypt data at rest
- Does NOT provide data recovery if browser data is cleared
- Does NOT synchronize across devices
- Does NOT provide medical advice or diagnosis

## 🖨️ Printing

The application includes print-optimized styles:
- Navigation and interactive elements are hidden when printing
- Tables and charts are formatted for paper
- Reports can be printed directly or saved as PDF
- Useful for sharing with healthcare providers

## 📊 Browser Compatibility

Tested and works with:
- ✅ Google Chrome (recommended)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari

Requires:
- JavaScript enabled
- LocalStorage support
- HTML5 Canvas support (for charts)

## 🐛 Troubleshooting

### Data Not Saving
- Check if JavaScript is enabled in your browser
- Ensure you're not in Private/Incognito mode (localStorage is disabled)
- Check browser storage quota (usually 5-10MB available)

### Charts Not Displaying
- Ensure browser supports HTML5 Canvas
- Try refreshing the page
- Check browser console for errors

### Lost Data
- If browser data was cleared, data cannot be recovered
- Restore from your most recent JSON export backup
- This is why regular backups are critical!

## 📝 Tips for Best Results

1. **Be Consistent**: Log data at the same time each day for accurate trends
2. **Use Notes**: Add context to readings (e.g., "after exercise", "before medication")
3. **Set Realistic Goals**: Start with achievable targets and adjust as needed
4. **Regular Backups**: Export your data weekly or monthly
5. **Review Trends**: Use the charts to identify patterns in your health metrics
6. **Share with Doctor**: Print reports before medical appointments
7. **Track Side Effects**: Note any symptoms after starting new medications

## 🎯 Common Use Cases

### Managing Multiple Medications
Perfect for patients with:
- Chronic conditions requiring multiple prescriptions
- Complex medication schedules
- Need to track medication adherence for healthcare providers

### Post-Surgery Recovery
Track:
- Vital signs multiple times per day
- Weight changes
- Symptoms and side effects
- Progress toward recovery goals

### Chronic Disease Management
Monitor:
- Blood pressure trends for hypertension
- Weight changes for heart conditions
- Symptom patterns for chronic illness
- Medication effectiveness

### Weight Management Programs
Track:
- Daily or weekly weight measurements
- Progress toward goal weight
- Correlation with other health metrics
- Long-term trends

## ⚖️ Legal Disclaimer

This software is provided "as is", without warranty of any kind. The developers are not responsible for any health decisions made based on data tracked in this application. 

**This is not a substitute for professional medical advice, diagnosis, or treatment.** Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

This application is **NOT HIPAA compliant** and should not be used in any capacity that requires HIPAA compliance.

## 📞 Support

For issues or questions:
- Review this README thoroughly
- Check browser console for error messages
- Ensure you're using a supported, up-to-date browser

## 🔄 Version History

### Version 1.0.0 (2025)
- Initial release
- Core features: Medications, Vitals, Symptoms, Weight tracking
- Goals and achievements system
- Bulk data entry
- Reports and export functionality
- Print optimization
- HIPAA disclaimer

## 🙏 Acknowledgments

Created to help individuals take control of their health tracking with a comprehensive, easy-to-use, privacy-focused application.

---

**Remember**: Your health data is valuable. Back it up regularly! 💾
