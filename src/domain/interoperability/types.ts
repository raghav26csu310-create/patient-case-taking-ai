/**
 * Interoperability Domain Models
 * Strictly distinguishes between local FHIR R4 generation and external ABDM ecosystem bridge
 */

export type InteroperabilityStatus = "GENERATED_LOCAL" | "VALIDATED_FHIR_R4" | "SIMULATED_SANDBOX" | "TRANSMITTED_EXTERNAL_ABDM";

export interface FhirResourceCount {
  compositionCount: number;
  conditionCount: number;
  medicationStatementCount: number;
  observationCount: number;
  allergyIntoleranceCount: number;
}

export interface InteroperabilityExportResult {
  bundleId: string;
  patientId: string;
  fhirVersion: "R4";
  status: InteroperabilityStatus;
  generatedAt: string;
  resourceCounts: FhirResourceCount;
  rawFhirJson: string;
  abdmBridgeMessage: string;
  isExternalTransmissionVerified: boolean; // FALSE unless live verified government bridge is active
}
