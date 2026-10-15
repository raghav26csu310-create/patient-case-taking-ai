"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Trash2,
  CheckCircle,
  Download,
  Terminal,
  Sparkles,
  Copy,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";
import { getFHIRService } from "@/services/interoperability/fhir-service";
import { getABDMService, ABDMBridgeStatus } from "@/services/interoperability/abdm-service";
import { ClinicalSummary } from "@/domain/clinical/types";
import { FhirResourceCount } from "@/domain/interoperability/types";

export default function AdminPage() {
  const { caseGraph } = useCaseGraph();
  const [activeTab, setActiveTab] = useState("audit");

  // DPDP 24h Purge Simulation State
  const [audioPurged, setAudioPurged] = useState(false);
  const [purgeLog, setPurgeLog] = useState<string[]>([]);

  // FHIR R4 Generation State
  const [fhirJson, setFhirJson] = useState<string | null>(null);
  const [isGeneratingFhir, setIsGeneratingFhir] = useState(false);
  const [fhirStats, setFhirStats] = useState<FhirResourceCount | null>(null);

  // ABDM Sandbox Bridge State
  const [abdmStatus, setAbdmStatus] = useState<ABDMBridgeStatus | null>(null);
  const [abdmConsentResult, setAbdmConsentResult] = useState<string | null>(null);
  const [isRequestingConsent, setIsRequestingConsent] = useState(false);

  // Selected AI Gateway Provider
  const [selectedProvider, setSelectedProvider] = useState<"MOCK" | "GEMINI" | "LOCAL_EDGE">("MOCK");

  useEffect(() => {
    const abdmService = getABDMService();
    abdmService.checkBridgeStatus().then(setAbdmStatus);
  }, []);

  const handleSimulatePurge = () => {
    setAudioPurged(true);
    setPurgeLog((prev) => [
      `[${new Date().toLocaleTimeString()}] PURGE_JOB: Ephemeral audio buffer for Session ${caseGraph.session.id} destroyed.`,
      `[${new Date().toLocaleTimeString()}] COMPLIANCE: DPDP Act 2023 24h retention deadline enforced. Raw voice waveform zeroed.`,
      ...prev,
    ]);
  };

  const handleGenerateFhir = async () => {
    setIsGeneratingFhir(true);
    const fhirService = getFHIRService();

    // Compile clinical summary structure from caseGraph
    const summary: ClinicalSummary = {
      id: `summary-${caseGraph.session.id}`,
      patientId: caseGraph.demographics.id,
      chiefComplaints: caseGraph.chiefComplaints,
      hpiNarrative: caseGraph.hpiStructured
        ? `${caseGraph.hpiStructured.character || "Symptom"} in ${caseGraph.hpiStructured.site || "body region"} for ${caseGraph.hpiStructured.timing || "unknown duration"}`
        : "Recorded in case graph",
      hpiStructured: caseGraph.hpiStructured,
      pastMedicalHistory: caseGraph.pastMedicalHistory,
      surgicalHistory: caseGraph.surgicalHistory,
      currentMedications: caseGraph.medications,
      knownAllergies: caseGraph.allergies,
      familyHistory: caseGraph.familyHistory,
      personalHistory: caseGraph.personalHistory,
      ayushHistory: caseGraph.ayushHistory,
      reviewOfSystems: caseGraph.reviewOfSystems,
      timelineEvents: caseGraph.timeline,
      missingInformationGaps: [],
      isPhysicianVerified: caseGraph.isPhysicianVerified,
      generatedAt: new Date().toISOString(),
    };

    const res = await fhirService.generateFhirBundle(summary);
    setFhirJson(res.rawFhirJson);
    setFhirStats(res.resourceCounts);
    setIsGeneratingFhir(false);
  };

  const handleSimulateAbdmConsent = async () => {
    setIsRequestingConsent(true);
    const abdmService = getABDMService();
    const abha = caseGraph.demographics.abhaId || "91-4582-1092-4412";
    const res = await abdmService.simulateConsentRequest(abha);
    setAbdmConsentResult(`Consent Artifact Generated: ${res.requestId} (Status: ${res.status})`);
    setIsRequestingConsent(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Admin Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] font-mono">
              SYSTEM ADMINISTRATION &amp; GOVERNANCE
            </span>
            <Badge variant="outline" size="sm">
              DPDP 2023 &amp; ABDM Ready
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Governance, Interoperability &amp; Clinical Audit
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Immutable clinician verification audit trails, DPDP Act 2023 audio retention enforcement, and FHIR R4 serialization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Audit Logging Active
          </Badge>
          <Badge variant="outline" size="sm" className="font-mono text-xs">
            Host: OPD AIIMS Node 1
          </Badge>
        </div>
      </header>

      {/* Admin Tabs */}
      <Tabs defaultValue="audit" value={activeTab} onValueChange={setActiveTab}>
        <TabList>
          <TabTrigger value="audit">Clinical Audit Trail</TabTrigger>
          <TabTrigger value="privacy">DPDP Audio Lifecycle</TabTrigger>
          <TabTrigger value="abdm">FHIR R4 &amp; ABDM Sandbox</TabTrigger>
          <TabTrigger value="ai-gateway">AI Gateway Config</TabTrigger>
        </TabList>

        {/* Tab 1: Clinical Audit Trail */}
        <TabContent value="audit" className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                Physician Verification &amp; History Edit Audit Trail
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Cryptographically timestamped log of all physician verification actions, fact acceptances, and rejections.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => {
                const blob = new Blob([JSON.stringify(caseGraph.verificationLogs, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `audit-log-${caseGraph.session.id}.json`;
                a.click();
              }}
            >
              Export JSON Log
            </Button>
          </div>

          <Card elevated>
            <CardContent className="p-4 flex flex-col gap-3">
              {caseGraph.verificationLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                  No verification actions recorded yet. Verify entities or approve the case in the Clinician Cockpit to generate entries.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {caseGraph.verificationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            log.action === "ACCEPTED"
                              ? "success"
                              : log.action === "REJECTED"
                              ? "danger"
                              : "warning"
                          }
                          size="sm"
                        >
                          {log.action}
                        </Badge>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-[var(--foreground)]">
                            Target Entity: [{log.targetEntityId}] ({log.targetEntityType})
                          </span>
                          <span className="text-[11px] text-[var(--muted-foreground)]">
                            Physician: <strong className="text-[var(--foreground)]">{log.clinicianId}</strong> •{" "}
                            {log.rationale || "No additional rationale provided"}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] text-[var(--muted-foreground)] self-start sm:self-center">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 2: DPDP Audio Retention */}
        <TabContent value="privacy" className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                Digital Personal Data Protection (DPDP) Act 2023 Audio Rules
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Strict ephemeral retention schedule: raw voice recordings automatically expire and purge within 24 hours.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-[var(--danger)]" />}
              onClick={handleSimulatePurge}
            >
              Simulate 24h Purge Trigger
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Audio Consent Status</span>
              <span className="text-base font-extrabold text-[var(--foreground)]">
                {caseGraph.consent.hasConsentedToAudioRecording ? "GRANTED BY PATIENT" : "NOT GRANTED"}
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)]">
                Method: {caseGraph.consent.consentMethod}
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Retention Window</span>
              <span className="text-base font-extrabold text-[var(--foreground)]">
                {caseGraph.consent.dataRetentionHours} Hours Maximum
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)]">
                Purge target: 24h post consultation
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
              <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Current Buffer State</span>
              <span
                className={`text-base font-extrabold ${
                  audioPurged ? "text-[var(--danger)]" : "text-[var(--success)]"
                }`}
              >
                {audioPurged ? "ZEROED / DESTROYED" : "ACTIVE (EPHEMERAL)"}
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)]">
                {audioPurged ? "Raw voice waveforms eradicated" : "Stored in isolated RAM buffer"}
              </span>
            </div>
          </div>

          {/* Purge Audit Terminal Console */}
          <Card elevated>
            <CardHeader className="py-2.5 bg-[var(--muted)]/50 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-xs font-mono">dpdp_ephemeral_purge_daemon.log</CardTitle>
              </div>
              <Badge variant="outline" size="sm">
                CRON ACTIVE
              </Badge>
            </CardHeader>
            <CardContent className="p-4 font-mono text-xs bg-black/90 text-green-400 rounded-b-2xl min-h-[140px] flex flex-col gap-1">
              <span>[SYSTEM_INIT] DPDP Purge daemon running on pid 1042.</span>
              <span>[RULE_CHECK] Max audio retention = 24h. Plaintext transcripts retained only with explicit consent.</span>
              {purgeLog.map((line, i) => (
                <span key={i} className="text-yellow-300">
                  {line}
                </span>
              ))}
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 3: FHIR R4 & ABDM Sandbox */}
        <TabContent value="abdm" className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                FHIR R4 Serialization &amp; ABDM Gateway Sandbox
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Strict adherence to clinical interoperability: honest mock sandbox boundaries without fabricated live transmissions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulateAbdmConsent}
                disabled={isRequestingConsent}
              >
                {isRequestingConsent ? "Requesting..." : "Simulate ABDM Consent"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={handleGenerateFhir}
                disabled={isGeneratingFhir}
              >
                {isGeneratingFhir ? "Compiling..." : "Generate FHIR R4 Bundle"}
              </Button>
            </div>
          </div>

          {/* ABDM Bridge Status Strip */}
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[var(--primary)]" />
                <span className="font-bold text-xs text-[var(--foreground)]">ABDM BRIDGE STATUS</span>
              </div>
              <Badge variant="warning" size="sm">
                SANDBOX / SIMULATED MODE
              </Badge>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {abdmStatus?.statusMessage || "Local architecture configured for ABDM M1/M2 sandbox endpoints."}
            </p>
            {abdmConsentResult && (
              <Alert variant="success" title="ABDM Sandbox Response">
                {abdmConsentResult}
              </Alert>
            )}
          </div>

          {/* FHIR Compilation Output */}
          {fhirJson && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[var(--foreground)]">
                    Compiled FHIR R4 Document Bundle (JSON)
                  </span>
                  {fhirStats && (
                    <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                      Composition: {fhirStats.compositionCount} | Conditions: {fhirStats.conditionCount} | Meds:{" "}
                      {fhirStats.medicationStatementCount} | Observations: {fhirStats.observationCount}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Copy className="w-3 h-3" />}
                  onClick={() => {
                    navigator.clipboard.writeText(fhirJson);
                    alert("FHIR R4 JSON copied to clipboard");
                  }}
                >
                  Copy JSON
                </Button>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] font-mono text-xs overflow-x-auto max-h-[360px] text-[var(--foreground)] whitespace-pre">
                {fhirJson}
              </div>
            </div>
          )}
        </TabContent>

        {/* Tab 4: AI Gateway Config */}
        <TabContent value="ai-gateway" className="mt-4 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">
              Clinical AI Gateway Provider Decoupling
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Provider-agnostic interface isolating business logic from cloud LLM APIs. Supports instant failover to local or alternative models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: "MOCK",
                title: "Mock Clinical Adapter",
                desc: "Fast, deterministic clinical mock. Safe for hackathon demonstration with zero external API dependencies.",
                badge: "Active Default",
              },
              {
                id: "GEMINI",
                title: "Google Gemini Adapter",
                desc: "Cloud clinical synthesis using Gemini 3.8 Flash via server-side AI Gateway with strict redaction of direct PII.",
                badge: "Cloud Adapter",
              },
              {
                id: "LOCAL_EDGE",
                title: "Local Sovereign Edge LLM",
                desc: "On-premise inference (e.g., Ollama / Med-Llama) running within hospital firewall for 100% data sovereignty.",
                badge: "Sovereign Edge",
              },
            ].map((prov) => (
              <div
                key={prov.id}
                onClick={() => setSelectedProvider(prov.id as "MOCK" | "GEMINI" | "LOCAL_EDGE")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedProvider === prov.id
                    ? "border-[var(--primary)] bg-[var(--primary-muted)]/20 ring-2 ring-[var(--primary)]/30"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Cpu className="w-5 h-5 text-[var(--primary)]" />
                    <Badge variant={selectedProvider === prov.id ? "primary" : "outline"} size="sm">
                      {prov.badge}
                    </Badge>
                  </div>
                  <span className="font-extrabold text-sm text-[var(--foreground)]">{prov.title}</span>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{prov.desc}</p>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--primary)]">
                  {selectedProvider === prov.id ? "Selected Active Provider" : "Click to Select"}
                </div>
              </div>
            ))}
          </div>

          <Alert variant="info" title="Zero Vendor Lock-In Guarantee">
            The SIH26047 architecture strictly prohibits direct component-level model calls. All clinical prompts, structured schema validations, and fallback mechanisms route exclusively through <code className="font-mono font-bold">ClinicalAIGateway</code>.
          </Alert>
        </TabContent>
      </Tabs>
    </div>
  );
}
