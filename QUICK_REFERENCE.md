# EmberMate V2 - Quick Reference Guide for New Features

## 🚀 Quick Start: New Features

### 1. Log Today's Vitals Button

**Location**: Top of the dashboard, right side of welcome message

**How to use**:
1. Click the prominent orange "Log Today's Vitals" button
2. Modal opens with current date/time pre-filled
3. Enter your vital signs
4. Click "Save Reading"

**Tip**: On mobile, the button spans full width for easy thumb access!

---

### 2. Time Scale Controls

**Location**: Above the vitals chart

**Options**:
- **7 Days** - See this week's trends
- **30 Days** - Monthly overview
- **90 Days** - Quarterly patterns
- **1 Year** - Annual health journey

**How to use**:
1. Click any time scale button above the chart
2. Chart instantly updates to show selected time period
3. Active button is highlighted in orange

---

### 3. Overlay Multiple Vitals

**Location**: Chart controls area

**How to use**:
1. Click the 📊 overlay button (next to vital selector)
2. Checkbox panel appears
3. Check the vitals you want to compare:
   - ✅ Blood Pressure
   - ✅ Heart Rate
   - ✅ Weight
   - ✅ Glucose
4. Selected vitals appear on the same chart
5. Click 📊 again to exit overlay mode

**Cool Feature**: When you include weight, a second Y-axis appears on the right side automatically!

**Best Use Cases**:
- See how weight affects blood pressure
- Compare blood pressure and heart rate patterns
- Track multiple vitals during medication changes

---

### 4. Interactive Chart Tooltips

**Location**: Hover over any data point on the chart

**Features**:
- Hover over any point to see exact value
- Point enlarges when hovering
- Tooltip shows date and precise measurement
- Works with both single and overlay mode

**Tip**: Use this to find exact readings from specific dates!

---

## 📱 Mobile Optimization

All new features are optimized for mobile:

- **Log Vitals Button**: Full-width on small screens
- **Time Scale Buttons**: Wrap to multiple rows on mobile
- **Overlay Checkboxes**: Stack vertically for easy selection
- **Chart**: Fully responsive and touch-enabled

---

## 🔒 Privacy Note

**Daily Motivation quotes are 100% private!**

- All quotes stored locally in your browser
- No external API calls
- No network requests for motivation content
- "Loading..." only appears briefly during page load

Everything stays on your device. Always.

---

## 🎯 Pro Tips

### For Daily Users
- Bookmark the app and use "Log Today's Vitals" button daily
- Check 7-day view to see immediate trends
- Use overlay mode weekly to spot correlations

### For Long-term Tracking
- Use 30-day and 90-day views to identify patterns
- Review 1-year view quarterly for big-picture health
- Export data regularly as backup

### For Healthcare Sharing
- Use overlay mode to show multiple vitals to your doctor
- Select relevant time scale before appointments
- Hover over specific dates to discuss exact readings

---

## 🐛 Troubleshooting

**Chart not updating?**
- Ensure you have data for the selected time period
- Try refreshing the page
- Check that JavaScript is enabled

**Overlay mode not working?**
- Uncheck all vitals, then check them again
- Exit and re-enter overlay mode
- Ensure you have data for selected vitals

**Button not responding?**
- Check if modal is already open (close it first)
- Try refreshing the page
- Clear browser cache if issues persist

---

## 📊 Keyboard Shortcuts

While we haven't added custom keyboard shortcuts yet, you can use browser defaults:

- **Ctrl/Cmd + R**: Refresh data
- **Tab**: Navigate between buttons
- **Enter**: Activate focused button
- **Esc**: Close modal (standard)

---

## 🎨 Customization Tips

Want to personalize EmberMate? Here are some quick tweaks:

### Change Default Time Scale
Edit `app.js`, line ~806:
```javascript
let currentTimeScale = 7; // Change to 30, 90, or 365
```

### Add More Quotes
Edit `app.js`, starting at line 145:
```javascript
const motivationalQuotes = [
    // Add your custom quotes here
    { quote: "Your custom quote", author: "You" },
];
```

---

## 📈 What's Next?

Potential future enhancements we're considering:

1. **Chart Export**: Download charts as images
2. **Smart Alerts**: Notifications when vitals are out of range
3. **Medication Integration**: Overlay medication schedule on charts
4. **Comparison Mode**: Compare this month vs. last month
5. **Custom Goals**: Set targets and track progress

Have ideas? Open an issue on GitHub!

---

**Happy Tracking! 🔥**

Remember: Consistency is key. Use that big orange button daily!
