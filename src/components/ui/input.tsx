import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isPatientMode?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, isPatientMode = false, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "font-medium text-[var(--foreground)]",
              isPatientMode ? "text-lg font-bold" : "text-xs uppercase tracking-wider text-[var(--muted-foreground)]"
            )}
          >
            {label}
            {props.required && <span className="text-[var(--danger)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "w-full rounded-lg border bg-[var(--surface)] px-3 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-[var(--danger)] focus-visible:outline-[var(--danger)]" : "border-[var(--border)]",
            isPatientMode ? "patient-touch-target text-xl px-4 py-3" : "h-10 text-sm",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-[var(--danger)] mt-0.5" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isPatientMode?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, isPatientMode = false, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "font-medium text-[var(--foreground)]",
              isPatientMode ? "text-lg font-bold" : "text-xs uppercase tracking-wider text-[var(--muted-foreground)]"
            )}
          >
            {label}
            {props.required && <span className="text-[var(--danger)] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "w-full rounded-lg border bg-[var(--surface)] p-3 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]",
            error ? "border-[var(--danger)] focus-visible:outline-[var(--danger)]" : "border-[var(--border)]",
            isPatientMode ? "text-lg p-4" : "text-sm",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-[var(--danger)] mt-0.5" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
