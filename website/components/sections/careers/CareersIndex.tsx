"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RowArrow } from "@/components/ui/RowArrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import { CAREER_DEPARTMENT_LABELS, CAREER_OPENINGS } from "@/constants/careers";
import { cn } from "@/utils/cn";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

const fadeUp = item;

/**
 * The /careers index -- built the same way `/solutions` was: real content
 * scraped from the client's live site (`lyftek.in/careers/1`-`/6`, a
 * client-rendered SPA with no server HTML, so this needed an actual
 * browser render rather than a plain fetch), normalised into one template.
 * See constants/careers.ts for the full provenance note.
 *
 * STRUCTURE: hero panel, then a single "Current Openings" band listing all
 * six roles as full-width bordered rows -- same row-not-card treatment
 * SolutionsIndex.tsx uses, for the same reason (04_VISUAL_LANGUAGE.md's
 * anti-repeated-card guidance, and a full-width row is a much larger click
 * target). Only one band, not one per category the way Solutions splits
 * enterprise-finance/healthcare: six roles across three departments does
 * not carry enough per-department volume to justify separate bands, and
 * splitting it would leave Sales and Finance & Operations each showing a
 * lone row under its own heading. The department still renders per-row as
 * a small label instead, so the grouping information isn't lost.
 *
 * NO ContactCTA at the bottom, unlike every other browse page on this site
 * (Home, /about, /solutions all close on it). Deliberate: ContactCTA's copy
 * ("Let's build something together... tell us what you're working on") is
 * the site's business-inquiry funnel -- exactly the wrong prompt under a
 * page whose visitors are evaluating Lyftek as an employer, not a vendor.
 * A mismatched sales pitch at the bottom of a jobs page would undercut the
 * page's own purpose rather than support it. Applying is the CTA here, and
 * every row already carries its own.
 */
export function CareersIndex() {
  return (
    <>
      <section
        className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
      >
        <div className="relative px-6 py-20 md:px-8 lg:py-28">
          <motion.div initial="hidden" animate="visible" variants={container}>
            <motion.div variants={item}>
              <SectionEyebrow>Join The Team</SectionEyebrow>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-rinter text-foreground mt-6 text-4xl tracking-tight xs:text-5xl sm:text-6xl lg:text-7xl"
            >
              Careers.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-foreground-secondary mt-8 max-w-3xl text-base leading-relaxed xs:text-lg"
            >
              Empowering digital transformation since 2011. Join a team of
              engineers, consultants, and specialists building enterprise
              systems for clients worldwide -- with flexible hours, real
              ownership, and room to grow.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-background">
        <div
          className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className={`flex flex-col px-6 py-16 xs:py-20 md:px-8 md:py-24 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
          >
            <SectionEyebrow>Current Openings</SectionEyebrow>

            <div className="border-border mt-12 border-t">
              {CAREER_OPENINGS.map((opening) => (
                <Link
                  key={opening.slug}
                  href={`/careers/${opening.slug}`}
                  className={cn(
                    "group border-border focus-visible:ring-accent hover:bg-surface/40 flex flex-col gap-3 border-b px-2 py-8 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    "lg:flex-row lg:items-baseline lg:gap-10",
                  )}
                >
                  <div className="shrink-0 lg:w-2/5">
                    <h3 className="font-rinter text-foreground group-hover:text-accent text-xl tracking-tight transition-colors lg:text-2xl">
                      {opening.title}
                    </h3>
                    <p className="text-foreground-muted font-mono text-xs tracking-[0.15em] uppercase">
                      {CAREER_DEPARTMENT_LABELS[opening.department]}
                    </p>
                  </div>
                  <p className="text-foreground-muted flex-1 text-sm leading-relaxed">
                    {opening.summary}
                  </p>
                  <RowArrow />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
