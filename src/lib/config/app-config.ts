/**
 * Application Configuration & Operational Mode
 * Supports strictly isolated operational modes: DEMO | MOCK | PRODUCTION
 */

export type AppMode = "DEMO" | "MOCK" | "PRODUCTION";

export interface AppConfig {
  mode: AppMode;
  appName: string;
  facilityName: string;
  aiProvider: "mock" | "gemini" | "openai" | "anthropic";
  speechProvider: "browser" | "mock" | "bhashini" | "cloud";
  ocrProvider: "mock" | "tesseract" | "vision_cloud";
  isDemoMode: boolean;
  isMockMode: boolean;
  isProduction: boolean;
}

export const APP_CONFIG: AppConfig = {
  mode: (process.env.NEXT_PUBLIC_APP_MODE as AppMode) || "DEMO",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "SIH26047 Patient Case-Taking AI",
  facilityName: process.env.NEXT_PUBLIC_FACILITY_NAME || "AIIMS OPD First-Mile Kiosk",
  aiProvider: (process.env.AI_PROVIDER as AppConfig["aiProvider"]) || "mock",
  speechProvider: (process.env.SPEECH_PROVIDER as AppConfig["speechProvider"]) || "browser",
  ocrProvider: (process.env.OCR_PROVIDER as AppConfig["ocrProvider"]) || "mock",
  isDemoMode: (process.env.NEXT_PUBLIC_APP_MODE || "DEMO") === "DEMO",
  isMockMode: (process.env.NEXT_PUBLIC_APP_MODE || "DEMO") === "MOCK",
  isProduction: process.env.NEXT_PUBLIC_APP_MODE === "PRODUCTION",
};
