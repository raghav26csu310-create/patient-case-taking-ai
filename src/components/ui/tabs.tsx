"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalTab;

  const setActiveTab = (tab: string) => {
    if (value === undefined) setInternalTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full flex flex-col gap-3", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-[var(--muted)] p-1 border border-[var(--border-subtle)] text-[var(--muted-foreground)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabTrigger({ value, children, className, disabled = false }: TabTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabTrigger must be used within Tabs");

  const isSelected = ctx.activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isSelected
          ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-xs"
          : "hover:text-[var(--foreground)] hover:bg-[var(--surface)]/50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabContent must be used within Tabs");

  if (ctx.activeTab !== value) return null;

  return (
    <div role="tabpanel" tabIndex={0} className={cn("focus-visible:outline-none", className)}>
      {children}
    </div>
  );
}
