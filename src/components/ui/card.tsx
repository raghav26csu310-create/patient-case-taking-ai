import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  bordered?: boolean;
}

export function Card({ className, elevated = false, bordered = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition-shadow",
        elevated ? "bg-[var(--surface-elevated)] shadow-md" : "bg-[var(--surface)]",
        bordered && "border border-[var(--border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pb-3 border-b border-[var(--border-subtle)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-[var(--foreground)] tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--muted-foreground)] mt-0.5", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}
