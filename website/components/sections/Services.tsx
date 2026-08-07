"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PANEL_CONTAINER } from "@/constants/layout";
import { SERVICE_PILLARS } from "@/constants/services";
import { cn } from "@/utils/cn";

// Same stagger timing as Hero's `container`/`item` variants (0.08s per
// child, 16px rise, easeOut) -- reused verbatim rather than re-derived so
// the homepage's motion language reads as one system, not a per-section
// guess. `as const` on `ease` for the same reason Hero.tsx notes: without
// it TypeScript widens the literal to `string` and Framer Motion's
// `Transition` type rejects it.
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Interior divider classes for one grid cell, computed per breakpoint
 * rather than hand-picked per index -- the grid reflows from 1 column
 * (mobile) to 2 (`sm`) to 4 (`lg`, one full row for exactly 4 pillars), and
 * each layout needs a different divider position. Tailwind emits
 * responsive variants in ascending breakpoint order (sm, then lg), so at
 * `lg` widths the `lg:` declarations below win the cascade over `sm:`'s
 * even where both target the same property -- no need to separately
 * "cancel" the `sm` rule.
 */
function pillarBorderClasses(index: number, total: number) {
  const isLastOverall = index === total - 1;
  const smRow = Math.floor(index / 2);
  const smLastRow = Math.floor((total - 1) / 2);
  const smIsLeftColumn = index % 2 === 0;

  return cn(
    // Mobile: single column, horizontal dividers between every row.
    !isLastOverall && "border-b",
    // `sm`: 2 columns -- vertical divider on the left column, horizontal
    // divider between rows except the final row.
    smIsLeftColumn && "sm:border-r",
    smRow === smLastRow ? "sm:border-b-0" : "sm:border-b",
    // `lg`: single row of 4 -- vertical dividers only, no horizontal ones.
    "lg:border-b-0",
    !isLastOverall && "lg:border-r",
  );
}

/**
 * Purpose: the homepage's "What We Do" section -- a fast, scannable answer
 * to "what does Lyftek actually do" for a visitor who has just seen the
 * Hero's claim and is now looking for proof it maps to something concrete.
 * Heading is "What We Do" (outcome-focused), deliberately not "Our
 * Services" -- per the approved homepage section plan, the former reads as
 * what a visitor gets, the latter as a vendor's menu.
 *
 * DATA: renders `SERVICE_PILLARS` from constants/services.ts verbatim --
 * does NOT invent or duplicate a service list here. That file is also the
 * Footer's own "Services" link source (see Footer.tsx's docblock), so this
 * section and the Footer can never drift into two different lists of
 * service names. Only 4 pillars, not the live site's 8: SERVICE_PILLARS
 * already documents the consolidation rationale (Docs/Mythoughts.md's
 * critique that listing all 8 with equal weight buries Lyftek's core
 * strengths) -- this component just consumes that decision, it doesn't
 * remake it. The full 8-item catalog still exists at /services, which is
 * exactly why this section ends with a "View All Services" link rather
 * than trying to be the complete list itself.
 *
 * NO PHOTOS / NO STOCK IMAGERY: icon + heading + one-line description only.
 * This is the same reasoning Hero.tsx's docblock gives for excluding a
 * product mockup -- no real product screenshots exist yet, and generic
 * stock photography of "professionals in an office" is exactly the
 * live-site pattern the client's own critique (Mythoughts.md) called out
 * as generic. Phosphor icons (already the sitewide icon set -- see
 * constants/services.ts, Footer.tsx, Navbar.tsx) carry the visual weight
 * instead.
 *
 * CONTAINER RULE: this section's own background is `bg-background` --
 * i.e. it does NOT differ from the page background, unlike Hero/Navbar/
 * Footer's `bg-panel`. Per the rule Footer.tsx's docblock lays out (and the
 * approved homepage section plan), a section only needs the boxed
 * `DASHBOARD_CONTAINER` treatment when its own background color diverges
 * from the page and would otherwise hit the true viewport edge -- a
 * `bg-background` section has no such seam, so it stays a full-width
 * `<section>` with its inner content constrained by `PANEL_CONTAINER`
 * (1280px "Standard Content" width) instead. Using DASHBOARD_CONTAINER here
 * would incorrectly imply this section is another boxed dashboard panel
 * like Hero, which it isn't.
 *
 * FLAT + BORDERED, NOT CARD/SHADOW: this is the one homepage section where
 * a grid layout is legitimate at all -- four discrete, enumerable services
 * are inherently a grid, not a narrative flow. But the live site's old
 * services section used individual floating boxed cards with drop shadows
 * and stock photos, which is precisely the "generic SaaS" surface the
 * client's critique and 04_VISUAL_LANGUAGE.md's brutalist-leaning direction
 * push against (see industrial-brutalist-ui skill: "gradients, soft drop
 * shadows... strictly prohibited," "absolute rejection of border-radius").
 * So each pillar is a cell in one continuous bordered grid -- a single
 * `border-border` rule box with interior dividers between cells -- rather
 * than four separate elevated boxes each drawing their own border+shadow.
 * One border system reads as one instrument panel; four separate shadowed
 * cards read as four unrelated widgets.
 *
 * MOTION: one-time fade-up + stagger on scroll-into-view (`whileInView`,
 * `viewport={{ once: true }}`), not a continuous/ambient effect like Hero's
 * Threads background -- this section has no such exception, so it follows
 * 13_MOTION_AND_ANIMATION.md's default "one-time entrance, then stillness"
 * model. Stagger timing (0.08s/child) and the 16px-rise/easeOut item
 * transition are copied from Hero's own `container`/`item` variants so the
 * two entrances feel like the same hand, not two different tunings. Gated
 * behind `useReducedMotion()` the same way Hero gates its Threads
 * background: reduced-motion visitors get the content immediately, with no
 * animated variant applied at all, rather than a paused-but-present one.
 */
