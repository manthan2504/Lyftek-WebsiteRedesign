"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import { SERVICE_PILLARS } from "@/constants/services";
import { cn } from "@/utils/cn";

/**
 * The service-card hover mesh's texture (see the reveal div in the render
 * below). Went through several rounds of direct client feedback, each one
 * a real, specific correction, not a guess re-applied blindly:
 *
 * 1. First version: a true checkerboard via two `linear-gradient`s --
 *    "it appears in a chess box type, can it be something in an
 *    inconsistent distorted pattern." Replaced with hand-placed
 *    (deterministic, not `Math.random()`) scattered squares instead.
 * 2. That scatter used `fill="currentColor"`, expecting it to inherit a
 *    `color: var(--color-accent)` style on the host div -- WRONG. An SVG
 *    referenced via `background-image: url(data:...)` renders as an
 *    isolated image resource; `currentColor` inside it does NOT inherit
 *    the host element's computed `color` and fell back to the SVG's own
 *    default (black) -- black squares on a black card, invisible by
 *    construction. This is what the client's "I cant see its not working"
 *    report actually was. Fixed by hardcoding the real accent hex
 *    (`#CDFC8A`, per 08_COLOR_SYSTEM.md) directly into `fill`.
 * 3. "The size of some squares is small and some is big, let it be
 *    consistent" -- unified every square to one size.
 * 4. "Make them connected at corners not far far away" -- grouped into
 *    diagonal chains where each square's corner exactly touches the next.
 * 5. THIS VERSION: "we want in that same chess board format only but
 *    distorted at some areas" -- back to an actual checkerboard as the
 *    base (round 1's instinct was right, "chess box" was the presentation
 *    problem, not the grid itself), generated programmatically
 *    (`buildMeshPattern` below) so most cells sit in perfect checkerboard
 *    alignment -- but a handful of specific cells (`DISTORTED_CELLS`) are
 *    deliberately nudged off-grid and resized, so the pattern reads as "a
 *    chessboard with localized glitches," not uniform, not fully random
 *    either. A regular checkerboard already has same-color cells meeting
 *    only at a single diagonal corner point, which happens to satisfy
 *    round 4's "connected at corners" for free.
 *
 * Built with a small generator function (not one more hand-typed rect
 * list) specifically because a REAL checkerboard needs many cells (8x8
 * grid = 32 filled squares) to actually read as a chessboard rather than a
 * sparse scatter -- typing that many rects by hand invites transcription
 * errors a loop can't make. `DISTORTED_CELLS` stays hand-authored and
 * small (5 cells) so the "distorted at SOME areas" scope stays deliberate
 * and reviewable, not the whole grid perturbed by a formula.
 *
 * Computed once at module scope (not inside the component/`.map`) --
 * string-building + `encodeURIComponent` only need to run once, not on
 * every render x every card.
 */
const MESH_GRID = { cell: 8, cols: 8, rows: 8 } as const;

// Cells (by [row, col]) that break the regular grid -- an offset (dx/dy, in
// SVG units) and/or a resized square, instead of sitting exactly on the
// checkerboard's own grid lines. Deliberately few and scattered, not
// clustered in one corner, so the "distortion" reads as several small
// glitches across the tile rather than one damaged region.
const DISTORTED_CELLS: Record<string, { dx?: number; dy?: number; size?: number }> = {
  "1,3": { dx: 2, dy: -1, size: 10 },
  "2,6": { dx: -2, dy: 2 },
  "4,1": { size: 5, dx: 1 },
  "5,4": { dx: -3, dy: 1, size: 9 },
  "6,7": { dx: 2, size: 6 },
};

function buildMeshPattern(): string {
  const { cell, cols, rows } = MESH_GRID;
  const rects: string[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Checkerboard condition -- only every other cell is filled.
      if ((row + col) % 2 !== 0) continue;

      const distortion = DISTORTED_CELLS[`${row},${col}`];
      const size = distortion?.size ?? cell;
      const x = col * cell + (distortion?.dx ?? 0);
      const y = row * cell + (distortion?.dy ?? 0);
      // Deterministic (position-derived, not random) opacity variation so
      // the mesh has some depth rather than every square reading identical.
      const opacity = (0.15 + ((row * cols + col) % 5) * 0.08).toFixed(2);

      rects.push(
        `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#CDFC8A" fill-opacity="${opacity}"/>`,
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MESH_GRID.cols * MESH_GRID.cell}" height="${MESH_GRID.rows * MESH_GRID.cell}">${rects.join("")}</svg>`;
}

const MESH_PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(buildMeshPattern())}")`;

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
 * (mobile) to 2 (`sm`) to 3 (`lg`, 2 full rows for the current 6 pillars),
 * and each layout needs a different divider position. 2026-08-08: was a
 * 4-column single-row `lg:` layout when there were exactly 4 pillars;
 * revised to 3 columns/2 rows when the client extended `SERVICE_PILLARS`
 * to 6 items (see constants/services.ts) -- generalized against `total`
 * rather than hardcoded for a specific count, so a future pillar-count
 * change doesn't require re-deriving this function again.
 *
 * Every breakpoint explicitly sets BOTH the "on" and "off" state for each
 * border property (`sm:border-r` AND `sm:border-r-0`, never just the
 * "on" case) -- Tailwind's responsive variants are min-width-based, so an
 * `sm:border-r` left unset at `lg:` would otherwise still apply at `lg:`
 * widths (nothing overrides it), even though `sm:` and `lg:` use
 * different column counts and column groupings.
 */
