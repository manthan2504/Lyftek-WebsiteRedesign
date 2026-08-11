"use client";

import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
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
 * SIZING/POSITION: `lg:max-w-lg xl:max-w-xl` + `h-auto` on this wrapper,
 * centered in its own grid column via `justify-self-center` + `mx-auto`
 * (2026-08-10, client: "increase the size and align at center" -- prior
 * to this it was right-pinned via `justify-self-end` + `lg:mr-10 xl:mr-14`
 * at `max-w-sm`/`max-w-md`). This same request also reverted a same-day
 * detour into hand-editing the SVG's own geometry (tilting the isometric
 * block to better match the real logo) back to the client-supplied
 * source paths in `AboutHeroIllustration.tsx` -- the client wants THIS
 * illustration shown bigger and centered, not reshaped. Grid gap stays
 * `lg:gap-16` (matches `About.tsx`'s own two-column split further down
 * this same page).
 */
export function AboutHero() {
  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <div className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center px-6 py-16 md:px-8 lg:py-20">
        {/*
          `initial="hidden"` unconditionally -- NOT branched on
          `useReducedMotion()`, which is what caused a hydration mismatch
          here (this section was the one the error first surfaced on).
          Reduced motion is now handled sitewide by MotionProvider; see
          components/layout/motion-provider.tsx for the full reasoning.
        */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="flex flex-col items-start text-left">
            <motion.div variants={item}>
              <SectionEyebrow>Who We Are</SectionEyebrow>
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

          {/*
            `aria-hidden` sits on the illustration itself, NOT on this
            wrapper -- it used to wrap the whole column, which was fine while
            the column held only decoration, but the statement line below is
            real copy and has to stay in the accessibility tree.
          */}
          <motion.div
            variants={item}
            className="hidden justify-self-center lg:flex lg:w-full lg:max-w-lg lg:flex-col xl:max-w-xl"
          >
            {/*
              Client line: "Every project we take on is designed for
              long-term success." Reworded per Docs/content_writing.md --
              "long-term success" is exactly the vague promise that doc rules
              out, so the claim is made concrete with a time horizon a CTO
              actually budgets against. "years, not quarters" also keeps it
              off the same ground as the body paragraph's "work designed to
              outlast the project that started it", which otherwise says the
              same thing twice on one screen.

              Lime `text-accent` rather than a heading size: this is a
              supporting statement, so it should read under the H1 and the
              body paragraph in hierarchy and earn its emphasis from brand
              colour instead of scale.
            */}
            <p className="text-accent max-w-md text-base leading-relaxed">
              Every project we take on is built for years, not quarters.
            </p>

            {/*
              `mt-6` not `mt-12`: the drawn artwork starts ~4% below the top
              of its own viewBox (the block's peak sits at y=43 of 1151), so
              the box gap understates the gap you actually see. 24px of margin
              still leaves ~40px of visual clearance under the statement.
            */}
            <AboutHeroIllustration
              aria-hidden
              className="text-foreground mx-auto mt-6 h-auto w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
