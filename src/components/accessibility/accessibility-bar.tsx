"use client";

import React, { useState } from "react";
import { Eye, Languages, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessibilityBar() {
  const [textSize, setTextSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hi");

  const cycleTextSize = () => {
    if (textSize === "normal") setTextSize("large");
    else if (textSize === "large") setTextSize("xlarge");
    else setTextSize("normal");
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <aside
      aria-label="Accessibility & Localization Bar"
      className="w-full bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] px-4 py-2 text-xs"
    >
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
        {/* Language Selection */}
        <div className="flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 text-[var(--muted-foreground)]" aria-hidden="true" />
          <span className="font-medium text-[var(--muted-foreground)]">भाषा / Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] cursor-pointer"
            aria-label="Select display and speech language"
          >
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
            <option value="hinglish">Hinglish</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>

        {/* Accessibility Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTextSize}
            leftIcon={<Type className="w-3.5 h-3.5" />}
            className="h-7 text-xs"
            aria-label={`Change text size. Currently ${textSize}`}
          >
            Text: <span className="font-bold ml-1 uppercase">{textSize}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHighContrast}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            className="h-7 text-xs"
            aria-label="Toggle high contrast dark mode"
          >
            {isHighContrast ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
