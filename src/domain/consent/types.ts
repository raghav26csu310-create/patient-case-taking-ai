/**
 * Patient Informed Consent Domain Models
 * Compliant with India's Digital Personal Data Protection (DPDP) Act 2023
 */

export interface ConsentRecord {
  patientId: string;
  hasConsentedToAudioRecording: boolean;
  hasConsentedToDocumentProcessing: boolean;
  hasConsentedToClinicalSynthesis: boolean;
  audioPlaybackListened: boolean;
  consentLanguage: string;
  consentedAt: string;
  consentMethod: "VOICE_AFFIRMATION" | "TOUCH_SCREEN_SELECTION" | "ASSISTED_CLINICAL_STAFF";
  dataRetentionHours: number; // Ephemeral default: 24h
  revokedAt?: string;
}
