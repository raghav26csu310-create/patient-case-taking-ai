"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PatientCaseGraph, VerificationLog } from "./types";
import { SYNTHETIC_SCENARIOS } from "@/mocks/scenarios/synthetic-scenarios";
import {
  ChiefComplaint,
  HpiSocrates,
  MedicationStatement,
  AllergyStatement,
  PainMapInput,
  PastMedicalHistoryItem,
  PastSurgicalHistoryItem,
  FamilyHistoryItem,
  PersonalSocialHistory,
  AyushHistory,
  ReviewOfSystems,
  TimelineEvent,
} from "@/domain/clinical/types";
import { PatientDemographics, PatientLanguage, InteractionMode } from "@/domain/patient/types";
import { ConsentRecord } from "@/domain/consent/types";
import { DocumentArtifact, LabObservation } from "@/domain/documents/types";

export interface CaseGraphContextValue {
  caseGraph: PatientCaseGraph;
  isLowLiteracyMode: boolean;
  toggleLowLiteracyMode: () => void;
  loadScenario: (scenarioId: string) => void;
  resetToNewPatient: () => void;
  setLanguage: (lang: PatientLanguage) => void;
  setInteractionMode: (mode: InteractionMode) => void;
  updateDemographics: (data: Partial<PatientDemographics>) => void;
  updateConsent: (consent: Partial<ConsentRecord>) => void;
  setPainMap: (pain: PainMapInput) => void;
  addChiefComplaint: (cc: ChiefComplaint) => void;
  updateHpi: (hpi: Partial<HpiSocrates>) => void;
  addPastMedicalHistory: (item: PastMedicalHistoryItem) => void;
  addPastSurgicalHistory: (item: PastSurgicalHistoryItem) => void;
  addMedication: (med: MedicationStatement) => void;
  addAllergy: (alg: AllergyStatement) => void;
  updateFamilyHistory: (items: FamilyHistoryItem[]) => void;
  updatePersonalHistory: (pers: PersonalSocialHistory) => void;
  updateAyushHistory: (ayush: AyushHistory) => void;
  updateReviewOfSystems: (ros: ReviewOfSystems) => void;
  addDocument: (doc: DocumentArtifact) => void;
  addLabObservation: (lab: LabObservation) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  verifyEntity: (
    entityId: string,
    entityType: VerificationLog["targetEntityType"],
    action: VerificationLog["action"],
    clinicianId: string,
    notes?: string
  ) => void;
  setPhysicianVerified: (verified: boolean, clinicianId?: string, notes?: string) => void;
}

const defaultScenario = SYNTHETIC_SCENARIOS[2].caseGraph; // Default to Acute Chest Pain (Scenario 3) for rich demo experience

const CaseGraphContext = createContext<CaseGraphContextValue | null>(null);

const STORAGE_KEY = "sih26047_active_case_graph";

