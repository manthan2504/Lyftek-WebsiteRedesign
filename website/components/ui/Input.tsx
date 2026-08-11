import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/utils/cn";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  /** Visual-only -- this component doesn't do validation, a consumer wires that up and toggles this. */
  error?: string;
  containerClassName?: string;
}

/**
 * Purpose: the site's first form input primitive -- built alongside
 * ContactCTA.tsx (the homepage's contact form), which is its first
 * consumer. Same minimal-prop-surface philosophy as Button.tsx: standard
 * HTML attribute passthrough via `...props` rather than reinventing every
 * native input behavior, extend only when a real use case needs more.
 *
 * Label styling matches the mono-uppercase eyebrow-label convention already
 * used throughout the site (Hero's "Enterprise Technology Partner", Footer's
 * column headings) rather than inventing a separate forms typography scale.
 *
 * Corners: `rounded-sm`, not the heavier rounding a generic form library
 * defaults to -- 04_VISUAL_LANGUAGE.md's flat/bordered direction, matching
 * Services.tsx's bordered grid and CornerBrackets' square-cornered vocabulary
 * rather than introducing a softer, rounder shape language just for forms.
 *
 * Focus/error state: focus ring matches every other interactive element
 * sitewide (`focus-visible:ring-accent`, see Button.tsx/Navbar.tsx). Error
 * state swaps the border to `--color-error` and shows the message below --
 * visual only, no validation logic lives here.
 */
export function Input({
  label,
  error,
  containerClassName,
  id,
  ...props
}: InputProps) {
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
      <input
        id={inputId}
        className={cn(
          "bg-surface border-border text-foreground placeholder:text-foreground-muted w-full rounded-sm border px-4 py-2.5 text-base transition-colors outline-none",
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
