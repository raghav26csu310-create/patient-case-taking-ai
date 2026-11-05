"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BookHeart, CalendarClock, FileText, HeartPulse, ShieldCheck, Stethoscope, User } from "lucide-react";
import { useCaseGraph } from "@/domain/case-graph/case-graph-store";
import { cn } from "@/lib/utils";

const navTranslations: Record<string, { home: string; story: string; docs: string; timeline: string; summary: string; staffPortal: string; myCare: string }> = {
  en: { home: "Home", story: "My Health Story", docs: "My Documents", timeline: "My Health Timeline", summary: "My Summary", staffPortal: "Staff Portal", myCare: "My Care" },
  hi: { home: "मुख्य पृष्ठ", story: "मेरा स्वास्थ्य विवरण", docs: "मेरे दस्तावेज़", timeline: "मेरा स्वास्थ्य समयरेखा", summary: "मेरा सारांश", staffPortal: "स्टाफ पोर्टल", myCare: "मेरा देखभाल" },
  hinglish: { home: "Home", story: "Mera Health Story", docs: "Mere Documents", timeline: "Mera Timeline", summary: "Mera Summary", staffPortal: "Staff Portal", myCare: "Mera Care" },
  bn: { home: "হোম", story: "আমার স্বাস্থ্য গল্প", docs: "আমার নথি", timeline: "আমার স্বাস্থ্য সময়রেখা", summary: "আমার সারাংশ", staffPortal: "স্টাফ পোর্টাল", myCare: "আমার যত্ন" },
  ta: { home: "முகப்பு", story: "என் சுகாதார கதை", docs: "என் ஆவணங்கள்", timeline: "என் சுகாதார காலவரிசை", summary: "என் சுருக்கம்", staffPortal: "பணியாளர் போர்டல்", myCare: "என் பராமரிப்பு" },
  te: { home: "హోమ్", story: "నా ఆరోగ్య కథ", docs: "నా డాక్యుమెంట్స్", timeline: "నా ఆరోగ్య సమయస్ఫూర్తి", summary: "నా సారాంశం", staffPortal: "స్టాఫ్ పోర్టల్", myCare: "నా సంరక్షణ" },
  mr: { home: "मुख्यपृष्ठ", story: "माझी आरोग्य कथा", docs: "माझे दस्तऐवज", timeline: "माझी आरोग्य वेळापत्रक", summary: "माझे सारांश", staffPortal: "स्टाफ पोर्टल", myCare: "माझी काळजी" },
};

export function Navbar() {
  const pathname = usePathname();
  const { caseGraph } = useCaseGraph();
  const strings = navTranslations[caseGraph.session.language] ?? navTranslations.en;

  const navLinks = [
    { href: "/", label: strings.home, icon: <Activity className="w-4 h-4" /> },
    { href: "/patient", label: strings.story, icon: <BookHeart className="w-4 h-4" /> },
    { href: "/patient", label: strings.docs, icon: <FileText className="w-4 h-4" /> },
    { href: "/patient", label: strings.timeline, icon: <CalendarClock className="w-4 h-4" /> },
    { href: "/patient", label: strings.summary, icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-200/70">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <Link href="/" className="text-sm font-black tracking-tight text-slate-900 hover:text-sky-700 transition-colors">
              SAATHI
            </Link>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {caseGraph.session.language === "hi" ? "आपकी स्वास्थ्य कहानी, समझी गई" : caseGraph.session.language === "en" ? "Your health story, understood." : "Your health story, understood."}
            </span>
          </div>
        </div>

        <nav aria-label="Main patient navigation" className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
                  isActive
                    ? "bg-sky-100 text-sky-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/clinician"
            className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-sky-200 hover:text-sky-700 sm:inline-flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4" />
            {strings.staffPortal}
          </Link>
          <Link
            href="/patient"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            <User className="h-4 w-4" />
            {strings.myCare}
          </Link>
        </div>
      </div>
    </header>
  );
}
