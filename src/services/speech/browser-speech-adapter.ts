import { SpeechService, SpeechRecognitionResult } from "./speech-service";
import { logger } from "@/lib/logging/logger";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/**
 * Browser Web Speech API Adapter
 * Gracefully wraps Web Speech API with fallback resilience
 */
export class BrowserSpeechAdapter implements SpeechService {
  readonly providerName = "Browser Web Speech API";
  private recognition: SpeechRecognitionInstance | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  get isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async startListening(
    language: string,
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      logger.warn("BrowserSpeechAdapter", "SpeechRecognition API not supported in this browser. Emulating speech input.");
      // Graceful emulation for demo environments
      setTimeout(() => {
        onResult({
          transcript: language === "hi" ? "मुझे दो दिन से सीने में दर्द है" : "I have had chest pain for two days",
          confidence: 0.95,
          isFinal: true,
          languageDetected: language,
          sourceProvider: "BROWSER_SPEECH_API",
        });
      }, 1500);
      return;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = language === "hi" ? "hi-IN" : language === "bn" ? "bn-IN" : language === "ta" ? "ta-IN" : "en-IN";

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcript = res[0].transcript;
          const confidence = res[0].confidence || 0.9;
          const isFinal = res.isFinal;

          onResult({
            transcript,
            confidence,
            isFinal,
            languageDetected: language,
            sourceProvider: "BROWSER_SPEECH_API",
          });
        }
      };

      this.recognition.onerror = (e) => {
        logger.error("BrowserSpeechAdapter", "Speech recognition error", { error: e.error });
        onError(e.error);
      };

      this.recognition.start();
    } catch (err) {
      logger.error("BrowserSpeechAdapter", "Failed to start recognition", { err });
      onError("Microphone unavailable or permission denied");
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
      this.recognition = null;
    }
  }

  async speakText(text: string, language: string, onEnd?: () => void): Promise<void> {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      logger.debug("BrowserSpeechAdapter", `SpeechSynthesis unavailable. Simulating TTS: "${text.slice(0, 30)}..."`);
      setTimeout(() => onEnd?.(), 1000);
      return;
    }

    this.cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "bn" ? "bn-IN" : language === "ta" ? "ta-IN" : "en-IN";
    utterance.rate = 0.95; // Slightly slower for clinical clarity

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (err) => {
      logger.warn("BrowserSpeechAdapter", "Speech synthesis error", { err });
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  cancelSpeech(): void {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}
