import { logger } from "@/lib/logging/logger";

/**
 * Text-to-Speech (TTS) Service Abstraction
 */

export interface TTSService {
  speak(text: string, language: string): Promise<void>;
  stop(): void;
}

export class MockTTSService implements TTSService {
  async speak(text: string, language: string): Promise<void> {
    logger.debug("MockTTSService", `Emulating TTS speech in language: ${language}`, { text });
  }

  stop(): void {
    logger.debug("MockTTSService", "Stopped TTS speech");
  }
}

let activeTtsService: TTSService = new MockTTSService();

export function getTTSService(): TTSService {
  return activeTtsService;
}

export function setTTSService(service: TTSService): void {
  activeTtsService = service;
}
