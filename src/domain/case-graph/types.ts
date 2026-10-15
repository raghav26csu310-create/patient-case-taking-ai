import { PatientDemographics, PatientSession } from "@/domain/patient/types";
import {
  ChiefComplaint,
  HpiSocrates,
  PastMedicalHistoryItem,
  PastSurgicalHistoryItem,
  MedicationStatement,
  AllergyStatement,
  FamilyHistoryItem,
  PersonalSocialHistory,
  AyushHistory,
  ReviewOfSystems,
  TimelineEvent,
  ClinicalSummary,
  PainMapInput,
} from "@/domain/clinical/types";
import { DocumentArtifact, LabObservation } from "@/domain/documents/types";
import { EvidenceCitation } from "@/domain/evidence/types";
import { TriageAlert } from "@/domain/triage/types";
import { ConsentRecord } from "@/domain/consent/types";

/**
 * Unified Patient Case Graph Model
 * Represents the complete, interconnected, provenance-backed clinical encounter.
 */

export interface VerificationLog {
  id: string;
  targetEntityId: string;
  targetEntityType:
    | "COMPLAINT"
    | "CHIEF_COMPLAINT"
    | "HPI"
    | "PAST_MEDICAL"
    | "SURGERY"
    | "MEDICATION"
    | "ALLERGY"
    | "LAB"
    | "DOCUMENT";
  action: "ACCEPTED" | "EDITED" | "REJECTED" | "FLAGGED";
  clinicianId: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  rationale?: string;
}

export interface PatientCaseGraph {
  session: PatientSession;
  demographics: PatientDemographics;
  consent: ConsentRecord;
  painMap?: PainMapInput;
  chiefComplaints: ChiefComplaint[];
  hpiStructured?: HpiSocrates;
  pastMedicalHistory: PastMedicalHistoryItem[];
  surgicalHistory: PastSurgicalHistoryItem[];
  medications: MedicationStatement[];
  allergies: AllergyStatement[];
  familyHistory: FamilyHistoryItem[];
  personalHistory?: PersonalSocialHistory;
  ayushHistory?: AyushHistory;
  reviewOfSystems?: ReviewOfSystems;
  documents: DocumentArtifact[];
  labObservations: LabObservation[];
  timeline: TimelineEvent[];
  triageAlerts: TriageAlert[];
  evidenceGraph: Record<string, EvidenceCitation>;
  verificationLogs: VerificationLog[];
  summary?: ClinicalSummary;
  isPhysicianVerified: boolean;
  activeScenarioId?: string;
}
