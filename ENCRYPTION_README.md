# EmberMate Encryption Feature

## Overview
The encryption feature provides AES-256 encryption for all your health data stored in the browser. Your encryption password never leaves your device and is never stored - only a hash is kept for verification.

## Files Created
1. **encryption.js** - Main encryption/decryption logic
2. **encryption.css** - Styling for encryption UI elements
3. **backup.js** - Data backup/restore functionality

## How It Works

### Initial Setup
1. Open EmberMate in your browser
2. Navigate to **Settings** (⚙️ icon in sidebar)
3. Scroll to the **🔐 Data Encryption** section
4. Click **"Enable Encryption"**
5. Create a strong password (minimum 8 characters)
6. Confirm your password

### What Gets Encrypted
The following data is automatically encrypted:
- All medications
- All blood pressure readings
- All blood glucose readings
- All weight/temperature readings
- All journal entries
- All appointments
- All care team information

### Password Management
- **Your password is NEVER stored** - only a SHA-256 hash is kept for verification
- **If you lose your password, your data CANNOT be recovered**
- Use the **"Change Password"** button to update your password
- You'll need to enter your password each time you open the app

### Features

#### Enable Encryption
1. Creates a password
2. Immediately encrypts all existing data
3. Shows green "Enabled" status

#### Disable Encryption
1. Requires password verification
2. Decrypts all data
3. Stores data unencrypted (for easier access)

#### Change Password
1. Verify current password
2. Enter new password
3. Automatically re-encrypts all data with new password

### Backup & Restore

#### Export Data
- Click **"📥 Export Data"** in Settings
- Downloads a JSON file with all your data
- **If encryption is enabled, the exported file is encrypted**
- Filename format: `embermate-backup-YYYY-MM-DD.json`

#### Import Data
- Click **"📤 Import Data"** in Settings
- Select a previously exported JSON file
- Confirms before overwriting current data
- Works with both encrypted and unencrypted backups

#### Clear All Data
- **DANGER**: Permanently deletes ALL data
- Requires triple confirmation including typing "DELETE ALL DATA"
- Cannot be undone without a backup

### Auto-Backup
- Automatic backup is created every 24 hours
- Stored in localStorage as `embermate_auto_backup`
- Can be restored from Settings if needed

## Technical Details

### Encryption Algorithm
- **Algorithm**: AES-256 (Advanced Encryption Standard)
- **Library**: CryptoJS (loaded from CDN)
- **Mode**: CBC with PKCS7 padding (default)
- **Key Derivation**: Password is used directly (consider adding PBKDF2 for production)

### Storage
- Encrypted data is stored in localStorage
- Encrypted strings start with "U2FsdGVk" (base64 for "Salted__")
- Password hash stored as: `embermate_password_hash`
- Encryption status: `embermate_encryption_enabled`

### Data Keys
```javascript
encryptedKeys: [
    'embermate_medications',
    'embermate_bp_readings',
    'embermate_glucose_readings',
    'embermate_weight_readings',
    'embermate_journal_entries',
    'embermate_appointments',
    'embermate_care_team'
]
```

## Security Considerations

### ✅ Good Security Practices
- Passwords never stored (only hashed)
- Strong encryption (AES-256)
- All sensitive data encrypted
- Encrypted data in backups

### ⚠️ Important Limitations
- This is a **client-side** encryption demo
- Not suitable for real medical data (HIPAA compliance required)
- Password hash stored in localStorage (vulnerable to XSS)
- No server-side validation or key management
- Browser localStorage can be cleared/corrupted

### 🔒 Production Recommendations
For real medical applications, you would need:
1. Server-side encryption with proper key management
2. HIPAA-compliant infrastructure
3. Secure authentication (OAuth, 2FA)
4. Encrypted data transmission (TLS/SSL)
5. Audit logging
6. Data retention policies
7. Professional security audit
8. PBKDF2 or Argon2 for key derivation
9. Secure session management
10. Regular security updates

## Usage Example

```javascript
// Enable encryption programmatically
EncryptionManager.setupEncryption();

// Store encrypted data
EncryptionManager.setData('embermate_medications', JSON.stringify(medicationData));

// Retrieve and decrypt data
const data = EncryptionManager.getData('embermate_medications');
const medications = JSON.parse(data);

// Check if encryption is enabled
if (EncryptionManager.isEncryptionEnabled) {
    console.log('Data is encrypted');
}
```

## Troubleshooting

### "Password required" prompt on every page load
- This is expected behavior when encryption is enabled
- Enter your password to unlock your data
- Consider disabling encryption if this is inconvenient

### "Incorrect password" error
- Double-check your password (case-sensitive)
- If forgotten, you cannot recover your data
- You can disable encryption and start fresh (data will be lost)

### Data not appearing after import
- Make sure encryption status matches (encrypted backup needs encryption enabled)
- Try refreshing the page after import
- Check browser console for errors

### Encryption button not appearing
- Make sure all three files are loaded (check browser console)
- CryptoJS library must be loaded from CDN
- Navigate to Settings page to see the encryption section

## Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Requires JavaScript enabled

## Demo Notice
⚠️ **This is a demonstration application and is NOT HIPAA compliant.**
Do not enter real personal health information. Use test data only.
