"use client";

import React, { useState } from "react";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";
import { SYNTHETIC_SCENARIOS } from "@/mocks/scenarios/synthetic-scenarios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScenarioSwitcher() {
  const { caseGraph, loadScenario, resetToNewPatient } = useCaseGraph();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Demo Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--surface-elevated)] border-2 border-[var(--primary)] text-[var(--foreground)] text-xs font-bold shadow-xl hover:bg-[var(--primary-muted)] transition-all cursor-pointer group"
      >
        <Sparkles className="w-4 h-4 text-[var(--primary)] group-hover:rotate-12 transition-transform" />
        <span>Curated demo scenarios ({SYNTHETIC_SCENARIOS.length})</span>
        <Badge variant="warning" size="sm">
          DEMO
        </Badge>
      </button>

      {/* Modal Dialog with all 8 Scenarios */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Load Pre-Curated Clinical Demonstration Scenario"
        description="Select any synthetic clinical archetype to instantly populate patient intake, document intelligence, deterministic triage alerts, and physician case sheets."
      >
        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
          {SYNTHETIC_SCENARIOS.map((scenario) => {
            const isSelected = caseGraph.activeScenarioId === scenario.id;
            return (
              <div
                key={scenario.id}
                onClick={() => {
                  loadScenario(scenario.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5",
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--primary-muted)]/30 ring-2 ring-[var(--primary)]/30"
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted)] hover:border-[var(--border-subtle)]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--foreground)]">{scenario.name}</span>
                    <Badge variant={scenario.badge.includes("CRITICAL") ? "danger" : "outline"} size="sm">
                      {scenario.badge}
                    </Badge>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{scenario.description}</p>
              </div>
            );
          })}

          {/* Reset to Clean Blank Patient Option */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const shouldReset = window.confirm("Clear the current demo session only? This does not delete any real patient records.");
                if (shouldReset) {
                  resetToNewPatient();
                  setIsOpen(false);
                }
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full text-xs"
            >
              Reset demo intake only
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
