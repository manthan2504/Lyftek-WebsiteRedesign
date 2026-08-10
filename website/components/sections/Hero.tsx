"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Threads } from "@/components/ui/Threads";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { useIsSoftwareRenderer } from "@/hooks/useIsSoftwareRenderer";
import { DASHBOARD_CONTAINER } from "@/constants/layout";

// Jade -- the same `--accent-hover` token introduced for the CTA's hover
// state earlier in this session (#0f9c7f), normalized to [0-1] floats for
// the WebGL shader. Kept as one shared secondary color across the button
// and the background rather than a third, unrelated color.
const THREADS_COLOR: [number, number, number] = [
  0.058823529411764705, 0.611764705882353, 0.4980392156862745,
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

// `as const` preserves the "easeOut" literal type Framer Motion's Transition
// expects -- without it, TypeScript widens `ease` to `string` and the
// variants prop no longer type-checks.
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Purpose: the first thing every visitor sees -- must communicate what
 * Lyftek does and why it can be trusted within a few seconds
 * (01_PROJECT_CONTEXT.md).
 *
 * Copy follows Docs/content_writing.md's principles and the client's
 * explicit direction: "Technology should remove complexity." is the bold
 * primary claim; "We engineer businesses for the AI era." (the client's
 * original headline from Mythoughts.md) is plain supporting text below it,
 * followed by a second line ("One partner. Not multiple vendors.") added
 * per content_writing.md's "speak to business outcomes rather than
 * technologies" principle -- a consolidation/simplicity value prop (a real
 * enterprise pain: coordinating multiple vendors), not a second restatement
 * of "we do AI," kept deliberately as short as the line above it, and
 * deliberately not naming a specific number (an earlier draft said "not
 * five vendors" -- the client asked for a general word instead). Single
 * CTA ("Talk to Our Team" +
 * "30 minutes. No sales pitch."), replacing two earlier competing CTAs.
 * See claudeContextExchange.md for the full content deliverable this
 * came from.
 *
 * STRUCTURE -- rebuilt to match fulcrumlabs.pro's actual hero technique
 * (studied directly via DOM/computed-style inspection, not guessed), not
 * the two-column side-by-side layout this section used previously:
 * - Single near-full-width text column (no grid split). Fulcrum's own text
 *   container is ~91% of its hero width; this section's DASHBOARD_CONTAINER
 *   math already lands in the same range without adjustment.
 * - Headline: uppercase, font-extrabold (800 via browser synthesis --
 *   Rinter only ships Regular), originally set in Switzer per the client's
 *   explicit direction after seeing Fulcrum's own 150px/800-weight/
 *   uppercase treatment, overriding an earlier draft that deliberately
 *   kept this mixed-case per 02_BRAND_GUIDELINES.md's "looks like an AI
 *   startup" litmus test. That guidance still stands as a general
 *   principle; this was a specific, explicit client override for this one
 *   headline, not a reversal of the principle itself. Switzer/IBM Plex
 *   Sans are now BOTH retired (2026-08-07) in favor of the locked
 *   Rinter/Martian Mono/Delight trio -- see app/layout.tsx's type-system
 *   docblock -- this headline uses `font-rinter` like every other big
 *   heading sitewide now, not a Hero-only exception anymore.
 * - Headline is 3 stacked lines ("Technology" / "should remove" /
 *   "complexity.") rather than wrapping naturally, per explicit client
 *   layout direction, with the illustration positioned beside the middle
 *   line / behind the third -- not Fulcrum's own far-right placement.
 * - Background: previously a static brand-mark illustration (HeroBackdrop,
 *   now removed) plus a static grid texture + radial gradient. Replaced,
 *   per explicit client direction, with an animated WebGL "Threads"
 *   background (components/ui/Threads.tsx, React Bits --
 *   14_DESIGN_AND_DEVELOPMENT_RESOURCES.md's preferred UI libraries list).
 *   This DELIBERATELY REVERSES the hero's earlier "complete staticcccc...
 *   nothing moving" decision from earlier in this engagement -- that
 *   reversal was surfaced and confirmed with the client before building it,
 *   not assumed. See Threads.tsx's own docblock for the reduced-motion
 *   handling, which this file gates (below).
 * - Per-character split-text entrance (which Fulcrum uses) was considered
 *   and rejected: 13_MOTION_AND_ANIMATION.md warns against motion that
 *   feels "exaggerated" or like a "cinematic intro," and per-glyph
 *   animation reads as a creative-agency signature move, not an enterprise
 *   consulting one. The existing element-level stagger (below) already
 *   satisfies the doc's "staggered typography" guidance at the right grain.
 *
 * Deliberately excludes:
 * - Background video: Mythoughts.md itself questions its value (Lyftek
 *   sells services, not a visual product) and recommends gradients/grid
 *   treatments instead -- which is what's below.
 * - The ISO certification badge: Mythoughts.md says move it into its own
 *   dedicated Trusted By / Certifications section, not keep any version of
 *   it in the hero. That section doesn't exist yet.
 * - Any product mockup, dashboard graphic, or screenshot: no real product
 *   screenshots exist yet. Fabricating a stand-in would misrepresent the
 *   product (04_VISUAL_LANGUAGE.md's warning against "generic marketing
 *   illustrations").
 * - Scroll-linked background motion specifically: Fulcrum's own hero
 *   illustration uses scroll-linked parallax, considered and rejected
 *   earlier in this engagement, and that rejection still stands -- the
 *   Threads background (see above) is continuous/ambient, not scroll-driven,
 *   which is a narrower, later, and separate decision from that one.
 *
 * MOTION BUDGET NOTE: with the Threads background now continuous rather
 * than static, this hero no longer follows the "one-time entrance, then
 * total stillness" model described in earlier session notes -- that was
 * accurate for the previous build, not the current one. The text stagger
 * below is unchanged; the background is the one exception to stillness now,
 * and it is skipped entirely under `prefers-reduced-motion` (see the
 * `showThreads` mount gate around the `<Threads>` render below -- still
 * skipped for the same reason, just deferred past hydration now).
 *
 * SIDE BORDERS (2026-08-08, direct client decision on a two-option senior-
 * UI/UX call): `border-x border-border` added to this panel. Navbar lost
 * its lime `CornerBrackets` and its shared width with this panel -- it's
 * now full-viewport-width chrome (see Navbar.tsx's own docblock) instead of
 * a boxed widget. To keep the "this is a bounded dashboard panel" cue alive
 * without Navbar around to establish it, this panel (and WhyLyftek/Footer,
 * the other two `DASHBOARD_CONTAINER` panels) now carries its own vertical
 * rails. Side-only, not a full `border` -- a full box outline plus corner
 * marks was explicitly rejected by the client on 2026-08-07 for WhyLyftek/
 * Footer (see those files' docblocks); rails alone are a narrower, more
 * minimal treatment than what was rejected then, not a reversal of that
 * decision.
 */
export function Hero() {
  /*
   * Mount gate for the WebGL background, added 2026-08-10 alongside the
   * sitewide hydration fix (components/layout/motion-provider.tsx).
   *
   * `<Threads>` is conditionally MOUNTED rather than animated, so
   * `MotionConfig` can't help here -- and this was the worst instance of
   * the bug: `useReducedMotion()` is `null` server-side, so the server
   * always rendered the wrapper div, while a reduced-motion client rendered
   * nothing. A missing/extra DOM node is a structural mismatch, which is
   * why the homepage threw the hard "Hydration failed... this tree will be
   * regenerated" error while /about only reported mismatched attributes.
   *
   * Deferring to a post-mount effect makes the server and the first client
   * render agree unconditionally (neither includes it), after which the
   * real preference decides. Nothing is lost by rendering it late: it is a
   * `aria-hidden` WebGL canvas that paints nothing until its own JS runs,
   * so it never had server-render value -- and keeping it out of first
   * paint means the headline is no longer racing a shader for LCP.
   *
   * The gate itself lives in `hooks/useHasHydrated.ts` -- WhyLyftek's stat
   * counter needs the same guard, which is exactly the "needed in more than
   * one component" bar that folder's README sets for extraction.
   *
   * REVISED TWICE on 2026-08-10 -- read this before "fixing" the missing
   * reduced-motion check, because its absence is deliberate:
   *
   * 1. The gate originally read `hasHydrated && !prefersReducedMotion`, so
   *    reduced-motion visitors got a flat black panel with no waves at all.
   * 2. Changed to always mount, with `animate={false}` under reduced motion
   *    (a frozen frame of the same shader) -- on the reasoning that
   *    `prefers-reduced-motion` asks to remove MOVEMENT, not artwork.
   * 3. **Current: no reduced-motion check at all.** The waves animate for
   *    every visitor.
   *
   * Step 3 is an EXPLICIT CLIENT DECISION (2026-08-10), taken with the
   * trade-off stated plainly, and it knowingly departs from
   * 13_MOTION_AND_ANIMATION.md ("support users who prefer reduced motion;
   * respect prefers-reduced-motion") and 99_GLOBAL_RULES.md ("accessibility
   * is mandatory; never sacrifice accessibility for aesthetics"). It is the
   * one documented exception to those rules on this site -- do not treat it
   * as licence to skip reduced-motion handling anywhere else, and do not
   * silently revert it either; it was asked for directly.
   *
   * Worth knowing what actually prompted it: the client reported the waves
   * "missing", which turned out to be their Windows Server dev VM shipping
   * with "Adjust for best performance" -- that disables UI animations, and
   * Chromium maps the flag straight to `prefers-reduced-motion: reduce`. So
   * the site had been behaving correctly and real visitors always saw the
   * animation; only that machine saw the frozen frame. The VM setting was
   * corrected as well, so this code change is belt-and-braces rather than
   * the actual fix for that symptom.
   *
   * `Threads` keeps its `animate` prop (see that file) even though nothing
   * passes it now -- it is a real capability and the route back if this
   * decision is ever reversed. Same "built, deliberately kept, currently
   * unused" status LyftekMark carries in 09_DESIGN_SYSTEM.md.
   */
  const hasHydrated = useHasHydrated();

  /*
   * Performance guard, added 2026-08-10 after the client reported the whole
   * site feeling laggy. Measured on their GPU-less VM, production build:
   * /about (no WebGL) ran at 60.0fps while this page ran at 2.2fps -- the
   * shader alone costing ~440ms per frame because there is no GPU and
   * Chromium falls back to SwiftShader, a CPU rasterizer.
   *
   * This is a CAPABILITY check, not a preference one. It does not undo the
   * client's decision to animate regardless of `prefers-reduced-motion`
   * (see the docblock above): anyone with a working GPU still gets the
   * continuous animation whatever their motion setting says. Only devices
   * that physically cannot draw it at speed fall back to a single static
   * frame of the same artwork -- which is what `Threads`' `animate` prop
   * was kept for.
   */
  const isSoftwareRenderer = useIsSoftwareRenderer();

  return (
    <section
      className={`bg-panel border-border relative overflow-hidden border-x ${DASHBOARD_CONTAINER}`}
    >
      {/*
        Threads (WebGL) replaces the old static grid + radial gradient, and
        animates continuously for EVERY visitor -- no `prefers-reduced-motion`
        branch, by explicit client decision. See the `hasHydrated` docblock
        above for the full history and the accessibility trade-off that was
        accepted; this is the site's one documented exception to
        13_MOTION_AND_ANIMATION.md.

        NO explicit z-index here (not `-z-10`) -- deliberately DOM-order
        stacking instead, same mechanism this file's old HeroBackdrop
        illustration relied on (see git history / claudeContextExchange.md).
        `<section>` doesn't itself establish a stacking context (no z-index
        of its own, only `position: relative`), so a negative z-index child
        can escape it and paint behind an ancestor further up the tree
        instead of just behind this section's own later siblings --
        confirmed this was actually happening (canvas present, correctly
        sized, WebGL context healthy, zero GL errors, but nothing visible)
        before switching to this. Rendered FIRST in the JSX, before the text
        block, so normal auto-z-index stacking puts it behind the text.
      */}
      {hasHydrated && (
        <div aria-hidden className="absolute inset-0">
          <Threads
            color={THREADS_COLOR}
            amplitude={1.1}
            distance={0}
            enableMouseInteraction={!isSoftwareRenderer}
            animate={!isSoftwareRenderer}
          />
        </div>
      )}

      {/*
        2026-08-08, direct client feedback: "at initial load user cant see
        the entire content completely," asking for vertical centering.
        Previous layout used large, asymmetric top padding (`pt-40`/`pt-44`/
        `pt-56`, far bigger than the `pb-*` below it) to push the text block
        down from the top -- on shorter viewports that pushed the CTA row
        ("Talk to Our Team" / "30 minutes. No sales pitch.") past the fold
        before any scrolling. Replaced with `justify-center` on a
        `min-h-[calc(100svh-4rem)]` box (svh, not vh, so mobile browsers'
        dynamic address-bar chrome doesn't miscalculate the height; `4rem`
        matches Navbar's real `h-16` row height / NAVBAR_FOOTPRINT_PX --
        Navbar is sticky, in-flow chrome now, not an overlay, so its height
        genuinely subtracts from the space left for Hero on first paint) so
        the whole content block centers in whatever vertical space is
        actually visible on load, with even `py-16`/`lg:py-20` padding as a
        floor rather than a fixed push. On tall content / short viewports
        this still grows past one screen rather than clipping anything --
        `min-h`, not a fixed `h`.
      */}
      <div className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center px-6 py-16 md:px-8 lg:py-20">

        {/*
          `initial="hidden"` unconditionally -- reduced motion is handled
          sitewide by MotionProvider now; branching it here per-section is
          what caused a hydration mismatch (see motion-provider.tsx). The
          Threads background above needs its own separate mount gate --
          MotionConfig can't fix a conditionally-mounted node.
        */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex flex-col items-start text-left"
        >
          <motion.div variants={item}>
            <SectionEyebrow>Enterprise Technology Partner</SectionEyebrow>
          </motion.div>

          {/*
            2026-08-07, direct client request ("lets apply it here as well
            but not with paid one, using CSS styling"): Switzer -> Rinter
            (`font-rinter`, see app/layout.tsx + app/globals.css
            docblocks). Rinter only has a free Regular (400) weight file --
            no 800/extrabold cut exists to buy or download -- so
            `font-extrabold` is kept as a CSS-only instruction rather than
            dropped (contrast the About heading, which dropped it
            entirely): with no 800-weight Rinter file loaded, the browser's
            own default `font-synthesis: weight` behavior algorithmically
            embolds the Regular glyphs to approximate the requested
            weight, which is exactly the "no paid weight, use CSS" outcome
            asked for here. (Nothing in this project's CSS disables
            `font-synthesis`, so this works without extra styling beyond
            the existing `font-extrabold` utility already on this
            element.)
          */}
          <motion.h1
            variants={item}
            className="font-rinter text-foreground mt-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl sm:leading-[1.05] lg:text-8xl lg:leading-[0.95] lg:tracking-tighter"
          >
            <span className="block uppercase">Technology</span>
            <span className="block uppercase">should remove</span>
            {/*
              Deliberately NOT uppercase like the two lines above -- the
              whole line is a shout ("TECHNOLOGY SHOULD REMOVE"); the answer
              shouldn't shout back. Lower-case + the accent color together
              read as the calm, quiet payoff to the loud problem statement,
              rather than just adding a third color-only emphasis on top of
              an already-maximal all-caps treatment.
            */}
            <span className="text-accent block">complexity.</span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start lg:mt-10 lg:gap-16"
          >
            {/*
              2026-08-07, direct client instruction (after confirming
              Delight's license): "delight we gonna use it for text
              like... normal texts on web." Switched from the sitewide
              `text-foreground-secondary` default (Public Sans, inherited
              via `font-sans`) to `font-delight` -- see app/layout.tsx +
              app/globals.css docblocks. Scoped to this one paragraph, not
              a sitewide body-copy change.
            */}
            <p className="text-foreground-secondary font-delight max-w-xl text-lg lg:max-w-2xl">
              We engineer businesses for the AI era.
              <br />
              One partner. Not multiple vendors.
            </p>
            <div className="flex flex-col items-start gap-3">
              <Button href="/contact" variant="primary">
                Talk to Our Team
              </Button>
              <p className="text-foreground-muted text-sm">
                30 minutes. No sales pitch.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
