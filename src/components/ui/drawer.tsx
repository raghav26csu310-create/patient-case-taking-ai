"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./button";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: "right" | "bottom";
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = "right",
  className,
}: DrawerProps) {
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed z-50 bg-[var(--surface-elevated)] border-[var(--border)] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          position === "right" &&
            "inset-y-0 right-0 w-full max-w-md border-l animate-in slide-in-from-right",
          position === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t animate-in slide-in-from-bottom",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] shrink-0">
          <div>
            <h2 id="drawer-title" className="text-base font-bold text-[var(--foreground)]">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>}
          </div>
          <IconButton icon={<X className="w-5 h-5" />} label="Close drawer" onClick={onClose} size="sm" />
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
