"use client";

import { motion } from "framer-motion";
import { User } from "@phosphor-icons/react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";

// `as const` preserves the "easeOut" literal type Framer Motion's Transition
// expects -- same reasoning as every other section's `fadeUp` variant.
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

interface TeamMember {
  name: string;
  title: string;
}

// Direct client-supplied roster (2026-08-08) -- names/titles copied
// verbatim, same no-fabrication standard SERVICE_PILLARS/SOLUTION_
// CATEGORIES document elsewhere in this project. Photos intentionally
// absent: the client hasn't supplied them yet ("photo would be given
// later") -- each frame below renders an explicit placeholder rather than
// a stock photo or generated avatar, so it reads as "reserved for a real
// photo," not finished content.
const TEAM_MEMBERS: TeamMember[] = [
  { name: "Sachin Gapat", title: "Founder & CEO" },
  { name: "Pallavi Deshmukh", title: "Director - People & Operations" },
];

/**
 * Purpose: the About page's team section -- built on the same locked
 * skeleton the homepage's `bg-background` sections use (About/Services on
 * home): `border-t`/`border-x` on a `DASHBOARD_CONTAINER` div (rails
 * continuous with the panels above/below), inner content at
 * `PANEL_CONTAINER_NESTED` width. See About.tsx's own docblock
 * ("RAILS MADE CONTINUOUS") for the full reasoning this pattern comes
 * from.
 *
 * PHOTO FRAMES: bordered `bg-surface` boxes with a muted centered `User`
 * glyph -- not a blank/empty box (which could read as a layout bug) and
 * not a fabricated stock photo or generated avatar standing in for a real
 * person (this project's standing rule -- see RequirementCard.tsx's own
 * docblock for the same call on the homepage's inquiry-card avatars,
 * DiceBear-generated rather than real headshots, for a different but
 * related reason). A neutral placeholder icon is the honest middle
 * ground here: visibly "a photo goes here," never mistaken for a real
 * one. `aspect-[4/5]` -- portrait, the standard headshot ratio -- not
 * `aspect-square`, so the reserved space actually matches what a real
 * photo will need.
 *
 * Only 2 members -- deliberately NOT forced into Services.tsx's
 * continuous-bordered-grid pattern (which exists for enumerable catalog
 * items, 4 or 8 of them). Two people is a roster, not a catalog; a plain
 * 2-column layout with real gap between them reads as people, not grid
 * cells.
 *
 * FOUNDER QUOTE (2026-08-08, direct client request: "on right side of
 * photo, aligning at center... a message from founders and a message in
 * quotes"): a second column, `lg:items-center` against the left column's
 * full height so it centers against the eyebrow+heading+photos block, not
 * just the photos alone. Attributed to Sachin Gapat specifically (not
 * "founders" plural, per the client's own wording) -- `TEAM_MEMBERS` only
 * has one person actually holding "Founder" in their title (Pallavi
 * Deshmukh's is "Director - People & Operations"), so a plural
 * attribution would misstate who's speaking. Copy written to Docs/
 * content_writing.md's guidelines (outcome-focused, first person,
 * confident without being a marketing claim) -- not a fabricated
 * testimonial or statistic, a values/philosophy statement in the
 * founder's own voice, the kind of copy a founder reviews and approves
 * before launch rather than a claim this project would need a source for.
 * Ties back to the "one accountable partner, not a rotating vendor list"
 * throughline already established in Hero/About/Services/WhyDifferent
 * rather than introducing a new, competing message. Left accent border
 * (`border-l-2 border-accent`) marks it as a pull-quote -- no decorative
 * quotation-mark glyph, matching 04_VISUAL_LANGUAGE.md's "distinction
 * from hierarchy, not decoration" component philosophy.
 */
const FOUNDER_QUOTE = {
  quote:
    "Every business we talk to is trying to solve a version of the same problem: too many vendors, not enough ownership. We built Lyftek to be the team that stays accountable long after the project ships, because that's the partner we'd want if the business were ours.",
  name: "Sachin Gapat",
  title: "Founder & CEO",
};

export function TeamSection() {
  return (
    <section className="bg-background relative">
      <div
        className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}
      >
        {/*
          `initial="hidden"` unconditionally -- reduced motion is handled
          sitewide by MotionProvider now; branching it here per-section is
          what caused a hydration mismatch (see motion-provider.tsx).
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className={`px-6 py-16 md:px-8 md:py-24 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
        >
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <SectionEyebrow>Leadership</SectionEyebrow>

              <h2 className="font-rinter text-foreground mt-4 text-3xl tracking-tight sm:text-4xl">
                Our Team
              </h2>

              <div className="mt-14 grid grid-cols-1 gap-8 xs:grid-cols-2 sm:gap-12 lg:mt-16">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.name} className="flex flex-col gap-4">
                    <div className="bg-surface border-border flex aspect-[4/5] w-full items-center justify-center border">
                      <User
                        aria-hidden
                        size={64}
                        weight="thin"
                        className="text-foreground-muted"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-rinter text-foreground text-lg tracking-tight">
                        {member.name}
                      </p>
                      <p className="text-foreground-muted font-mono text-sm tracking-wide">
                        {member.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* 2026-08-10: `tracking-wide` (0.025em) -> `font-semibold
                  tracking-[0.15em]`, the site's one uppercase mono
                  micro-label style. */}
              <p className="text-foreground-muted font-mono text-xs font-semibold tracking-[0.15em] uppercase">
                A Message From Our Founder
              </p>
              <blockquote className="border-accent flex flex-col gap-4 border-l-2 pl-4 sm:pl-6">
                <p className="text-foreground text-xl leading-relaxed lg:text-2xl">
                  &ldquo;{FOUNDER_QUOTE.quote}&rdquo;
                </p>
                <footer className="text-foreground-muted font-mono text-sm tracking-wide">
                  {FOUNDER_QUOTE.name}, {FOUNDER_QUOTE.title}
                </footer>
              </blockquote>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
