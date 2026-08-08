"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DASHBOARD_CONTAINER } from "@/constants/layout";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

// `as const` preserves the "easeOut" literal type Framer Motion's Transition
// expects -- same reasoning as Hero.tsx's own `item` variant.
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Purpose: the About page's opening panel -- same ROLE Hero.tsx plays on
 * the homepage (first section under Navbar, establishes what the page is
 * before anything else), built on the exact same locked skeleton (direct
 * client instruction, 2026-08-08: "make sure we follow layout of homepage,
 * because basic framework of homepage is locked in for us now").
 *
 * SHARED WITH HOME HERO: `bg-panel` + `border-x` + `DASHBOARD_CONTAINER`,
 * no `border-t` -- this is the first section under Navbar, same as
 * Hero.tsx, so its top edge is deliberately NOT connected to a rail above
 * it (matches Navbar's own full-width-chrome-vs-boxed-content split, see
 * Navbar.tsx's docblock). Same eyebrow (`font-martian-mono`, accent
 * square) + `font-rinter` heading + body-copy trio Hero.tsx uses, same
 * stagger-in motion (`container`/`item` variants, copied verbatim).
 *
 * DELIBERATELY DIFFERENT FROM HOME HERO:
 * - No WebGL `Threads` background -- that's Hero's own homepage-specific
 *   motion-budget exception (see that file's docblock); this page doesn't
 *   inherit it just because it shares the panel treatment.
 * - No CTA button/caption row here. Per 10_PAGE_BLUEPRINTS.md's "single
 *   primary objective" principle, this page has exactly one CTA -- the
 *   reused `ContactCTA` at the bottom (see app/about/page.tsx) -- not a
 *   second one competing with it above the fold.
 * - No `min-h-[calc(100svh-4rem)]` full-viewport centering. Home Hero's
 *   `min-h` fix (see that file's docblock, 2026-08-08) existed because a
 *   much heavier content stack (eyebrow + 3-line headline + subtext + CTA
 *   + caption) was pushing the CTA below the fold on shorter viewports.
 *   This panel is one eyebrow + heading + paragraph -- visibly lighter --
 *   so forcing full-viewport height would just leave it looking emptier
 *   than its content justifies. Generous fixed padding (`py-32 lg:py-40`,
 *   taller than a standard section's `py-24 lg:py-32` since this is the
 *   page's own opening statement) does the "feels substantial" job
 *   without the empty space.
 *
 * COPY: written to Docs/content_writing.md's guidelines (outcome-focused,
 * no generic IT-company boilerplate), adapted from the client's own
 * inspiration draft rather than used verbatim -- that draft's specific
 * phrasing ("native AI systems," "the layer that acts") described a
 * narrower AI-platform company, not Lyftek's actual established
 * positioning (one accountable partner across software, AI, cloud,
 * cybersecurity -- see Hero.tsx/About.tsx). Kept the underlying sentiment
 * (proprietary, not a shared template; quietly dependable; built for the
 * long term) and re-grounded it in the "one partner, not multiple
 * vendors" throughline already established sitewide.
 *
 * RIGHT-COLUMN ISOMETRIC LOGO SCENE -- TRIED AND REVERTED (2026-08-08):
 * a `LogoScene` component (components/sections/about/LogoScene.tsx, now
 * deleted) rendered the Lyftek mark as a 3D object on an isometric grid,
 * with two abstract figures, in a second grid column added here. Went
 * through two full rebuilds same day (a chip/plinth version, then a
 * landed-directly-on-the-grid version after the first was flagged) --
 * client called it "messed up" on the second pass too and asked to drop
 * it entirely rather than keep iterating live: "remove that entirely dump
 * it will do that later." This file is back to its original single-column
 * layout (no grid, no visual column) -- if this direction gets picked up
 * again, start fresh rather than resurrecting the deleted component from
 * git history, since neither prior attempt was approved.
 */
export function AboutHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={container}
        className="flex flex-col items-start px-6 py-32 text-left md:px-8 lg:py-40"
      >
        <motion.div variants={item} className="flex items-center gap-2">
          <span aria-hidden className="bg-accent h-2 w-2 shrink-0" />
          <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
            Who We Are
          </p>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-rinter text-foreground mt-6 text-5xl tracking-tight sm:text-6xl lg:text-7xl"
        >
          About.
        </motion.h1>

        <motion.p
          variants={item}
          className="text-foreground-secondary mt-8 max-w-2xl text-lg leading-relaxed"
        >
          Every engagement starts with how your business actually runs, not
          a template we retrofit to fit. We build systems that are
          proprietary to your operations, not a shared platform everyone
          else is running too. That ownership is what keeps things moving
          when no one&apos;s watching: fewer vendors to coordinate, one team
          that stays accountable to what it built, and work designed to
          outlast the project that started it.
        </motion.p>
      </motion.div>
    </section>
  );
}
