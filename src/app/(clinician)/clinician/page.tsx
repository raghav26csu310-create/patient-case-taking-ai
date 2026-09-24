"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle,
  FileCheck,
  Edit3,
  XCircle,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Alert } from "@/components/ui/alert";

export default function ClinicianCockpitPage() {
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);

  const openEvidence = (citationId: string) => {
    setSelectedCitation(citationId);
    setIsEvidenceDrawerOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Clinician Top Action Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">
              CLINICAL COCKPIT (OPD DESKTOP)
            </span>
            <Badge variant="warning" size="sm">
              PHASE 1 STRUCTURAL SHELL
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Consultation Case Review & Verification
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            High-density 30-second case overview designed for rapid review and provenance verification.
          </p>
        </div>

        {/* Global Verification Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            onClick={() => alert("Inline editing will be enabled in Phase 5")}
          >
            Edit Case
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5" />}
            onClick={() => alert("Physician verification flow will be enabled in Phase 5")}
          >
            Verify & Accept Case
          </Button>
        </div>
      </header>

      {/* Patient Header Strip Placeholder */}
      <section aria-label="Patient Demographics Summary" className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center font-bold text-sm">
            RS
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--foreground)]">Rameshwar Sharma (Demo Profile)</span>
              <Badge variant="outline" size="sm">
                ABHA: 91-4582-1092-4412
              </Badge>
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              54 Yrs • Male • Token #OPD-042 • Preferred Language: Hindi / Hinglish
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="danger" size="md" className="gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            TRIAGE PRIORITY: URGENT (CARDIO)
          </Badge>
          <Badge variant="outline" size="md">
            Visit: Follow-up
          </Badge>
        </div>
      </section>

      {/* Grid Layout: Left Column (Case Sheet) vs Right Column (Timeline & Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop): Core Clinical Case */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Section: Chief Complaint & HPI */}
          <Card elevated>
            <CardHeader className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Chief Complaint & History of Present Illness (HPI)</CardTitle>
              </div>
              <Badge variant="evidence" size="sm" onClick={() => openEvidence("E1")}>
                [E1] Audio Evidence
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs leading-relaxed">
              <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border-subtle)] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--foreground)]">Retrosternal chest discomfort (2 days)</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Duration: 48h • Severity: 7/10</span>
                </div>
                <p className="text-[var(--muted-foreground)]">
                  Patient reports dull aching retrosternal heaviness radiating to the left shoulder and arm. Aggravated by
                  climbing stairs, partially relieved by rest. Denies fever, hemoptysis, or syncope.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-[var(--primary)]">Source Grounding:</span>
                  <button
                    onClick={() => openEvidence("E1")}
                    className="text-[10px] text-[var(--primary)] underline hover:text-[var(--primary-hover)] cursor-pointer"
                  >
                    View Hindi Voice Transcript Snippet [E1]
                  </button>
                </div>
              </div>

              {/* Skeletons demonstrating future clinical section density */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="font-bold text-[var(--foreground)] uppercase tracking-wider text-[11px]">
                  Past Medical & Surgical History (Structural Placeholder)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] flex justify-between items-center">
                    <span>Type 2 Diabetes Mellitus (5 yrs)</span>
                    <Badge variant="evidence" size="sm" onClick={() => openEvidence("E2")}>
                      [E2 Doc]
                    </Badge>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] flex justify-between items-center">
                    <span>Essential Hypertension (3 yrs)</span>
                    <Badge variant="outline" size="sm">Self-Reported</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Medications & Allergies */}
          <Card elevated>
            <CardHeader className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Current Regimen & Verified Document Observations</CardTitle>
              </div>
              <Badge variant="outline" size="sm">Source: Prescription OCR</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--foreground)]">Tab Metformin 500mg</span>
                  <span className="text-[var(--muted-foreground)]">Dosage: 500mg • Twice daily (BID) • Self-Reported Compliant</span>
                </div>
                <Badge variant="evidence" size="sm" onClick={() => openEvidence("E3")}>
                  [E3 Crop]
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--danger-muted)]/40 border border-[var(--danger-muted)]">
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--danger-foreground)]">Known Drug Allergy: Penicillin</span>
                  <span className="text-[var(--muted-foreground)]">Reaction: Cutaneous urticaria & pruritus</span>
                </div>
                <Badge variant="danger" size="sm">HIGH ALERT</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Alerts */}
        <div className="flex flex-col gap-6">
          {/* Deterministic Red Flag Alerts Card */}
          <Card elevated className="border-[var(--danger-muted)]">
            <CardHeader className="py-3 bg-[var(--danger-muted)]/20 border-b border-[var(--danger-muted)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
                <CardTitle className="text-sm text-[var(--danger-foreground)]">Deterministic Triage Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">
              <Alert variant="danger" title="Rule RF-CARD-001 Triggered">
                Suspected Acute Coronary Syndrome. Recommended Action: Immediate 12-lead ECG and Troponin I evaluation.
              </Alert>
            </CardContent>
          </Card>

          {/* Chronological Patient Timeline Placeholder */}
          <Card elevated>
            <CardHeader className="py-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                <CardTitle className="text-sm">Patient Clinical Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs">
              <div className="relative pl-6 border-l-2 border-[var(--primary)]/30 flex flex-col gap-4">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[var(--primary)]" />
                  <span className="font-bold text-[var(--foreground)]">Today, 10:45 AM</span>
                  <p className="text-[var(--muted-foreground)]">OPD Intake registered via Voice & Kiosk</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[var(--border)]" />
                  <span className="font-bold text-[var(--foreground)]">2 Days Ago</span>
                  <p className="text-[var(--muted-foreground)]">Onset of retrosternal heaviness on exertion</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[var(--border)]" />
                  <span className="font-bold text-[var(--foreground)]">6 Months Ago</span>
                  <p className="text-[var(--muted-foreground)]">Prior prescription dispensed at District Civil Hospital</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evidence & Provenance Drawer Component */}
      <Drawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        title="Evidence Provenance & Source Audit"
        subtitle={`Audit trail for citation reference [${selectedCitation || "E1"}]`}
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[var(--foreground)]">SOURCE TYPE</span>
              <Badge variant="primary">PATIENT VOICE INTERVIEW</Badge>
            </div>
            <span className="text-[var(--muted-foreground)]">Captured: Today at 10:42 AM IST (Kiosk Session #042)</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold text-[var(--muted-foreground)] uppercase text-[10px]">
              Original Patient Utterance (Hindi / Vernacular)
            </span>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] italic text-[var(--foreground)]">
              &ldquo;मुझे दो दिन से सीने में भारीपन लग रहा है, और यह दर्द बाएँ हाथ की तरफ जाता है।&rdquo;
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold text-[var(--muted-foreground)] uppercase text-[10px]">
              Normalized Clinical Representation
            </span>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--foreground)]">
              Retrosternal chest heaviness for 2 days radiating to left arm.
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--foreground)]">Physician Verification Action:</span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                onClick={() => {
                  alert("Citation verified by physician");
                  setIsEvidenceDrawerOpen(false);
                }}
              >
                Accept & Verify
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<XCircle className="w-3.5 h-3.5 text-[var(--danger)]" />}
                onClick={() => {
                  alert("Citation rejected by physician");
                  setIsEvidenceDrawerOpen(false);
                }}
              >
                Reject Fact
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
