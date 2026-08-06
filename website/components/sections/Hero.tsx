"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DASHBOARD_CONTAINER } from "@/constants/layout";

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
 * Copy follows Docs/Mythoughts.md's Hero Section recommendations directly
 * (headline and subheadline are the client's own wording, not a paraphrase
 * -- see claudeContextExchange.md for the earlier draft that deviated from
 * this and why that was wrong).
 *
 * Layout: a wide (1440px) "dashboard" panel -- see DASHBOARD_CONTAINER --
 * the exact same width as Navbar's own box, so the panel's dark/grid
 * background is visible extending above and below the independently-
 * floating Navbar (Navbar is NOT fused to this panel; see Navbar.tsx's
 * docblock and app/page.tsx's negative-margin pull-up). No corner brackets
 * here -- that accent treatment belongs to Navbar only. Inner content uses
 * the same px-6/md:px-8 horizontal padding as Navbar's own inner row (not a
 * separately-centered narrower column), so the headline's left edge lines
 * up exactly with the "Lyftek" wordmark above it. Text is left-aligned, not
 * centered.
 *
 * Deliberately excludes:
 * - Background video: Mythoughts.md itself questions its value (Lyftek
 *   sells services, not a visual product) and recommends gradients/grid
 *   treatments instead -- which is what's below.
 * - The ISO certification badge: Mythoughts.md says move it into its own
 *   dedicated Trusted By / Certifications section, not keep any version of
 *   it in the hero. That section doesn't exist yet -- the badge is simply
 *   absent from the homepage until it's built, rather than left here in a
 *   softened form.
 * - Any illustration, mockup, or dashboard graphic: no real product
 *   screenshots or brand imagery exist yet. Fabricating a stand-in would
 *   misrepresent the product (04_VISUAL_LANGUAGE.md's warning against
 *   "generic marketing illustrations").
 * - Continuous/looping background motion: researched directly against
 *   Stripe/Vercel/Linear vs. IBM/Microsoft/Anthropic/Apple precedent.
 *   Continuous ambient motion (drifting gradients, particles) is a
 *   developer-tool/PLG-startup genre convention that signals "we move
 *   fast" -- the wrong register for a firm CTOs are vetting for a
 *   multi-year engagement. Static reads as stability; the one-time text
 *   entrance below carries the hero's entire motion budget, same logic
 *   Apple uses (motion as one-time polish, then stillness).
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className={`bg-panel relative overflow-hidden ${DASHBOARD_CONTAINER}`}
    >
      {/*
        Restrained background texture: a faint 64px grid (reads as
        "engineered", not decorative) fading out via a radial mask, plus a
        soft accent-tinted radial gradient behind the headline. Both are
        static -- no motion, no blurred glow orbs, which 04_VISUAL_LANGUAGE.md
        explicitly bans regardless of intensity. Implemented as inline
        styles rather than Tailwind arbitrary-value classes because encoding
        this much raw CSS in bracket syntax hurt readability more than the
        inline style costs -- see 17_CODING_STANDARDS.md's "avoid arbitrary
        values unless justified."
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-panel-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-panel-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at top, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, var(--color-accent-surface), transparent 60%)",
        }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={container}
        className="flex flex-col items-start px-6 pt-40 pb-16 text-left md:px-8 md:pt-44 md:pb-20 lg:pt-48 lg:pb-24"
      >
        <motion.p
          variants={item}
          className="text-foreground-muted font-mono text-xs font-medium tracking-[0.2em] uppercase"
        >
          Enterprise Technology Partner
        </motion.p>

        <motion.h1
          variants={item}
          className="font-heading text-foreground mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          We engineer businesses for the{" "}
          <span className="text-accent">AI era</span>.
        </motion.h1>

        <motion.p
          variants={item}
          className="text-foreground-secondary mt-6 max-w-2xl text-lg"
        >
          Custom software. AI. Automation. Cloud. Built for modern businesses.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button href="/contact" variant="primary">
            Book a Consultation
          </Button>
          <Button href="/services" variant="outline">
            Explore Our Services
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
