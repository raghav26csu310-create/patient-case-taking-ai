import { CandidateClinicalFact, ClinicalSummary } from "@/domain/clinical/types";
import { ExtractedDocumentFact } from "@/domain/documents/types";
import { logger } from "@/lib/logging/logger";

/**
 * Provider-Independent Clinical AI Gateway Interface
 * Prevents hardcoupling to any single LLM or provider
 */

export interface ClinicalAIService {
  readonly providerName: string;

  summarizeCase(facts: CandidateClinicalFact[], documents: ExtractedDocumentFact[]): Promise<ClinicalSummary>;

  extractClinicalFacts(rawUtterance: string, language: string): Promise<CandidateClinicalFact[]>;

  structurePatientResponse(promptCategory: string, rawText: string): Promise<Record<string, unknown>>;

  translateClinicalText(text: string, sourceLang: string, targetLang: string): Promise<string>;

  generatePatientFollowUpPrompt(complaint: string, language: string): Promise<string>;
}

/**
 * Mock Clinical AI Service
 * Used in DEMO and MOCK modes. Always explicitly labeled.
 */
export class MockClinicalAIService implements ClinicalAIService {
  readonly providerName = "MOCK / DEMO Clinical Engine";

  async summarizeCase(_facts: CandidateClinicalFact[]): Promise<ClinicalSummary> {
    logger.debug("MockClinicalAIService", "Executing mock case summarization");
    return {
      id: "summary-mock-001",
      patientId: "patient-demo-001",
      generatedAt: new Date().toISOString(),
      chiefComplaints: [
        {
          id: "cc-mock-1",
          complaint: "[DEMO] Retrosternal chest discomfort radiating to left arm",
          durationText: "2 days",
          evidenceCitationId: "evidence-mock-001",
        },
      ],
      hpiNarrative:
        "[DEMO / SYNTHETIC CASE] 54-year-old male with dull aching chest pressure since 48 hours, worsening on exertion. Denies fever or cough.",
      pastMedicalHistory: ["[DEMO] Type 2 Diabetes Mellitus (5 years)", "[DEMO] Hypertension (3 years)"],
      surgicalHistory: ["None reported"],
      currentMedications: [
        {
          id: "med-mock-1",
          drugName: "Metformin",
          dosage: "500 mg",
          frequency: "Twice daily",
          duration: "Continuous",
          adherenceSelfReported: "COMPLIANT",
          evidenceCitationId: "evidence-mock-002",
        },
      ],
      knownAllergies: [
        {
          id: "alg-mock-1",
          allergen: "Penicillin",
          reactionType: "Cutaneous rash",
          severity: "MODERATE",
          evidenceCitationId: "evidence-mock-003",
        },
      ],
      missingInformationGaps: ["[DEMO] Exact onset time of most recent chest pain episode unverified"],
      isPhysicianVerified: false,
    };
  }

  async extractClinicalFacts(rawUtterance: string): Promise<CandidateClinicalFact[]> {
    logger.debug("MockClinicalAIService", "Extracting candidate facts in mock mode", { rawUtterance });
    return [
      {
        category: "CHIEF_COMPLAINT",
        statement: `[DEMO] Extracted complaint from: "${rawUtterance.slice(0, 30)}..."`,
        confidenceScore: 0.95,
        extractedFromSnippet: rawUtterance,
      },
    ];
  }

  async structurePatientResponse(promptCategory: string, rawText: string): Promise<Record<string, unknown>> {
    return {
      category: promptCategory,
      rawInput: rawText,
      structuredCategory: "MOCK_INTERVIEW_NODE",
      isDemo: true,
    };
  }

  async translateClinicalText(text: string): Promise<string> {
    return `[TRANSLATED MOCK]: ${text}`;
  }

  async generatePatientFollowUpPrompt(complaint: string): Promise<string> {
    return `[DEMO QUESTION]: Aapko ye takleef kab se hai? (Since when have you had this: ${complaint}?)`;
  }
}

/**
 * Global AI Gateway Singleton Factory
 */
let activeAiService: ClinicalAIService = new MockClinicalAIService();

export function getClinicalAIService(): ClinicalAIService {
  return activeAiService;
}

export function setClinicalAIService(service: ClinicalAIService): void {
  activeAiService = service;
  logger.info("ClinicalAIGateway", `Switched active AI provider to: ${service.providerName}`);
}
