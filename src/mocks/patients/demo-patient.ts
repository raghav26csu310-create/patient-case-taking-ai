import { PatientDemographics } from "@/domain/patient/types";

/**
 * Standard Synthetic Patient Fixture for Demo & Testing
 * EXPLICITLY MARKED AS DEMO / SYNTHETIC CASE
 */
export const DEMO_PATIENT: PatientDemographics = {
  id: "patient-synthetic-042",
  abhaId: "91-4582-1092-4412",
  opdTokenNumber: "OPD-042",
  fullName: "Rameshwar Sharma [DEMO / SYNTHETIC]",
  age: 54,
  gender: "MALE",
  preferredLanguage: "hi",
  phoneNumber: "+91-98765-XXXXX",
  visitType: "FOLLOW_UP",
  emergencyContactName: "Sunita Sharma (Spouse)",
  emergencyContactPhone: "+91-98765-YYYYY",
  registeredAt: new Date().toISOString(),
};
