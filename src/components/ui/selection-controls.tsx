import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
  isPatientMode?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, isPatientMode = false, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          isPatientMode && "patient-touch-target p-2 hover:bg-[var(--muted)] rounded-lg",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          className={cn(
            "rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--focus)] cursor-pointer mt-0.5",
            isPatientMode ? "w-6 h-6" : "w-4 h-4"
          )}
          {...props}
        />
        <div className="flex flex-col">
          <span className={cn("text-[var(--foreground)] font-medium", isPatientMode ? "text-lg" : "text-sm")}>
            {label}
          </span>
          {description && (
            <span className={cn("text-[var(--muted-foreground)]", isPatientMode ? "text-sm" : "text-xs")}>
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
  isPatientMode?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, isPatientMode = false, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          isPatientMode && "patient-touch-target p-2 hover:bg-[var(--muted)] rounded-lg",
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          id={inputId}
          disabled={disabled}
          className={cn(
            "border-[var(--border)] text-[var(--primary)] focus:ring-[var(--focus)] cursor-pointer mt-0.5",
            isPatientMode ? "w-6 h-6" : "w-4 h-4"
          )}
          {...props}
        />
        <div className="flex flex-col">
          <span className={cn("text-[var(--foreground)] font-medium", isPatientMode ? "text-lg" : "text-sm")}>
            {label}
          </span>
          {description && (
            <span className={cn("text-[var(--muted-foreground)]", isPatientMode ? "text-sm" : "text-xs")}>
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);
Radio.displayName = "Radio";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onCheckedChange, label, description, disabled = false, className }: SwitchProps) {
  const switchId = useId();

  return (
    <div className={cn("inline-flex items-center justify-between gap-4 select-none", className)}>
      <div className="flex flex-col">
        <label htmlFor={switchId} className="text-sm font-medium text-[var(--foreground)] cursor-pointer">
          {label}
        </label>
        {description && <span className="text-xs text-[var(--muted-foreground)]">{description}</span>}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
