"use client";

import { ShieldAlert, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback-states";

export default function TriageQueuePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Triage Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--warning)] font-mono">
              TRIAGE & QUEUE MANAGEMENT
            </span>
            <Badge variant="outline" size="sm">
              Phase 1 Structural Shell
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            OPD Emergency Priority & Queue Dashboard
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Deterministic triage rule escalation for high-volume outpatient waiting halls.
          </p>
        </div>
      </header>

      {/* Triage Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[var(--danger-muted)] bg-[var(--danger-muted)]/20 flex flex-col gap-1">
          <span className="text-xs font-bold text-[var(--danger-foreground)] uppercase">Urgent Red Flags</span>
          <span className="text-2xl font-black text-[var(--danger)]">1</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">Immediate nursing triage required</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--warning-muted)] bg-[var(--warning-muted)]/20 flex flex-col gap-1">
          <span className="text-xs font-bold text-[var(--warning-foreground)] uppercase">Moderate Priority</span>
          <span className="text-2xl font-black text-[var(--warning)]">3</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">Vitals check recommended</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] flex flex-col gap-1">
          <span className="text-xs font-bold text-[var(--foreground)] uppercase">Standard Queue</span>
          <span className="text-2xl font-black text-[var(--primary)]">14</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">Routine OPD order</span>
        </div>
      </div>

      {/* Structural Placeholder Content */}
      <Card elevated>
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--primary)]" />
            <CardTitle className="text-sm">Active Patient Waiting Queue (Structural Placeholder)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <EmptyState
            title="Triage Priority Engine Shell"
            whatShouldAppearHere="Real-time synchronized queue will display active waiting patients sorted by deterministic red flag rules and arrival timestamps."
            icon={<ShieldAlert className="w-6 h-6 text-[var(--warning)]" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
