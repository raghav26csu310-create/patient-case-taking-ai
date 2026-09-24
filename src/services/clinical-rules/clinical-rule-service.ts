import { ClinicalFact } from "@/domain/clinical/types";
import { TriageAlert } from "@/domain/triage/types";
import { logger } from "@/lib/logging/logger";

/**
 * Deterministic Clinical Rule Service
 * Evaluates coded medical emergency rules strictly independent of LLMs
 */

export interface ClinicalRuleService {
  evaluateTriage(facts: ClinicalFact[]): Promise<TriageAlert[]>;
}

export class MockClinicalRuleService implements ClinicalRuleService {
  async evaluateTriage(facts: ClinicalFact[]): Promise<TriageAlert[]> {
    logger.debug("MockClinicalRuleService", "Evaluating deterministic rules", { factsCount: facts.length });
    
    // Deterministic mock emergency rule trigger for demonstration
    return [
      {
        id: "alert-demo-001",
        ruleId: "RF-CARD-001",
        ruleTitle: "Potential Acute Coronary Syndrome (ACS)",
        severity: "EMERGENCY",
        clinicalReason: "[DEMO] Reported retrosternal chest pain with left arm radiation in patient with vascular risk factors.",
        triggeringEvidenceIds: ["evidence-mock-001"],
        suggestedAction: "Immediate ECG, SpO2 check, and direct triage to Resuscitation/Cardiology Bay.",
        departmentRoutingRecommendation: "CARDIOLOGY / EMERGENCY",
        createdAt: new Date().toISOString(),
        status: "ACTIVE",
      },
    ];
  }
}

let activeRuleService: ClinicalRuleService = new MockClinicalRuleService();

export function getClinicalRuleService(): ClinicalRuleService {
  return activeRuleService;
}

export function setClinicalRuleService(service: ClinicalRuleService): void {
  activeRuleService = service;
}
