"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
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
 * Purpose: counts a stat value up from 0 to its real number once, the
 * moment it scrolls into view -- per direct client request ("live
 * counting animation of numbers"). Split out as its own component (not
 * inlined in the STATS.map below) so each of the 4 stats gets its own
 * independent `useInView` trigger/ref, which a single shared hook call
 * couldn't provide.
 *
 * Parses `value` (e.g. "350+") into a numeric target (350) and a suffix
 * ("+") via regex rather than storing them as separate fields on `Stat` --
 * keeps the `STATS` array itself simple, plain client-facing strings, with
 * no risk of the numeric/suffix pair drifting out of sync with the display
 * string.
 *
 * `once: true` on `useInView` -- this is a one-time entrance count-up, not
 * a looping/repeating animation; matches 13_MOTION_AND_ANIMATION.md's
 * "one-time entrance, then stillness" model already used for this
 * section's fade-up (`fadeUp` above). `useReducedMotion()` skips the tween
 * entirely and renders the final value immediately -- counting animations
 * are exactly the kind of motion `prefers-reduced-motion` exists for.
 */
function AnimatedStatValue({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

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
 * CONTENT-ACCURACY GATE (2026-08-07, resolved 2026-08-08) -- why this
 * originally shipped with only 1 of 4 live-site stats: the live site's
 * "Our Achievements" block animates 4 counters up from "0+" (Satisfied
 * Clients / Successful Projects / Team Strength / Years of Experience).
 * At the time, only "Years of Experience" had an observable, internally
 * consistent real value ("12+ Years" / "Since 2011" appears as STATIC text
 * in two separate places on the live site); the other three were JS-driven
 * counters with no static fallback markup, so their real final values had
 * never actually been observed -- inventing plausible-looking numbers for
 * them would have shipped fabricated data under the client's name. Resolved
 * 2026-08-08: the client supplied the other three figures directly (350+
 * Satisfied Clients, 550+ Successful Projects, 25+ Team Strength) -- `STATS`
 * now has all 4 entries, still not fabricated, just client-provided instead
 * of scraped off a mid-animation counter.
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

// 2026-08-08: extended from the single-entry array the content-accuracy
// gate note above describes -- the client supplied these three figures
// directly (Satisfied Clients / Successful Projects / Team Strength),
// resolving the exact "when the client confirms" condition that note was
// written for. Not fabricated -- client-provided data, same standard
// "Years of Experience" already met.
const STATS: Stat[] = [
  { value: "350+", label: "Satisfied Clients" },
  { value: "550+", label: "Successful Projects" },
  { value: "25+", label: "Team Strength" },
  { value: "12+", label: "Years of Experience" },
];

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
            Stat strip -- now 4 entries (2026-08-08, see docblock). Was one
            `divide-x`/`border-t` bordered row (worked fine for a single
            stat); switched to a plain gapped grid instead of trying to
            stretch `divide-x`/`divide-y` across a wrapping 2x2/1x4 layout,
            which produces broken-looking divider stubs at the wrap point.
            The bordered row's own `border-t` was removed entirely per
            direct client feedback (it collided with "12+").

            Follow-up, same day: the 4 stats now live inside ONE rectangle
            -- `border border-divider` (the same neutral grey as every
            other divider on the page, not the lime accent), `w-full` so
            it spans this panel's full content width, which already equals
            `DASHBOARD_CONTAINER` (Navbar's exact width -- this section's
            outer `bg-panel` div is already boxed to that same constant,
            see the docblock above). No internal partition lines between
            the 4 stats -- `gap-x-8 gap-y-10` alone provides the even
            spacing the client asked for, nothing dividing one stat from
            the next.
          */}
          <div className="border-divider mt-10 w-full border p-8 lg:mt-14 lg:p-10">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  {/*
                    2026-08-08, direct client request ("make those numbers
                    in a brand lime color with a live counting animation"):
                    text-foreground -> text-accent (the same lime token as
                    the eyebrow dot/"complexity." in Hero -- this site's one
                    brand accent color, not a new one), plain text ->
                    AnimatedStatValue (see that component's docblock above
                    for the count-up mechanics).
                  */}
                  <span className="font-rinter text-accent text-4xl tracking-tight lg:text-5xl">
                    <AnimatedStatValue value={stat.value} />
                  </span>
                  <span className="text-foreground-muted font-mono text-xs font-medium tracking-[0.2em] uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
