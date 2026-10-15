"use client";

import React, { useState } from "react";
import { PainMapInput } from "@/domain/clinical/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnatomicalBodyMapProps {
  initialValue?: PainMapInput;
  onChange: (value: PainMapInput) => void;
  className?: string;
}

interface AnatomicalRegion {
  id: string;
  name: string;
  side: "ANTERIOR" | "POSTERIOR" | "LEFT" | "RIGHT" | "BILATERAL";
  view: "ANTERIOR" | "POSTERIOR";
  svgPath: string;
  labelPosition: { x: number; y: number };
}

const BODY_REGIONS: AnatomicalRegion[] = [
  // Front / Anterior
  {
    id: "head-anterior",
    name: "Head / Forehead (सिर)",
    side: "ANTERIOR",
    view: "ANTERIOR",
    svgPath: "M 130 50 A 25 30 0 0 1 170 50 A 25 35 0 0 1 130 50 Z",
    labelPosition: { x: 150, y: 45 },
  },
  {
    id: "neck-anterior",
    name: "Neck / Throat (गर्दन / गला)",
    side: "ANTERIOR",
    view: "ANTERIOR",
    svgPath: "M 140 75 L 160 75 L 163 92 L 137 92 Z",
    labelPosition: { x: 150, y: 84 },
  },
  {
    id: "chest-anterior",
    name: "Chest / Heart (छाती / सीना)",
    side: "ANTERIOR",
    view: "ANTERIOR",
    svgPath: "M 125 93 L 175 93 L 180 145 L 120 145 Z",
    labelPosition: { x: 150, y: 118 },
  },
  {
    id: "abdomen-anterior",
    name: "Abdomen / Stomach (पेट)",
    side: "ANTERIOR",
    view: "ANTERIOR",
    svgPath: "M 120 146 L 180 146 L 175 195 L 125 195 Z",
    labelPosition: { x: 150, y: 170 },
  },
  {
    id: "pelvis-anterior",
    name: "Pelvis / Groin (पेड़ू / कमर का निचला भाग)",
    side: "ANTERIOR",
    view: "ANTERIOR",
    svgPath: "M 125 196 L 175 196 L 185 225 L 115 225 Z",
    labelPosition: { x: 150, y: 210 },
  },
  {
    id: "left-arm-anterior",
    name: "Left Shoulder & Arm (बायाँ कंधा व हाथ)",
    side: "LEFT",
    view: "ANTERIOR",
    svgPath: "M 181 95 L 210 135 L 230 205 L 215 210 L 195 145 L 176 105 Z",
    labelPosition: { x: 210, y: 150 },
  },
  {
    id: "right-arm-anterior",
    name: "Right Shoulder & Arm (दायाँ कंधा व हाथ)",
    side: "RIGHT",
    view: "ANTERIOR",
    svgPath: "M 119 95 L 90 135 L 70 205 L 85 210 L 105 145 L 124 105 Z",
    labelPosition: { x: 90, y: 150 },
  },
  {
    id: "right-thigh-anterior",
    name: "Right Thigh (दायीं जांघ)",
    side: "RIGHT",
    view: "ANTERIOR",
    svgPath: "M 120 226 L 148 226 L 144 310 L 115 310 Z",
    labelPosition: { x: 130, y: 265 },
  },
  {
    id: "left-thigh-anterior",
    name: "Left Thigh (बायीं जांघ)",
    side: "LEFT",
    view: "ANTERIOR",
    svgPath: "M 152 226 L 180 226 L 185 310 L 156 310 Z",
    labelPosition: { x: 170, y: 265 },
  },
  {
    id: "knees-anterior",
    name: "Bilateral Knees (दोनों घुटने)",
    side: "BILATERAL",
    view: "ANTERIOR",
    svgPath: "M 112 311 L 188 311 L 188 340 L 112 340 Z",
    labelPosition: { x: 150, y: 325 },
  },
  {
    id: "legs-feet-anterior",
    name: "Legs & Feet (पिंडलियाँ व पैर)",
    side: "BILATERAL",
    view: "ANTERIOR",
    svgPath: "M 112 341 L 188 341 L 190 415 L 110 415 Z",
    labelPosition: { x: 150, y: 375 },
  },

  // Back / Posterior
  {
    id: "neck-posterior",
    name: "Cervical Spine / Neck Back (गर्दन का पिछला भाग)",
    side: "POSTERIOR",
    view: "POSTERIOR",
    svgPath: "M 135 70 L 165 70 L 168 95 L 132 95 Z",
    labelPosition: { x: 150, y: 82 },
  },
  {
    id: "upper-back-posterior",
    name: "Upper Back / Shoulders (ऊपरी पीठ / कंधे)",
    side: "POSTERIOR",
    view: "POSTERIOR",
    svgPath: "M 120 96 L 180 96 L 185 155 L 115 155 Z",
    labelPosition: { x: 150, y: 125 },
  },
  {
    id: "lumbar-posterior",
    name: "Lumbar Spine / Lower Back (निचली पीठ / कमर)",
    side: "POSTERIOR",
    view: "POSTERIOR",
    svgPath: "M 118 156 L 182 156 L 180 215 L 120 215 Z",
    labelPosition: { x: 150, y: 185 },
  },
];

