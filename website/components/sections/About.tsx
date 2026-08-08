"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardSwap, { Card } from "@/components/ui/CardSwap";
import { RequirementCard } from "@/components/ui/RequirementCard";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import { INQUIRY_CARDS } from "@/constants/inquiries";

// `as const` preserves the "easeOut" literal type Framer Motion's Transition
// expects -- same reasoning as Hero.tsx's `item` variant.
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Purpose: the homepage's "About Preview" section -- introduces the company
 * and why it exists, directly beneath Hero. Client's own critique of the
 * live site's equivalent section (Docs/Mythoughts.md, "C) About Preview
 * Section") drives the base content decisions (heading "Who We Are" not the
 * company name, one tightened paragraph, "Since 2011" as a quiet inline
 * stat) -- see prior revisions in claudeContextExchange.md for that history.
 *
 * REVISION HISTORY (crop treatment) -- went through many iterations, each
 * per explicit, direct client feedback, kept here so the next session
 * doesn't re-litigate settled ground:
 *   1-6. Various `overflow-hidden` crop box sizes/positions/anchors --
 *      repeatedly cropped INTO the avatar/message content itself, not just
 *      the card's edges, which the client correctly flagged each time.
 *   7. Client supplied a reference image (website/inspirations/Screenshot
 *      2026-08-07 200118.png -- reactbits.dev's own CardSwap demo). Misread
 *      as "remove the box entirely" -- wrong, per immediate correction
 *      ("where is the box"). The reference was about the CARD styling
 *      (rounded corners, clean readable content), not the container.
 *   8. Box restored, but deliberately NOT `overflow-hidden` (sized to try
 *      to contain the full animated stack instead) -- wrong tradeoff, per
 *      direct correction: "the goal is not to show entire up and down
 *      swipe of the card... if the card gets unvisible from right and
 *      bottom its ok."
 *   9. THIS VERSION -- the actual, now-explicit requirement: `overflow-
 *      hidden` IS correct, cropping the right/bottom of the card IS fine,
 *      as long as the CORE content (avatar, role, subject, message) stays
 *      fully visible. That's exactly what `anchor="top-left"` +
 *      `overflow-hidden` gives -- the same mechanism attempt #5 used, this
 *      time understood as the actual goal rather than something to
 *      eliminate. Box height matches the text column's own rendered height
 *      via `lg:items-stretch` + `h-full` (top aligns with "Who We Are",
 *      bottom originally calibrated against "Since 2011 / One partner for
 *      all of it." before the latter moved into the box itself -- see
 *      CLOSING CAPTION below -- now just "Since 2011"; height math is
 *      still driven by the text column's real rendered height either way,
 *      so this wasn't re-verified as a fixed number, just noted as no
 *      longer literally matching this sentence). The skewY-offset compensation
 *      (see components/ui/CardSwap.tsx's docblock) lives on an inner
 *      wrapper, not this box, so the box's own border position stays fixed
 *      while only the content inside shifts -- getting that sign backwards
 *      once already cost real time earlier in this build; recompute
 *      whenever card width changes -- at width=560 (current, see below):
 *      (560/2)*tan(4deg) ~= 19.6px, `mt-6` (+24px) leaves a small buffer.
 *      `rounded-xl` on `RequirementCard` (from attempt #7) is kept -- that
 *      part of the reference match was correct and never in
 *      question.
 *
 * CARD CONTENT -- `RequirementCard` (components/ui/RequirementCard.tsx):
 * avatar + role/subject header row, divider, envelope icon + message row.
 * See that component's own docblock for its full provenance -- it started
 * from a ready-made design the client supplied directly, adapted to this
 * project's actual tokens/icon-system/corner-radius conventions rather than
 * adopted verbatim. Content itself comes from `INQUIRY_CARDS`
 * (constants/inquiries.ts) -- see that file's docblock for the full
 * content-honesty reasoning (role labels, not fabricated specific names;
 * illustrative inquiries, not claimed testimonials; subject lines reuse
 * SERVICE_PILLARS verbatim) and the avatar-licensing/provenance reasoning
 * (DiceBear, generated locally via @dicebear/core + @dicebear/personas --
 * CC0 design license, NOT their hosted non-commercial-only HTTP API, and
 * NOT real people's photos -- that file's docblock has the full "realistic
 * vibe" request and why real Unsplash headshots were declined for it).
 *
 * CLOSING CAPTION (REVISED 2026-08-08): "One partner for all of it." no
 * longer sits in the text column -- moved into the card-stack box itself
 * (top-left, lime `text-accent`, plain weight -- see that div's own
 * docblock below) per direct client request, then the text-column copy of
 * it removed on a same-day follow-up once it existed in both places ("keep
 * only Since 2011" in that row). Still a static line, not part of the card
 * rotation, and still ties the four rotating inquiry types back to Hero's
 * own "One partner. Not multiple vendors." line -- only WHERE it sits on
 * the page changed, not its purpose.
 *
 * CONTAINER/BACKGROUND RULE: background unchanged -- `bg-background`,
 * matching the page (both are the same pure black post-unification, see
 * app/globals.css). Inner content is still `PANEL_CONTAINER_NESTED`
 * (1280px, unchanged width from the old `PANEL_CONTAINER`). What's new
 * (2026-08-08, see constants/layout.ts's "RAILS MADE CONTINUOUS" note): an
 * outer `DASHBOARD_CONTAINER` + `border-x border-border` wrapper now sits
 * between this section and that inner content, purely so this section's
 * side rails line up with Hero/WhyLyftek/Footer's above and below it --
 * this section still isn't a boxed `bg-panel` dashboard panel itself, only
 * its rails now run continuous with the ones that are.
 *
 * MOTION: text still gets the one-time `whileInView` fade-up. CardSwap's
 * own swap animation is continuous/interval-driven by design (see that
 * component's docblock) and, like Hero's Threads background, has no
 * built-in `prefers-reduced-motion` handling of its own -- a known,
 * consistent gap across both React Bits components used on this site, not
 * an oversight specific to this file.
 */
export function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    // 2026-08-07: border-t moved from motion.div (PANEL_CONTAINER-width) to
    // this outer full-width section -- full-page audit after the client
    // flagged inconsistent line widths across sections.
    //
    // REVERSED 2026-08-08 (direct client feedback: "section break
    // boundaries are outside of the left and right box boundaries... entire
    // boxy vibe is cracked"): moving border-t here is exactly what caused
    // that crack, once About also grew `border-x` rails (same session, see
    // constants/layout.ts's "RAILS MADE CONTINUOUS" note) -- a full-width
    // border-t and an inset border-x are two different elements at two
    // different widths, so the horizontal line ran past the vertical rails
    // instead of meeting them at a corner. Fix: border-t moves onto the
    // SAME `border-border`/DASHBOARD_CONTAINER div as the rails (below),
    // dropping the separate `border-divider` token in favor of the rails'
    // own `border-border` so the two edges are the same color too, not just
    // the same width. `relative` stays on the outer section (unrelated to
    // the border, still needed for whatever's positioned against it).
    <section className="bg-background relative">
      <div
        className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}
      >
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className={`grid grid-cols-1 gap-16 px-6 py-24 md:px-8 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
        >
        <div className="flex max-w-xl flex-col gap-6">
          <div className="flex items-center gap-2">
            <span aria-hidden className="bg-accent h-2 w-2 shrink-0" />
            <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
              Who We Are
            </p>
          </div>

          {/*
            2026-08-07, direct client request ("replace this with rinter
            format"): this heading was the FIRST swapped from the sitewide
            `font-heading` (IBM Plex Sans, since fully retired) to
            `font-rinter` (self-hosted, see app/layout.tsx + app/globals.css
            docblocks) -- originally scoped to just this one element, now
            the sitewide treatment for every big heading per the later
            "throughout" trio instruction. `font-semibold` dropped: Rinter
            only has a Regular (400) weight file, so keeping a bold utility
            here would just trigger the browser's synthetic-bold fallback
            instead of an actually-designed bold cut.
          */}
          <h2 className="font-rinter text-foreground text-3xl tracking-tight sm:text-4xl">
            An enterprise technology partner, not another vendor to manage.
          </h2>
          <p className="text-foreground-secondary text-lg leading-relaxed">
            Lyftek works with enterprise teams on custom software, AI and
            generative AI, automation, cloud, and cybersecurity -- as one
            partner across the full engagement, not a rotating list of
            specialists. That consistency is what lets a CIO or operations
            lead move from a business problem to a working system without
            coordinating five different vendors along the way.
          </p>
          {/*
            2026-08-08, direct client request: "One partner for all of it."
            removed from this row -- it now lives inside the card-stack box
            instead (lime-accented, top-left, see that div below), and
            having it in both places read as duplicated copy rather than a
            deliberate second mention. `Since 2011` stays here alone; the
            divider + second `<p>` it used to separate are gone with it
            (nothing left to divide).
          */}
          <p className="text-foreground-muted font-mono text-sm tracking-wide">
            Since 2011
          </p>
        </div>

        {/*
          Visible `bg-panel` + `border-border` box, sized generously to
          actually contain the stack -- measured its real rendered extent
          via getBoundingClientRect (498x413px at default settings, plus
          the stack drifts as cards animate) rather than guessing.
          `overflow-hidden` crops the right/bottom of every card --
          confirmed acceptable by the client (see docblock revision #9) as
          long as the core content (avatar/role/subject/message) stays
          fully visible, which `anchor="top-left"` protects.

          Box height: `h-[380px]` fallback below `lg:` (single-column
          stack, no row to stretch against), `lg:h-full` at `lg:`+ where
          the grid row's `items-stretch` makes this cell's height equal the
          text column's own height automatically.

          Box WIDTH increased (320 -> 460) per direct client request
          ("increase the width of the card from left, let it go closer to
          the text part on the left, no problem"). The box is right-aligned
          in its grid cell (`lg:justify-end`), so growing its width extends
          it LEFTWARD, toward the text column -- exactly the requested
          direction, no repositioning needed. Card width bumped to match
          (420 -> 500 -> 560, still slightly wider than the box so the
          right edge still crops a little, consistent with "if it gets
          unvisible from right... its ok"). Widened again per direct
          follow-up ("increase the width more close to the text") --
          measured the actual available gap (text column's right edge to
          box's left edge) via getBoundingClientRect first (180px at this
          viewport) rather than guessing how much room existed, then used
          most of it, leaving a small buffer rather than the two literally
          touching.

          Card HEIGHT increased (280 -> 340) per the same follow-up ("pull
          those cards down... let the downward part of the cards be
          blocked, no issue"): the box's height is dynamic (matches the
          text column via `h-full`, see below) and was measured taller than
          the front card's own height, leaving empty box space below the
          card with nothing filling it. A taller card closes that gap --
          and if the box is shorter than the card at some viewport, the
          card's own bottom is what crops instead, which is explicitly
          acceptable per the client's own instruction.

          `dropDistance={110}` (CardSwap's own upstream default is 500) --
          with `overflow-hidden` back, the drop animation is simply cropped
          like everything else that exceeds the box, so this is no longer
          strictly required for correctness -- kept anyway so the drop
          doesn't travel absurdly far past a relatively small, cropped box.

          REAL BUG FOUND AND FIXED: the box previously used a single fixed
          `w-[560px]` at every breakpoint. Because its parent
          (`flex justify-center`) makes this box a flex ITEM, and flex items
          default to `flex-shrink: 1`, that fixed width was silently
          overridden and squished down at narrow viewports regardless of
          the declared value -- confirmed via getBoundingClientRect at a
          390px viewport: the box rendered at 295px wide, not 560px,
          visibly distorting the whole card stack. `shrink-0` plus actual
          responsive width classes (380px capped at mobile, the full 560px
          only from `lg:` up) fixes this properly -- not just adding
          `shrink-0` to a still-oversized-for-mobile box, which would trade
          "squished" for "overflowing/clipped by the viewport" instead.
        */}
        {/*
          Card height 340 -> 440: the box's height is dynamic (`h-full`,
          matches the text column), and the text column's own height
          changes with viewport width (more line-wrapping at narrower
          widths within the `lg:` range) -- a fixed card height that looked
          fine at one width left a real gap at others. Measured across the
          actual `lg:`-active range (1024px, the exact breakpoint boundary,
          is the worst case: box height 462px) rather than checking only
          one viewport -- at height=340 that left a 74px gap below the
          card; at height=440 the card's own skewed bounding height
          (440 + 560*tan(4deg) ~= 479px) comfortably exceeds even that
          worst-case box height, so there's no gap at any width from
          1024px up. Below `lg:` the box reverts to a fixed 380px and the
          taller card simply overflows/crops more there too, which is
          already an accepted tradeoff (see the crop-treatment revision
          history above).
        */}
        {/*
          2026-08-07 follow-up (direct client instruction, "take the cards
          down... shift the cards downward" + "reduce the width of the card
          from left"): box/card width taken down 560 -> 460, vertical offset
          `mt-6` -> `mt-16`.

          Same day, correction ("not the width of the box, only the width of
          the CARD must increase... let there be a gap between the left edge
          of the card and the left inner edge of the box"): box width reset
          to 460 (unchanged from the "take down" step above) and decoupled
          from the card's own width.

          First attempt at the gap used `pl-10` (padding) on the CardSwap's
          positioned ancestor -- wrong, no visible gap: CardSwap's
          `top-left` anchor is `absolute left-0`, and an absolutely
          positioned element's containing block is its ancestor's PADDING
          box, whose left edge sits at the ancestor's own border/padding
          boundary, so the ancestor's own padding never shifts it.

          Second attempt used `ml-10` (margin) on that same ancestor --
          this DID move the card (confirmed via screenshot), but per direct
          follow-up correction, moving the card at all was the wrong
          approach: "the cards would be as it is, just stretch the outer
          box from left, that would create a gap between box boundary and
          card boundary." I.e. leave the card's own position/size exactly
          as it was pre-gap-fiddling (flush top-left, `width={560}`, no
          margin), and instead decouple the box from the card region
          entirely: the card-holding div now has a FIXED width (460px,
          the box's own pre-gap width -- this preserves the card's exact
          prior look/crop, nothing about it changed) and is pinned to the
          RIGHT edge of the (now wider) outer box via an added `flex
          justify-end` wrapper. The outer box grew (460 -> 600), its own
          right edge already fixed by the outer `lg:justify-end`, so the
          new width is added entirely on the LEFT -- and because the fixed-
          width card region stays pinned to the box's right edge, that new
          left-side space shows up as empty box interior: the gap that was
          asked for, with the card itself completely untouched.
        */}
        {/*
          2026-08-07, later follow-up ("everything as it is locked in, only
          increase height of the box from top"): everything above this
          comment is untouched. Box height grown upward only: `lg:h-full`
          (100% of the flex parent, i.e. flush with the stretched grid row
          on both edges) -> `lg:h-[calc(100%+4rem)]` plus `lg:-mt-16`
          (-4rem). The extra 4rem is added to the height AND removed from
          the top via matching negative margin, so the BOTTOM edge stays
          exactly where the grid row already put it (unchanged) while the
          TOP edge rises by 4rem -- the same "grow from one edge, other
          edge fixed" mechanism already used for the box's width (right
          edge fixed via `lg:justify-end`, width added on the left).
        */}
        {/*
          2026-08-07, later still ("shift the stack of cards slightly to
          the left" + "pull the stack of the card downward vertically"):
          both applied to the fixed-width card region div only (the one
          right below), nothing above this comment touched. `mr-6` on that
          div nudges it left, off the box's right edge, inside the parent's
          `justify-end` flex (mirrors the same box-width mechanism -- adding
          margin on the *end* side moves the item away from that edge).
          `mt-16` -> `mt-24` pulls the stack further down, same mechanism
          as the earlier `mt-6` -> `mt-16` step.

          2026-08-07, further follow-up ("shift the card downward more
          vertically"): `mt-24` -> `mt-32`, same div, same mechanism, no
          other change.
        */}
        <div className="flex justify-center lg:justify-end">
          {/*
            2026-08-08, senior QA pass, second real bug found the same way
            as the inner card region above: `lg:w-[600px]` (fixed,
            unconditional) was tuned against wide-desktop column widths
            (~614px+ at 1440px, where 600 comfortably fits with room to
            spare) but this box's actual grid column shrinks to ~424px
            right at the `lg:` breakpoint boundary (1024px) -- since this
            box has no `min-width:0`/shrink safety and no cap of its own at
            that size, it rendered at the full 600px regardless, overflowing
            straight through the text column next to it (confirmed via
            screenshot at 1024px: heading/paragraph text visibly cut off
            behind the box). `lg:w-full lg:max-w-[600px]` resolves to
            `min(actual column width, 600px)` -- shrinks to fit the real
            column at 1024px, and lands on exactly the original fixed
            600px once the column is wide enough to hold it (1440px and up),
            so nothing changes at the viewport this was originally tuned
            for.
          */}
          <div className="bg-panel border-border relative h-[380px] w-full max-w-[380px] shrink-0 overflow-hidden border lg:-mt-16 lg:h-[calc(100%+4rem)] lg:w-full lg:max-w-[600px]">
            {/*
              2026-08-08, direct client request: "One partner for all of
              it." added a second time, inside this box, lime-accented --
              the text column (above) still carries the original per the
              CLOSING CAPTION note in this file's docblock; this is a
              distinct, deliberate restatement stamped onto the visual box
              itself (like a caption on the artifact it's describing), not
              a duplicate-by-mistake. Placed top-left, above where the card
              region starts (that region is pushed down via `mt-32` below),
              so this sits in the empty space above the card rather than
              competing with it. Plain weight, plain (non-mono, non-
              tracked-out) text per direct follow-up correction -- "no
              weight, normal text" -- this is NOT another eyebrow label
              (those are `font-martian-mono` + uppercase + tracking-wide +
              semibold sitewide); it's a quiet, regular-weight caption, with
              `text-accent` (lime) as the only thing marking it as
              deliberate. `z-10` keeps it above CardSwap's own stack (which
              has no explicit z-index of its own but paints later in DOM
              order without it).
            */}
            <p className="text-accent absolute top-6 left-6 z-10 text-sm font-normal">
              One partner for all of it.
            </p>
            <div className="flex h-full w-full justify-end">
              {/*
                2026-08-08, senior QA pass: `w-[460px]` (fixed, unconditional)
                was overflowing the box's own responsive width below `lg:`
                (`max-w-[380px]` there vs. this region's fixed 460px) --
                since this region is right-pinned via the parent's
                `justify-end`, that 80px overflow bled off the box's LEFT
                edge instead of the intended right/bottom decorative crop,
                clipping real content (role labels, message text) at every
                viewport between mobile and `lg:` (confirmed via screenshot
                at 768px). `w-full max-w-[460px]` resolves to
                `min(container width, 460px)` -- at `lg:`+ the container is
                600px, so this still evaluates to the original fixed 460px
                (zero visual change there, `justify-end` still pins it right
                with the same empty-gap-on-the-left effect the box-width
                history above this comment describes); below `lg:` it now
                shrinks to fit the box's own actual width instead of
                overflowing it.
              */}
              <div className="relative mt-32 mr-6 h-full w-full max-w-[460px] shrink-0">
                <CardSwap
                  width={560}
                  height={440}
                  cardDistance={50}
                  verticalDistance={56}
                  skewAmount={4}
                  delay={4000}
                  dropDistance={110}
                  pauseOnHover
                  anchor="top-left"
                >
                  {INQUIRY_CARDS.map((inquiry) => (
                    <Card key={inquiry.subject}>
                      <RequirementCard data={inquiry} />
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
