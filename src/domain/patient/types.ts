/**
 * Patient Demographics & Profile Domain Model
 */

export type PatientLanguage = "en" | "hi" | "hinglish" | "bn" | "ta" | "te" | "mr";

export type VisitType = "NEW" | "FOLLOW_UP";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNDISCLOSED";

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
