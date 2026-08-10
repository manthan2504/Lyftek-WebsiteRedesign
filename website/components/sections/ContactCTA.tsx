"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Purpose: the CLOSING conversion section for pages whose primary content
 * is something else -- currently the homepage and /about. Replaces the live
 * site's "Quick Contact" block, which ran two redundant boxes ("Get a
 * Quote" / "Request a Call") ABOVE a separate, minimal 3-field form that
 * captured neither a business email nor what the visitor actually needed.
 * Per Docs/Mythoughts.md's explicit critique ("handle both through one
 * contact form") and the approved homepage section plan: ONE form, no
 * redundant boxes duplicating what the form itself does.
 *
 * NOT USED ON /contact (changed 2026-08-10): that page's redesign makes the
 * form its own primary content rather than a closing call-to-action, so it
 * renders `components/sections/contact/ContactSection.tsx` instead. Putting
 * this section there too would have meant two identical forms on one page.
 * The tone is also wrong for it -- "Let's build something together" is a
 * closing line for a visitor who came to read about services, not the
 * opening of a page they navigated to specifically to get in touch.
 *
 * FORM: renders the shared `ContactForm` (components/sections/ContactForm.tsx),
 * extracted from this file 2026-08-10 when /contact became its second
 * consumer -- see that file's docblock for the full reasoning and for the
 * still-stubbed submission contract.
 *
 * Heading ("Let's build something together") and the reassurance line are
 * deliberately consultative, not salesy -- 11_CONTENT_STRATEGY.md's CTA
 * guidance (prefer "Schedule a Consultation" register over "Buy Now"). The
 * reassurance copy echoes Hero's tone without repeating Hero's exact line
 * ("30 minutes. No sales pitch.") verbatim -- same register, a distinct
 * sentence, so the two don't read as a copy-paste of each other despite
 * appearing on the same page.
 *
 * EYEBROW (added 2026-08-10, direct client request): lime square +
 * `font-martian-mono` uppercase "Contact Us" label, the same opening
 * pattern every other section uses -- this was previously the only section
 * on either page missing it. Plain markup rather than its own `motion.div`
 * with a separate variant: unlike Hero/About/Services/WhyLyftek, this
 * section has no `staggerChildren` container (just one `fadeUp` on the
 * whole grid), so the h2/p below it aren't individually animated either.
 *
 * LAYOUT: split two-column at `lg:` -- eyebrow + heading + reassurance copy
 * on the left, the form on the right. No card/shadow box around the section
 * (04_VISUAL_LANGUAGE.md's anti-card-overuse guidance, same call
 * Services.tsx and About.tsx make).
 *
 * CONTAINER/BACKGROUND RULE: `bg-background`, matching the page itself --
 * NOT `bg-panel`. Inner content is `PANEL_CONTAINER_NESTED`-width.
 *
 * RAILS (2026-08-08, see constants/layout.ts's "RAILS MADE CONTINUOUS"
 * note): an outer `DASHBOARD_CONTAINER` + `border-x border-border` wrapper
 * sits between the `<section>` and the content div below, purely so this
 * section's side rails run continuous with Hero/WhyLyftek/Footer's above
 * and below it. Background stays plain `bg-background` -- this isn't a
 * boxed `bg-panel` dashboard panel, only the rails are shared.
 *
 * MOTION: one-time `whileInView` fade-up -- same pattern as About.tsx/
 * Services.tsx/WhyLyftek.tsx, not Hero's page-load stagger (this section
 * isn't visible on initial load) and not a continuous effect (this section
 * has no motion-budget exception the way Hero's Threads background does).
 */
export function ContactCTA() {
  return (
    // 2026-08-07: border-t moved to the section (which owns py-24/
    // lg:py-32) -- same fix as Services.tsx, same underlying bug: it was
    // on motion.div, which has no vertical padding of its own, so the line
    // sat flush against the heading with zero gap.
    //
    // REVISED 2026-08-08 (same "cracked boxy vibe" fix as About.tsx/
    // Services.tsx -- see About.tsx's docblock): border-t (and the py-24/
    // lg:py-32 padding it depends on to keep its gap) both move onto the
    // border-x/DASHBOARD_CONTAINER rail div, so the horizontal and vertical
    // lines are the same element at the same width.
    <section className="bg-background">
      <div
        className={`border-border border-t border-x py-24 lg:py-32 ${DASHBOARD_CONTAINER}`}
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
          className={`grid grid-cols-1 gap-12 px-6 md:px-8 lg:grid-cols-2 lg:gap-20 ${PANEL_CONTAINER_NESTED}`}
        >
          <div className="flex flex-col">
            <SectionEyebrow>Contact Us</SectionEyebrow>

            {/*
              2026-08-07, locked trio: font-heading -> font-rinter,
              font-semibold dropped (Regular-only face, see app/layout.tsx).
              Margins rather than a uniform `gap` on the parent, so the
              eyebrow->heading step is tighter than heading->body, matching
              how every other section paces this same three-line rhythm.
            */}
            <h2 className="font-rinter text-foreground mt-4 text-3xl tracking-tight sm:text-4xl">
              Let&apos;s build something together.
            </h2>
            <p className="text-foreground-secondary mt-6 max-w-md text-lg leading-relaxed">
              Tell us what you&apos;re working on. A senior engineer, not a
              sales rep, will get back to you with next steps.
            </p>
          </div>

          <div>
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
