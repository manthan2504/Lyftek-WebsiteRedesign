import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "md" | "icon";

interface ButtonProps {
  children: ReactNode;
  /** Renders as a Next.js Link when provided, otherwise a native <button>. */
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  // Subtle scale (not just a color change) on the primary variant only --
  // researched against Stripe/Linear-tier CTA polish, scoped tight
  // (1.0->1.02) so it reads as considered rather than performative. See
  // Navbar's docblock / claudeContextExchange.md for the full precedent
  // comparison this came out of.
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]",
  outline: "border border-border text-foreground hover:bg-surface-hover",
  ghost: "text-foreground hover:bg-surface-hover",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "h-10 px-5 text-sm",
  icon: "h-10 w-10",
};

/**
 * Purpose: single reusable action trigger for the whole site (nav CTA, hero
 * CTA, form submit, icon toggles) so button styling never forks per section.
 * Usage: prefer this over a raw <button>/<a> anywhere an action or
 * navigation trigger is needed. Extend variants here rather than overriding
 * styles inline at the call site.
 *
 * Intentionally minimal prop surface for now (no full HTML attribute
 * passthrough) -- grow it only when a real use case needs more, per
 * 17_CODING_STANDARDS.md's "avoid unnecessary abstractions."
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  ...aria
}: ButtonProps) {
  const classes = cn(
    // Plain `transition` (not `transition-colors`) so color AND transform
    // changes both animate -- needed for the primary variant's hover scale.
    // No rounding utility -- sharp, square corners, per direct client
    // instruction ("boxy, sharp boxy... nothing fancy clean professional")
    // that also retires the `pill` prop this component used to have
    // (`rounded-full`, previously Hero's "Talk to Our Team" CTA only) --
    // that variant directly contradicted the new boxy direction, so it was
    // removed rather than left as unreachable dead code. This also
    // resolves the Navbar-CTA-vs-Hero-CTA shape inconsistency flagged
    // repeatedly across earlier sessions (09_DESIGN_SYSTEM.md, this file's
    // own prior docblock): both are the same sharp box now, nothing left
    // to reconcile.
    "inline-flex items-center justify-center gap-2 font-medium transition duration-150",
    "focus-visible:ring-accent focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...aria}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...aria}>
      {children}
    </button>
  );
}
