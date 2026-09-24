"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-desc" : undefined}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6 shadow-2xl animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 mb-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold text-[var(--foreground)]">
              {title}
            </h2>
            {description && (
              <p id="dialog-desc" className="text-xs text-[var(--muted-foreground)] mt-1">
                {description}
              </p>
            )}
          </div>
          <IconButton icon={<X className="w-5 h-5" />} label="Close dialog" onClick={onClose} size="sm" />
        </div>

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
