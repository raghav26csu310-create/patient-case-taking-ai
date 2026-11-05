"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  FileText,
  HeartPulse,
  Mic,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";

const benefits = [
  {
    title: "TALK",
    description: "Explain your health concern in your own language.",
    icon: Mic,
  },
  {
    title: "SHARE",
    description: "Take photos of your prescriptions and medical reports.",
    icon: Camera,
  },
  {
    title: "PREPARE",
    description: "Review your organized health story before sharing it with your doctor.",
    icon: ShieldCheck,
  },
];

const journey = [
  { step: "1", title: "Identify", description: "Start with your visit and preferred language." },
  { step: "2", title: "Converse", description: "Tell your story in your own words." },
  { step: "3", title: "Scan", description: "Upload prescriptions, reports, and notes." },
  { step: "4", title: "Summarize", description: "We organize your details into a clear story." },
  { step: "5", title: "Consult", description: "Share a prepared brief with your doctor." },
];

const translations: Record<string, any> = {
  hi: {
    badge: "SAATHI • आपका नज़रिया",
    heading: "आइए आपकी स्वास्थ्य कहानी को आसान बनाते हैं।",
    subheading: "अपनी तकलीफ को अपनी भाषा में बताइए, रिपोर्ट अपलोड कीजिए, और अपने डॉक्टर से मिलने से पहले अपनी जानकारी व्यवस्थित करिए।",
    ctaPrimary: "मेरी स्वास्थ्य कहानी शुरू करें",
    ctaSecondary: "पिछला सत्र जारी रखें",
    ctaTertiary: "मेरे स्वास्थ्य रिकॉर्ड देखें",
    ctaQuaternary: "जानें कि मेरी जानकारी कैसे सुरक्षित है",
    assistantTitle: "मैं SAATHI हूँ",
    assistantPrompt: "आज आप कैसा महसूस कर रहे हैं?",
    assistantHelp: "अपनी भाषा में अपने लक्षण बताइए।",
    listeningLabel: "हिंदी / अंग्रेज़ी में सुन रहा है",
    storyTitle: "आपकी स्वास्थ्य कहानी",
    storyMeta: "5 में से 4 चरण",
    journeyTitle: "TALK",
    journeyDescription: "अपनी भाषा में अपनी स्वास्थ्य समस्या बताइए।",
    shareTitle: "SHARE",
    shareDescription: "अपने प्रिस्क्रिप्शन और मेडिकल रिपोर्ट की फोटो लें।",
    prepareTitle: "PREPARE",
    prepareDescription: "डॉक्टर से साझा करने से पहले अपनी स्वास्थ्य कहानी की समीक्षा करें।",
    supportTitle: "नमस्कार",
  },
  en: {
    badge: "SAATHI • Your Personal AI Health Companion",
    heading: "Let&apos;s make your health story easier to understand.",
    subheading: "Tell us how you feel, share your previous medical reports, and let us organize your health information before your doctor&apos;s visit.",
    ctaPrimary: "START MY HEALTH STORY",
    ctaSecondary: "Continue Previous Session",
    ctaTertiary: "Explore My Health Records",
    ctaQuaternary: "Learn How My Information Is Protected",
    assistantTitle: "I&apos;m SAATHI",
    assistantPrompt: "How are you feeling today?",
    assistantHelp: "Tell me about your symptoms in your own words.",
    listeningLabel: "Listening in Hindi / English",
    storyTitle: "Your health story",
    storyMeta: "4 of 5 steps",
    journeyTitle: "TALK",
    journeyDescription: "Explain your health concern in your own language.",
    shareTitle: "SHARE",
    shareDescription: "Take photos of your prescriptions and medical reports.",
    prepareTitle: "PREPARE",
    prepareDescription: "Review your organized health story before sharing it with your doctor.",
    supportTitle: "Good morning",
  },
  hinglish: {
    badge: "SAATHI • Aapka personal health companion",
    heading: "Chalo aapki health story ko easy bana dete hain.",
    subheading: "Aap bataiye apne symptoms, reports upload kariye, aur doctor visit se pehle hum aapke details ko organize kar denge.",
    ctaPrimary: "Meri health story shuru karein",
    ctaSecondary: "Previous session continue karein",
    ctaTertiary: "Mere records dekhein",
    ctaQuaternary: "Meri information safe kaise hai, samjhein",
    assistantTitle: "Main SAATHI hoon",
    assistantPrompt: "Aaj aapkaise feel kar rahe ho?",
    assistantHelp: "Apne words mein symptoms bataiye.",
    listeningLabel: "Hindi / English mein sun rahe hain",
    storyTitle: "Aapki health story",
    storyMeta: "5 steps mein se 4",
    journeyTitle: "TALK",
    journeyDescription: "Apni health problem apni language mein explain karein.",
    shareTitle: "SHARE",
    shareDescription: "Prescription aur reports ki photos lein.",
    prepareTitle: "PREPARE",
    prepareDescription: "Doctor ke liye ready hone se pehle apni health story dekh lein.",
    supportTitle: "Namaste",
  },
};

