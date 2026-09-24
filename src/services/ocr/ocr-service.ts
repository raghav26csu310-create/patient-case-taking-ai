import { DocumentArtifact, ExtractedDocumentFact, LabObservation } from "@/domain/documents/types";
import { logger } from "@/lib/logging/logger";

/**
 * OCR & Document Processing Service Abstraction
 * Enforces raw text preservation and bounding box capture
 */

export interface OCRProcessingResult {
  documentId: string;
  rawExtractedText: string;
  facts: ExtractedDocumentFact[];
  labObservations: LabObservation[];
  processingStatus: "SUCCESS" | "PARTIAL" | "FAILED";
}

export interface OCRService {
  readonly providerName: string;
  processDocument(file: File | Blob, documentType: DocumentArtifact["documentType"]): Promise<OCRProcessingResult>;
}

export class MockOCRService implements OCRService {
  readonly providerName = "MOCK / DEMO OCR Service";

  async processDocument(_file: File | Blob, documentType: DocumentArtifact["documentType"]): Promise<OCRProcessingResult> {
    logger.debug("MockOCRService", "Processing document in mock mode", { documentType });
    return {
      documentId: "doc-mock-001",
      rawExtractedText: "[DEMO OCR RAW TEXT]\nDr. Sharma OPD Chit\nRx: Tab Metformin 500mg BID\nTab Telmisartan 40mg OD",
      facts: [
        {
          id: "fact-mock-1",
          factType: "MEDICATION",
          extractedText: "Tab Metformin 500mg BID",
          confidenceScore: 0.94,
          boundingBox: { x: 120, y: 340, width: 280, height: 45, pageNumber: 1 },
          evidenceCitation: {
            id: "evidence-ocr-001",
            sourceType: "SCANNED_DOCUMENT",
            timestamp: new Date().toISOString(),
            normalizedRepresentation: "Metformin 500mg Twice Daily",
            verificationStatus: "UNVERIFIED",
            documentMetadata: {
              documentId: "doc-mock-001",
              documentTitle: "demo_prescription.pdf",
              pageNumber: 1,
              rawOcrString: "Tab Metformin 500mg BID",
              boundingBox: { x: 120, y: 340, width: 280, height: 45, pageNumber: 1 },
            },
          },
        },
      ],
      labObservations: [
        {
          id: "lab-mock-1",
          testName: "Hemoglobin (Hb)",
          measuredValue: "9.8",
          unit: "g/dL",
          referenceRange: "12.0 - 15.5 g/dL",
          interpretation: "LOW", // Stated as an observation, NOT an autonomous diagnosis of anemia
          evidenceCitationId: "evidence-lab-001",
        },
      ],
      processingStatus: "SUCCESS",
    };
  }
}

let activeOcrService: OCRService = new MockOCRService();

export function getOCRService(): OCRService {
  return activeOcrService;
}

export function setOCRService(service: OCRService): void {
  activeOcrService = service;
}