export function CaseGraphProvider({ children }: { children: React.ReactNode }) {
  const [caseGraph, setCaseGraph] = useState<PatientCaseGraph>(defaultScenario);
  const [isLowLiteracyMode, setIsLowLiteracyMode] = useState(false);

  // Initialize from local state if available (for session persistence)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCaseGraph(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors on restricted environments
    }
  }, []);

  // Sync state to local session
  const saveState = (updated: PatientCaseGraph) => {
    setCaseGraph(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const toggleLowLiteracyMode = () => setIsLowLiteracyMode((prev) => !prev);

  const loadScenario = (scenarioId: string) => {
    const found = SYNTHETIC_SCENARIOS.find((s) => s.id === scenarioId);
    if (found) {
      saveState(JSON.parse(JSON.stringify(found.caseGraph)));
      if (scenarioId === "scenario-elderly-vernacular") {
        setIsLowLiteracyMode(true);
      }
    }
  };

  const resetToNewPatient = () => {
    const emptyGraph: PatientCaseGraph = {
      session: {
        id: `sess-${Date.now()}`,
        patientId: `pat-${Date.now()}`,
        language: "hi",
        interactionMode: "VOICE",
        status: "IDENTIFYING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      demographics: {
        id: `pat-${Date.now()}`,
        fullName: "",
        age: 30,
        gender: "MALE",
        preferredLanguage: "hi",
        visitType: "NEW",
        registeredAt: new Date().toISOString(),
      },
      consent: {
        patientId: `pat-${Date.now()}`,
        hasConsentedToHealthHistory: false,
        hasConsentedToAudioRecording: false,
        hasConsentedToDocumentProcessing: false,
        hasConsentedToClinicalSynthesis: false,
        audioPlaybackListened: false,
        consentLanguage: "hi",
        consentedAt: new Date().toISOString(),
        consentMethod: "TOUCH_SCREEN_SELECTION",
        dataRetentionHours: 24,
      },
      chiefComplaints: [],
      pastMedicalHistory: [],
      surgicalHistory: [],
      medications: [],
      allergies: [],
      familyHistory: [],
      documents: [],
      labObservations: [],
      timeline: [],
      triageAlerts: [],
      evidenceGraph: {},
      verificationLogs: [],
      isPhysicianVerified: false,
    };
    saveState(emptyGraph);
  };

  const setLanguage = (lang: PatientLanguage) => {
    saveState({
      ...caseGraph,
      session: { ...caseGraph.session, language: lang, updatedAt: new Date().toISOString() },
      demographics: { ...caseGraph.demographics, preferredLanguage: lang },
    });
  };

  const setInteractionMode = (mode: InteractionMode) => {
    saveState({
      ...caseGraph,
      session: { ...caseGraph.session, interactionMode: mode, updatedAt: new Date().toISOString() },
    });
  };

  const updateDemographics = (data: Partial<PatientDemographics>) => {
    saveState({
      ...caseGraph,
      demographics: { ...caseGraph.demographics, ...data },
      session: {
        ...caseGraph.session,
        status: "CONSENT_PENDING",
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const updateConsent = (consentData: Partial<ConsentRecord>) => {
    const updatedConsent = { ...caseGraph.consent, ...consentData };
    saveState({
      ...caseGraph,
      consent: updatedConsent,
      session: {
        ...caseGraph.session,
        status: updatedConsent.hasConsentedToHealthHistory ? "READY_FOR_INTERVIEW" : "CONSENT_PENDING",
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const setPainMap = (pain: PainMapInput) => {
    saveState({
      ...caseGraph,
      painMap: pain,
    });
  };

  const addChiefComplaint = (cc: ChiefComplaint) => {
    const updated = {
      ...caseGraph,
      chiefComplaints: [...caseGraph.chiefComplaints, cc],
      evidenceGraph: {
        ...caseGraph.evidenceGraph,
        [cc.evidenceCitationId]: {
          id: cc.evidenceCitationId,
          sourceType: "PATIENT_INTERVIEW" as const,
          timestamp: new Date().toISOString(),
          originalLanguage: caseGraph.session.language,
          rawUtterance: cc.complaint,
          normalizedRepresentation: cc.complaint,
          verificationStatus: "UNVERIFIED" as const,
        },
      },
    };
    saveState(updated);
  };

  const updateHpi = (hpi: Partial<HpiSocrates>) => {
    saveState({
      ...caseGraph,
      hpiStructured: { ...caseGraph.hpiStructured, ...hpi },
    });
  };

  const addPastMedicalHistory = (item: PastMedicalHistoryItem) => {
    saveState({
      ...caseGraph,
      pastMedicalHistory: [...caseGraph.pastMedicalHistory, item],
    });
  };

  const addPastSurgicalHistory = (item: PastSurgicalHistoryItem) => {
    saveState({
      ...caseGraph,
      surgicalHistory: [...caseGraph.surgicalHistory, item],
    });
  };

  const addMedication = (med: MedicationStatement) => {
    saveState({
      ...caseGraph,
      medications: [...caseGraph.medications, med],
    });
  };

  const addAllergy = (alg: AllergyStatement) => {
    saveState({
      ...caseGraph,
      allergies: [...caseGraph.allergies, alg],
    });
  };

  const updateFamilyHistory = (items: FamilyHistoryItem[]) => {
    saveState({
      ...caseGraph,
      familyHistory: items,
    });
  };

  const updatePersonalHistory = (pers: PersonalSocialHistory) => {
    saveState({
      ...caseGraph,
      personalHistory: pers,
    });
  };

  const updateAyushHistory = (ayush: AyushHistory) => {
    saveState({
      ...caseGraph,
      ayushHistory: ayush,
    });
  };

  const updateReviewOfSystems = (ros: ReviewOfSystems) => {
    saveState({
      ...caseGraph,
      reviewOfSystems: ros,
    });
  };

  const addDocument = (doc: DocumentArtifact) => {
    saveState({
      ...caseGraph,
      documents: [...caseGraph.documents, doc],
    });
  };

  const addLabObservation = (lab: LabObservation) => {
    saveState({
      ...caseGraph,
      labObservations: [...caseGraph.labObservations, lab],
    });
  };

  const addTimelineEvent = (event: TimelineEvent) => {
    saveState({
      ...caseGraph,
      timeline: [...caseGraph.timeline, event],
    });
  };

  const verifyEntity = (
    entityId: string,
    entityType: VerificationLog["targetEntityType"],
    action: VerificationLog["action"],
    clinicianId: string,
    notes?: string
  ) => {
    const log: VerificationLog = {
      id: `vlog-${Date.now()}`,
      targetEntityId: entityId,
      targetEntityType: entityType,
      action,
      clinicianId,
      timestamp: new Date().toISOString(),
      rationale: notes,
    };

    // Update evidence citation if present
    const updatedEvidenceGraph = { ...caseGraph.evidenceGraph };
    if (updatedEvidenceGraph[entityId]) {
      updatedEvidenceGraph[entityId] = {
        ...updatedEvidenceGraph[entityId],
        verificationStatus:
          action === "ACCEPTED" ? "VERIFIED" : action === "REJECTED" ? "REJECTED" : "EDITED",
        verifiedBy: clinicianId,
        verifiedAt: new Date().toISOString(),
        auditNotes: notes,
      };
    }

    saveState({
      ...caseGraph,
      evidenceGraph: updatedEvidenceGraph,
      verificationLogs: [...caseGraph.verificationLogs, log],
    });
  };

  const setPhysicianVerified = (verified: boolean, clinicianId = "DR-AIIMS-042", notes?: string) => {
    saveState({
      ...caseGraph,
      isPhysicianVerified: verified,
      summary: caseGraph.summary
        ? {
            ...caseGraph.summary,
            isPhysicianVerified: verified,
            verifiedByClinicianId: clinicianId,
            verifiedAt: new Date().toISOString(),
            physicianNotes: notes,
          }
        : undefined,
    });
  };

  return (
    <CaseGraphContext.Provider
      value={{
        caseGraph,
        isLowLiteracyMode,
        toggleLowLiteracyMode,
        loadScenario,
        resetToNewPatient,
        setLanguage,
        setInteractionMode,
        updateDemographics,
        updateConsent,
        setPainMap,
        addChiefComplaint,
        updateHpi,
        addPastMedicalHistory,
        addPastSurgicalHistory,
        addMedication,
        addAllergy,
        updateFamilyHistory,
        updatePersonalHistory,
        updateAyushHistory,
        updateReviewOfSystems,
        addDocument,
        addLabObservation,
        addTimelineEvent,
        verifyEntity,
        setPhysicianVerified,
      }}
    >
      {children}
    </CaseGraphContext.Provider>
  );
}

export function useCaseGraph() {
  const ctx = useContext(CaseGraphContext);
  if (!ctx) {
    throw new Error("useCaseGraph must be used within a CaseGraphProvider");
  }
  return ctx;
}
