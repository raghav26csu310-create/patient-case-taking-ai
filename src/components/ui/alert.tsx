import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "danger" | "success";
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const variantConfig = {
    info: {
      container: "bg-[var(--info-muted)] border-[var(--info)] text-[var(--info-foreground)]",
      icon: <Info className="w-5 h-5 text-[var(--info)] shrink-0 mt-0.5" aria-hidden="true" />,
    },
    warning: {
      container: "bg-[var(--warning-muted)] border-[var(--warning)] text-[var(--warning-foreground)]",
      icon: <AlertTriangle className="w-5 h-5 text-[var(--warning)] shrink-0 mt-0.5" aria-hidden="true" />,
    },
    danger: {
      container: "bg-[var(--danger-muted)] border-[var(--danger)] text-[var(--danger-foreground)]",
      icon: <AlertCircle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" aria-hidden="true" />,
    },
    success: {
      container: "bg-[var(--success-muted)] border-[var(--success)] text-[var(--success-foreground)]",
      icon: <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" aria-hidden="true" />,
    },
  };

  const { container, icon } = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn("flex items-start gap-3 p-4 rounded-xl border", container, className)}
      {...props}
    >
      {icon}
      <div className="flex flex-col gap-0.5 text-sm">
        {title && <span className="font-bold tracking-tight text-base">{title}</span>}
        <div className="leading-relaxed opacity-95">{children}</div>
      </div>
    </div>
  );
}
