import { EvidenceCitation } from "@/domain/evidence/types";

/**
 * Clinical Domain Models
 * Implements standard Indian Medical Council & OLDCARTS / SOCRATES structures
 */

export interface PainMapInput {
  bodyRegion: string;
  /** Alias for bodyRegion used in UI display */
  region?: string;
  side: "ANTERIOR" | "POSTERIOR" | "LEFT" | "RIGHT" | "BILATERAL";
  coordinates?: { x: number; y: number };
  intensityVisualScale: number; // 0 to 10
  /** Alias for intensityVisualScale used in UI display */
  intensity?: number;
  descriptors: string[]; // e.g. "burning", "throbbing", "sharp"
  /** Primary descriptor for display */
  character?: string;
}

export interface ChiefComplaint {
  id: string;
  complaint: string;
  durationText: string;
  /** Alias for durationText used in UI display */
  duration?: string;
  snomedCode?: string;
  severityScale?: number; // 0-10
  /** Alias for severityScale used in UI display */
  severity?: number;
  evidenceCitationId: string;
}

export interface HpiSocrates {
  site?: string;
  onset?: "SUDDEN" | "GRADUAL";
  character?: string;
  radiation?: string;
  associations?: string[];
  timing?: string;
  /** Alias for timing used in UI display */
  duration?: string;
  exacerbatingFactors?: string[];
  relievingFactors?: string[];
  severityScale?: number; // 0-10
  pathwayType?: "PAIN" | "FEVER" | "RESPIRATORY" | "GASTROINTESTINAL" | "NEUROLOGICAL" | "SKIN" | "GENERAL";
}

export interface PastMedicalHistoryItem {
  id: string;
  condition: string;
  diagnosedDuration: string;
  /** Alias for diagnosedDuration used in UI display */
  approximateOnset?: string;
  status: "ACTIVE" | "CONTROLLED" | "RESOLVED" | "UNKNOWN";
  evidenceCitationId?: string;
}

export interface PastSurgicalHistoryItem {
  id: string;
  procedureName: string;
  /** Alias for procedureName used in UI display */
  procedure?: string;
  approximateYear?: string;
  complications?: string;
  evidenceCitationId?: string;
}

export interface MedicationStatement {
  id: string;
  drugName: string;
  /** Alias for drugName used in UI display */
  medicationName?: string;
  genericName?: string;
  dosage?: string | null; // NULL if not explicitly stated in source (Anti-hallucination)
  frequency?: string | null;
  duration?: string | null;
  adherenceSelfReported?: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT" | "UNKNOWN";
  /** Alias for adherenceSelfReported used in UI display */
  adherenceReported?: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT" | "UNKNOWN";
  sourceType?: "PATIENT_REPORTED" | "PRESCRIPTION_SCAN" | "DISCHARGE_SUMMARY";
  evidenceCitationId: string;
}

export interface AllergyStatement {
  id: string;
  allergen: string;
  /** Alias for allergen used in UI display */
  substance?: string;
  reactionType?: string;
  /** Alias for reactionType used in UI display */
  manifestation?: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
  evidenceCitationId: string;
}

export interface FamilyHistoryItem {
  id: string;
  condition: string;
  relation: "FATHER" | "MOTHER" | "SIBLING" | "GRANDPARENT" | "OTHER";
  ageOfOnset?: string;
}

export interface PersonalSocialHistory {
  dietaryPreference: "VEGETARIAN" | "NON_VEGETARIAN" | "VEGAN" | "OVA_LACTO" | "OTHER";
  tobaccoUse: "NONE" | "CIGARETTE" | "BIDI" | "GUTKHA_CHEWING" | "FORMER";
  alcoholUse: "NONE" | "OCCASIONAL" | "REGULAR" | "FORMER";
  occupation?: string;
  physicalActivityLevel?: "SEDENTARY" | "MODERATE" | "ACTIVE";
}

export interface AyushHistory {
  isIncluded: boolean;
  /** AYUSH tradition system */
  tradition?: "AYURVEDA" | "YOGA" | "UNANI" | "SIDDHA" | "HOMEOPATHY";
  prakritiPrimary?: "VATA" | "PITTA" | "KAPHA" | "VATA_PITTA" | "PITTA_KAPHA" | "VATA_KAPHA" | "TRIDOSHA";
  /** Alias for prakritiPrimary used in UI display (e.g. "Vata-Pitta") */
  prakriti?: string;
  agni?: "SAMA" | "VISHAMA" | "TIKSHNA" | "MANDA";
  koshtha?: "MRUDU" | "MADHYAMA" | "KRURA";
  /** Nadi (pulse) observation text */
  nadiObservation?: string;
  aharaHabits?: string;
  viharaHabits?: string;
  /** Current home remedies and traditional preparations */
  concurrentHomeRemedies?: string[];
  disclaimer: string;
}

export interface ClinicalFact {
  id: string;
  category:
    | "CHIEF_COMPLAINT"
    | "HPI"
    | "PAST_MEDICAL"
    | "SURGICAL"
    | "MEDICATION"
    | "ALLERGY"
    | "FAMILY"
    | "SOCIAL"
    | "ROS"
    | "AYUSH";
  statement: string;
  sourceCategory: "PATIENT_REPORTED" | "DOCUMENT_DERIVED" | "AI_EXTRACTED" | "PHYSICIAN_VERIFIED";
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
  integumentary?: { positive: string[]; negative: string[] };
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  displayDate: string;
  /** Alias for displayDate used in UI display */
  approximateDate?: string;
  eventType:
    | "SYMPTOM_ONSET"
    | "OPD_VISIT"
    | "MEDICATION_START"
    | "MEDICATION_CHANGE"
    | "LAB_INVESTIGATION"
    | "SURGERY"
    | "DOCUMENT_SCAN"
    | "PHYSICIAN_VERIFICATION";
  title: string;
  description: string;
  source: "PATIENT_REPORTED" | "DOCUMENT_DERIVED" | "AI_EXTRACTED" | "PHYSICIAN_VERIFIED";
  evidenceCitationId?: string;
  isVerified: boolean;
  severityFlag?: "CRITICAL" | "WARNING" | "NORMAL";
}

export interface ClinicalSummary {
  id: string;
  patientId: string;
  generatedAt: string;
  chiefComplaints: ChiefComplaint[];
  hpiNarrative: string;
  hpiStructured?: HpiSocrates;
  pastMedicalHistory: PastMedicalHistoryItem[];
  surgicalHistory: PastSurgicalHistoryItem[];
  currentMedications: MedicationStatement[];
  knownAllergies: AllergyStatement[];
  familyHistory?: FamilyHistoryItem[];
  personalHistory?: PersonalSocialHistory;
  ayushHistory?: AyushHistory;
  reviewOfSystems?: ReviewOfSystems;
  timelineEvents: TimelineEvent[];
  missingInformationGaps: string[];
  isPhysicianVerified: boolean;
  verifiedByClinicianId?: string;
  verifiedAt?: string;
  physicianNotes?: string;
}
