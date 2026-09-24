import { logger } from "@/lib/logging/logger";

/**
 * ABDM (Ayushman Bharat Digital Mission) Gateway Adapter
 * Strictly maintains honest boundaries regarding sandbox vs live connectivity
 */

export interface ABDMBridgeStatus {
  isConfigured: boolean;
  isSandboxMode: boolean;
  isLiveProduction: boolean;
  statusMessage: string;
}

export interface ABDMService {
  checkBridgeStatus(): Promise<ABDMBridgeStatus>;
  simulateConsentRequest(abhaId: string): Promise<{ requestId: string; status: "REQUESTED" | "GRANTED" }>;
}

export class MockABDMService implements ABDMService {
  async checkBridgeStatus(): Promise<ABDMBridgeStatus> {
    logger.debug("MockABDMService", "Checking ABDM bridge status");
    return {
      isConfigured: false,
      isSandboxMode: true,
      isLiveProduction: false,
      statusMessage: "[DEMO / SIMULATED] Local architecture ready for ABDM M1/M2 sandbox endpoints. Live transmission disabled.",
    };
  }

  async simulateConsentRequest(abhaId: string): Promise<{ requestId: string; status: "REQUESTED" | "GRANTED" }> {
    logger.debug("MockABDMService", `Simulating ABDM consent request for ABHA: ${abhaId}`);
    return {
      requestId: `req-abdm-${Date.now()}`,
      status: "GRANTED",
    };
  }
}

let activeAbdmService: ABDMService = new MockABDMService();

export function getABDMService(): ABDMService {
  return activeAbdmService;
}

export function setABDMService(service: ABDMService): void {
  activeAbdmService = service;
}
