import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  formatTime, 
  isToday, 
  calculateBMI, 
  getBMICategory,
  sanitizeText 
} from '@/lib/utils';

describe('Utils', () => {
  describe('Date formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/2:30/);
    });

    it('should detect today correctly', () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isToday(today)).toBe(true);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('BMI calculations', () => {
    it('should calculate BMI correctly', () => {
      const bmi = calculateBMI(70, 175); // 70kg, 175cm
      expect(bmi).toBeCloseTo(22.86, 2);
    });

    it('should categorize BMI correctly', () => {
      expect(getBMICategory(18.4)).toBe('Underweight');
      expect(getBMICategory(22)).toBe('Normal weight');
      expect(getBMICategory(27)).toBe('Overweight');
      expect(getBMICategory(32)).toBe('Obese');
    });
  });

  describe('Text sanitization', () => {
    it('should sanitize PII in text', () => {
      const text = 'My email is john@example.com and phone is 555-123-4567';
      const { sanitized, warnings } = sanitizeText(text);
      
      expect(sanitized).toBe('My email is [EMAIL] and phone is [PHONE]');
      expect(warnings).toHaveLength(2);
      expect(warnings[0]).toContain('email');
      expect(warnings[1]).toContain('phone');
    });

    it('should handle text without PII', () => {
      const text = 'This is just normal text with no sensitive information';
      const { sanitized, warnings } = sanitizeText(text);
      
      expect(sanitized).toBe(text);
      expect(warnings).toHaveLength(0);
    });
  });
});