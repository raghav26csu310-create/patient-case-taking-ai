import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  isPatientMode?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, isPatientMode = false, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "font-medium text-[var(--foreground)]",
              isPatientMode ? "text-lg font-bold" : "text-xs uppercase tracking-wider text-[var(--muted-foreground)]"
            )}
          >
            {label}
            {props.required && <span className="text-[var(--danger)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border bg-[var(--surface)] px-3 text-[var(--foreground)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            error ? "border-[var(--danger)]" : "border-[var(--border)]",
            isPatientMode ? "patient-touch-target text-xl px-4 py-3" : "h-10 text-sm",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-[var(--danger)]">{error}</p>}
        {!error && helperText && <p className="text-xs text-[var(--muted-foreground)]">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