function pillarBorderClasses(index: number, total: number) {
  const isLastOverall = index === total - 1;

  const SM_COLS = 2;
  const smCol = index % SM_COLS;
  const smRow = Math.floor(index / SM_COLS);
  const smLastRow = Math.floor((total - 1) / SM_COLS);

  const LG_COLS = 4;
  const lgCol = index % LG_COLS;
  const lgRow = Math.floor(index / LG_COLS);
  const lgLastRow = Math.floor((total - 1) / LG_COLS);

  return cn(
    // Mobile: single column, horizontal dividers between every row.
    isLastOverall ? "border-b-0" : "border-b",
    // `sm`: 2 columns -- vertical divider on the left column, horizontal
    // divider between rows except the final row.
    smCol === 0 ? "sm:border-r" : "sm:border-r-0",
    smRow === smLastRow ? "sm:border-b-0" : "sm:border-b",
    // `lg`: 4 columns -- vertical dividers between columns, horizontal
    // divider between rows except the final row. Back to 4 (was 3,
    // briefly, for the 6-item placeholder list) now that the real 8-item
    // catalog landed -- 2 rows of 4, generalized against `total` same as
    // before so this doesn't need re-deriving again if the count changes.
    lgCol !== LG_COLS - 1 ? "lg:border-r" : "lg:border-r-0",
    lgRow === lgLastRow ? "lg:border-b-0" : "lg:border-b",
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
 * Footer's/Navbar's own service-content source (see those files'
 * docblocks), so none of the three ever drift into different lists of
 * service names. All 8 real services, not a curated subset -- see
 * SERVICE_PILLARS's own docblock for when/why that changed from an earlier
 * 4-item consolidation.
 *
 * NO "VIEW ALL SERVICES" LINK (removed 2026-08-08, direct client decision):
 * this section used to end with a link to a standalone `/services` page --
 * that page was never actually built, and the client's call once asked
 * directly was that it didn't need to exist: "there is no need of a
 * separate services page, we already have that section at homepage." THIS
 * section already IS the complete list (all 8, not a curated preview), so
 * a "view all" link pointing at itself would have been redundant even
 * setting the dead-link problem aside. `id="services"` + `scroll-mt-16` on
 * the `<section>` below make this the actual anchor target for the top-nav
 * "Services" link and every individual service href instead (both changed
 * from `/services...` to `/#...` in constants/navigation.ts and
 * constants/services.ts).
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
 * Footer's `bg-panel`. Its inner content stays `PANEL_CONTAINER_NESTED`
 * width (1280px "Standard Content"), not `bg-panel`-boxed like Hero.
 *
 * RAILS (2026-08-08, see constants/layout.ts's "RAILS MADE CONTINUOUS"
 * note): an outer `DASHBOARD_CONTAINER` + `border-x border-border` wrapper
 * now sits between the `<section>` and the `PANEL_CONTAINER_NESTED` content
 * div below, purely so this section's side rails run continuous with Hero/
 * WhyLyftek/Footer's above and below it on the page. This does NOT make it
 * a boxed `bg-panel` dashboard panel -- the background is still plain
 * `bg-background`, only the rails are now shared.
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
    // line sat flush against the eyebrow with zero gap.
    //
    // REVISED 2026-08-08 (same "cracked boxy vibe" fix as About.tsx -- see
    // that file's docblock): border-t moves again, this time onto the
    // border-x/DASHBOARD_CONTAINER rail div, so the horizontal and vertical
    // lines are the same element at the same width instead of a full-width
    // border-t meeting an inset border-x. The `py-24 lg:py-32` padding that
    // used to live on this outer `<section>` moves down with it -- border-t
    // needs padding INSIDE it (not on the section outside it) to keep the
    // original zero-gap fix from regressing.
    //
    // `id="services"` + `scroll-mt-16` added 2026-08-08: this section is
    // now the actual landing target for the top-nav "Services" link and
    // every individual service's own href (both changed from a dead
    // `/services` page to in-page anchors, see constants/navigation.ts +
    // constants/services.ts) -- `scroll-mt-16` (64px, matching Navbar's
    // real row height / NAVBAR_FOOTPRINT_PX) keeps the sticky Navbar from
    // covering the heading when the browser jumps here, same reasoning as
    // app/page.tsx's own `scroll-mt-16` on `<main>`.
    <section id="services" className="scroll-mt-16 bg-background">
      <div
        className={`border-border border-t border-x py-24 lg:py-32 ${DASHBOARD_CONTAINER}`}
      >
      <div className={`px-6 md:px-8 ${PANEL_CONTAINER_NESTED}`}>
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

            COPY REVISED 2026-08-08, direct client flag: "One partner, four
            disciplines." was accurate when SERVICE_PILLARS held the earlier
            4-item consolidation (see that file's own docblock) -- once it
            grew to the real 8-item catalog, the count in this headline went
            stale and started contradicting the 8 cards actually rendered
            below it. Replaced (client's pick among several options,
            following Docs/content_writing.md's "write multiple headline
            options" guidance) with a version that doesn't hardcode a count
            at all, so it can't drift out of sync again if the catalog size
            ever changes -- still closes on the same "one partner" idea
            Hero/About both use, per that doc's "flows naturally into the
            next section" principle.
          */}
          <motion.h2
            variants={item}
            className="font-rinter text-foreground mt-4 max-w-3xl text-3xl tracking-tight sm:text-4xl lg:max-w-none lg:text-5xl"
          >
            {/*
              2026-08-08, direct client request: forced two-line break
              instead of natural wrap -- same `<span className="block">`
              per-line technique Hero.tsx's own H1 uses, splitting exactly
              on the sentence boundary. `max-w-2xl` (672px) -- sized for
              the OLD single-run heading's natural wrap point -- was still
              narrower than the first line's own text at `lg:text-5xl`,
              so it kept wrapping a second time despite the manual split.
              `lg:max-w-none` removes the constraint at the width it
              actually mattered; `max-w-3xl` below `lg:` is just wide
              enough that neither line wraps again at the smaller sizes
              either.
            */}
            <span className="block">The full range of enterprise technology.</span>
            <span className="block">One partner to run it.</span>
          </motion.h2>

          <motion.div
            variants={item}
            className="border-border mt-14 grid grid-cols-1 border sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          >
            {SERVICE_PILLARS.map(
              ({ label, description, href, icon: ServiceIcon }, index) => (
                <a
                  key={href}
                  // `id` is the actual anchor TARGET (this card is what
                  // `href` -- and the Navbar mega-menu's matching entry --
                  // scroll to); `href.slice(2)` strips the leading `/#`
                  // that constants/services.ts's hrefs now carry. `href`
                  // itself pointing at this same card's own anchor is a
                  // no-op self-link when clicked directly here, which is
                  // harmless -- the meaningful use of `href` is everywhere
                  // ELSE it's read from (Navbar, ContactCTA's service
                  // select).
                  id={href.slice(2)}
                  href={href}
                  className={cn(
                    "group border-border focus-visible:ring-accent bg-background relative flex flex-col gap-4 overflow-hidden p-8 focus-visible:ring-2 focus-visible:outline-none lg:p-10",
                    pillarBorderClasses(index, SERVICE_PILLARS.length),
                  )}
                >
                  {/*
                    2026-08-08, direct client request, then refined after
                    direct follow-up feedback ("coming in one plane line
                    way and covering our text"). Two real bugs in the
                    first pass, both fixed here:

                    1. Animating `scale-y-0 -> scale-y-100` scales the
                       element's rendered background-image ALONG WITH it --
                       mid-transition, the checkerboard squares were
                       vertically stretched into a smeared flat band
                       instead of staying crisp squares. Fixed by animating
                       `translate-y-full -> translate-y-0` instead: a pure
                       position change, the pattern itself never distorts,
                       at any point in the transition.

                    2. `h-1/2` with a hard edge reached right into the
                       description text's line box. Fixed two ways: the
                       band is shorter now (`h-16 lg:h-20`, sized to sit
                       within the card's own bottom padding rather than
                       reaching up into the content), AND its top edge is
                       additionally softened with a `mask-image` fade so
                       even the shorter band dissolves into the background
                       before it reaches any text, rather than ending in a
                       hard line. Fade start point moved down (`black 40%`
                       -> `black 22%`, i.e. only the bottom ~22% stays
                       fully solid, fading out well before that) per
                       direct follow-up ("do that fading slightly more
                       early so the text content gets visible neatly") --
                       the description text sits closer to this band than
                       it looked at first pass, so the original 40% still
                       left a faint tail of squares behind the last line
                       of copy.

                    Squares (2026-08-08) went through a few rounds of
                    direct feedback -- "it appears in a chess box type,
                    can it be something in an inconsistent distorted
                    pattern," then "I cant see its not working" (a real
                    `currentColor`-in-background-image-SVG bug, since
                    fixed), then "the size of some squares is small and
                    some is big, let it be consistent." Current state:
                    irregular POSITIONS, uniform SIZE (6x6), hardcoded
                    `#CDFC8A` fill -- see `MESH_PATTERN_URL`'s own
                    docblock above for the full history and why each
                    property landed where it did.
                  */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 translate-y-full opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 lg:h-20"
                    style={{
                      backgroundImage: MESH_PATTERN_URL,
                      backgroundSize: "64px 64px",
                      maskImage: "linear-gradient(to top, black 22%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to top, black 22%, transparent 100%)",
                    }}
                  />

                  <div className="relative z-10 flex flex-col gap-4">
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
                  </div>
                </a>
              ),
            )}
          </motion.div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
