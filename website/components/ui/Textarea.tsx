import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Purpose: multi-line form field -- see Input.tsx's docblock for the shared
 * reasoning (label styling, corner/focus/error conventions, minimal prop
 * surface). This file only documents what's different: a sensible default
 * `rows` (4) so it doesn't render as a single cramped line, and vertical-only
 * resize (`resize-y`) so it can't be dragged wider than its container.
 */
export function Textarea({
  label,
  error,
  containerClassName,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className="text-foreground-muted font-mono text-xs font-semibold tracking-[0.15em] uppercase"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          "bg-surface border-border text-foreground placeholder:text-foreground-muted w-full resize-y rounded-sm border px-4 py-2.5 text-base transition-colors outline-none",
          "focus-visible:border-accent focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-0",
          error && "border-error",
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-error text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
