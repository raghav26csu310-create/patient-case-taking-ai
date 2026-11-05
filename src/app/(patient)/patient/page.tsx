"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  FileText,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Eye,
} from "lucide-react";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";
import { LOCALES } from "@/services/translation/language-registry";
import { getSpeechService } from "@/services/speech/speech-service";
import { CLINICAL_INTERVIEW_QUESTIONS, QuestionDefinition } from "@/features/interview/question-engine";
import { AnatomicalBodyMap } from "@/components/anatomy/anatomical-body-map";
import { Anatomical3DViewer } from "@/components/anatomy/anatomical-3d-viewer";
import { GRANULAR_CONSENT_CATEGORIES } from "@/domain/consent/types";
import { Button, IconButton } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PatientFlowStep = "ENTRY_IDENTIFY" | "CONSENT" | "INTERVIEW" | "DOCUMENTS" | "SUMMARY_READY";

export default function PatientSurfacePage() {
  const {
    caseGraph,
    setLanguage,
    setInteractionMode,
    updateDemographics,
    updateConsent,
    setPainMap,
    addChiefComplaint,
    updateHpi,
    addPastMedicalHistory,
    addMedication,
    addAllergy,
    updatePersonalHistory,
    updateAyushHistory,
    addDocument,
    isLowLiteracyMode,
  } = useCaseGraph();

  const [currentStep, setCurrentStep] = useState<PatientFlowStep>("ENTRY_IDENTIFY");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [show3dAnatomy, setShow3dAnatomy] = useState(false);
  const [uploadedFileNotice, setUploadedFileNotice] = useState<string | null>(null);

  const lang = caseGraph.session.language;
  const t = LOCALES[lang] || LOCALES.hi;
  const speechService = getSpeechService();

  // Reset audio on unmount or step switch
  useEffect(() => {
    return () => {
      speechService.cancelSpeech();
    };
  }, [speechService]);

  // Audio Playback Handler
  const handlePlayAudio = (textToSpeak: string) => {
    if (isPlayingAudio) {
      speechService.cancelSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speechService.speakText(textToSpeak, lang, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  // Speech Recognition Handler
  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscriptPreview("");
      speechService.startListening(
        lang,
        (result) => {
          setTranscriptPreview(result.transcript);
          if (result.isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          console.warn("Speech error:", error);
          setIsListening(false);
        }
      );
    }
  };

  // Navigation across interview questions with skip logic
  const activeQuestions = CLINICAL_INTERVIEW_QUESTIONS.filter((q) => !q.condition || q.condition(caseGraph));
  const currentQuestion: QuestionDefinition | undefined = activeQuestions[currentQuestionIndex];

  const handleNextQuestion = () => {
    speechService.cancelSpeech();
    setIsPlayingAudio(false);
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscriptPreview("");
    } else {
      setCurrentStep("DOCUMENTS");
    }
  };

  const handlePreviousQuestion = () => {
    speechService.cancelSpeech();
    setIsPlayingAudio(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTranscriptPreview("");
    } else {
      setCurrentStep("CONSENT");
    }
  };

  // Record an answer to the current question
  const handleAnswerQuestion = (val: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.section === "CHIEF_COMPLAINT") {
      addChiefComplaint({
        id: `cc-${Date.now()}`,
        complaint: val,
        durationText: "Reported during intake",
        evidenceCitationId: `ev-cc-${Date.now()}`,
      });
    } else if (currentQuestion.section === "HPI") {
      updateHpi({
        character: val,
        associations: val.includes("DIAPHORESIS") ? ["Cold sweating", "Diaphoresis"] : undefined,
      });
    } else if (currentQuestion.section === "PAST_MEDICAL") {
      addPastMedicalHistory({
        id: `pmh-${Date.now()}`,
        condition: val,
        diagnosedDuration: "Established",
        status: "ACTIVE",
      });
    } else if (currentQuestion.section === "MEDICATION") {
      addMedication({
        id: `med-${Date.now()}`,
        drugName: val,
        adherenceSelfReported: "COMPLIANT",
        evidenceCitationId: `ev-med-${Date.now()}`,
      });
    } else if (currentQuestion.section === "ALLERGY") {
      addAllergy({
        id: `alg-${Date.now()}`,
        allergen: val,
        severity: "MODERATE",
        evidenceCitationId: `ev-alg-${Date.now()}`,
      });
    } else if (currentQuestion.section === "PERSONAL") {
      updatePersonalHistory({
        dietaryPreference: "VEGETARIAN",
        tobaccoUse: val.includes("BIDI") ? "BIDI" : val.includes("GUTKHA") ? "GUTKHA_CHEWING" : "NONE",
        alcoholUse: val.includes("ALCOHOL") ? "REGULAR" : "NONE",
      });
    } else if (currentQuestion.section === "AYUSH") {
      updateAyushHistory({
        isIncluded: true,
        agni: val.includes("MANDA") ? "MANDA" : val.includes("TIKSHNA") ? "TIKSHNA" : "SAMA",
        disclaimer: "AYUSH assessments are self-reported patient observations.",
      });
    }

    handleNextQuestion();
  };

  // Simulated Document Upload Handler
  const handleSimulateDocumentUpload = (docType: "PRESCRIPTION" | "LAB_REPORT") => {
    const newDocId = `doc-${Date.now()}`;
    const fileName = docType === "PRESCRIPTION" ? "rx_doctor_slip.pdf" : "cbc_lab_report.pdf";
    const sampleRawOcr =
      docType === "PRESCRIPTION"
        ? "Dr. S. K. Gupta, MD (Med)\nRx:\nTab Metformin 500mg BID\nTab Telmisartan 40mg OD"
        : "PATHOLOGY DEPT\nHb: 9.8 g/dL (Ref: 12.0 - 15.5)\nPlatelets: 2.1 Lakhs/cumm";

    addDocument({
      id: newDocId,
      patientId: caseGraph.demographics.id,
      documentType: docType,
      fileName,
      fileSize: 480000,
      mimeType: "application/pdf",
      uploadedAt: new Date().toISOString(),
      pageCount: 1,
      rawOcrText: sampleRawOcr,
      extractedFacts: [
        {
          id: `fact-${Date.now()}`,
          factType: docType === "PRESCRIPTION" ? "MEDICATION" : "LAB_VALUE",
          extractedText: docType === "PRESCRIPTION" ? "Tab Metformin 500mg BID" : "Hb: 9.8 g/dL",
          confidenceScore: 0.96,
          boundingBox: { x: 50, y: 120, width: 220, height: 35, pageNumber: 1 },
          evidenceCitation: {
            id: `ev-doc-${Date.now()}`,
            sourceType: "SCANNED_DOCUMENT",
            timestamp: new Date().toISOString(),
            normalizedRepresentation: docType === "PRESCRIPTION" ? "Metformin 500mg Twice daily" : "Hemoglobin 9.8 g/dL",
            verificationStatus: "UNVERIFIED",
            documentMetadata: {
              documentId: newDocId,
              documentTitle: fileName,
              pageNumber: 1,
              rawOcrString: docType === "PRESCRIPTION" ? "Tab Metformin 500mg BID" : "Hb: 9.8 g/dL (Ref: 12.0 - 15.5)",
              referenceRange: docType === "LAB_REPORT" ? "12.0 - 15.5 g/dL" : undefined,
            },
          },
        },
      ],
      labObservations:
        docType === "LAB_REPORT"
          ? [
              {
                id: `lab-${Date.now()}`,
                testName: "Hemoglobin (Hb)",
                measuredValue: "9.8",
                unit: "g/dL",
                referenceRange: "12.0 - 15.5 g/dL",
                interpretation: "LOW",
                evidenceCitationId: `ev-doc-${Date.now()}`,
              },
            ]
          : [],
    });

    setUploadedFileNotice(`Document "${fileName}" successfully processed with raw OCR preservation.`);
    setTimeout(() => setUploadedFileNotice(null), 4000);
  };

  // Step Progress Calculation
  const progressPercent =
    currentStep === "ENTRY_IDENTIFY"
      ? 15
      : currentStep === "CONSENT"
      ? 30
      : currentStep === "INTERVIEW"
      ? Math.round(30 + ((currentQuestionIndex + 1) / activeQuestions.length) * 45)
      : currentStep === "DOCUMENTS"
      ? 85
      : 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 flex flex-col gap-6 select-none">
      {/* Patient Header Strip */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-mono">
              FIRST-MILE CLINICAL INTAKE KIOSK
            </span>
            <Badge variant="outline" size="sm">
              {caseGraph.session.interactionMode} MODE
            </Badge>
          </div>
          <h1 className={cn("text-[var(--foreground)]", isLowLiteracyMode ? "text-2xl sm:text-3xl font-black" : "patient-h1")}>
            {t.appName}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">{t.firstMileSub}</p>
        </div>

        {/* Modality Switcher (Voice <-> Touch <-> Text) */}
        <div
          role="group"
          aria-label="Interaction Modality Selector"
          className="inline-flex rounded-xl bg-[var(--muted)] p-1.5 border border-[var(--border-subtle)] gap-1 self-start sm:self-center"
        >
          <Button
            variant={caseGraph.session.interactionMode === "VOICE" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setInteractionMode("VOICE")}
            leftIcon={<Mic className="w-4 h-4" />}
            className="text-xs h-9"
          >
            {t.voiceModeTitle}
          </Button>
          <Button
            variant={caseGraph.session.interactionMode === "TOUCH" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setInteractionMode("TOUCH")}
            leftIcon={<Hand className="w-4 h-4" />}
            className="text-xs h-9"
          >
            {t.touchModeTitle}
          </Button>
          <Button
            variant={caseGraph.session.interactionMode === "TEXT" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setInteractionMode("TEXT")}
            leftIcon={<MessageSquare className="w-4 h-4" />}
            className="text-xs h-9"
          >
            {t.textModeTitle}
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <section aria-label="Journey Progress" className="flex flex-col gap-1.5">
        <Progress value={progressPercent} isPatientMode={isLowLiteracyMode} />
        <div className="flex justify-between text-[11px] font-semibold text-[var(--muted-foreground)] px-1">
          <span className={cn(currentStep === "ENTRY_IDENTIFY" && "text-[var(--primary)] font-bold")}>
            1. पहचान (Identity)
          </span>
          <span className={cn(currentStep === "CONSENT" && "text-[var(--primary)] font-bold")}>
            2. सहमति (Consent)
          </span>
          <span className={cn(currentStep === "INTERVIEW" && "text-[var(--primary)] font-bold")}>
            3. स्वास्थ्य इतिहास (Interview)
          </span>
          <span className={cn(currentStep === "DOCUMENTS" && "text-[var(--primary)] font-bold")}>
            4. दस्तावेज़ (Documents)
          </span>
          <span className={cn(currentStep === "SUMMARY_READY" && "text-[var(--primary)] font-bold")}>
            5. पूर्ण (Ready)
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STEP 1: PATIENT ENTRY & IDENTIFICATION                         */}
      {/* ============================================================== */}
      {currentStep === "ENTRY_IDENTIFY" && (
        <Card elevated className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--primary)]/20 flex flex-col gap-6">
          <CardHeader className="p-0 border-none flex flex-col gap-2">
            <Badge variant="primary-muted" className="self-start">
              STEP 1: PATIENT ONBOARDING
            </Badge>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t.startVisit}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              This system helps you describe your symptoms in your own language before you see the doctor. You can speak,
              touch, or type anytime.
            </p>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-6">
            {/* Language Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[var(--foreground)]">{t.chooseLanguage}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { code: "hi", name: "हिन्दी (Hindi)" },
                  { code: "hinglish", name: "Hinglish" },
                  { code: "en", name: "English" },
                  { code: "bn", name: "বাংলা (Bengali)" },
                  { code: "ta", name: "தமிழ் (Tamil)" },
                  { code: "te", name: "తెలుగు (Telugu)" },
                  { code: "mr", name: "मराठी (Marathi)" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code as import("@/domain/patient/types").PatientLanguage)}
                    className={cn(
                      "p-3 rounded-xl border text-sm font-bold transition-all text-center cursor-pointer",
                      lang === l.code
                        ? "border-[var(--primary)] bg-[var(--primary-muted)] text-[var(--primary)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Demographics / Identification Fields */}
            <div className="p-4 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border-subtle)] flex flex-col gap-4">
              <span className="text-xs font-bold uppercase text-[var(--foreground)]">मरीज़ पहचान / Patient Profile</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--muted-foreground)]">पूरा नाम (Full Name)</label>
                  <input
                    type="text"
                    value={caseGraph.demographics.fullName}
                    onChange={(e) => updateDemographics({ fullName: e.target.value })}
                    placeholder="e.g. Rameshwar Sharma"
                    className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--muted-foreground)]">उम्र (Age)</label>
                  <input
                    type="number"
                    value={caseGraph.demographics.age}
                    onChange={(e) => updateDemographics({ age: Number(e.target.value) })}
                    className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--muted-foreground)]">लिंग (Gender)</label>
                  <select
                    value={caseGraph.demographics.gender}
                    onChange={(e) => updateDemographics({ gender: e.target.value as import("@/domain/patient/types").Gender })}
                    className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] cursor-pointer"
                  >
                    <option value="MALE">पुरुष (Male)</option>
                    <option value="FEMALE">महिला (Female)</option>
                    <option value="OTHER">अन्य (Other)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]">
                <span>OPD Token: <strong>{caseGraph.demographics.opdTokenNumber || "OPD-AUTO-042"}</strong></span>
                <span>ABHA ID: <strong>{caseGraph.demographics.abhaId || "Not Linked (Optional)"}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <Button
                variant="outline"
                size="md"
                onClick={() => updateDemographics({ fullName: "Rameshwar Sharma [SYNTHETIC DEMO]" })}
                leftIcon={<Sparkles className="w-4 h-4 text-[var(--primary)]" />}
              >
                1-Click Demo Patient (डेमो मरीज़ भरें)
              </Button>

              <Button
                variant="patient"
                size="patient"
                onClick={() => setCurrentStep("CONSENT")}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {t.continueBtn}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================== */}
      {/* STEP 2: DPDP ACT 2023 GRANULAR CONSENT & AUDIO EXPLANATION     */}
      {/* ============================================================== */}
      {currentStep === "CONSENT" && (
        <Card elevated className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--primary)]/20 flex flex-col gap-6">
          <CardHeader className="p-0 border-none flex flex-col gap-2">
            <Badge variant="primary-muted" className="self-start">
              STEP 2: INFORMED CONSENT (DPDP ACT 2023)
            </Badge>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t.consentTitle}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{t.consentAudioPrompt}</p>

            {/* Audio Explanation Button (Play/Pause/Replay) */}
            <div className="p-3.5 rounded-2xl bg-[var(--primary-muted)]/40 border border-[var(--primary-muted)] flex items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-3">
                <IconButton
                  icon={isPlayingAudio ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                  label="Play/Pause explanation audio in vernacular"
                  variant="primary"
                  size="md"
                  onClick={() => handlePlayAudio(t.consentAudioPrompt)}
                  className="rounded-full shadow-md"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--primary)] uppercase">
                    {isPlayingAudio ? t.playingAudio : t.listenToExplanation}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    आवाज़ में नियम और अधिकार सुनें (Audio Explanation)
                  </span>
                </div>
              </div>
              {isPlayingAudio && (
                <Badge variant="success" size="sm" className="animate-pulse">
                  PLAYING
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-4">
            {/* Granular Consent Categories (No Single Checkbox) */}
            <div className="flex flex-col gap-3">
              {GRANULAR_CONSENT_CATEGORIES.map((cat) => {
                const isChecked =
                  cat.code === "HEALTH_HISTORY"
                    ? caseGraph.consent.hasConsentedToHealthHistory
                    : cat.code === "AUDIO_RECORDING"
                    ? caseGraph.consent.hasConsentedToAudioRecording
                    : cat.code === "DOCUMENT_SCAN"
                    ? caseGraph.consent.hasConsentedToDocumentProcessing
                    : caseGraph.consent.hasConsentedToClinicalSynthesis;

                const handleToggle = () => {
                  if (cat.code === "HEALTH_HISTORY") {
                    updateConsent({ hasConsentedToHealthHistory: !isChecked });
                  } else if (cat.code === "AUDIO_RECORDING") {
                    updateConsent({ hasConsentedToAudioRecording: !isChecked });
                  } else if (cat.code === "DOCUMENT_SCAN") {
                    updateConsent({ hasConsentedToDocumentProcessing: !isChecked });
                  } else {
                    updateConsent({ hasConsentedToClinicalSynthesis: !isChecked });
                  }
                };

                return (
                  <label
                    key={cat.id}
                    className={cn(
                      "p-4 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer",
                      isChecked ? "border-[var(--primary)] bg-[var(--surface)] shadow-xs" : "border-[var(--border)] bg-[var(--muted)]/50 opacity-70"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleToggle}
                      className="mt-1 w-5 h-5 rounded text-[var(--primary)] border-[var(--border)] focus:ring-[var(--focus)] cursor-pointer"
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--foreground)]">
                          {lang === "hi" ? cat.titleHindi : cat.title}
                        </span>
                        {cat.isMandatory && <Badge variant="outline" size="sm">अनिवार्य (Mandatory)</Badge>}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                        {lang === "hi" ? cat.descriptionHindi : cat.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* DPDP Legal Safeguard Alert */}
            <Alert variant="info" title="गोपनीयता और डेटा सुरक्षा (DPDP Act 2023)">
              {t.dpdpAssurance}
            </Alert>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep("ENTRY_IDENTIFY")}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                {t.backBtn}
              </Button>

              <Button
                variant="patient"
                size="patient"
                disabled={!caseGraph.consent.hasConsentedToHealthHistory || !caseGraph.consent.hasConsentedToClinicalSynthesis}
                onClick={() => setCurrentStep("INTERVIEW")}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                सहमति स्वीकारें और शुरू करें (Accept & Begin)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================== */}
      {/* STEP 3: MULTIMODAL CLINICAL INTERVIEW (QUESTION ENGINE)        */}
      {/* ============================================================== */}
      {currentStep === "INTERVIEW" && currentQuestion && (
        <Card elevated className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--primary)]/30 flex flex-col gap-6">
          <CardHeader className="p-0 border-none flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">
                सवाल {currentQuestionIndex + 1} of {activeQuestions.length} • {currentQuestion.section}
              </Badge>
              <div className="flex items-center gap-2">
                {currentQuestion.inputType === "PAIN_MAP" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShow3dAnatomy((s) => !s)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="h-7 text-xs font-bold"
                  >
                    {show3dAnatomy ? "2D मानचित्र दिखाएँ" : "3D शारीरिक दृश्य दिखाएँ"}
                  </Button>
                )}
                <IconButton
                  icon={isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  label="Listen to question audio prompt"
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayAudio(currentQuestion.audioPrompt[lang] || currentQuestion.audioPrompt.hi)}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Question Heading & Subtitle */}
            <div className="flex flex-col gap-1">
              <h2 className={cn("text-[var(--foreground)]", isLowLiteracyMode ? "text-2xl sm:text-3xl font-black" : "text-xl sm:text-2xl font-bold")}>
                {currentQuestion.title[lang] || currentQuestion.title.hi}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {currentQuestion.subtitle[lang] || currentQuestion.subtitle.hi}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-6">
            {/* Input Renderer based on InputType */}
            {currentQuestion.inputType === "PAIN_MAP" ? (
              show3dAnatomy ? (
                <Anatomical3DViewer
                  activeRegionName={caseGraph.painMap?.bodyRegion || "Chest / Heart"}
                  severityScale={caseGraph.painMap?.intensityVisualScale || 7}
                />
              ) : (
                <AnatomicalBodyMap
                  initialValue={caseGraph.painMap}
                  onChange={(pain) => setPainMap(pain)}
                />
              )
            ) : currentQuestion.inputType === "SEVERITY_SCALE" ? (
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border-subtle)] items-center">
                <span className="text-3xl font-black text-[var(--danger)]">
                  {caseGraph.hpiStructured?.severityScale ?? 7} / 10
                </span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={caseGraph.hpiStructured?.severityScale ?? 7}
                  onChange={(e) => updateHpi({ severityScale: Number(e.target.value) })}
                  className="w-full max-w-md h-4 bg-[var(--surface)] rounded-lg appearance-none cursor-pointer accent-[var(--danger)]"
                  aria-label="Pain severity slider"
                />
                <div className="flex justify-between w-full max-w-md text-xs text-[var(--muted-foreground)] font-bold">
                  <span>0 (हल्का)</span>
                  <span>5 (मध्यम)</span>
                  <span>10 (असहनीय)</span>
                </div>
                <Button variant="patient" size="md" onClick={() => handleNextQuestion()}>
                  तीव्रता दर्ज करें (Confirm Scale)
                </Button>
              </div>
            ) : currentQuestion.inputType === "SINGLE_SELECT" && currentQuestion.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswerQuestion(opt.label[lang] || opt.label.hi)}
                    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--primary-muted)]/40 hover:border-[var(--primary)] text-left font-bold text-sm text-[var(--foreground)] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    {opt.label[lang] || opt.label.hi}
                  </button>
                ))}
              </div>
            ) : currentQuestion.inputType === "MULTI_SELECT" && currentQuestion.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswerQuestion(opt.label[lang] || opt.label.hi)}
                    className={cn(
                      "p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer shadow-xs flex items-center justify-between",
                      opt.isRedFlagTrigger
                        ? "border-[var(--danger)]/50 bg-[var(--danger-muted)]/20 text-[var(--danger-foreground)] hover:bg-[var(--danger-muted)]/40"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    <span>{opt.label[lang] || opt.label.hi}</span>
                    {opt.isRedFlagTrigger && <Badge variant="danger" size="sm">चेतावनी</Badge>}
                  </button>
                ))}
              </div>
            ) : currentQuestion.inputType === "BOOLEAN" ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswerQuestion("हाँ (Yes)")}
                  className="p-6 rounded-2xl border border-[var(--primary)] bg-[var(--surface)] hover:bg-[var(--primary-muted)] font-black text-lg text-[var(--primary)] text-center cursor-pointer shadow-sm active:scale-95"
                >
                  हाँ (Yes)
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerQuestion("नहीं (No)")}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted)] font-bold text-lg text-[var(--foreground)] text-center cursor-pointer shadow-sm active:scale-95"
                >
                  नहीं (No)
                </button>
              </div>
            ) : (
              /* VOICE & TEXT MULTIMODAL INPUT WORKFLOW */
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[var(--primary)]/40 bg-[var(--primary-muted)]/10 text-center gap-4">
                  {/* Tap to Speak Big Button */}
                  <IconButton
                    icon={isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                    label={isListening ? "Stop Listening" : "Tap to Speak"}
                    variant={isListening ? "danger" : "primary"}
                    size="patient"
                    onClick={handleToggleListening}
                    className="w-20 h-20 rounded-full shadow-lg transition-transform hover:scale-105"
                  />

                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-[var(--foreground)]">
                      {isListening ? t.listening : t.speakNow}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      अपनी मातृभाषा में बोलें, स्क्रीन पर आपकी बात लिखी जाएगी।
                    </span>
                  </div>
                </div>

                {/* Live Transcript Preview & Confirmation */}
                {transcriptPreview && (
                  <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border-2 border-[var(--primary)] flex flex-col gap-2 animate-in fade-in">
                    <span className="text-xs font-bold text-[var(--primary)] uppercase">
                      दर्ज की गई आवाज़ (Recorded Transcript):
                    </span>
                    <p className="text-base font-medium text-[var(--foreground)] italic">
                      &ldquo;{transcriptPreview}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAnswerQuestion(transcriptPreview)}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        पुष्टि करें और आगे बढ़ें (Confirm & Next)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTranscriptPreview("")}
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                      >
                        रद्द करें (Cancel)
                      </Button>
                    </div>
                  </div>
                )}

                {/* Text Fallback Alternative Input */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder={t.typeYourAnswer}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        handleAnswerQuestion(e.currentTarget.value);
                      }
                    }}
                    className="flex-1 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)]"
                  />
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button
                variant="ghost"
                size="md"
                onClick={handlePreviousQuestion}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                {t.backBtn}
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={handleNextQuestion}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentQuestionIndex === activeQuestions.length - 1 ? "दस्तावेज़ जोड़ें (Next: Documents)" : "छोड़ें (Skip)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================== */}
      {/* STEP 4: DOCUMENT SCANNING & OCR EXTRACTION                    */}
      {/* ============================================================== */}
      {currentStep === "DOCUMENTS" && (
        <Card elevated className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--primary)]/20 flex flex-col gap-6">
          <CardHeader className="p-0 border-none flex flex-col gap-2">
            <Badge variant="primary-muted" className="self-start">
              STEP 4: PRIOR PRESCRIPTION & LAB REPORT SCAN
            </Badge>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              पुरानी पर्ची या जाँच रिपोर्ट जोड़ें (Upload Prior Documents)
            </CardTitle>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              If you have any old physical doctor prescriptions, discharge summaries, or blood test reports, upload them
              here. The system extracts medications and lab values while preserving the original image.
            </p>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-6">
            {uploadedFileNotice && (
              <Alert variant="success" title="Document Processed">
                {uploadedFileNotice}
              </Alert>
            )}

            {/* Interactive Upload Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSimulateDocumentUpload("PRESCRIPTION")}
                className="p-6 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface)] hover:bg-[var(--primary-muted)]/20 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-[var(--primary)] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm text-[var(--foreground)]">डॉक्टर की पुरानी पर्ची जोड़ें</span>
                <span className="text-xs text-[var(--muted-foreground)]">Upload Physical Prescription (OPD Chit)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateDocumentUpload("LAB_REPORT")}
                className="p-6 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface)] hover:bg-[var(--primary-muted)]/20 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <FileText className="w-8 h-8 text-[var(--primary)] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm text-[var(--foreground)]">खून या लैब जाँच रिपोर्ट जोड़ें</span>
                <span className="text-xs text-[var(--muted-foreground)]">Upload Pathology Lab Report (CBC, Sugar)</span>
              </button>
            </div>

            {/* Display Current Uploaded Documents */}
            {caseGraph.documents.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-[var(--foreground)]">
                  संलग्न दस्तावेज़ ({caseGraph.documents.length} Attached)
                </span>
                <div className="flex flex-col gap-2">
                  {caseGraph.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-[var(--primary)]" />
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-[var(--foreground)]">{doc.fileName}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            {doc.documentType} • Raw OCR Captured & Preserved
                          </span>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">OCR EXTRACTED</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep("INTERVIEW")}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                {t.backBtn}
              </Button>

              <Button
                variant="patient"
                size="patient"
                onClick={() => setCurrentStep("SUMMARY_READY")}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                केस सारांश देखें (Review & Finish)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================== */}
      {/* STEP 5: PATIENT SUMMARY & READY FOR CONSULTATION              */}
      {/* ============================================================== */}
      {currentStep === "SUMMARY_READY" && (
        <Card elevated className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--success)]/30 flex flex-col gap-6">
          <CardHeader className="p-0 border-none flex flex-col gap-2">
            <div className="w-12 h-12 rounded-full bg-[var(--success-muted)] text-[var(--success)] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">{t.readyForInterviewTitle}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Your case history has been structured, evidence-linked, and queued for the consulting doctor.
            </p>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-6">
            {/* Quick Summary Pill Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border-subtle)] text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[var(--muted-foreground)] uppercase">मरीज़ (Patient)</span>
                <span className="font-bold text-sm text-[var(--foreground)]">{caseGraph.demographics.fullName}</span>
                <span className="text-[11px] text-[var(--muted-foreground)]">Token #{caseGraph.demographics.opdTokenNumber}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[var(--muted-foreground)] uppercase">मुख्य शिकायत (Chief Complaint)</span>
                <span className="font-bold text-sm text-[var(--foreground)]">
                  {caseGraph.chiefComplaints[0]?.complaint || "Chest Discomfort"}
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  Duration: {caseGraph.chiefComplaints[0]?.durationText || "2 days"}
                </span>
              </div>
            </div>

            {/* Launch Clinician Cockpit direct action */}
            <div className="p-6 rounded-2xl bg-[var(--primary-muted)]/30 border border-[var(--primary-muted)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[var(--primary)] text-white">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-[var(--foreground)]">
                    डॉक्टर कॉकपिट में केस देखें (View in Clinician Cockpit)
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    See how your structured case, evidence badges, and timeline appear to the doctor.
                  </span>
                </div>
              </div>
              <Link href="/clinician">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Open Clinician View
                </Button>
              </Link>
            </div>

            {/* Reset or Re-edit */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep("ENTRY_IDENTIFY")}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                नया मरीज़ शुरू करें (New Intake)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
