import { EvidenceCitation } from "@/domain/evidence/types";

/**
 * Clinical Domain Models
 * Implements standard Indian Medical Council & OLDCARTS / SOCRATES structures
 */

export interface PainMapInput {
  bodyRegion: string;
  side: "ANTERIOR" | "POSTERIOR" | "LEFT" | "RIGHT" | "BILATERAL";
  coordinates?: { x: number; y: number };
  intensityVisualScale: number; // 0 to 10
  descriptors: string[]; // e.g. "burning", "throbbing", "sharp"
}

export interface ChiefComplaint {
  id: string;
  complaint: string;
  durationText: string;
  snomedCode?: string;
  evidenceCitationId: string;
}

export interface HpiSocrates {
  site?: string;
  onset?: "SUDDEN" | "GRADUAL";
  character?: string;
  radiation?: string;
  associations?: string[];
  timing?: string;
  exacerbatingFactors?: string[];
  relievingFactors?: string[];
  severityScale?: number; // 0-10
}

export interface MedicationStatement {
  id: string;
  drugName: string;
  genericName?: string;
  dosage?: string | null; // NULL if not explicitly stated in source (Anti-hallucination)
  frequency?: string | null;
  duration?: string | null;
  adherenceSelfReported?: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT" | "UNKNOWN";
  evidenceCitationId: string;
}

export interface AllergyStatement {
  id: string;
  allergen: string;
  reactionType?: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
  evidenceCitationId: string;
}

export interface ClinicalFact {
  id: string;
  category: "CHIEF_COMPLAINT" | "HPI" | "PAST_MEDICAL" | "SURGICAL" | "MEDICATION" | "ALLERGY" | "FAMILY" | "SOCIAL" | "ROS";
  statement: string;
  status: "ACTIVE" | "HISTORICAL" | "RESOLVED";
  evidenceCitation: EvidenceCitation;
}

export interface CandidateClinicalFact {
  category: ClinicalFact["category"];
  statement: string;
  confidenceScore: number;
  extractedFromSnippet: string;
}

export interface ReviewOfSystems {
  cardiovascular?: { positive: string[]; negative: string[] };
  respiratory?: { positive: string[]; negative: string[] };
  gastrointestinal?: { positive: string[]; negative: string[] };
  neurological?: { positive: string[]; negative: string[] };
  musculoskeletal?: { positive: string[]; negative: string[] };
  constitutional?: { positive: string[]; negative: string[] };
}

export interface ClinicalSummary {
  id: string;
  patientId: string;
  generatedAt: string;
  chiefComplaints: ChiefComplaint[];
  hpiNarrative: string;
  hpiStructured?: HpiSocrates;
  pastMedicalHistory: string[];
  surgicalHistory: string[];
  currentMedications: MedicationStatement[];
  knownAllergies: AllergyStatement[];
  reviewOfSystems?: ReviewOfSystems;
  missingInformationGaps: string[];
  isPhysicianVerified: boolean;
  verifiedByClinicianId?: string;
}
