import { getClinicalAIService } from "../src/services/ai/clinical-ai-gateway";
import { getSpeechService } from "../src/services/speech/speech-service";
import { getOCRService } from "../src/services/ocr/ocr-service";
import { getClinicalRuleService } from "../src/services/clinical-rules/clinical-rule-service";
import { getFHIRService } from "../src/services/interoperability/fhir-service";
import { getABDMService } from "../src/services/interoperability/abdm-service";
import { DEMO_CLINICAL_SUMMARY } from "../src/mocks/clinical/demo-clinical-case";

async function verifyAllMockServices() {
  console.log("=== VERIFYING MOCK SERVICES INSTANTIATION & IDENTIFICATION ===");

  // 1. ClinicalAIService
  const aiService = getClinicalAIService();
  console.log(`[1] ClinicalAIService provider: "${aiService.providerName}"`);
  if (!aiService.providerName.includes("MOCK") && !aiService.providerName.includes("DEMO")) {
    throw new Error("ClinicalAIService does not identify as MOCK/DEMO");
  }
  const summary = await aiService.summarizeCase([], []);
  console.log(`    ClinicalAIService summary narrative: "${summary.hpiNarrative.slice(0, 30)}..."`);
  if (!summary.hpiNarrative.includes("DEMO") && !summary.hpiNarrative.includes("SYNTHETIC")) {
    throw new Error("ClinicalAIService output does not identify as DEMO/SYNTHETIC");
  }

  // 2. SpeechService
  const speechService = getSpeechService();
  console.log(`[2] SpeechService provider: "${speechService.providerName}"`);
  if (!speechService.providerName.includes("MOCK") && !speechService.providerName.includes("DEMO")) {
    throw new Error("SpeechService does not identify as MOCK/DEMO");
  }

  // 3. OCRService
  const ocrService = getOCRService();
  console.log(`[3] OCRService provider: "${ocrService.providerName}"`);
  if (!ocrService.providerName.includes("MOCK") && !ocrService.providerName.includes("DEMO")) {
    throw new Error("OCRService does not identify as MOCK/DEMO");
  }
  const ocrResult = await ocrService.processDocument(new Blob(), "PRESCRIPTION");
  console.log(`    OCR raw text sample: "${ocrResult.rawExtractedText.split('\n')[0]}"`);
  if (!ocrResult.rawExtractedText.includes("DEMO")) {
    throw new Error("OCR raw text does not identify as DEMO");
  }

  // 4. ClinicalRuleService
  const ruleService = getClinicalRuleService();
  const alerts = await ruleService.evaluateTriage([]);
  console.log(`[4] ClinicalRuleService alerts count: ${alerts.length}, alert: "${alerts[0]?.ruleTitle}"`);
  if (!alerts[0]?.clinicalReason.includes("DEMO")) {
    throw new Error("ClinicalRuleService alert reason does not identify as DEMO");
  }

  // 5. FHIRService
  const fhirService = getFHIRService();
  const fhirResult = await fhirService.generateFhirBundle(DEMO_CLINICAL_SUMMARY);
  console.log(`[5] FHIRService bundle status: "${fhirResult.status}", message: "${fhirResult.abdmBridgeMessage}"`);
  if (!fhirResult.abdmBridgeMessage.includes("MOCK") && !fhirResult.abdmBridgeMessage.includes("DEMO")) {
    throw new Error("FHIRService message does not identify as MOCK/DEMO");
  }

  // 6. ABDMService
  const abdmService = getABDMService();
  const abdmStatus = await abdmService.checkBridgeStatus();
  console.log(`[6] ABDMService bridge status: "${abdmStatus.statusMessage}"`);
  if (!abdmStatus.statusMessage.includes("DEMO") && !abdmStatus.statusMessage.includes("SIMULATED")) {
    throw new Error("ABDMService message does not identify as DEMO/SIMULATED");
  }

  console.log("=== ALL 6 MOCK SERVICES VERIFIED SUCCESSFULLY ===");
}

verifyAllMockServices().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
