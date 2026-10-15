import { ClinicalSummary } from "@/domain/clinical/types";

/**
 * Standard Synthetic Clinical Case Fixture for Demo & Testing
 * EXPLICITLY MARKED AS DEMO / SYNTHETIC CASE
 */
export const DEMO_CLINICAL_SUMMARY: ClinicalSummary = {
  id: "summary-synthetic-042",
  patientId: "patient-synthetic-042",
  generatedAt: new Date().toISOString(),
  chiefComplaints: [
    {
      id: "cc-demo-1",
      complaint: "[DEMO] Retrosternal chest discomfort radiating to left arm",
      durationText: "2 days",
      snomedCode: "29857009",
      evidenceCitationId: "evidence-demo-001",
    },
  ],
  hpiNarrative:
    "[DEMO / SYNTHETIC CASE] 54-year-old male presenting with dull aching retrosternal heaviness since 48 hours, aggravated by climbing stairs. Patient reports sensation radiating to left inner arm. Denies fever, breathlessness, or diaphoresis.",
  pastMedicalHistory: [
    { id: "pmh-demo-1", condition: "Type 2 Diabetes Mellitus", diagnosedDuration: "5 years ago", status: "ACTIVE" },
    { id: "pmh-demo-2", condition: "Essential Hypertension", diagnosedDuration: "3 years ago", status: "ACTIVE" },
  ],
  surgicalHistory: [],
  timelineEvents: [],
  currentMedications: [
    {
      id: "med-demo-1",
      drugName: "Metformin",
      dosage: "500 mg",
      frequency: "Twice daily (BID)",
      duration: "Ongoing",
      adherenceSelfReported: "COMPLIANT",
      evidenceCitationId: "evidence-demo-002",
    },
    {
      id: "med-demo-2",
      drugName: "Telmisartan",
      dosage: "40 mg",
      frequency: "Once daily (OD)",
      duration: "Ongoing",
      adherenceSelfReported: "COMPLIANT",
      evidenceCitationId: "evidence-demo-003",
    },
  ],
  knownAllergies: [
    {
      id: "alg-demo-1",
      allergen: "Penicillin",
      reactionType: "Urticarial rash & facial edema",
      severity: "SEVERE",
      evidenceCitationId: "evidence-demo-004",
    },
  ],
  missingInformationGaps: [
    "[DEMO] Exact duration of morning stiffness unverified",
    "[DEMO] Recent lipid profile report not presented by patient",
  ],
  isPhysicianVerified: false,
};
