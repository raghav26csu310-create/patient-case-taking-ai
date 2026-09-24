import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  isPatientMode?: boolean;
}

export function Progress({
  value,
  max = 100,
  label,
  isPatientMode = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full flex flex-col gap-1.5" {...props}>
      {label && (
        <div className="flex justify-between items-center text-xs font-medium text-[var(--muted-foreground)]">
          <span className={isPatientMode ? "text-base font-bold text-[var(--foreground)]" : ""}>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
        className={cn(
          "w-full overflow-hidden rounded-full bg-[var(--muted)] border border-[var(--border-subtle)]",
          isPatientMode ? "h-4" : "h-2",
          className
        )}
      >
        <div
          className="h-full bg-[var(--primary)] transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