export default function HomePage() {
  const { caseGraph } = useCaseGraph();
  const copy = translations[caseGraph.session.language] ?? translations.en;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.35),_transparent_30%),linear-gradient(135deg,#f9fbff_0%,#edf7ff_50%,#f4f0ff_100%)] p-6 shadow-[0_30px_80px_rgba(37,99,235,0.08)] sm:p-10">
        <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.badge}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-6xl">
                {copy.heading}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                {copy.subheading}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/patient">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {copy.ctaPrimary}
                </Button>
              </Link>
              <Link href="/patient">
                <Button variant="secondary" size="lg">
                  {copy.ctaSecondary}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/patient">
                <Button variant="outline" size="md">
                  {copy.ctaTertiary}
                </Button>
              </Link>
              <Link href="/patient">
                <Button variant="ghost" size="md">
                  {copy.ctaQuaternary}
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {benefits.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold tracking-[0.2em] text-sky-700">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md rounded-[30px] border border-sky-200 bg-white/80 p-5 shadow-[0_30px_80px_rgba(14,116,144,0.12)] backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.supportTitle}</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{copy.assistantTitle}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-200/70">
                  <HeartPulse className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-sky-50 p-4">
                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{copy.assistantPrompt}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{copy.assistantHelp}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-sky-200 bg-white px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mic className="h-4 w-4 text-sky-600" />
                    {copy.listeningLabel}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">{copy.storyTitle}</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    {copy.storyMeta}
                  </span>
                </div>

                <div className="space-y-3">
                  {journey.map(({ step, title, description }) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                        {step}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{title}</p>
                        <p className="text-xs text-slate-500">{description}</p>
                      </div>
                      {Number(step) < 5 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-sky-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">What is this application?</p>
            <p className="mt-3 text-base leading-7 text-slate-700">
              A calm digital companion that helps you prepare a complete health story before seeing your doctor.
            </p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">How will it help me?</p>
            <p className="mt-3 text-base leading-7 text-slate-700">
              It listens, structures your symptoms, gathers reports, and turns scattered details into a clear summary.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">What should I do next?</p>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Start your intake, answer in your own words, upload old prescriptions, and review your health story.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3 text-slate-800">
          <FileText className="h-5 w-5 text-sky-600" />
          <h2 className="text-2xl font-bold tracking-tight">A simple 5-stage journey</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {journey.map(({ step, title, description }) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                {step}
              </div>
              <p className="text-base font-bold text-slate-800">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
            <Mic className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Voice-first conversation</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Speak in the language you are most comfortable with and keep your health story natural.</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Camera className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Smart document capture</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Upload old prescriptions, lab reports, and other health records in a few taps.</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Stethoscope className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Doctor-ready summary</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Review a clear, organized summary before your appointment and share it confidently.</p>
        </div>
      </section>
    </div>
  );
}
