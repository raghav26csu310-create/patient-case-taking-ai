/**
 * Evidence & Provenance Domain Models
 * Reusable domain capability for zero-hallucination source tracking
 */

export type SourceType = "PATIENT_INTERVIEW" | "SCANNED_DOCUMENT" | "MANUAL_CLINICIAN_ENTRY";

export type VerificationStatus = "UNVERIFIED" | "VERIFIED" | "EDITED" | "REJECTED";

export interface AudioEvidenceMetadata {
  recordingId: string;
  durationMs: number;
  sampleRate: number;
  ephemeralUri?: string;
  retentionExpiresAt?: string;
  isSyntheticDemo: boolean;
}

export interface DocumentBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

export interface DocumentEvidenceMetadata {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  boundingBox?: DocumentBoundingBox;
  rawOcrString: string;
  referenceRange?: string;
  cropPreviewUri?: string;
}

export interface EvidenceCitation {
  id: string;
  sourceType: SourceType;
  timestamp: string;
  originalLanguage?: string;
  rawUtterance?: string;
  normalizedRepresentation: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  auditNotes?: string;
  audioMetadata?: AudioEvidenceMetadata;
  documentMetadata?: DocumentEvidenceMetadata;
}
