"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DASHBOARD_CONTAINER } from "@/constants/layout";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Purpose: homepage credibility section -- the qualitative "why us" case
 * plus the one hard number worth stating up front, positioned right after
 * Hero. Merges what the live site runs as two separate, back-to-back card
 * grids ("Why Choose Us?" -- 4 icon cards, and "Our Achievements" -- 4
 * animated stat counters). Per Docs/Mythoughts.md's explicit "merge these
 * two sections" recommendation and the approved homepage section plan: the
 * two sections independently restate the same facts (e.g. "12+ years"
 * appears in both) and, run one after another, both read as templated
 * icon-card grids -- the exact generic-template look 04_VISUAL_LANGUAGE.md
 * warns against. One section, two registers of the same claim (qualitative
 * prose + a numeric strip), reads as one considered statement instead.
 *
 * CONTENT-ACCURACY GATE -- why 3 of the 4 live-site stats are omitted:
 * the live site's "Our Achievements" block animates 4 counters up from
 * "0+" (Satisfied Clients / Successful Projects / Team Strength / Years of
 * Experience). Only "Years of Experience" has an observable, internally
 * consistent real value -- "12+ Years" / "Since 2011" appears as STATIC
 * text in two separate places on the live site, so it's confirmed, not
 * read off a counter mid-animation. The other three are JS-driven counters
 * with no static fallback markup -- their real final values were never
 * actually observed, only their animated-from-zero starting state. Inventing
 * plausible-looking numbers for "Satisfied Clients," "Successful Projects,"
 * or "Team Strength" would ship fabricated data under the client's name.
 *
 * Of the two safe options weighed (see task brief): (a) ship ONLY the
 * confirmed "12+ Years" stat and omit the other three slots entirely, or
 * (b) ship all four labels with the unconfirmed three rendered as a styled
 * "--" pending placeholder. THIS BUILD USES (a) -- a single-stat strip reads
 * as a deliberate, confident statement; three visible "--" placeholders next
 * to one real number would read as an unfinished page shipped to production.
 * When the client confirms the other three figures, extend `STATS` below
 * (currently a single-entry array specifically so that extension is a
 * data-only change, not a structural rewrite of this component).
 *
 * CONTAINER/BACKGROUND RULE -- same one Footer.tsx's docblock documents
 * (and the same mistake corrected there earlier this session): this
 * section uses `bg-panel`, the near-black #0A0A0A boxed-panel color shared
 * with Navbar/Hero/Footer, as a deliberate contrast break from the
 * surrounding plain `bg-background` sections. Per the rule established in
 * Footer.tsx: any section whose OWN background differs from the page
 * background MUST be boxed in `DASHBOARD_CONTAINER`, never full-bleed to
 * the viewport edge -- a `bg-panel` band that reaches the true viewport
 * edge has zero gutter and breaks the "everything lives inside the boxed
 * dashboard frame" identity Navbar/Hero/Footer establish. So this section
 * follows Footer's exact nesting shape: a full-width `<section>` wrapper
 * with only vertical margin, containing one `bg-panel` + `border` +
 * `DASHBOARD_CONTAINER` inner div that holds all the content. Sections
 * that instead use plain `bg-background` don't have this problem and stay
 * full-width -- this one specifically opts INTO the panel treatment as a
 * deliberate visual beat, not a mistake to fix later.
 *
 * Structure: 2-3 short qualitative sentences (certified professionals &
 * domain expertise, proven client track record, flexible engagement
 * models -- adapted/shortened from the live site's 4 icon-cards, kept as
 * prose/a tight list rather than repeating that card-grid shape a third
 * time on the page) beside a horizontal stat strip. The strip itself
 * follows the industrial-brutalist-ui skill's "Micro-Typography (Data &
 * Telemetry)" guidance -- `font-mono` numerals, uppercase tracked-out
 * labels, a bordered row divided by `border-divider`, deliberately NO card
 * wrappers around individual stats, so it reads as one continuous
 * telemetry readout rather than a third card grid.
 *
 * SEPARATION (revised 2026-08-07, direct client feedback: "we dont want
 * that outline or colored corners just add seperation lines between
 * sections"): the `border` + `CornerBrackets` outline this panel used to
 * have is removed -- the client explicitly rejected the boxed-outline
 * look (which also made this section and Footer feel inconsistent with
 * each other depending on which had the lime corners at any given
 * moment, see claudeContextExchange.md). Replaced sitewide with one
 * consistent mechanism instead: a plain `border-t border-divider`
 * hairline at the top of every homepage section (see About/Services/
 * ContactCTA/Footer for the same treatment) rather than ad hoc boxes on
 * some sections and not others. `bg-panel` + `DASHBOARD_CONTAINER` are
 * UNCHANGED -- only the outline stroke and corner marks were the
 * complaint, not this section's color-block identity.
 *
 * Motion: one-time fade-up on scroll into view (`whileInView`, `once:
 * true`), gated behind `useReducedMotion()` -- matches 13_MOTION_AND_
 * ANIMATION.md's "one-time entrance, then stillness" model for non-hero
 * sections (unlike Hero's continuous WebGL background, this section has no
 * ongoing motion budget exception).
 */

interface Stat {
  value: string;
  label: string;
}

// Deliberately a single entry -- see the content-accuracy gate note above.
// Extend this array (not the JSX) once the client confirms real figures for
// Satisfied Clients / Successful Projects / Team Strength.
const STATS: Stat[] = [{ value: "12+", label: "Years of Experience" }];

const QUALITATIVE_POINTS = [
  "Certified professionals with deep domain expertise across the technologies we deliver.",
  "A proven track record built on long-term client relationships, not one-off projects.",
  "Flexible engagement models that adapt to how your team actually works.",
];

export function WhyLyftek() {
  const prefersReducedMotion = useReducedMotion();

  return (
    // 2026-08-07: border-t moved from the inner bg-panel/DASHBOARD_CONTAINER
    // div to this outer section (full width) -- full-page audit after the
    // client flagged inconsistent line widths (some edge-to-edge, some
    // inset). Every section's divider is now full-width, matching About/
    // Services/ContactCTA/Footer.
    <section className="border-divider mt-16 mb-16 border-t lg:mt-24 lg:mb-24">
      <div
        className={`bg-panel px-6 py-16 md:px-8 lg:py-24 ${DASHBOARD_CONTAINER}`}
      >
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span aria-hidden className="bg-accent h-2 w-2 shrink-0" />
            <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
              Why Lyftek
            </p>
          </div>

          {/*
            2026-08-07, locked trio: font-heading -> font-rinter,
            font-semibold dropped (Regular-only face, see app/layout.tsx).
          */}
          <h2 className="font-rinter text-foreground mt-4 text-3xl tracking-tight lg:text-4xl">
            Built on expertise, proven with clients.
          </h2>

          <ul className="text-foreground-secondary mt-6 flex max-w-3xl flex-col gap-3 text-base lg:text-lg">
            {QUALITATIVE_POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="text-accent shrink-0">
                  /
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/*
            Stat strip -- one bordered row, divided (not gridded into cards)
            by `divide-x`/`border-divider`. Value in `font-rinter` per the
            locked trio's "Big heading and numbers: Rinter" rule (2026-08-07
            -- was `font-mono`/Geist Mono under the earlier industrial-
            brutalist-ui telemetry treatment); the sub-label underneath it
            stays `font-mono` -- it's a caption, not a number, and doesn't
            fit any of the trio's three categories. Only one entry currently
            populates `STATS` (see docblock).
          */}
          <div className="border-divider divide-divider mt-10 grid grid-cols-1 divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-14">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 py-6 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0"
              >
                <span className="font-rinter text-foreground text-4xl tracking-tight lg:text-5xl">
                  {stat.value}
                </span>
                <span className="text-foreground-muted font-mono text-xs font-medium tracking-[0.2em] uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