export function Services() {
  const prefersReducedMotion = useReducedMotion();

  return (
    // 2026-08-07: border-t moved here (onto the section that owns the
    // py-24/lg:py-32 padding) after the client flagged it colliding with
    // "What We Do" -- it was previously on the inner PANEL_CONTAINER div,
    // which has no vertical padding of its own (only px-6/md:px-8), so the
    // line sat flush against the eyebrow with zero gap. Matches how
    // About/WhyLyftek/ContactCTA/Footer already put their own divider on
    // whichever element actually owns the top spacing.
    <section className="border-divider border-t bg-background py-24 lg:py-32">
      <div className={`px-6 md:px-8 ${PANEL_CONTAINER}`}>
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item} className="flex items-center gap-2">
            <span aria-hidden className="bg-accent h-2 w-2 shrink-0" />
            <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
              What We Do
            </p>
          </motion.div>

          {/*
            2026-08-07, locked trio ("Big heading and numbers: Rinter"):
            font-heading (IBM Plex Sans) -> font-rinter, font-semibold
            dropped -- Rinter only ships a Regular weight, see
            app/layout.tsx's docblock.
          */}
          <motion.h2
            variants={item}
            className="font-rinter text-foreground mt-4 max-w-2xl text-3xl tracking-tight sm:text-4xl lg:text-5xl"
          >
            One partner, four disciplines.
          </motion.h2>

          <motion.div
            variants={item}
            className="border-border mt-14 grid grid-cols-1 border sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          >
            {SERVICE_PILLARS.map(
              ({ label, description, href, icon: ServiceIcon }, index) => (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    "border-border hover:bg-surface-hover focus-visible:ring-accent flex flex-col gap-4 p-8 transition-colors focus-visible:ring-2 focus-visible:outline-none lg:p-10",
                    pillarBorderClasses(index, SERVICE_PILLARS.length),
                  )}
                >
                  <ServiceIcon
                    size={28}
                    weight="light"
                    className="text-accent"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-rinter text-foreground text-lg tracking-tight">
                      {label}
                    </h3>
                    <p className="text-foreground-muted text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </a>
              ),
            )}
          </motion.div>

          <motion.div variants={item} className="mt-12 lg:mt-14">
            <Button href="/services" variant="outline">
              View All Services
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
