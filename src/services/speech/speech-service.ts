import { logger } from "@/lib/logging/logger";

/**
 * Speech Service Abstraction
 * Provider-agnostic interface for Speech-to-Text (STT) and Text-to-Speech (TTS)
 */

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  languageDetected: string;
  sourceProvider: "BROWSER_SPEECH_API" | "BHASHINI" | "CLOUD_STT" | "MOCK";
}

export interface SpeechService {
  readonly providerName: string;
  readonly isAvailable: boolean;

  startListening(
    language: string,
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void
  ): Promise<void>;

  stopListening(): Promise<void>;

  speakText(text: string, language: string, onEnd?: () => void): Promise<void>;

  cancelSpeech(): void;
}

/**
 * Mock Speech Service
 * Safe fallback for environments without microphone support or automated testing
 */
export class MockSpeechService implements SpeechService {
  readonly providerName = "MOCK / DEMO Speech Service";
  readonly isAvailable = true;
  private isListening = false;

  async startListening(
    language: string,
    onResult: (result: SpeechRecognitionResult) => void
  ): Promise<void> {
    this.isListening = true;
    logger.debug("MockSpeechService", "Mock listening started", { language });

    // Emulate safe demo response
    setTimeout(() => {
      if (this.isListening) {
        onResult({
          transcript: "[DEMO] Mujhe do din se seene mein dard hai",
          confidence: 0.98,
          isFinal: true,
          languageDetected: language,
          sourceProvider: "MOCK",
        });
      }
    }, 1500);
  }

  async stopListening(): Promise<void> {
    this.isListening = false;
    logger.debug("MockSpeechService", "Mock listening stopped");
  }

  async speakText(text: string, language: string, onEnd?: () => void): Promise<void> {
    logger.debug("MockSpeechService", `[MOCK TTS Speaking]: "${text}" (${language})`);
    setTimeout(() => {
      onEnd?.();
    }, 500);
  }

  cancelSpeech(): void {
    logger.debug("MockSpeechService", "Mock speech cancelled");
  }
}

let activeSpeechService: SpeechService = new MockSpeechService();

export function getSpeechService(): SpeechService {
  return activeSpeechService;
}

export function setSpeechService(service: SpeechService): void {
  activeSpeechService = service;
  logger.info("SpeechService", `Active speech provider set to: ${service.providerName}`);
}
