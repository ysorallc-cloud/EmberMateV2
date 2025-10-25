import { z } from 'zod';

// Medication schemas
export const medicationScheduleSchema = z.object({
  id: z.string(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  days: z.array(z.number().min(0).max(6)).min(1, 'At least one day must be selected'),
  enabled: z.boolean(),
});

export const medicationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Medication name is required').max(100, 'Name too long'),
  dose: z.number().positive('Dose must be positive'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit too long'),
  schedule: z.array(medicationScheduleSchema).min(1, 'At least one schedule is required'),
  notes: z.string().max(500, 'Notes too long').optional(),
  remainingPills: z.number().int().min(0).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const medicationLogSchema = z.object({
  id: z.number().optional(),
  medicationId: z.number(),
  takenAt: z.date(),
  status: z.enum(['taken', 'skipped', 'missed']),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Vitals schemas
export const vitalsSchema = z.object({
  id: z.number().optional(),
  systolic: z.number().int().min(50).max(300, 'Systolic must be between 50-300'),
  diastolic: z.number().int().min(30).max(200, 'Diastolic must be between 30-200'),
  heartRate: z.number().int().min(30).max(250, 'Heart rate must be between 30-250'),
  weight: z.number().min(20).max(500, 'Weight must be between 20-500 lbs'),
  temperature: z.number().min(95).max(110, 'Temperature must be between 95-110°F').optional(),
  spO2: z.number().min(70).max(100, 'SpO2 must be between 70-100%').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  recordedAt: z.date().optional(),
});

// User profile schemas
export const userProfileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().max(50, 'Name too long').optional(),
  ageRange: z.enum(['18-25', '26-35', '36-45', '46-55', '56-65', '65+']).optional(),
  height: z.number().min(100).max(250, 'Height must be between 100-250 cm').optional(),
  alertThresholds: z.object({
    weightChangePercent: z.number().min(1).max(50, 'Weight change threshold must be 1-50%'),
    heartRateMin: z.number().int().min(30).max(200),
    heartRateMax: z.number().int().min(30).max(250),
  }),
  preferences: z.object({
    voiceInputEnabled: z.boolean(),
    darkMode: z.enum(['auto', 'light', 'dark']),
    notifications: z.boolean(),
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Voice note schema
export const voiceNoteSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(1, 'Text is required').max(1000, 'Text too long'),
  audioBlob: z.instanceof(Blob).optional(),
  createdAt: z.date().optional(),
});

// Settings schema
export const settingsSchema = z.object({
  id: z.number().optional(),
  key: z.string(),
  value: z.any(),
  updatedAt: z.date().optional(),
});

// PII validation
export const piiValidationSchema = z.string().refine((text) => {
  // This will be used with the PII detection patterns
  return true; // We'll handle PII detection separately
}, 'Text contains potentially sensitive information');

// Form schemas for UI
export const dailyCheckInSchema = z.object({
  medications: z.array(z.object({
    medicationId: z.number(),
    status: z.enum(['taken', 'skipped']),
    notes: z.string().optional(),
  })),
  vitals: vitalsSchema.omit({ id: true, recordedAt: true }),
  voiceNote: z.string().optional(),
});

export const medicationFormSchema = medicationSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const vitalsFormSchema = vitalsSchema.omit({ 
  id: true, 
  recordedAt: true 
});

export const userProfileFormSchema = userProfileSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Type exports
export type MedicationFormData = z.infer<typeof medicationFormSchema>;
export type VitalsFormData = z.infer<typeof vitalsFormSchema>;
export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;
export type DailyCheckInData = z.infer<typeof dailyCheckInSchema>;
export type MedicationScheduleData = z.infer<typeof medicationScheduleSchema>;