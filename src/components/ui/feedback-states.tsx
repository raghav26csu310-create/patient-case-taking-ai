import React from "react";
import { AlertCircle, FileQuestion, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * Reusable Feedback State Patterns: Loading, Error, Recovery, Empty
 */

export interface LoadingStateProps {
  whatIsHappening: string;
  subtext?: string;
  className?: string;
}

export function LoadingState({
  whatIsHappening,
  subtext = "Please wait while the clinical engine processes this request.",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] min-h-[220px] gap-3",
        className
      )}
    >
      <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" aria-hidden="true" />
      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{whatIsHappening}</h3>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{subtext}</p>
      </div>
    </div>
  );
}

export interface ErrorStateProps {
  whatFailed: string;
  recoveryGuidance: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  whatFailed,
  recoveryGuidance,
  onRetry,
  retryLabel = "Try Again",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-[var(--danger-muted)] bg-[var(--surface-elevated)] min-h-[240px] gap-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[var(--danger-muted)] flex items-center justify-center text-[var(--danger)]">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="text-base font-bold text-[var(--foreground)]">{whatFailed}</h3>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{recoveryGuidance}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  whatShouldAppearHere: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  whatShouldAppearHere,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] min-h-[220px] gap-3",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
        {icon || <FileQuestion className="w-5 h-5" aria-hidden="true" />}
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{whatShouldAppearHere}</p>
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
