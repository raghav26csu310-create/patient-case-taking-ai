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
  /** Alias for measuredValue used in UI display */
  value?: string;
  unit: string;
  referenceRange: string;
  interpretation: "NORMAL" | "HIGH" | "LOW" | "CRITICAL" | "INDETERMINATE";
  /** Derived flag for UI rendering: true when interpretation is HIGH, LOW, or CRITICAL */
  isAbnormal?: boolean;
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
  /** Short preview snippet for clinician cockpit display (first ~200 chars of rawOcrText) */
  extractedTextSnippet?: string;
  /** OCR confidence score 0-1 */
  ocrConfidence?: number;
  extractedFacts: ExtractedDocumentFact[];
  labObservations: LabObservation[];
  previewUri?: string;
}
