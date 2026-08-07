import type { SelectHTMLAttributes } from "react";
import { useId } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  options: SelectOption[];
  /** Rendered as a disabled, pre-selected first option -- e.g. "Select a service". */
  placeholder?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Purpose: dropdown form field -- see Input.tsx's docblock for the shared
 * label/focus/error conventions this follows. First real consumer is
 * ContactCTA.tsx's "Service Interested In" field.
 *
 * A native <select> rather than a custom-built listbox -- this site has no
 * other dropdown yet, and a native element gets keyboard nav, screen-reader
 * behavior, and mobile OS picker UI for free (17_CODING_STANDARDS.md's
 * "avoid unnecessary abstractions"; reach for a custom Radix/Base UI
 * combobox only when a real need for it -- search, multi-select, custom
 * option rendering -- shows up). The native appearance is stripped
 * (`appearance-none`) and a Phosphor caret icon laid on top so it still
 * matches the site's visual language instead of the browser's default
 * dropdown chrome.
 */
export function Select({
  label,
  options,
  placeholder,
  error,
  containerClassName,
  id,
  defaultValue,
  ...props
}: SelectProps) {
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
      <div className="relative">
        <select
          id={inputId}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          className={cn(
            "bg-surface border-border text-foreground appearance-none rounded-sm border px-4 py-2.5 pr-10 text-sm transition-colors outline-none",
            "focus-visible:border-accent focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-0",
            error && "border-error",
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDown
          aria-hidden
          size={16}
          className="text-foreground-muted pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-error text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
