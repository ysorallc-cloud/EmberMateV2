'use client';

export interface VoiceRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
}

export class VoiceRecognition {
  private recognition: any | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private onResultCallback?: (result: VoiceRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.isSupported = true;
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let confidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        confidence = result[0].confidence;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text && this.onResultCallback) {
        this.onResultCallback({
          text: text.trim(),
          confidence,
          isFinal: !!finalTranscript,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  start(options: VoiceRecognitionOptions = {}) {
    if (!this.isSupported || !this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      this.stop();
    }

    this.recognition.continuous = options.continuous ?? true;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.lang = options.language ?? 'en-US';
    this.recognition.maxAlternatives = options.maxAlternatives ?? 1;

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      throw new Error('Failed to start voice recognition');
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  abort() {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  onResult(callback: (result: VoiceRecognitionResult) => void) {
    this.onResultCallback = callback;
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  onEnd(callback: () => void) {
    this.onEndCallback = callback;
  }

  getSupported(): boolean {
    return this.isSupported;
  }

  getListening(): boolean {
    return this.isListening;
  }
}

// Hook for using voice recognition
export function useVoiceRecognition() {
  const voiceRecognition = new VoiceRecognition();

  return {
    isSupported: voiceRecognition.getSupported(),
    isListening: voiceRecognition.getListening(),
    start: voiceRecognition.start.bind(voiceRecognition),
    stop: voiceRecognition.stop.bind(voiceRecognition),
    abort: voiceRecognition.abort.bind(voiceRecognition),
    onResult: (callback: (result: VoiceRecognitionResult) => void) => voiceRecognition.onResult(callback),
    onError: (callback: (error: string) => void) => voiceRecognition.onError(callback),
    onEnd: (callback: () => void) => voiceRecognition.onEnd(callback),
  };
}

// Utility function to check browser support
export function isVoiceRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return !!SpeechRecognition;
}

// Utility function to get available languages
export function getAvailableLanguages(): string[] {
  // Common languages supported by most browsers
  return [
    'en-US',
    'en-GB',
    'es-ES',
    'fr-FR',
    'de-DE',
    'it-IT',
    'pt-BR',
    'ru-RU',
    'ja-JP',
    'ko-KR',
    'zh-CN',
  ];
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}