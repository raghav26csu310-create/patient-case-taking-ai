import { DocumentBoundingBox, EvidenceCitation } from "@/domain/evidence/types";

/**
 * Document AI & OCR Domain Models
 * Enforces raw text preservation and strict anti-hallucination rules
 */

export type DocumentType = "PRESCRIPTION" | "LAB_REPORT" | "DISCHARGE_SUMMARY" | "RADIOLOGY" | "OTHER";

export interface LabObservation {
  id: string;
  testName: string;
  measuredValue: string;
  unit: string;
  referenceRange: string;
  interpretation: "NORMAL" | "HIGH" | "LOW" | "CRITICAL" | "INDETERMINATE";
  evidenceCitationId: string;
}

export interface ExtractedDocumentFact {
  id: string;
  factType: "MEDICATION" | "LAB_VALUE" | "PRIOR_DIAGNOSIS" | "DOCTOR_NOTE";
  extractedText: string;
  confidenceScore: number;
  boundingBox?: DocumentBoundingBox;
  evidenceCitation: EvidenceCitation;
}

export interface DocumentArtifact {
  id: string;
  patientId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  pageCount: number;
  rawOcrText?: string;
  extractedFacts: ExtractedDocumentFact[];
  labObservations: LabObservation[];
  previewUri?: string;
}
