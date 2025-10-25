import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db, initializeDefaultSettings, detectPII } from '@/lib/database';

// Mock Dexie
vi.mock('dexie', () => {
  const mockDb = {
    medications: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(1),
      update: vi.fn().mockResolvedValue(1),
      delete: vi.fn().mockResolvedValue(1),
      clear: vi.fn().mockResolvedValue(undefined),
    },
    medicationLogs: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(1),
      bulkAdd: vi.fn().mockResolvedValue(1),
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      delete: vi.fn().mockResolvedValue(1),
      clear: vi.fn().mockResolvedValue(undefined),
    },
    vitals: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(1),
      update: vi.fn().mockResolvedValue(1),
      delete: vi.fn().mockResolvedValue(1),
      clear: vi.fn().mockResolvedValue(undefined),
      orderBy: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue(null),
      limit: vi.fn().mockReturnThis(),
      sortBy: vi.fn().mockResolvedValue([]),
      where: vi.fn().mockReturnThis(),
      above: vi.fn().mockReturnThis(),
    },
    settings: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(1),
      put: vi.fn().mockResolvedValue(1),
      get: vi.fn().mockResolvedValue(null),
      clear: vi.fn().mockResolvedValue(undefined),
    },
    voiceNotes: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(1),
      clear: vi.fn().mockResolvedValue(undefined),
    },
    userProfile: {
      toArray: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(1),
      update: vi.fn().mockResolvedValue(1),
      clear: vi.fn().mockResolvedValue(undefined),
      orderBy: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue(null),
    },
  };
  
  return {
    default: class MockDexie {
      constructor() {
        Object.assign(this, mockDb);
        this.version = vi.fn().mockReturnThis();
        this.stores = vi.fn().mockReturnThis();
        
        // Add hook method to each table
        Object.keys(mockDb).forEach(key => {
          this[key].hook = vi.fn().mockReturnThis();
        });
      }
    },
  };
});

describe('Database', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize default settings', async () => {
    const mockSettings = {
      toArray: vi.fn().mockResolvedValue([]),
      bulkAdd: vi.fn().mockResolvedValue(1),
    };
    
    // Mock the settings table
    (db as any).settings = mockSettings;
    
    await initializeDefaultSettings();
    
    expect(mockSettings.bulkAdd).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'disclaimerAccepted', value: false }),
        expect.objectContaining({ key: 'voiceInputEnabled', value: true }),
        expect.objectContaining({ key: 'darkMode', value: 'auto' }),
        expect.objectContaining({ key: 'notifications', value: true }),
        expect.objectContaining({ key: 'weightChangeThreshold', value: 5 }),
        expect.objectContaining({ key: 'heartRateMin', value: 60 }),
        expect.objectContaining({ key: 'heartRateMax', value: 100 }),
      ])
    );
  });

  it('should detect PII in text', () => {
    const testCases = [
      {
        text: 'My email is john@example.com',
        expected: [{ type: 'email', matches: ['john@example.com'] }],
      },
      {
        text: 'Call me at 555-123-4567',
        expected: [{ type: 'phone', matches: ['555-123-4567'] }],
      },
      {
        text: 'My SSN is 123-45-6789',
        expected: [{ type: 'ssn', matches: ['123-45-6789'] }],
      },
      {
        text: 'I live at 123 Main Street',
        expected: [{ type: 'address', matches: ['123 Main Street'] }],
      },
      {
        text: 'No PII here',
        expected: [],
      },
    ];

    testCases.forEach(({ text, expected }) => {
      const result = detectPII(text);
      expect(result).toEqual(expected);
    });
  });
});