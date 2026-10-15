"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Clock,
  HeartPulse,
  CheckCircle2,
  Search,
  Filter,
  Flame,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";

interface QueuePatient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  severity: "EMERGENCY" | "URGENT" | "PRIORITY" | "ROUTINE";
  ruleId?: string;
  departmentRecommendation: string;
  arrivedAt: string;
  vitals?: { bp?: string; pulse?: number; spo2?: number; temp?: string };
  isAcknowledged: boolean;
}

export default function TriageQueuePage() {
  const { caseGraph, loadScenario } = useCaseGraph();
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});

  // Generate real-time waiting queue combining active case + other synthetic OPD patients
  const queuePatients: QueuePatient[] = [
    // Current Active Case in Context
    {
      id: caseGraph.session.id,
      token: `#OPD-${caseGraph.session.id.slice(-4).toUpperCase()}`,
      name: caseGraph.demographics.fullName || "Current Active Intake",
      age: caseGraph.demographics.age,
      gender: caseGraph.demographics.gender,
      chiefComplaint:
        caseGraph.chiefComplaints[0]?.complaint || "Awaiting triage interview input",
      severity:
        caseGraph.triageAlerts[0]?.severity === "EMERGENCY"
          ? "EMERGENCY"
          : caseGraph.triageAlerts.length > 0
          ? "URGENT"
          : "ROUTINE",
      ruleId: caseGraph.triageAlerts[0]?.ruleId,
      departmentRecommendation:
        caseGraph.triageAlerts[0]?.departmentRoutingRecommendation || "GENERAL MEDICINE",
      arrivedAt: "10 mins ago",
      vitals: { bp: "148/92", pulse: 94, spo2: 96 },
      isAcknowledged: !!acknowledgedAlerts[caseGraph.session.id],
    },
    // Synthetic Queue Patient 2: Stroke FAST Emergency
    {
      id: "pt-queue-fast",
      token: "#OPD-1029",
      name: "Sunita Devi",
      age: 62,
      gender: "FEMALE",
      chiefComplaint: "Acute right-sided facial droop and right arm heaviness",
      severity: "EMERGENCY",
      ruleId: "RF-NEURO-001",
      departmentRecommendation: "EMERGENCY / STROKE BAY",
      arrivedAt: "4 mins ago",
      vitals: { bp: "182/104", pulse: 88, spo2: 98 },
      isAcknowledged: !!acknowledgedAlerts["pt-queue-fast"],
    },
    // Synthetic Queue Patient 3: Asthma Exacerbation
    {
      id: "pt-queue-resp",
      token: "#OPD-1025",
      name: "Mohd. Tariq",
      age: 28,
      gender: "MALE",
      chiefComplaint: "Severe wheezing, accessory muscle use, unable to complete sentences",
      severity: "URGENT",
      ruleId: "RF-RESP-001",
      departmentRecommendation: "PULMONOLOGY / NEBULIZATION",
      arrivedAt: "18 mins ago",
      vitals: { bp: "132/80", pulse: 110, spo2: 91 },
      isAcknowledged: !!acknowledgedAlerts["pt-queue-resp"],
    },
    // Synthetic Queue Patient 4: Anaphylaxis risk
    {
      id: "pt-queue-allergy",
      token: "#OPD-1018",
      name: "Pooja Hegde",
      age: 34,
      gender: "FEMALE",
      chiefComplaint: "Periorbital swelling and throat tightness after amoxicillin",
      severity: "EMERGENCY",
      ruleId: "RF-ALLERG-001",
      departmentRecommendation: "EMERGENCY / RESUSCITATION",
      arrivedAt: "22 mins ago",
      vitals: { bp: "100/65", pulse: 118, spo2: 95 },
      isAcknowledged: !!acknowledgedAlerts["pt-queue-allergy"],
    },
    // Synthetic Queue Patient 5: Routine Chronic Care
    {
      id: "pt-queue-chronic",
      token: "#OPD-0994",
      name: "Anand Verma",
      age: 48,
      gender: "MALE",
      chiefComplaint: "Routine 3-month diabetes follow-up and prescription refill",
      severity: "ROUTINE",
      departmentRecommendation: "INTERNAL MEDICINE",
      arrivedAt: "35 mins ago",
      vitals: { bp: "128/82", pulse: 74, spo2: 99 },
      isAcknowledged: true,
    },
    // Synthetic Queue Patient 6: Priority Joint Pain
    {
      id: "pt-queue-ortho",
      token: "#OPD-0988",
      name: "Kavita Rao",
      age: 58,
      gender: "FEMALE",
      chiefComplaint: "Bilateral knee swelling and inability to bear weight",
      severity: "PRIORITY",
      departmentRecommendation: "ORTHOPEDICS",
      arrivedAt: "42 mins ago",
      vitals: { bp: "130/84", pulse: 78, spo2: 98 },
      isAcknowledged: true,
    },
  ];

  const handleAcknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: true }));
  };

  const filteredQueue = queuePatients.filter((pt) => {
    const matchesSeverity = filterSeverity === "ALL" || pt.severity === filterSeverity;
    const matchesSearch =
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const emergencyCount = queuePatients.filter((p) => p.severity === "EMERGENCY").length;
  const urgentCount = queuePatients.filter((p) => p.severity === "URGENT").length;
  const routineCount = queuePatients.filter((p) => p.severity === "ROUTINE" || p.severity === "PRIORITY").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Triage Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--warning)] font-mono">
              OPD TRIAGE &amp; EMERGENCY ESCALATION
            </span>
            <Badge variant="danger" size="sm" className="gap-1">
              <Flame className="w-3 h-3" />
              {emergencyCount} CRITICAL RED FLAGS
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Deterministic Red-Flag Queue &amp; Routing Engine
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Rule-based medical emergency detection isolated from LLMs. Automatically prioritizes time-critical presentations for nursing intervention.
          </p>
        </div>

        {/* Quick Scenario Injectors for Triage Testing */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadScenario("scenario-emergency-acs")}
          >
            Load ACS Red Flag
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadScenario("scenario-stroke-fast")}
          >
            Load Stroke FAST
          </Button>
        </div>
      </header>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-[var(--danger-muted)] bg-[var(--danger-muted)]/25 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--danger-foreground)] uppercase">
              Emergency (Immediate Care)
            </span>
            <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
          </div>
          <span className="text-3xl font-black text-[var(--danger)]">{emergencyCount}</span>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            Suspected ACS, stroke signs, or severe airway risk
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--warning-muted)] bg-[var(--warning-muted)]/25 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--warning-foreground)] uppercase">
              Urgent Priority
            </span>
            <HeartPulse className="w-4 h-4 text-[var(--warning)]" />
          </div>
          <span className="text-3xl font-black text-[var(--warning)]">{urgentCount}</span>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            Abnormal SpO2, high fevers, or severe pain (VAS &gt; 7)
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--foreground)] uppercase">
              Standard OPD Queue
            </span>
            <UserCheck className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <span className="text-3xl font-black text-[var(--primary)]">{routineCount}</span>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            Routine consultations, chronic follow-ups &amp; refills
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by patient name, token #, or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          <div className="flex gap-1">
            {["ALL", "EMERGENCY", "URGENT", "PRIORITY", "ROUTINE"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterSeverity === sev
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Patients Queue List */}
      <div className="flex flex-col gap-3">
        {filteredQueue.length === 0 ? (
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--muted-foreground)]">
            No waiting patients match the selected filter.
          </div>
        ) : (
          filteredQueue.map((patient) => {
            const isEmergency = patient.severity === "EMERGENCY";
            const isUrgent = patient.severity === "URGENT";

            return (
              <Card
                key={patient.id}
                elevated
                className={`transition-all ${
                  isEmergency
                    ? "border-[var(--danger-muted)] ring-1 ring-[var(--danger)]/30 bg-[var(--danger-muted)]/10"
                    : isUrgent
                    ? "border-[var(--warning-muted)]"
                    : "border-[var(--border)]"
                }`}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Column: Patient info & Red flag reason */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isEmergency
                          ? "bg-[var(--danger-muted)] text-[var(--danger)]"
                          : isUrgent
                          ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                          : "bg-[var(--muted)] text-[var(--foreground)]"
                      }`}
                    >
                      {patient.token.replace("#OPD-", "")}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-[var(--foreground)]">
                          {patient.name}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {patient.age}Y • {patient.gender}
                        </span>
                        <Badge
                          variant={
                            isEmergency
                              ? "danger"
                              : isUrgent
                              ? "warning"
                              : "outline"
                          }
                          size="sm"
                        >
                          {patient.severity}
                        </Badge>
                        {patient.ruleId && (
                          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                            {patient.ruleId}
                          </Badge>
                        )}
                        <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {patient.arrivedAt}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-[var(--foreground)]">
                        {patient.chiefComplaint}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--muted-foreground)] mt-0.5">
                        <span>
                          Routing Recommendation:{" "}
                          <strong className="text-[var(--primary)]">{patient.departmentRecommendation}</strong>
                        </span>
                        {patient.vitals && (
                          <span className="font-mono">
                            BP: {patient.vitals.bp} | HR: {patient.vitals.pulse} bpm | SpO2: {patient.vitals.spo2}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Triage Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!patient.isAcknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        onClick={() => handleAcknowledge(patient.id)}
                      >
                        Acknowledge
                      </Button>
                    )}

                    <Link href="/clinician">
                      <Button
                        variant={isEmergency ? "primary" : "secondary"}
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Review in Cockpit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Deterministic Rule Engine Explanation */}
      <section className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[var(--warning)]" />
          <h4 className="font-bold text-[var(--foreground)]">Deterministic Safety Isolation Architecture</h4>
        </div>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          Triage escalations in this platform are computed using <strong>strict rule-based algorithms</strong> (hardcoded thresholds for chest pain, facial droop, oxygen desaturation, and anaphylaxis signs). Generative LLMs are never permitted to unilaterally assign or downgrade emergency triage priority.
        </p>
      </section>
    </div>
  );
}
