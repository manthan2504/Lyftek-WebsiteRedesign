"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { NAV_LINKS, PRIMARY_CTA } from "@/constants/navigation";
import { cn } from "@/utils/cn";

/**
 * Purpose: single unified navigation bar, replacing the current live site's
 * two-layer header (contact bar + nav) flagged in Docs/Lyftek Website
 * Redesign Strategy.pdf as adding unnecessary height and burying the logo.
 *
 * Structure: an independent floating box, the same full width as Hero's
 * dashboard panel behind it (see DASHBOARD_CONTAINER, 1440px), not fused to
 * it. Solid near-black `panel` background, square corners, lime
 * corner-bracket marks on all 4 corners (this is the ONLY component that
 * gets the lime corner treatment -- the dashboard panel itself stays
 * plain). Sticky with a fixed top offset that matches its resting margin,
 * so it keeps floating with the same gap once scrolled instead of snapping
 * flush to the viewport edge.
 *
 * On the homepage specifically, app/page.tsx pulls Hero's wider dashboard
 * panel up (negative margin on <main>, see NAVBAR_FOOTPRINT_PX) so its
 * dark/grid background shows through above, below, and to the sides of
 * this floating box -- but Navbar itself has zero awareness of that; it's
 * entirely self-contained and renders identically on every route.
 *
 * Accessibility: skip link to #main-content, semantic <header>/<nav>
 * landmarks, aria-current on the active link, aria-expanded/controls on the
 * mobile toggle, Escape closes the mobile menu, visible focus rings
 * throughout. Motion is skipped for users who prefer reduced motion.
 *
 * Desktop link interaction (researched against Stripe/Vercel/Linear vs.
 * IBM/Microsoft/GitHub -- see claudeContextExchange.md for the full
 * precedent comparison): the active link gets a flat 2px accent underline
 * that slides between links via Framer Motion's layoutId (functional
 * wayfinding, not decoration); inactive links get a fast CSS-only
 * underline-grow on hover/focus. Deliberately NOT done: glow/shadow on the
 * indicator, or an always-on blurred/translucent background -- both would
 * tip into the effects 04_VISUAL_LANGUAGE.md explicitly bans.
 */
export function Navbar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close the mobile menu on route change. Adjusted during render (React's
  // recommended pattern for state that must reset when a prop changes)
  // rather than in an effect, which would cause an extra render pass.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const isActiveLink = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    // `header` itself stays an unconstrained, full-width sticky flex item --
    // `body` is `flex flex-col` (app/layout.tsx), and a direct flex child's
    // cross-axis sizing does NOT resolve max-width + mx-auto centering the
    // normal block-layout way (verified: max-width computed correctly, but
    // the box's actual width did not respect it, collapsing to roughly
    // half). The boxed panel (width/background/corners) lives on the inner
    // div instead, which is a normal block child of header -- not itself a
    // flex item -- so standard centering math applies correctly.
    <header className="sticky top-8 z-50 mt-8">
      <div className={cn("bg-panel relative", DASHBOARD_CONTAINER)}>
        <CornerBrackets
          corners={["top-left", "top-right", "bottom-left", "bottom-right"]}
        />

        <a
          href="#main-content"
          className="focus:bg-accent focus:text-accent-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          {/*
            2026-08-07, direct client instruction (after fetching Martian
            Mono as a licensed AO Mono substitute): "navbar elements...
            we gonna use martian mono." Wordmark switched from `font-
            heading` (IBM Plex Sans, the sitewide heading face) to
            `font-martian-mono` -- see app/layout.tsx + app/globals.css
            docblocks for the full font provenance.
          */}
          <Link
            href="/"
            className="focus-visible:ring-accent font-martian-mono text-foreground rounded-sm text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
          >
            Lyftek
          </Link>

          <nav
            aria-label="Primary"
            className="hidden lg:flex lg:items-center lg:gap-8"
          >
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-accent font-martian-mono group relative rounded-sm py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "text-foreground"
                      : "text-foreground-secondary hover:text-foreground",
                  )}
                >
                  {link.label}
                  {active ? (
                    // Shared-layout indicator: Framer Motion animates this
                    // sliding smoothly to whichever link is active, instead of
                    // just appearing/disappearing. Flat 2px accent bar, no
                    // glow/shadow -- 04_VISUAL_LANGUAGE.md bans glow effects
                    // regardless of how subtle.
                    <motion.span
                      layoutId="nav-active-indicator"
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.2,
                        ease: "easeOut",
                      }}
                      className="bg-accent absolute inset-x-0 -bottom-1 h-[2px] rounded-full"
                    />
                  ) : (
                    // Hover-only underline, CSS transform only (no Framer
                    // Motion needed for a plain hover state per
                    // 13_MOTION_AND_ANIMATION.md's "CSS first" guidance).
                    // Also triggers on keyboard focus, not just mouse hover.
                    <span
                      aria-hidden
                      className="bg-foreground-secondary absolute inset-x-0 -bottom-1 h-[1.5px] origin-left scale-x-0 rounded-full transition-transform duration-150 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href={PRIMARY_CTA.href} variant="primary">
              {PRIMARY_CTA.label}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </Button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: "easeInOut",
              }}
              className="border-panel-border overflow-hidden border-t lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-accent font-martian-mono rounded-md px-3 py-2.5 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                      isActiveLink(link.href)
                        ? "bg-surface text-foreground"
                        : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  href={PRIMARY_CTA.href}
                  variant="primary"
                  className="mt-3 w-full"
                >
                  {PRIMARY_CTA.label}
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
