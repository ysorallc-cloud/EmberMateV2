import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { detectPII } from './database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

// Medication utilities
export function getNextDoseTime(schedule: Array<{ time: string; days: number[]; enabled: boolean }>): Date | null {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const enabledSchedules = schedule.filter(s => s.enabled);
  if (enabledSchedules.length === 0) return null;
  
  // Find next dose today
  for (const sched of enabledSchedules) {
    if (sched.days.includes(currentDay)) {
      const [hours, minutes] = sched.time.split(':').map(Number);
      const doseTime = hours * 60 + minutes;
      
      if (doseTime > currentTime) {
        const nextDose = new Date(now);
        nextDose.setHours(hours, minutes, 0, 0);
        return nextDose;
      }
    }
  }
  
  // Find next dose in upcoming days
  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + dayOffset);
    const checkDay = checkDate.getDay();
    
    for (const sched of enabledSchedules) {
      if (sched.days.includes(checkDay)) {
        const [hours, minutes] = sched.time.split(':').map(Number);
        const nextDose = new Date(checkDate);
        nextDose.setHours(hours, minutes, 0, 0);
        return nextDose;
      }
    }
  }
  
  return null;
}

export function getMedicationStatus(
  medicationId: number,
  logs: Array<{ medicationId: number; takenAt: Date; status: string }>,
  schedule: Array<{ time: string; days: number[]; enabled: boolean }>
): 'taken' | 'missed' | 'upcoming' | 'none' {
  const today = new Date();
  const todayLogs = logs.filter(log => 
    log.medicationId === medicationId && 
    isToday(log.takenAt)
  );
  
  if (todayLogs.some(log => log.status === 'taken')) {
    return 'taken';
  }
  
  const nextDose = getNextDoseTime(schedule);
  if (nextDose && nextDose > today) {
    return 'upcoming';
  }
  
  // Check if there should have been a dose today
  const currentDay = today.getDay();
  const enabledSchedules = schedule.filter(s => s.enabled && s.days.includes(currentDay));
  
  if (enabledSchedules.length > 0) {
    const currentTime = today.getHours() * 60 + today.getMinutes();
    const hasPassedDose = enabledSchedules.some(sched => {
      const [hours, minutes] = sched.time.split(':').map(Number);
      const doseTime = hours * 60 + minutes;
      return doseTime < currentTime;
    });
    
    if (hasPassedDose) {
      return 'missed';
    }
  }
  
  return 'none';
}

// Vitals utilities
export function calculateBMI(weight: number, height: number): number {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function detectVitalAnomalies(
  vitals: { systolic: number; diastolic: number; heartRate: number; weight: number },
  previousVitals: { weight: number; heartRate: number } | null,
  thresholds: { weightChangePercent: number; heartRateMin: number; heartRateMax: number }
): string[] {
  const anomalies: string[] = [];
  
  // Blood pressure anomalies
  if (vitals.systolic > 140 || vitals.diastolic > 90) {
    anomalies.push('High blood pressure');
  }
  if (vitals.systolic < 90 || vitals.diastolic < 60) {
    anomalies.push('Low blood pressure');
  }
  
  // Heart rate anomalies
  if (vitals.heartRate < thresholds.heartRateMin || vitals.heartRate > thresholds.heartRateMax) {
    anomalies.push('Heart rate outside normal range');
  }
  
  // Weight change anomalies
  if (previousVitals) {
    const weightChangePercent = Math.abs((vitals.weight - previousVitals.weight) / previousVitals.weight) * 100;
    if (weightChangePercent > thresholds.weightChangePercent) {
      anomalies.push(`Significant weight change (${weightChangePercent.toFixed(1)}%)`);
    }
  }
  
  return anomalies;
}

// PII utilities
export function sanitizeText(text: string): { sanitized: string; warnings: string[] } {
  const piiDetections = detectPII(text);
  let sanitized = text;
  const warnings: string[] = [];
  
  piiDetections.forEach(detection => {
    warnings.push(`Detected ${detection.type}: ${detection.matches.join(', ')}`);
    // Replace with placeholder
    detection.matches.forEach(match => {
      sanitized = sanitized.replace(match, `[${detection.type.toUpperCase()}]`);
    });
  });
  
  return { sanitized, warnings };
}

// Storage utilities
export async function exportData(): Promise<string> {
  const { db } = await import('./database');
  
  const data = {
    medications: await db.medications.toArray(),
    medicationLogs: await db.medicationLogs.toArray(),
    vitals: await db.vitals.toArray(),
    settings: await db.settings.toArray(),
    voiceNotes: await db.voiceNotes.toArray(),
    userProfile: await db.userProfile.toArray(),
    exportDate: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonData: string): Promise<{ success: boolean; errors: string[] }> {
  try {
    const data = JSON.parse(jsonData);
    const { db } = await import('./database');
    
    // Validate required fields
    if (!data.exportDate) {
      return { success: false, errors: ['Invalid data format'] };
    }
    
    // Clear existing data
    await db.medications.clear();
    await db.medicationLogs.clear();
    await db.vitals.clear();
    await db.settings.clear();
    await db.voiceNotes.clear();
    await db.userProfile.clear();
    
    // Import new data
    if (data.medications) await db.medications.bulkAdd(data.medications);
    if (data.medicationLogs) await db.medicationLogs.bulkAdd(data.medicationLogs);
    if (data.vitals) await db.vitals.bulkAdd(data.vitals);
    if (data.settings) await db.settings.bulkAdd(data.settings);
    if (data.voiceNotes) await db.voiceNotes.bulkAdd(data.voiceNotes);
    if (data.userProfile) await db.userProfile.bulkAdd(data.userProfile);
    
    return { success: true, errors: [] };
  } catch (error) {
    return { success: false, errors: ['Failed to parse data: ' + (error as Error).message] };
  }
}

// Theme utilities
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: 'light' | 'dark' | 'auto') {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
  
  root.classList.remove('light', 'dark');
  root.classList.add(actualTheme);
  root.setAttribute('data-theme', actualTheme);
}