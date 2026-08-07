"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { LyftekMark } from "@/components/ui/LyftekMark";
import { PANEL_CONTAINER } from "@/constants/layout";
import { SERVICE_PILLARS } from "@/constants/services";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

// Reuses SERVICE_PILLARS' own labels (constants/services.ts) rather than a
// second, hand-typed list -- the same "one source of truth" reasoning
// Footer.tsx and Services.tsx already apply to this data. "Something else"
// is appended because a consultative form shouldn't force a visitor whose
// need doesn't map cleanly onto one of the 4 pillars to pick a wrong answer.
const SERVICE_OPTIONS = [
  ...SERVICE_PILLARS.map((pillar) => ({
    label: pillar.label,
    value: pillar.label,
  })),
  { label: "Something else", value: "other" },
];

/**
 * Purpose: the homepage's closing conversion section -- replaces the live
 * site's "Quick Contact" block, which ran two redundant boxes ("Get a
 * Quote" / "Request a Call") ABOVE a separate, minimal 3-field form (Name /
 * Mobile / Message only) that didn't even capture what the visitor needed
 * or how to reach them by email. Per Docs/Mythoughts.md's explicit
 * critique ("handle both through one contact form" + add Company Name /
 * Business Email / Service Interested In) and the approved homepage section
 * plan: ONE form, no redundant boxes duplicating what the form itself does.
 *
 * Heading ("Let's Build Something Together") and the reassurance line are
 * deliberately consultative, not salesy -- 11_CONTENT_STRATEGY.md's CTA
 * guidance (prefer "Schedule a Consultation" register over "Buy Now"). The
 * reassurance copy echoes Hero's tone without repeating Hero's exact line
 * ("30 minutes. No sales pitch.") verbatim -- same register, a distinct
 * sentence, so the two don't read as a copy-paste of each other despite
 * appearing on the same page.
 *
 * FIELDS: Name, Business Email, Company Name, Service Interested In (a
 * Select sourced from SERVICE_PILLARS -- see SERVICE_OPTIONS above -- so
 * this dropdown and the Services/Footer sections can never list different
 * services), Message. Mobile Number is optional, kept because the live
 * site's audience (enterprise decision-makers scheduling a call) plausibly
 * still wants to leave a number, but no longer the primary/only contact
 * method the way the old form treated it.
 *
 * SUBMISSION: intentionally stubbed. Where this form should actually submit
 * to (transactional email service, CRM webhook, a Next.js Route Handler)
 * has not been decided -- flagged in the approved homepage section plan as
 * a technical dependency separate from the visual/content build, not
 * something to guess at here. `handleSubmit` prevents the native page
 * reload and flips local UI into a "message sent" confirmation state so the
 * form is interactively complete without a real network call; swap the body
 * of `handleSubmit` for a real request once the destination is decided --
 * no other part of this component needs to change.
 *
 * LAYOUT: split two-column at `lg:` -- heading/reassurance copy + a small,
 * muted `LyftekMark` on the left, the form on the right. No card/shadow
 * box around the section (04_VISUAL_LANGUAGE.md's anti-card-overuse
 * guidance, same call Services.tsx and About.tsx make). LyftekMark uses the
 * SAME muted-stroke override Footer.tsx and About.tsx use -- the component's
 * own default `strokeTop` (a deep teal, `--color-accent-foreground`) is
 * close to invisible against this site's dark backgrounds, a problem
 * already diagnosed once this engagement (see 08_COLOR_SYSTEM.md) and
 * consistently avoided here rather than reintroduced.
 *
 * CONTAINER/BACKGROUND RULE: `bg-background`, matching the page itself --
 * NOT `bg-panel`. Per the rule Footer.tsx's docblock establishes, only
 * sections whose background differs from the page need the boxed
 * `DASHBOARD_CONTAINER` treatment; this one stays full-width with inner
 * content constrained by `PANEL_CONTAINER` instead.
 *
 * MOTION: one-time `whileInView` fade-up, gated behind `useReducedMotion()`
 * -- same pattern as About.tsx/Services.tsx/WhyLyftek.tsx, not Hero's
 * page-load stagger (this section isn't visible on initial load) and not a
 * continuous effect (this section has no motion-budget exception the way
 * Hero's Threads background does).
 */
export function ContactCTA() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Stub -- see docblock. Real integration (email/CRM/Route Handler) is a
    // separate, undecided technical dependency.
    setIsSubmitted(true);
  }

  return (
    // 2026-08-07: border-t moved to the section (which owns py-24/
    // lg:py-32) -- same fix as Services.tsx, same underlying bug: it was
    // on motion.div, which has no vertical padding of its own, so the line
    // sat flush against the heading with zero gap.
    <section className="border-divider border-t bg-background py-24 lg:py-32">
      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className={`grid grid-cols-1 gap-12 px-6 md:px-8 lg:grid-cols-2 lg:gap-20 ${PANEL_CONTAINER}`}
      >
        <div className="flex flex-col gap-6">
          <LyftekMark
            aria-hidden
            className="h-10 w-10"
            strokeTop="var(--color-foreground-muted)"
            strokeBottom="var(--color-accent)"
            strokeWidth={7}
          />
          {/*
            2026-08-07, locked trio: font-heading -> font-rinter,
            font-semibold dropped (Regular-only face, see app/layout.tsx).
          */}
          <h2 className="font-rinter text-foreground text-3xl tracking-tight sm:text-4xl">
            Let&apos;s build something together.
          </h2>
          <p className="text-foreground-secondary max-w-md text-lg leading-relaxed">
            Tell us what you&apos;re working on. A senior engineer, not a
            sales rep, will get back to you with next steps.
          </p>
        </div>

        <div>
          {isSubmitted ? (
            <div
              role="status"
              className="border-border flex h-full flex-col justify-center gap-2 border p-8"
            >
              <p className="font-rinter text-foreground text-lg">
                Message sent.
              </p>
              <p className="text-foreground-muted text-sm">
                We&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Name" name="name" autoComplete="name" required />
                <Input
                  label="Business Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="Company Name"
                  name="company"
                  autoComplete="organization"
                  required
                />
                <Input
                  label="Mobile Number (optional)"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </div>
              <Select
                label="Service Interested In"
                name="service"
                options={SERVICE_OPTIONS}
                placeholder="Select a service"
                required
              />
              <Textarea
                label="Message"
                name="message"
                placeholder="What are you trying to build?"
                required
              />
              <div>
                <Button type="submit" variant="primary">
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
