import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "primary-muted" | "success" | "warning" | "danger" | "info" | "evidence" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Badge({ className, variant = "default", size = "md", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]",
    primary: "bg-[var(--primary)] text-white border border-[var(--primary)]",
    "primary-muted": "bg-[var(--primary-muted)] text-[var(--primary)] border border-[var(--primary)]/30",
    success: "bg-[var(--success-muted)] text-[var(--success-foreground)] border border-[var(--success)]",
    warning: "bg-[var(--warning-muted)] text-[var(--warning-foreground)] border border-[var(--warning)]",
    danger: "bg-[var(--danger-muted)] text-[var(--danger-foreground)] border border-[var(--danger)] font-bold",
    info: "bg-[var(--info-muted)] text-[var(--info-foreground)] border border-[var(--info)]",
    evidence:
      "bg-[var(--primary-muted)] text-[var(--primary)] border border-[var(--primary)] font-mono font-bold hover:bg-[var(--primary)] hover:text-white cursor-pointer transition-colors shadow-2xs",
    outline: "border border-[var(--border)] text-[var(--foreground)] bg-transparent",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 rounded",
    md: "text-xs px-2.5 py-0.5 rounded-md",
    lg: "text-sm px-3 py-1 rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium leading-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
