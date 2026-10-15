"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle,
  Edit3,
  XCircle,
  Check,
  Printer,
  ShieldCheck,
  Activity,
  AlertCircle,
  Pill,
  Leaf,
  FlaskConical,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Dialog } from "@/components/ui/dialog";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";

export default function ClinicianCockpitPage() {
  const { caseGraph, verifyEntity, setPhysicianVerified, updateHpi } = useCaseGraph();

  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);
  const [isChitOpen, setIsChitOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editDuration, setEditDuration] = useState(caseGraph.hpiStructured?.duration || "");
  const [editCharacter, setEditCharacter] = useState(caseGraph.hpiStructured?.character || "");

  const openEvidence = (citationId: string) => {
    setSelectedCitationId(citationId);
    setIsEvidenceDrawerOpen(true);
  };

  const handleVerifyEvidence = (status: "ACCEPTED" | "REJECTED") => {
    if (!selectedCitationId) return;
    verifyEntity(
      selectedCitationId,
      "CHIEF_COMPLAINT",
      status,
      "DR-AIIMS-NEWDELHI-442",
      status === "ACCEPTED" ? "Clinically verified during OPD consultation" : "Refuted on physical examination"
    );
    setIsEvidenceDrawerOpen(false);
  };

  const handleVerifyWholeCase = () => {
    setPhysicianVerified(
      true,
      "DR-AIIMS-NEWDELHI-442",
      "Case history reviewed, verified, and reconciled with clinical presentation."
    );
  };

  const handleSaveEdits = () => {
    updateHpi({
      duration: editDuration,
      character: editCharacter,
    });
    setIsEditModalOpen(false);
  };

  const activeEvidence = selectedCitationId ? caseGraph.evidenceGraph[selectedCitationId] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Clinician Top Action Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">
              CLINICAL COCKPIT • OPD DESKTOP
            </span>
            {caseGraph.isPhysicianVerified ? (
              <Badge variant="success" size="sm" className="gap-1">
                <ShieldCheck className="w-3 h-3" />
                DOCTOR VERIFIED
              </Badge>
            ) : (
              <Badge variant="warning" size="sm" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                VERIFICATION PENDING
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
            Consultation Case Review &amp; Verification
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            High-density 30-second case overview designed for rapid review and provenance verification before consultation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            onClick={() => {
              setEditDuration(caseGraph.hpiStructured?.duration || "");
              setEditCharacter(caseGraph.hpiStructured?.character || "");
              setIsEditModalOpen(true);
            }}
          >
            Edit History
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => setIsChitOpen(true)}
          >
            Print OPD Chit
          </Button>

          <Button
            variant={caseGraph.isPhysicianVerified ? "secondary" : "primary"}
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5" />}
            onClick={handleVerifyWholeCase}
          >
            {caseGraph.isPhysicianVerified ? "Re-Verify Case" : "Verify & Sign Case"}
          </Button>
        </div>
      </header>

      {/* Patient Demographic Summary Strip */}
      <section
        aria-label="Patient Demographics Summary"
        className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] flex flex-wrap items-center justify-between gap-4 shadow-xs"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center font-black text-base">
            {caseGraph.demographics.fullName
              ? caseGraph.demographics.fullName.slice(0, 2).toUpperCase()
              : "PT"}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-[var(--foreground)]">
                {caseGraph.demographics.fullName || "Unregistered Patient"}
              </span>
              {caseGraph.demographics.abhaId && (
                <Badge variant="primary" size="sm">
                  ABHA: {caseGraph.demographics.abhaId}
                </Badge>
              )}
              <Badge variant="outline" size="sm">
                Token #{caseGraph.session.id.slice(-6).toUpperCase()}
              </Badge>
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              {caseGraph.demographics.age} Yrs • {caseGraph.demographics.gender} • Language:{" "}
              <strong className="text-[var(--foreground)]">
                {caseGraph.session.language.toUpperCase()}
              </strong>{" "}
              • Visit Type: {caseGraph.demographics.visitType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {caseGraph.triageAlerts.length > 0 ? (
            <Badge
              variant={caseGraph.triageAlerts[0].severity === "EMERGENCY" ? "danger" : "warning"}
              size="md"
              className="gap-1.5 py-1 px-3"
            >
              <AlertTriangle className="w-4 h-4" />
              TRIAGE: {caseGraph.triageAlerts[0].severity} ({caseGraph.triageAlerts[0].departmentRoutingRecommendation})
            </Badge>
          ) : (
            <Badge variant="success" size="md">
              TRIAGE: ROUTINE OPD
            </Badge>
          )}
        </div>
      </section>

      {/* Main Grid: Left Column (Clinical Case Sheet) vs Right Column (Timeline & Deterministic Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Core Clinical Case */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Section 1: Chief Complaints & HPI (SOCRATES / OLDCARTS) */}
          <Card elevated>
            <CardHeader className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Chief Complaints &amp; History of Present Illness (HPI)</CardTitle>
              </div>
              <Badge variant="outline" size="sm">
                Structured SOCRATES
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs leading-relaxed pt-4">
              {caseGraph.chiefComplaints.length === 0 ? (
                <div className="p-4 rounded-xl bg-[var(--muted)]/50 text-[var(--muted-foreground)] text-center">
                  No chief complaints recorded yet. Use the Patient Kiosk or load a scenario.
                </div>
              ) : (
                caseGraph.chiefComplaints.map((cc) => (
                  <div
                    key={cc.id}
                    className="p-3.5 rounded-xl bg-[var(--muted)]/40 border border-[var(--border-subtle)] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[var(--foreground)]">
                        {cc.complaint}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                          Duration: {cc.duration} • Severity: {cc.severity}/10
                        </span>
                        <Badge
                          variant="evidence"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => openEvidence(cc.evidenceCitationId)}
                        >
                          [{cc.evidenceCitationId}] Source Citation
                        </Badge>
                      </div>
                    </div>

                    {/* HPI Breakdown */}
                    {caseGraph.hpiStructured && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                            Site / Radiation
                          </span>
                          <span className="text-[11px] text-[var(--foreground)]">
                            {caseGraph.hpiStructured.site} (Rad: {caseGraph.hpiStructured.radiation || "None"})
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                            Character
                          </span>
                          <span className="text-[11px] text-[var(--foreground)]">
                            {caseGraph.hpiStructured.character}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                            Aggravating
                          </span>
                          <span className="text-[11px] text-[var(--foreground)]">
                            {caseGraph.hpiStructured.exacerbatingFactors?.join(", ") || "None"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                            Relieving
                          </span>
                          <span className="text-[11px] text-[var(--foreground)]">
                            {caseGraph.hpiStructured.relievingFactors?.join(", ") || "None"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pain Map Pin Summary if present */}
                    {caseGraph.painMap && (
                      <div className="mt-1 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                        <span className="text-[var(--muted-foreground)]">
                          Anatomical Pin: <strong>{caseGraph.painMap.region}</strong> • Character:{" "}
                          <strong>{caseGraph.painMap.character}</strong> • VAS:{" "}
                          <strong>{caseGraph.painMap.intensity}/10</strong>
                        </span>
                        <Badge variant="outline" size="sm">
                          Patient-Pinned Map
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Section 2: Medical & Surgical History */}
          <Card elevated>
            <CardHeader className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Past Medical &amp; Surgical History</CardTitle>
              </div>
              <Badge variant="outline" size="sm">
                Chronological
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4">
              <div className="flex flex-col gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--muted-foreground)]">
                  Past Medical Diagnoses
                </span>
                {caseGraph.pastMedicalHistory.length === 0 ? (
                  <span className="text-[var(--muted-foreground)] italic">None reported</span>
                ) : (
                  caseGraph.pastMedicalHistory.map((pmh) => (
                    <div
                      key={pmh.id}
                      className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--foreground)]">{pmh.condition}</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          Since {pmh.approximateOnset || pmh.diagnosedDuration} • Status: {pmh.status}
                        </span>
                      </div>
                      <Badge
                        variant="evidence"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => openEvidence(pmh.evidenceCitationId ?? "")}
                      >
                        [{pmh.evidenceCitationId}]
                      </Badge>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--muted-foreground)]">
                  Past Surgical Procedures
                </span>
                {caseGraph.surgicalHistory.length === 0 ? (
                  <span className="text-[var(--muted-foreground)] italic">None reported</span>
                ) : (
                  caseGraph.surgicalHistory.map((psh) => (
                    <div
                      key={psh.id}
                      className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--foreground)]">{psh.procedure || psh.procedureName}</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          Year: {psh.approximateYear}
                        </span>
                      </div>
                      <Badge
                        variant="evidence"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => openEvidence(psh.evidenceCitationId ?? "")}
                      >
                        [{psh.evidenceCitationId}]
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Current Medications & Allergies */}
          <Card elevated>
            <CardHeader className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Current Regimen &amp; Known Allergies</CardTitle>
              </div>
              <Badge variant="outline" size="sm">
                Source: Patient &amp; OCR Prescriptions
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs pt-4">
              {/* Allergies - High Alert */}
              <div className="flex flex-col gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--danger)]">
                  Allergy Intolerances &amp; Adverse Reactions
                </span>
                {caseGraph.allergies.length === 0 ? (
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--muted-foreground)]">
                    No known drug or environmental allergies reported.
                  </div>
                ) : (
                  caseGraph.allergies.map((alg) => (
                    <div
                      key={alg.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--danger-muted)]/30 border border-[var(--danger-muted)]"
                    >
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-[var(--danger-foreground)]">
                          {alg.substance} ({alg.severity})
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          Reaction: {alg.manifestation}
                        </span>
                      </div>
                      <Badge variant="danger" size="sm">
                        HIGH ALERT
                      </Badge>
                    </div>
                  ))
                )}
              </div>

              {/* Medications List */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--muted-foreground)]">
                  Active Medications
                </span>
                {caseGraph.medications.length === 0 ? (
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--muted-foreground)]">
                    No active medications documented.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {caseGraph.medications.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)]"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--foreground)]">{med.medicationName}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            Dosage: {med.dosage} • Frequency: {med.frequency}
                          </span>
                          <span className="text-[10px] text-[var(--primary)] font-mono">
                            Adherence: {med.adherenceReported}
                          </span>
                        </div>
                        <Badge
                          variant="evidence"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => openEvidence(med.evidenceCitationId)}
                        >
                          [{med.evidenceCitationId}]
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Document Extracts & Lab Observations */}
          {(caseGraph.documents.length > 0 || caseGraph.labObservations.length > 0) && (
            <Card elevated>
              <CardHeader className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[var(--primary)]" />
                  <CardTitle className="text-sm">Paper Document Extracts &amp; Lab Observations</CardTitle>
                </div>
                <Badge variant="outline" size="sm">
                  Source Truth OCR
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-xs pt-4">
                {/* Lab observations */}
                {caseGraph.labObservations.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--muted-foreground)]">
                      Discrete Laboratory Findings
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {caseGraph.labObservations.map((lab) => (
                        <div
                          key={lab.id}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            lab.isAbnormal
                              ? "bg-[var(--danger-muted)]/20 border-[var(--danger-muted)]"
                              : "bg-[var(--surface)] border-[var(--border-subtle)]"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--foreground)]">{lab.testName}</span>
                            <span className="text-[10px] text-[var(--muted-foreground)]">
                              Value: <strong className="text-[var(--foreground)]">{lab.value} {lab.unit}</strong>{" "}
                              (Ref: {lab.referenceRange})
                            </span>
                          </div>
                          {lab.isAbnormal && (
                            <Badge variant="danger" size="sm">
                              ABNORMAL
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Documents */}
                {caseGraph.documents.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[var(--muted-foreground)]">
                      Digitized Document Artifacts
                    </span>
                    {caseGraph.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[var(--foreground)]">{doc.fileName}</span>
                          <Badge variant="outline" size="sm">
                            OCR Confidence: {Math.round((doc.ocrConfidence ?? 1) * 100)}%
                          </Badge>
                        </div>
                        <p className="font-mono text-[10px] bg-[var(--muted)]/50 p-2 rounded-lg text-[var(--muted-foreground)] whitespace-pre-wrap">
                          {doc.extractedTextSnippet}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section 5: AYUSH Assessment if present */}
          {caseGraph.ayushHistory && (
            <Card elevated>
              <CardHeader className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[var(--success)]" />
                  <CardTitle className="text-sm">AYUSH / Traditional Medicine Integration</CardTitle>
                </div>
                <Badge variant="success" size="sm">
                  {caseGraph.ayushHistory.tradition}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold">PRAKRITI</span>
                    <p className="font-semibold text-[var(--foreground)]">{caseGraph.ayushHistory.prakriti || "N/A"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold">AGNI (DIGESTION)</span>
                    <p className="font-semibold text-[var(--foreground)]">{caseGraph.ayushHistory.agni || "N/A"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold">KOSHTHA (BOWEL)</span>
                    <p className="font-semibold text-[var(--foreground)]">{caseGraph.ayushHistory.koshtha || "N/A"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold">NADI (PULSE)</span>
                    <p className="font-semibold text-[var(--foreground)]">{caseGraph.ayushHistory.nadiObservation || "N/A"}</p>
                  </div>
                </div>
                {caseGraph.ayushHistory.concurrentHomeRemedies && caseGraph.ayushHistory.concurrentHomeRemedies.length > 0 && (
                  <div className="mt-1 p-2.5 rounded-lg bg-[var(--muted)]/50 text-[11px]">
                    <span className="font-bold text-[var(--foreground)]">Concurrent Home Remedies: </span>
                    <span className="text-[var(--muted-foreground)]">
                      {caseGraph.ayushHistory.concurrentHomeRemedies.join(", ")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (1 Col wide on desktop): Deterministic Alerts & Patient Timeline */}
        <div className="flex flex-col gap-6">
          {/* Deterministic Red Flag Alerts */}
          <Card elevated className="border-[var(--danger-muted)]">
            <CardHeader className="py-3 bg-[var(--danger-muted)]/20 border-b border-[var(--danger-muted)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
                <CardTitle className="text-sm text-[var(--danger-foreground)]">Deterministic Triage Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">
              {caseGraph.triageAlerts.length === 0 ? (
                <div className="p-3 rounded-lg bg-[var(--success-muted)]/20 border border-[var(--success-muted)] text-xs text-[var(--success)]">
                  No red-flag emergency criteria detected. Patient routed to standard OPD queue.
                </div>
              ) : (
                caseGraph.triageAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl border border-[var(--danger-muted)] bg-[var(--danger-muted)]/30 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="danger" size="sm">
                        {alert.ruleId}
                      </Badge>
                      <span className="text-[10px] font-mono text-[var(--danger)] uppercase font-bold">
                        {alert.severity}
                      </span>
                    </div>

                    <span className="font-extrabold text-xs text-[var(--foreground)]">
                      {alert.ruleTitle}
                    </span>

                    <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                      {alert.clinicalReason}
                    </p>

                    <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--danger-muted)] text-[11px]">
                      <span className="font-bold text-[var(--danger-foreground)]">Recommended Action: </span>
                      <span className="text-[var(--foreground)]">{alert.suggestedAction}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Chronological Patient Timeline */}
          <Card elevated>
            <CardHeader className="py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Patient Clinical Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs p-4">
              {caseGraph.timeline.length === 0 ? (
                <span className="text-[var(--muted-foreground)] italic">Timeline empty.</span>
              ) : (
                <div className="relative pl-6 border-l-2 border-[var(--primary)]/30 flex flex-col gap-4">
                  {caseGraph.timeline.map((event, idx) => (
                    <div key={event.id} className="relative">
                      <span
                        className={`absolute -left-[31px] top-0.5 w-3 h-3 rounded-full ${
                          idx === 0 ? "bg-[var(--primary)]" : "bg-[var(--border-strong)]"
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--foreground)] text-[11px]">
                          {event.title}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          {event.approximateDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Verification Audit History */}
          <Card elevated>
            <CardHeader className="py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
                <CardTitle className="text-sm">Clinician Audit Logs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-xs p-4">
              {caseGraph.verificationLogs.length === 0 ? (
                <span className="text-[var(--muted-foreground)] italic text-[11px]">
                  No verification actions recorded in this session yet.
                </span>
              ) : (
                caseGraph.verificationLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <Badge
                        variant={log.action === "ACCEPTED" ? "success" : log.action === "REJECTED" ? "danger" : "warning"}
                        size="sm"
                      >
                        {log.action}
                      </Badge>
                      <span className="font-mono text-[var(--muted-foreground)]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[var(--foreground)]">
                      Entity: [{log.targetEntityId}] by {log.clinicianId}
                    </span>
                    {log.rationale && (
                      <span className="text-[10px] text-[var(--muted-foreground)] italic">
                        &quot;{log.rationale}&quot;
                      </span>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evidence & Provenance Drawer */}
      <Drawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        title="Clinical Evidence Provenance & Audit"
        subtitle={`Verifiable source audit for citation reference [${selectedCitationId || "E1"}]`}
      >
        <div className="flex flex-col gap-4 text-xs">
          {activeEvidence ? (
            <>
              <div className="p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--foreground)] uppercase text-[10px]">SOURCE TYPE</span>
                  <Badge variant="primary">{activeEvidence.sourceType}</Badge>
                </div>
                <span className="text-[var(--muted-foreground)] text-[11px]">
                  Captured at: {new Date(activeEvidence.timestamp).toLocaleString()} • Language:{" "}
                  {activeEvidence.originalLanguage?.toUpperCase() ?? "UNKNOWN"}
                </span>
              </div>

              {activeEvidence.rawUtterance && (
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[var(--muted-foreground)] uppercase text-[10px]">
                    Original Patient Utterance / Raw Document Extract
                  </span>
                  <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] italic text-[var(--foreground)] leading-relaxed">
                    &ldquo;{activeEvidence.rawUtterance}&rdquo;
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className="font-bold text-[var(--muted-foreground)] uppercase text-[10px]">
                  Normalized Clinical Concept Representation
                </span>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--foreground)] leading-relaxed">
                  {activeEvidence.normalizedRepresentation}
                </div>
              </div>

              {/* Status and Verification State */}
              <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--foreground)]">CURRENT STATUS:</span>
                  <Badge
                    variant={
                      activeEvidence.verificationStatus === "VERIFIED"
                        ? "success"
                        : activeEvidence.verificationStatus === "REJECTED"
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                  >
                    {activeEvidence.verificationStatus}
                  </Badge>
                </div>
                {activeEvidence.verifiedBy && (
                  <span className="text-[10px] text-[var(--muted-foreground)]">
                    Audited by {activeEvidence.verifiedBy} at {activeEvidence.verifiedAt}
                  </span>
                )}
              </div>

              {/* Physician Verification Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="font-bold text-[var(--foreground)]">Physician Verification Action:</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                    onClick={() => handleVerifyEvidence("ACCEPTED")}
                  >
                    Accept &amp; Verify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<XCircle className="w-3.5 h-3.5 text-[var(--danger)]" />}
                    onClick={() => handleVerifyEvidence("REJECTED")}
                  >
                    Reject Fact
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-[var(--muted-foreground)]">
              No evidence details found for citation [{selectedCitationId}].
            </div>
          )}
        </div>
      </Drawer>

      {/* OPD Consultation Chit Modal */}
      <Dialog
        isOpen={isChitOpen}
        onClose={() => setIsChitOpen(false)}
        title="OPD Clinical Consultation Summary Chit"
        description="Printable clinical case chit with physician signature block for hospital OPD archives."
        className="max-w-2xl"
      >
        <div className="flex flex-col gap-4 text-xs" id="printable-opd-chit">
          <div className="p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3 font-mono">
            {/* Chit Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="font-extrabold text-sm uppercase">AIIMS OPD CLINICAL SUMMARY CHIT</h3>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  SIH26047 First-Mile Intake System
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-xs">TOKEN #{caseGraph.session.id.slice(-6).toUpperCase()}</span>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <strong>Patient:</strong> {caseGraph.demographics.fullName || "Unregistered"} ({caseGraph.demographics.age}Y / {caseGraph.demographics.gender})
              </div>
              <div>
                <strong>ABHA:</strong> {caseGraph.demographics.abhaId || "N/A"}
              </div>
            </div>

            {/* Chief Complaints */}
            <div className="border-t pt-2">
              <strong>CHIEF COMPLAINTS &amp; HPI:</strong>
              <ul className="list-disc pl-4 mt-1">
                {caseGraph.chiefComplaints.map((cc) => (
                  <li key={cc.id}>
                    {cc.complaint} (Duration: {cc.duration || cc.durationText}, Severity: {cc.severity ?? cc.severityScale}/10)
                  </li>
                ))}
              </ul>
              {caseGraph.hpiStructured && (
                <p className="text-[10px] mt-1 text-[var(--muted-foreground)]">
                  Character: {caseGraph.hpiStructured.character} | Exacerbating: {caseGraph.hpiStructured.exacerbatingFactors?.join(", ")} | Relieving: {caseGraph.hpiStructured.relievingFactors?.join(", ")}
                </p>
              )}
            </div>

            {/* Allergies & Medications */}
            <div className="border-t pt-2">
              <strong>ALLERGIES:</strong>{" "}
              {caseGraph.allergies.length > 0
                ? caseGraph.allergies.map((a) => `${a.substance || a.allergen} (${a.manifestation || a.reactionType || a.severity})`).join(", ")
                : "No known drug allergies"}
            </div>
            <div>
              <strong>CURRENT MEDICATIONS:</strong>{" "}
              {caseGraph.medications.length > 0
                ? caseGraph.medications.map((m) => `${m.medicationName || m.drugName} ${m.dosage}`).join(", ")
                : "None reported"}
            </div>

            {/* Triage Alerts */}
            {caseGraph.triageAlerts.length > 0 && (
              <div className="border-t pt-2 text-[var(--danger)]">
                <strong>RED FLAG TRIAGE ALERT:</strong> {caseGraph.triageAlerts[0].ruleTitle} -{" "}
                {caseGraph.triageAlerts[0].suggestedAction}
              </div>
            )}

            {/* Doctor Signature Block */}
            <div className="border-t pt-4 mt-2 flex items-end justify-between">
              <div>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  Status: {caseGraph.isPhysicianVerified ? "VERIFIED & SIGNED" : "PROVISIONAL"}
                </span>
              </div>
              <div className="text-right">
                <div className="w-40 border-b border-[var(--foreground)] mb-1" />
                <span className="text-[10px] font-bold">Attending Physician Signature</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsChitOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => {
                window.print();
              }}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Inline Clinical History Edit Dialog */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Clinical History Assertions"
        description="Make real-time physician adjustments to synthesized duration or symptom characteristics."
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[var(--foreground)]">Duration / Time Course</label>
            <input
              type="text"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
              className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-[var(--foreground)]">Symptom Character / Descriptors</label>
            <input
              type="text"
              value={editCharacter}
              onChange={(e) => setEditCharacter(e.target.value)}
              className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdits}>
              Save Changes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
