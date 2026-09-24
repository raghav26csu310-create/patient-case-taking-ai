import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./button";

export interface ToastProps {
  id?: string;
  type?: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export function Toast({
  type = "info",
  title,
  message,
  onDismiss,
  className,
}: ToastProps) {
  const iconConfig = {
    info: <Info className="w-5 h-5 text-[var(--info)] shrink-0" aria-hidden="true" />,
    success: <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-[var(--warning)] shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-[var(--danger)] shrink-0" aria-hidden="true" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-lg max-w-sm w-full animate-in slide-in-from-bottom-2",
        className
      )}
    >
      {iconConfig[type]}
      <div className="flex flex-col gap-0.5 flex-1">
        <h4 className="text-sm font-semibold text-[var(--foreground)]">{title}</h4>
        {message && <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{message}</p>}
      </div>
      {onDismiss && (
        <IconButton icon={<X className="w-4 h-4" />} label="Dismiss notification" onClick={onDismiss} size="sm" />
      )}
    </div>
  );
}
