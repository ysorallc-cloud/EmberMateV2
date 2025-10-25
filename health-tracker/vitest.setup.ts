import '@testing-library/jest-dom';

// Mock IndexedDB for testing
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
});

// Mock Web Speech API
Object.defineProperty(window, 'SpeechRecognition', {
  value: class MockSpeechRecognition {
    continuous = false;
    interimResults = false;
    lang = 'en-US';
    maxAlternatives = 1;
    
    onresult = null;
    onerror = null;
    onend = null;
    
    start() {}
    stop() {}
    abort() {}
  },
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: window.SpeechRecognition,
});

// Mock crypto.randomUUID
Object.defineProperty(crypto, 'randomUUID', {
  value: () => 'mock-uuid-1234',
});