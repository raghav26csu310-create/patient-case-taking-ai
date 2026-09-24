import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "patient";
  size?: "sm" | "md" | "lg" | "patient";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variantStyles = {
      primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus-visible:outline-[var(--focus)] shadow-sm",
      secondary: "bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)] focus-visible:outline-[var(--focus)]",
      outline: "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:outline-[var(--focus)]",
      danger: "bg-[var(--danger)] text-white hover:opacity-90 focus-visible:outline-[var(--danger)] shadow-sm",
      ghost: "text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:outline-[var(--focus)]",
      patient:
        "patient-touch-target text-xl font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus-visible:outline-[var(--focus)] shadow-md rounded-xl active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      patient: "min-h-[54px] px-8 text-lg gap-3",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Accessible label is required
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "patient";
  size?: "sm" | "md" | "lg" | "patient";
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = "ghost", size = "md", isLoading = false, className, disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      patient: "h-14 w-14 patient-touch-target",
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        isLoading={isLoading}
        aria-label={label}
        title={label}
        className={cn("p-0 shrink-0", sizeStyles[size], className)}
        disabled={disabled}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";
