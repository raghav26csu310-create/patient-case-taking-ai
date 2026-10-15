"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Stethoscope,
  User,
  ShieldAlert,
  Settings,
  Layers,
  Sparkles,
  HeartPulse,
  FileCheck2,
  Lock,
  Globe2,
  CheckCircle2,
  Cpu,
  ActivitySquare,
  PlayCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModeBadge } from "@/components/ui/mode-badge";
import { SpatialLandingCanvas } from "@/components/spatial/spatial-landing-canvas";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";
import { SYNTHETIC_SCENARIOS } from "@/mocks/scenarios/synthetic-scenarios";

export default function PortalHomePage() {
  const { caseGraph, loadScenario } = useCaseGraph();

  const surfaceCards = [
    {
      href: "/patient",
      title: "Patient Surface (Kiosk / Mobile)",
      badge: "Accessibility & Multilingual",
      icon: <User className="w-6 h-6 text-[var(--primary)]" />,
      description:
        "Designed for elderly, low-literacy, and multilingual patients. Features vernacular voice STT/TTS, 2D anatomical pain map, 3D holographic wireframe, and granular DPDP consent.",
      actionText: "Open Patient Kiosk",
      status: caseGraph.session.status,
    },
    {
      href: "/clinician",
      title: "Clinician Cockpit (Desktop)",
      badge: "Sub-30s Consultation Review",
      icon: <Stethoscope className="w-6 h-6 text-[var(--primary)]" />,
      description:
        "High-density clinical case sheet with chronological timeline, interactive [E1]-[E4] evidence provenance citations, inline physician editing, and 1-click consultation verification.",
      actionText: "Open Clinician Cockpit",
      status: caseGraph.isPhysicianVerified ? "VERIFIED" : "PENDING_DOCTOR_REVIEW",
    },
    {
      href: "/triage",
      title: "Triage & Emergency Queue",
      badge: "Deterministic Safety Rules",
      icon: <ShieldAlert className="w-6 h-6 text-[var(--warning)]" />,
      description:
        "Deterministic red-flag rules isolated from LLMs. Automatically escalates suspected acute coronary syndrome, FAST stroke signs, or severe respiratory distress to nursing bays.",
      actionText: "Open Triage Workspace",
      status: `${caseGraph.triageAlerts.length} Active Alert(s)`,
    },
    {
      href: "/admin",
      title: "Admin & Interoperability",
      badge: "DPDP 2023 & ABDM FHIR R4",
      icon: <Settings className="w-6 h-6 text-[var(--muted-foreground)]" />,
      description:
        "Hospital governance, 24-hour ephemeral audio retention enforcement, ABDM M1/M2/M3 gateway sandboxing, and FHIR R4 clinical document bundle generation.",
      actionText: "Open Admin & Audit",
      status: "ABDM Sandbox Active",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Hero Section with 3D Spatial Canvas */}
      <section className="relative rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface)] p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Background 3D Spatial Holographic Canvas */}
        <div className="absolute inset-0 z-0 opacity-40">
          <SpatialLandingCanvas className="w-full h-full" />
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="primary-muted" className="gap-1.5 py-1 px-3">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                SIH26047 • Smart India Hackathon 2026
              </Badge>
              <ModeBadge />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Active LTS Next.js 16 • React 19
              </Badge>
              <Badge variant="success" className="font-mono text-xs">
                FHIR R4 Ready
              </Badge>
            </div>
          </div>

          <div className="max-w-3xl flex flex-col gap-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] leading-tight">
              First-Mile Clinical Intake &amp; Case-Taking AI
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              Empowering high-volume Indian OPDs to transform fragmented patient stories, vernacular voice utterances,
              and paper prescriptions into structured, evidence-backed clinical summaries with sub-30-second physician
              verification.
            </p>
          </div>

          {/* Active Case Live Status Banner */}
          <div className="p-4 rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface)]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center font-bold">
                <ActivitySquare className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[var(--foreground)]">
                    Active Patient: {caseGraph.demographics.fullName || "Unregistered Patient"}
                  </span>
                  <Badge variant="outline" size="sm">
                    {caseGraph.demographics.age}Y • {caseGraph.demographics.gender}
                  </Badge>
                  {caseGraph.demographics.abhaId && (
                    <Badge variant="primary" size="sm">
                      ABHA: {caseGraph.demographics.abhaId}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Session: <span className="font-mono">{caseGraph.session.id}</span> • Status:{" "}
                  <strong className="text-[var(--primary)]">{caseGraph.session.status}</strong> • Triage:{" "}
                  <strong>{caseGraph.triageAlerts[0]?.severity || "ROUTINE"}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/clinician">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Review in Cockpit
                </Button>
              </Link>
              <Link href="/patient">
                <Button variant="outline" size="sm">
                  Resume Intake
                </Button>
              </Link>
            </div>
          </div>

          {/* 6-Stage Journey Tracker */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Approved 6-Stage Patient Clinical Journey Pipeline
              </span>
              <span className="text-[11px] font-mono text-[var(--primary)]">
                Isolated Triage &amp; Evidence Grounding
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { step: "1", title: "Identify", desc: "ABHA / Token ID", icon: <User className="w-3.5 h-3.5" /> },
                { step: "2", title: "Consent", desc: "DPDP 2023 Audio", icon: <Lock className="w-3.5 h-3.5" /> },
                { step: "3", title: "Converse", desc: "Voice / Touch / Pain Map", icon: <Globe2 className="w-3.5 h-3.5" /> },
                { step: "4", title: "Scan", desc: "Source Truth OCR", icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
                { step: "5", title: "Summarize", desc: "Deterministic Triage", icon: <HeartPulse className="w-3.5 h-3.5" /> },
                { step: "6", title: "Consult", desc: "Physician Verification", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
              ].map((j) => (
                <div
                  key={j.step}
                  className="flex flex-col p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/80 backdrop-blur-sm gap-1 hover:border-[var(--primary)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--primary)] font-mono">STAGE {j.step}</span>
                    <span className="text-[var(--muted-foreground)]">{j.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--foreground)]">{j.title}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)] leading-tight">{j.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8 Synthetic Clinical Scenarios 1-Click Launch Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[var(--primary)]" />
              1-Click Synthetic Clinical Test Scenarios
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Pre-curated clinical test cases demonstrating diverse OPD demographics, acute red flags, low-literacy needs, and AYUSH integration.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
            {SYNTHETIC_SCENARIOS.length} Scenarios Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYNTHETIC_SCENARIOS.map((scenario) => {
            const isSelected =
              caseGraph.session.id === scenario.caseGraph.session.id ||
              caseGraph.demographics.fullName === scenario.caseGraph.demographics.fullName;

            return (
              <div
                key={scenario.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--primary-muted)]/30 ring-2 ring-[var(--primary)]/30"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1">
                    <Badge variant="primary-muted" size="sm">
                      {scenario.badge}
                    </Badge>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      {scenario.caseGraph.demographics.age}Y • {scenario.caseGraph.demographics.gender}
                    </span>
                  </div>

                  <span className="font-bold text-sm text-[var(--foreground)] leading-snug">
                    {scenario.name}
                  </span>

                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-semibold text-[var(--primary)] truncate max-w-[120px]">
                    {scenario.caseGraph.demographics.fullName}
                  </span>
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    onClick={() => loadScenario(scenario.id)}
                  >
                    {isSelected ? "Active Case" : "Load Scenario"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modular System Surfaces */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">System Application Surfaces</h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Role-specific workspaces engineered for Indian public health infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surfaceCards.map((surface) => (
            <Card key={surface.href} elevated className="flex flex-col justify-between hover:border-[var(--primary)] transition-colors">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[var(--muted)]">{surface.icon}</div>
                  <Badge variant="outline">{surface.badge}</Badge>
                </div>
                <div>
                  <CardTitle>{surface.title}</CardTitle>
                  <CardDescription className="mt-1 leading-relaxed text-xs sm:text-sm">
                    {surface.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">
                  Status: <strong className="text-[var(--foreground)]">{surface.status}</strong>
                </span>
                <Link href={surface.href}>
                  <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {surface.actionText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Clinical Safety & Regulatory Pillars */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
            Clinical Safety &amp; Interoperability Commitments
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-[var(--danger)] font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Deterministic Triage</span>
            </div>
            <span className="text-[var(--muted-foreground)] leading-relaxed">
              Critical red-flag rules (ACS, stroke, anaphylaxis) execute via isolated deterministic code without LLM hallucination risk.
            </span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
              <FileCheck2 className="w-4 h-4" />
              <span>Source Truth OCR</span>
            </div>
            <span className="text-[var(--muted-foreground)] leading-relaxed">
              Extracted paper prescriptions strictly preserve verbatim dosages. Zero invented medication strengths or unilateral diagnoses.
            </span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-[var(--success)] font-bold">
              <Lock className="w-4 h-4" />
              <span>DPDP Act 2023 Audio Rules</span>
            </div>
            <span className="text-[var(--muted-foreground)] leading-relaxed">
              Audio recordings automatically purged within 24 hours of consultation verification. Granular, revocable patient consent.
            </span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-[var(--warning)] font-bold">
              <Cpu className="w-4 h-4" />
              <span>Provider-Agnostic Gateway</span>
            </div>
            <span className="text-[var(--muted-foreground)] leading-relaxed">
              Standardized AI Gateway decouples clinical synthesis from specific cloud vendors, enabling local edge or sovereign LLM execution.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
