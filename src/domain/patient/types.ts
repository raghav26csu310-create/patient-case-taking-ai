import { ConsentRecord } from "@/domain/consent/types";

/**
 * Patient Demographics & Profile Domain Model
 */

export type PatientLanguage = "en" | "hi" | "hinglish" | "bn" | "ta" | "te" | "mr";

export type VisitType = "NEW" | "FOLLOW_UP";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNDISCLOSED";

export type InteractionMode = "VOICE" | "TOUCH" | "TEXT";

export type SessionStatus =
  | "IDENTIFYING"
  | "CONSENT_PENDING"
  | "CONSENTED"
  | "READY_FOR_INTERVIEW"
  | "CANCELLED";

export interface LanguagePreference {
  code: PatientLanguage;
  displayName: string;
  nativeName: string;
  direction: "LTR" | "RTL";
}

export const SUPPORTED_LANGUAGES: LanguagePreference[] = [
  { code: "hi", displayName: "Hindi", nativeName: "हिन्दी", direction: "LTR" },
  { code: "en", displayName: "English", nativeName: "English", direction: "LTR" },
  { code: "bn", displayName: "Bengali", nativeName: "বাংলা", direction: "LTR" },
  { code: "ta", displayName: "Tamil", nativeName: "தமிழ்", direction: "LTR" },
  { code: "te", displayName: "Telugu", nativeName: "తెలుగు", direction: "LTR" },
  { code: "mr", displayName: "Marathi", nativeName: "मराठी", direction: "LTR" },
];

export interface PatientDemographics {
  id: string;
  abhaId?: string;
  opdTokenNumber?: string;
  fullName: string;
  age: number;
  gender: Gender;
  preferredLanguage: PatientLanguage;
  phoneNumber?: string;
  visitType: VisitType;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  registeredAt: string;
}

export interface PatientSession {
  id: string;
  patientId: string;
  language: PatientLanguage;
  interactionMode: InteractionMode;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  patientDemographics?: PatientDemographics;
  consentRecord?: ConsentRecord;
}
