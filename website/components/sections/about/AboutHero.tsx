"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { AboutHeroIllustration } from "./AboutHeroIllustration";

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
 * - Matches Home Hero's `min-h-[calc(100svh-4rem)]` + `justify-center` +
 *   `py-16 lg:py-20` sizing (2026-08-09 client follow-up: this panel's
 *   earlier `py-32 lg:py-40` fixed padding read visibly taller than the
 *   homepage hero, breaking the "consistent view" between pages). Same
 *   4rem offset for the same reason as Home Hero (Navbar's real in-flow
 *   `h-16`), same floor padding rather than a fixed push. The right-column
 *   illustration centers against the text block vertically via the
 *   grid's own `items-center` (below), so both columns land mid-panel
 *   together -- a same-day-earlier `items-stretch` + `h-full` attempt
 *   made the art stretch to the text column's full height, which read as
 *   oversized/dominant against it (client, 2026-08-10: "current size is
 *   too much... must suit the section"); reverted to a capped,
 *   content-sized `max-w-md`/`xl:max-w-lg` in step with the earlier
 *   `IsometricPeople` treatment.
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
 * RIGHT-COLUMN VISUAL -- HISTORY: a first attempt (`LogoScene`, since
 * deleted) rendered the Lyftek mark as a 3D object on an isometric grid
 * with two abstract figures. Went through two full rebuilds same day and
 * was pulled entirely per client instruction (2026-08-08): "remove that
 * entirely dump it will do that later." Later ("that later") the client
 * supplied a real asset -- first `IsometricPeople` (from
 * assets/about_us_isometric_people_outline.svg, a hand-rebuilt vector,
 * see that component's own extensive docblock/git history if it's ever
 * needed again), then two same-day (2026-08-10) supersessions: first
 * assets/about_us_exact_svg_code.svg, which turned out to be a flattened
 * PNG wrapped in an SVG shell (no path data at all -- client caught this:
 * "that is still an image did you really hard code that svg?"), then
 * finally assets/about_us_true_vector_editable.svg -- genuine editable
 * vector, 128 real `<path>` elements, which is what's actually in
 * `AboutHeroIllustration.tsx` now.
 *
 * RENDERED AS AN INLINE SVG COMPONENT (`AboutHeroIllustration.tsx`, not
 * `<img>`/`next/image`/a CSS `mask-image` on a plain div), same shape
 * `IsometricPeople` used. Unlike that raster-mask detour, this is real
 * hard-coded geometry -- the source paths hoisted straight into JSX, no
 * `<image>`/base64/mask anywhere. `currentColor`/`text-foreground` is
 * just `stroke="currentColor"` on the parent `<g>` (the source is stroke
 * art, not filled regions, so no mask indirection is needed at all).
 *
 * SIZING/POSITION: `lg:max-w-sm xl:max-w-md` + `h-auto` on this wrapper --
 * capped to a size that reads as a companion visual next to the copy
 * column, not a competing full-height block (see the `items-center` note
 * above for why the earlier full-height version was reverted). Went
 * through two more size passes the same session: `max-w-md`/`max-w-lg`
 * read too heavy next to the text column, `max-w-xs`/`max-w-sm` was then
 * bumped back up one notch per client follow-up ("increase its size
 * slightly"). Grid gap bumped to `lg:gap-16` (from `lg:gap-8`) to match
 * `About.tsx`'s own two-column split further down this same page (its
 * `gap-16`/`lg:gap-12`, the closest in-repo precedent for this kind of
 * text+visual split) -- and the wrapper's own `lg:mr-10 xl:mr-14` (from
 * `lg:mr-6`) pulls the illustration further off the section's right edge
 * so it reads centered in its own half rather than pinned to the
 * boundary, per the same follow-up ("move it slightly left").
 */
export function AboutHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <div className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center px-6 py-16 md:px-8 lg:py-20">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={container}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="flex flex-col items-start text-left">
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
              Every engagement starts with how your business actually runs,
              not a template we retrofit to fit. We build systems that are
              proprietary to your operations, not a shared platform everyone
              else is running too. That ownership is what keeps things
              moving when no one&apos;s watching: fewer vendors to
              coordinate, one team that stays accountable to what it built,
              and work designed to outlast the project that started it.
            </motion.p>
          </div>

          <motion.div
            variants={item}
            aria-hidden
            className="hidden justify-self-end lg:mr-10 lg:flex lg:w-full lg:max-w-sm xl:mr-14 xl:max-w-md"
          >
            <AboutHeroIllustration className="text-foreground h-auto w-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
