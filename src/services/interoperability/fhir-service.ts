import { ClinicalSummary } from "@/domain/clinical/types";
import { InteroperabilityExportResult } from "@/domain/interoperability/types";
import { logger } from "@/lib/logging/logger";

/**
 * FHIR R4 Serialization Service
 */

export interface FHIRService {
  generateFhirBundle(summary: ClinicalSummary): Promise<InteroperabilityExportResult>;
}

export class MockFHIRService implements FHIRService {
  async generateFhirBundle(summary: ClinicalSummary): Promise<InteroperabilityExportResult> {
    logger.debug("MockFHIRService", "Generating FHIR R4 bundle in mock mode", { summaryId: summary.id });
    
    const mockBundle = {
      resourceType: "Bundle",
      id: `bundle-${summary.id}`,
      type: "document",
      timestamp: new Date().toISOString(),
      entry: [
        { resource: { resourceType: "Composition", status: "preliminary", title: "OPD Case Summary" } },
        { resource: { resourceType: "Condition", code: { text: "Chest Pain" } } },
        { resource: { resourceType: "MedicationStatement", status: "active" } },
        { resource: { resourceType: "Observation", status: "registered" } },
      ],
    };

    return {
      bundleId: `bundle-${summary.id}`,
      patientId: summary.patientId,
      fhirVersion: "R4",
      status: "GENERATED_LOCAL",
      generatedAt: new Date().toISOString(),
      resourceCounts: {
        compositionCount: 1,
        conditionCount: summary.chiefComplaints.length,
        medicationStatementCount: summary.currentMedications.length,
        observationCount: 2,
        allergyIntoleranceCount: summary.knownAllergies.length,
      },
      rawFhirJson: JSON.stringify(mockBundle, null, 2),
      abdmBridgeMessage: "[MOCK / DEMO] Local FHIR R4 bundle compiled. Ready for clinical review or mock sandbox bridge.",
      isExternalTransmissionVerified: false,
    };
  }
}

let activeFhirService: FHIRService = new MockFHIRService();

export function getFHIRService(): FHIRService {
  return activeFhirService;
}

export function setFHIRService(service: FHIRService): void {
  activeFhirService = service;
}
