"use client";

import React, { useState } from "react";
import { Mic, Volume2, Hand, MessageSquare, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function PatientSurfacePage() {
  const [activeModality, setActiveModality] = useState<"voice" | "touch" | "text">("voice");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 flex flex-col gap-6">
      {/* Patient Surface Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">
              PATIENT INTAKE KIOSK / MOBILE
            </span>
            <Badge variant="outline" size="sm">
              Phase 1 Shell
            </Badge>
          </div>
          <h1 className="patient-h1 text-[var(--foreground)]">मरीज़ सहायता केंद्र / Patient Assistance</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            कृपया अपनी भाषा और सुविधा अनुसार जानकारी साझा करें (Please share your details comfortably)
          </p>
        </div>

        {/* Modality Switcher (Voice <-> Touch <-> Text) */}
        <div
          role="group"
          aria-label="Interaction Modality Selector"
          className="inline-flex rounded-xl bg-[var(--muted)] p-1.5 border border-[var(--border-subtle)] gap-1 self-start sm:self-center"
        >
          <Button
            variant={activeModality === "voice" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveModality("voice")}
            leftIcon={<Mic className="w-4 h-4" />}
            className="text-xs h-9"
          >
            बोलकर (Voice)
          </Button>
          <Button
            variant={activeModality === "touch" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveModality("touch")}
            leftIcon={<Hand className="w-4 h-4" />}
            className="text-xs h-9"
          >
            छूकर (Touch)
          </Button>
          <Button
            variant={activeModality === "text" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveModality("text")}
            leftIcon={<MessageSquare className="w-4 h-4" />}
            className="text-xs h-9"
          >
            लिखकर (Text)
          </Button>
        </div>
      </header>

      {/* Progress Indicator Foundation */}
      <section aria-label="Intake Progress" className="flex flex-col gap-2">
        <Progress
          value={33}
          label="प्रक्रिया प्रगति / Intake Progress (चरण 2 of 6: स्वास्थ्य इतिहास)"
          isPatientMode
        />
        <div className="flex justify-between text-xs text-[var(--muted-foreground)] px-1">
          <span>1. पहचान (Identity)</span>
          <span className="font-bold text-[var(--primary)]">2. लक्षण (Symptoms)</span>
          <span>3. पर्ची स्कैन (Documents)</span>
          <span>4. सारांश (Summary)</span>
        </div>
      </section>

      {/* Large Content Region (Accessible & Calm) */}
      <main className="flex flex-col gap-6">
        <Card elevated className="border-2 border-[var(--primary)]/30 rounded-3xl p-6 sm:p-10 bg-[var(--surface-elevated)]">
          <CardContent className="p-0 flex flex-col gap-6">
            {/* Audio Prompt Readback Widget */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--primary-muted)]/50 border border-[var(--primary-muted)]">
              <div className="flex items-center gap-3">
                <IconButton
                  icon={<Volume2 className="w-6 h-6 text-[var(--primary)]" />}
                  label="Listen to question audio prompt in Hindi"
                  variant="primary"
                  size="patient"
                  className="rounded-full shadow-md"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                    आवाज़ सुनें / Listen to Prompt
                  </span>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    &ldquo;आज आप किस तकलीफ के लिए डॉक्टर साहब से मिलने आए हैं?&rdquo;
                  </span>
                </div>
              </div>
            </div>

            {/* Main Question & Placeholder */}
            <div className="flex flex-col gap-3 py-4">
              <h2 className="patient-instruction text-2xl font-bold text-[var(--foreground)]">
                आप आज अस्पताल क्यों आए हैं?
              </h2>
              <p className="patient-body text-[var(--muted-foreground)]">
                What main health issue brings you to the hospital today?
              </p>

              {/* Interaction Placeholder Shell */}
              <div className="mt-4 flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/30 text-center gap-4 min-h-[220px]">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)]">
                  {activeModality === "voice" && <Mic className="w-8 h-8 animate-pulse" />}
                  {activeModality === "touch" && <Hand className="w-8 h-8" />}
                  {activeModality === "text" && <MessageSquare className="w-8 h-8" />}
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {activeModality === "voice" && "आवाज़ द्वारा मरीज़ बातचीत यहाँ होगी (Voice Intake Shell)"}
                    {activeModality === "touch" && "2D शारीरिक दर्द मानचित्र यहाँ होगा (Touch / Pain Map Shell)"}
                    {activeModality === "text" && "टेक्स्ट द्वारा सवाल-जवाब यहाँ होगा (Text Intake Shell)"}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    [Phase 1 Scaffolding] Actual multimodal clinical interview logic will be initialized in Phase 2.
                  </p>
                </div>
              </div>
            </div>

            {/* DPDP 2023 Consent & Privacy Assurance Banner */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border-subtle)] text-xs text-[var(--muted-foreground)]">
              <ShieldCheck className="w-5 h-5 text-[var(--success)] shrink-0" aria-hidden="true" />
              <span>
                <strong>DPDP Act 2023 Compliant:</strong> आपकी आवाज़ और विवरण केवल आपके डॉक्टर की सहायता के लिए सुरक्षित रूप से उपयोग किए जाते हैं। (Your data is protected and ephemeral).
              </span>
            </div>

            {/* Clear Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto" leftIcon={<HelpCircle className="w-5 h-5" />}>
                मदद चाहिए? (Need Help?)
              </Button>
              <Button
                variant="patient"
                size="patient"
                className="w-full sm:w-auto min-w-[240px]"
                rightIcon={<ArrowRight className="w-6 h-6" />}
              >
                आगे बढ़ें (Continue)
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
