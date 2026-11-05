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

const resolveSpeechLanguageCode = (language: string): string => {
  switch (language) {
    case "hi":
    case "hinglish":
      return "hi-IN";
    case "bn":
      return "bn-IN";
    case "ta":
      return "ta-IN";
    case "te":
      return "te-IN";
    case "mr":
      return "mr-IN";
    case "en":
    default:
      return "en-IN";
  }
};

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
      logger.warn("BrowserSpeechAdapter", "SpeechRecognition API not supported in this browser.");
      onError("Speech recognition is not available in this browser. Please use text input instead.");
      return;
    }

    try {
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }

      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = resolveSpeechLanguageCode(language);

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
        const friendlyError =
          e.error === "not-allowed"
            ? "Microphone access was blocked. Please allow access and try again."
            : e.error === "no-speech"
              ? "No speech was detected. Please speak a bit louder or try again."
              : e.error === "network"
                ? "Speech service is temporarily unavailable. Please try again or use text input."
                : `Speech recognition failed: ${e.error}`;
        this.recognition = null;
        onError(friendlyError);
      };

      this.recognition.onend = () => {
        this.recognition = null;
      };

      this.recognition.start();
    } catch (err) {
      logger.error("BrowserSpeechAdapter", "Failed to start recognition", { err });
      this.recognition = null;
      onError("Microphone unavailable or permission denied. Please use text input instead.");
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
    utterance.lang = resolveSpeechLanguageCode(language);
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
