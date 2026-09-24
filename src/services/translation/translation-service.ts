import { logger } from "@/lib/logging/logger";

/**
 * Translation & Vernacular Localization Service
 */

export interface TranslationService {
  translate(text: string, sourceLang: string, targetLang: string): Promise<string>;
}

export class MockTranslationService implements TranslationService {
  async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    logger.debug("MockTranslationService", `Translating ${sourceLang} -> ${targetLang}`);
    return `[MOCK TRANSLATION (${targetLang})]: ${text}`;
  }
}

let activeTranslationService: TranslationService = new MockTranslationService();

export function getTranslationService(): TranslationService {
  return activeTranslationService;
}

export function setTranslationService(service: TranslationService): void {
  activeTranslationService = service;
}
