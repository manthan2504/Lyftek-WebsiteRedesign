"use client";

import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";

// `as const` preserves the "easeOut" literal type Framer Motion's Transition
// expects -- same reasoning as every other section's `fadeUp` variant.
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

// Merged Mission + Vision content (2026-08-08, direct client instruction:
// "merge these points... so no need to create dedicated section for
// mission and vision") -- rewritten in Lyftek's own established voice
// (Docs/content_writing.md: outcome-focused, no generic IT-company
// boilerplate) rather than kept as the client's original draft, which
// leaned on phrasing ("globally recognized digital innovation partner,"
// "future-ready solutions") that guideline explicitly warns against.
// Same `QUALITATIVE_POINTS` list pattern WhyLyftek.tsx already uses on the
// homepage -- point 1 carries the mission's outcome focus, point 2 carries
// the vision's "one partner across every discipline" ambition, neither
// headed as its own subsection, per the client's explicit instruction.
const DIFFERENTIATOR_POINTS = [
  "Every engagement is measured by the same standard: less manual work, a better customer experience, and real progress on the outcome that started the project -- not just a system that ships and goes quiet.",
  "The direction is the same at every stage of our growth: become the technology partner enterprises default to across AI, automation, cloud, and security -- not one specialist among several they still have to manage.",
];

/**
 * Purpose: the About page's credibility/positioning section -- built on
 * the exact same `bg-panel` skeleton WhyLyftek.tsx uses on the homepage
 * (see that file's own docblock for the full reasoning: `border-t`/
 * `border-x` on a `DASHBOARD_CONTAINER` div, no outline/corner marks --
 * rejected sitewide 2026-08-07 -- and deliberately no `border-b`, since
 * `ContactCTA` follows this section on the page and its own `border-t`
 * closes this panel's bottom edge, the same rail-handoff mechanism every
 * homepage section relies on).
 *
 * CONTENT, two parts, per direct client instruction:
 *
 * 1. The differentiation paragraph. The client's own draft leaned on
 *    specific claims this project has no source for (a fundraising/
 *    roll-up narrative, three named client industries/companies) -- not
 *    used verbatim. This project's standing no-fabrication rule (already
 *    applied to WhyLyftek's stats and the ContactCTA inquiry cards)
 *    covers invented client stories the same way it covers invented
 *    numbers. Rewritten around the one differentiation claim this site
 *    can actually stand behind, already established sitewide (Hero/
 *    About/Services all make the same point): one accountable team
 *    across the full stack, instead of the specialist-per-vendor status
 *    quo.
 *
 * 2. `DIFFERENTIATOR_POINTS` -- the client's separate Mission/Vision copy,
 *    merged into this section as a plain 2-item list rather than two
 *    headed subsections (direct instruction), same `/`-marker pattern
 *    WhyLyftek's `QUALITATIVE_POINTS` already uses on the homepage.
 *
 * ALIGNMENT (2026-08-08, direct client decision, same fix applied to
 * WhyLyftek.tsx on the homepage -- see `PANEL_CONTAINER_NESTED`'s own
 * docblock in constants/layout.ts): Hero-equivalent panels (AboutHero on
 * this page, Hero on the homepage) keep their own flush-left content
 * padding as a deliberate one-off pattern; every section below them
 * shares a different, indented pattern instead via `PANEL_CONTAINER_
 * NESTED`. This section is one of the "below" sections, so it gets that
 * token on its motion.div rather than padding the `DASHBOARD_CONTAINER`
 * box directly.
 */
export function WhyDifferent() {
  return (
    // Padding lives on the motion.div with `PANEL_CONTAINER_NESTED`, not
    // on this outer `bg-panel` div -- matching About.tsx/Services.tsx's
    // exact nesting shape (see WhyLyftek.tsx's matching fix/docblock,
    // 2026-08-08) so this section's eyebrow lands at the same left edge
    // as every other "below Hero" section instead of a few pixels off.
    <section>
      <div
        className={`bg-panel border-border border-t border-x ${DASHBOARD_CONTAINER}`}
      >
        {/*
          `initial="hidden"` unconditionally -- reduced motion is handled
          sitewide by MotionProvider now; branching it here per-section is
          what caused a hydration mismatch (see motion-provider.tsx).
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          // 2026-08-10 consistency pass: `gap-2` removed -- it added 8px on
          // top of every child's own `mt-*`, making this section's spacing
          // rhythm 24px/32px against 16px/24px everywhere else. Same fix as
          // WhyLyftek.tsx, the only other section that had it.
          className={`flex flex-col px-6 py-12 md:px-8 md:py-16 lg:py-24 ${PANEL_CONTAINER_NESTED}`}
        >
          <SectionEyebrow>Our Approach</SectionEyebrow>

          {/*
            2026-08-10: `lg:text-4xl` -> `sm:text-4xl`, matching every other
            section H2's breakpoint (see WhyLyftek.tsx for the full note).
          */}
          <h2 className="font-rinter text-foreground mt-4 text-3xl tracking-tight sm:text-4xl">
            Why we&apos;re different.
          </h2>

          {/* 2026-08-10: `text-base lg:text-lg` -> `text-lg`, matching every
              other section's body copy. */}
          <p className="text-foreground-secondary mt-6 max-w-3xl text-lg leading-relaxed">
            Most enterprise technology work gets split across specialists
            -- one vendor for software, another for cloud, a third for
            security -- each optimizing their own piece without owning how
            it all works together. Lyftek was built to close that gap: one
            team, accountable across the full stack, from the first line
            of code to the system still running years later.
          </p>

          <ul className="text-foreground-secondary mt-6 flex max-w-3xl flex-col gap-3 text-lg leading-relaxed">
            {DIFFERENTIATOR_POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="text-accent shrink-0">
                  /
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