const DESCRIPTORS = [
  { id: "dull-ache", label: "मीठा दर्द (Dull Aching)" },
  { id: "sharp-stabbing", label: "तेज़ / चुभने वाला दर्द (Sharp / Stabbing)" },
  { id: "crushing", label: "दबाव / भारीपन (Crushing Heaviness)" },
  { id: "burning", label: "जलन (Burning sensation)" },
  { id: "throbbing", label: "धड़कने वाला दर्द (Throbbing)" },
  { id: "stiffness", label: "अकड़न (Stiffness)" },
];

export function AnatomicalBodyMap({ initialValue, onChange, className }: AnatomicalBodyMapProps) {
  const [currentView, setCurrentView] = useState<"ANTERIOR" | "POSTERIOR">("ANTERIOR");
  const [selectedRegion, setSelectedRegion] = useState<string>(initialValue?.bodyRegion || "Chest / Heart (छाती / सीना)");
  const [intensity, setIntensity] = useState<number>(initialValue?.intensityVisualScale ?? 7);
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>(
    initialValue?.descriptors || ["Crushing Heaviness", "Radiating to left arm"]
  );

  const handleRegionClick = (region: AnatomicalRegion) => {
    setSelectedRegion(region.name);
    onChange({
      bodyRegion: region.name,
      side: region.side,
      intensityVisualScale: intensity,
      descriptors: selectedDescriptors,
    });
  };

  const handleIntensityChange = (val: number) => {
    setIntensity(val);
    onChange({
      bodyRegion: selectedRegion,
      side: "ANTERIOR",
      intensityVisualScale: val,
      descriptors: selectedDescriptors,
    });
  };

  const toggleDescriptor = (desc: string) => {
    const updated = selectedDescriptors.includes(desc)
      ? selectedDescriptors.filter((d) => d !== desc)
      : [...selectedDescriptors, desc];
    setSelectedDescriptors(updated);
    onChange({
      bodyRegion: selectedRegion,
      side: "ANTERIOR",
      intensityVisualScale: intensity,
      descriptors: updated,
    });
  };

  const visibleRegions = BODY_REGIONS.filter((r) => r.view === currentView);

  return (
    <div className={cn("flex flex-col gap-6 p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]", className)}>
      {/* Disclaimer Banner */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[var(--muted)] border border-[var(--border-subtle)] text-[11px] text-[var(--muted-foreground)]">
        <span>
          <strong>ANATOMICAL ORIENTATION (PATIENT INPUT ONLY):</strong> This interactive map records patient-reported
          pain location and severity. It is not an autonomous diagnostic visualization.
        </span>
        <Badge variant="outline" size="sm">
          INPUT METHOD
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* SVG Interactive Silhouette Column */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full max-w-[280px]">
            <span className="text-xs font-bold text-[var(--foreground)] uppercase">
              {currentView === "ANTERIOR" ? "सामने का भाग (Front View)" : "पीछे का भाग (Back View)"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView((v) => (v === "ANTERIOR" ? "POSTERIOR" : "ANTERIOR"))}
              leftIcon={<RotateCw className="w-3.5 h-3.5" />}
              className="text-xs h-7"
            >
              दृष्टिकोण बदलें (Flip View)
            </Button>
          </div>

          <div className="relative w-[280px] h-[440px] rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-2 shadow-inner flex items-center justify-center">
            <svg viewBox="50 20 200 410" className="w-full h-full select-none">
              {/* Silhouette Ambient Glow */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render Anatomical Clickable Regions */}
              {visibleRegions.map((region) => {
                const isSelected = selectedRegion === region.name;
                return (
                  <g key={region.id} onClick={() => handleRegionClick(region)} className="cursor-pointer group">
                    <path
                      d={region.svgPath}
                      className={cn(
                        "transition-all duration-200 stroke-2",
                        isSelected
                          ? "fill-[var(--danger)]/50 stroke-[var(--danger)] filter drop-shadow(0 0 6px rgba(220,38,38,0.5))"
                          : "fill-[var(--muted)]/80 stroke-[var(--border)] hover:fill-[var(--primary)]/30 hover:stroke-[var(--primary)]"
                      )}
                    />
                    <text
                      x={region.labelPosition.x}
                      y={region.labelPosition.y}
                      textAnchor="middle"
                      className={cn(
                        "text-[9px] font-bold pointer-events-none transition-colors",
                        isSelected ? "fill-white" : "fill-[var(--muted-foreground)] group-hover:fill-[var(--primary)]"
                      )}
                    >
                      {region.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <span className="text-[10px] text-[var(--muted-foreground)] text-center">
            शरीर के जिस हिस्से में दर्द है उस पर टैप करें (Tap on the affected area)
          </span>
        </div>

        {/* Selected Region Details & Severity Rating Column */}
        <div className="flex flex-col gap-5">
          <div className="p-3.5 rounded-xl border border-[var(--primary-muted)] bg-[var(--primary-muted)]/20 flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
              चयनित दर्द का स्थान (Selected Area)
            </span>
            <span className="text-base font-bold text-[var(--foreground)]">{selectedRegion}</span>
          </div>

          {/* Pain Severity Scale (0 to 10 VAS with Wong-Baker Faces) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--foreground)] uppercase">
                दर्द की तीव्रता (Pain Severity): {intensity} / 10
              </span>
              <Badge
                variant={intensity >= 7 ? "danger" : intensity >= 4 ? "warning" : "success"}
                size="sm"
              >
                {intensity >= 7 ? "गंभीर (Severe)" : intensity >= 4 ? "मध्यम (Moderate)" : "हल्का (Mild)"}
              </Badge>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              value={intensity}
              onChange={(e) => handleIntensityChange(Number(e.target.value))}
              className="w-full h-3 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-[var(--danger)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              aria-label="Pain severity scale from 0 to 10"
            />

            <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] px-0.5">
              <span>0 (कोई दर्द नहीं)</span>
              <span>5 (मध्यम)</span>
              <span>10 (असहनीय दर्द)</span>
            </div>
          </div>

          {/* Pain Descriptors / Quality Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[var(--foreground)] uppercase">
              दर्द किस तरह का महसूस होता है? (Pain Quality)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DESCRIPTORS.map((d) => {
                const isSelected = selectedDescriptors.includes(d.label);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDescriptor(d.label)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer",
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary-muted)] text-[var(--primary)] font-bold shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    <span>{d.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
