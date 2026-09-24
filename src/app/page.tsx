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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ModeBadge } from "@/components/ui/mode-badge";

export default function PortalHomePage() {
  const surfaceCards = [
    {
      href: "/patient",
      title: "Patient Surface (Kiosk / Mobile)",
      badge: "Accessibility First",
      icon: <User className="w-6 h-6 text-[var(--primary)]" />,
      description:
        "Designed for elderly, low-literacy, and multilingual patients. Features large touch targets, voice-first interaction placeholders, and audio consent.",
      actionText: "Launch Patient Shell",
    },
    {
      href: "/clinician",
      title: "Clinician Cockpit (Desktop)",
      badge: "Sub-30s Review",
      icon: <Stethoscope className="w-6 h-6 text-[var(--primary)]" />,
      description:
        "High-density clinical case sheet with chronological timeline, interactive evidence provenance citations, and one-click physician verification.",
      actionText: "Launch Clinician Shell",
    },
    {
      href: "/triage",
      title: "Triage & Emergency Queue",
      badge: "Deterministic Safety",
      icon: <ShieldAlert className="w-6 h-6 text-[var(--warning)]" />,
      description:
        "Rule-based red flag triage engine isolated from generative models. Escalates suspected acute coronary syndrome, stroke, and respiratory distress.",
      actionText: "Launch Triage Shell",
    },
    {
      href: "/admin",
      title: "Admin & Clinical Audit",
      badge: "DPDP 2023 & ABDM",
      icon: <Settings className="w-6 h-6 text-[var(--muted-foreground)]" />,
      description:
        "System governance, ephemeral audio retention policies, clinician audit trails, and ABDM interoperability sandbox controls.",
      actionText: "Launch Admin Shell",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Hero Section */}
      <section className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary-muted" className="gap-1.5 py-1 px-3">
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              SIH26047 Smart India Hackathon
            </Badge>
            <ModeBadge />
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Phase 1 Baseline Active
          </Badge>
        </div>

        <div className="max-w-3xl flex flex-col gap-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            First-Mile Clinical Case-Taking Intelligence
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            Transforming fragmented patient history and paper records into structured, evidence-linked clinical cases
            before consultation in high-volume Indian Outpatient Departments (OPDs).
          </p>
        </div>

        {/* Phase 1 Scope Notice */}
        <Alert variant="info" title="Phase 1 Architectural Scope Active">
          This deployment represents the <strong>technical foundation and clinical design system</strong>. Complete
          clinical interview logic, generative AI calls, real OCR parsing, and live ABDM network calls are deliberately
          frozen until downstream phases.
        </Alert>

        {/* 6-Stage Journey Tracker */}
        <div className="mt-2 pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Approved Patient Journey Pipeline:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { step: "1", title: "Identify", desc: "ABHA / Token" },
              { step: "2", title: "Consent", desc: "DPDP 2023 Voice" },
              { step: "3", title: "Converse", desc: "Voice / Touch / Text" },
              { step: "4", title: "Scan", desc: "OCR Source Truth" },
              { step: "5", title: "Summarize", desc: "Deterministic Triage" },
              { step: "6", title: "Consult", desc: "Doctor Verification" },
            ].map((j) => (
              <div
                key={j.step}
                className="flex flex-col p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] gap-1"
              >
                <span className="text-[10px] font-bold text-[var(--primary)] font-mono">STAGE {j.step}</span>
                <span className="text-xs font-bold text-[var(--foreground)]">{j.title}</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{j.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Surface Launch Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">System Application Surfaces</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Modular shells tailored for distinct clinical and patient personas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surfaceCards.map((surface) => (
            <Card key={surface.href} elevated className="flex flex-col justify-between hover:border-[var(--primary)] transition-colors">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[var(--muted)]">{surface.icon}</div>
                  <Badge variant="outline">{surface.badge}</Badge>
                </div>
                <div>
                  <CardTitle>{surface.title}</CardTitle>
                  <CardDescription className="mt-1 leading-relaxed">{surface.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <Link href={surface.href} className="w-full">
                  <Button variant="secondary" size="md" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {surface.actionText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architectural Pillars Summary */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
            Phase 1 Architectural Invariants Established
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--foreground)]">Next.js 16.x Active LTS</span>
            <span className="text-[var(--muted-foreground)]">React 19.x, strict TypeScript, Tailwind CSS design tokens.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--foreground)]">Clinical AI Gateway</span>
            <span className="text-[var(--muted-foreground)]">Provider-agnostic interface with zero vendor lock-in.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--foreground)]">Deterministic Triage</span>
            <span className="text-[var(--muted-foreground)]">Hardcoded emergency rules strictly isolated from probabilistic LLMs.</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--foreground)]">Source Truth OCR</span>
            <span className="text-[var(--muted-foreground)]">Zero dosage invention; abnormal labs remain observations.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
