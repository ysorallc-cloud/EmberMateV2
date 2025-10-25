import Dexie, { type Table } from 'dexie';

export interface Medication {
  id?: number;
  name: string;
  dose: number;
  unit: string;
  schedule: MedicationSchedule[];
  notes?: string;
  remainingPills?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationSchedule {
  id: string;
  time: string; // HH:MM format
  days: number[]; // 0-6, Sunday = 0
  enabled: boolean;
}

export interface MedicationLog {
  id?: number;
  medicationId: number;
  takenAt: Date;
  status: 'taken' | 'skipped' | 'missed';
  notes?: string;
}

export interface Vitals {
  id?: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  weight: number;
  temperature?: number;
  spO2?: number;
  notes?: string;
  recordedAt: Date;
}

export interface Settings {
  id?: number;
  key: string;
  value: any;
  updatedAt: Date;
}

export interface VoiceNote {
  id?: number;
  text: string;
  audioBlob?: Blob;
  createdAt: Date;
}

export interface UserProfile {
  id?: number;
  firstName?: string;
  ageRange?: string; // e.g., "18-25", "26-35", etc.
  height?: number; // in cm
  alertThresholds: {
    weightChangePercent: number;
    heartRateMin: number;
    heartRateMax: number;
  };
  preferences: {
    voiceInputEnabled: boolean;
    darkMode: 'auto' | 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class HealthTrackerDB extends Dexie {
  medications!: Table<Medication>;
  medicationLogs!: Table<MedicationLog>;
  vitals!: Table<Vitals>;
  settings!: Table<Settings>;
  voiceNotes!: Table<VoiceNote>;
  userProfile!: Table<UserProfile>;

  constructor() {
    super('HealthTrackerDB');
    
    this.version(1).stores({
      medications: '++id, name, createdAt, updatedAt',
      medicationLogs: '++id, medicationId, takenAt, status',
      vitals: '++id, recordedAt',
      settings: '++id, key, updatedAt',
      voiceNotes: '++id, createdAt',
      userProfile: '++id, createdAt, updatedAt'
    });

    // Add hooks for automatic timestamps
    this.medications.hook('creating', function (primKey, obj, trans) {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.medications.hook('updating', function (modifications: any, primKey, obj, trans) {
      modifications.updatedAt = new Date();
    });

    this.medicationLogs.hook('creating', function (primKey, obj, trans) {
      if (!obj.takenAt) {
        obj.takenAt = new Date();
      }
    });

    this.vitals.hook('creating', function (primKey, obj, trans) {
      if (!obj.recordedAt) {
        obj.recordedAt = new Date();
      }
    });

    this.settings.hook('creating', function (primKey, obj, trans) {
      obj.updatedAt = new Date();
    });

    this.settings.hook('updating', function (modifications: any, primKey, obj, trans) {
      modifications.updatedAt = new Date();
    });

    this.userProfile.hook('creating', function (primKey, obj, trans) {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.userProfile.hook('updating', function (modifications: any, primKey, obj, trans) {
      modifications.updatedAt = new Date();
    });
  }
}

export const db = new HealthTrackerDB();

// Initialize default settings
export async function initializeDefaultSettings() {
  const existingSettings = await db.settings.toArray();
  
  if (existingSettings.length === 0) {
    await db.settings.bulkAdd([
      { key: 'disclaimerAccepted', value: false, updatedAt: new Date() },
      { key: 'voiceInputEnabled', value: true, updatedAt: new Date() },
      { key: 'darkMode', value: 'auto', updatedAt: new Date() },
      { key: 'notifications', value: true, updatedAt: new Date() },
      { key: 'weightChangeThreshold', value: 5, updatedAt: new Date() }, // 5% weight change threshold
      { key: 'heartRateMin', value: 60, updatedAt: new Date() },
      { key: 'heartRateMax', value: 100, updatedAt: new Date() },
    ]);
  }
}

// PII detection patterns
export const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Place|Pl)\b/gi,
  mrn: /\b(?:MRN|Medical Record Number)[\s:]*\d+/gi,
  dob: /\b(?:0[1-9]|1[0-2])[\/\-](?:0[1-9]|[12][0-9]|3[01])[\/\-](?:19|20)\d{2}\b/g,
};

export function detectPII(text: string): { type: string; matches: string[] }[] {
  const detections: { type: string; matches: string[] }[] = [];
  
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      detections.push({ type, matches });
    }
  });
  
  return detections;
}