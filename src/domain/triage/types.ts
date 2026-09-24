/**
 * Deterministic Triage Domain Models
 * Explicitly decoupled from LLM non-determinism
 */

export type TriageSeverity = "EMERGENCY" | "URGENT" | "STANDARD";

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "DISMISSED" | "ESCALATED";

export interface TriageAlert {
  id: string;
  ruleId: string;
  ruleTitle: string;
  severity: TriageSeverity;
  clinicalReason: string;
  triggeringEvidenceIds: string[];
  suggestedAction: string;
  departmentRoutingRecommendation: string;
  createdAt: string;
  status: AlertStatus;
  acknowledgedByClinicianId?: string;
  acknowledgedAt?: string;
  clinicalActionTaken?: string;
}

export interface DepartmentRouting {
  departmentCode: "MEDICINE" | "CARDIOLOGY" | "ORTHOPAEDICS" | "PULMONOLOGY" | "ENT" | "SURGERY" | "PEDIATRICS" | "DERMATOLOGY";
  departmentName: string;
  priorityLevel: TriageSeverity;
  routingRationale: string;
}
