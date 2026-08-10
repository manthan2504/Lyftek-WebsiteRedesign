"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import type { SolutionDetail } from "@/types/solution";

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
 * Opening panel for a Solutions detail page -- the same locked skeleton
 * Hero.tsx, AboutHero.tsx and ContactSection.tsx use for the first section
 * under Navbar: `bg-panel` + `border-x` + `DASHBOARD_CONTAINER`, no
 * `border-t`, flush-left padding on the container itself rather than the
 * indented `PANEL_CONTAINER_NESTED` every below-hero section shares.
 *
 * DELIBERATELY SHORTER than the other three heroes: no
 * `min-h-[calc(100svh-4rem)]`. Those pages open on a statement and can
 * afford a full screen to make it; a solution page is reference content that
 * a reader has navigated to on purpose, and making them scroll a full
 * viewport before the first capability would be padding, not pacing. Same
 * reasoning 10_PAGE_BLUEPRINTS.md applies to page purpose -- the structure
 * should serve what the visitor came for.
 *
 * BACK LINK: a solution page is the one place on this site a visitor can
 * land without passing through the page above it (search, a shared link, the
 * Navbar mega-menu). The link up to /solutions gives that visitor the
 * category context they skipped, which is 03_DESIGN_PRINCIPLES.md's "users
 * should always understand where they are". Rendered above the eyebrow so it
 * reads as navigation rather than as part of the heading block.
 *
 * STATS: only Revenue Cycle Management supplies them, and they are INDUSTRY
 * figures, not Lyftek's results -- the labels say so explicitly ("of claims
 * denied because of data errors", not "we reduced denials by"). Rendered in
 * `font-rinter` per 07_TYPOGRAPHY.md's Locked Scale entry for numbers.
 */
export function SolutionHero({
  solution,
  categoryLabel,
}: {
  solution: SolutionDetail;
  categoryLabel: string;
}) {
  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <div className="relative px-6 py-20 md:px-8 lg:py-28">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.div variants={item}>
            <Link
              href="/solutions"
              className="text-foreground-muted hover:text-foreground focus-visible:ring-accent group inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft
                aria-hidden
                size={14}
                className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
              />
              All solutions
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10">
            <SectionEyebrow>{categoryLabel}</SectionEyebrow>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-rinter text-foreground mt-4 max-w-4xl text-4xl tracking-tight sm:text-5xl lg:text-6xl"
          >
            {solution.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-foreground-secondary mt-8 max-w-3xl text-lg leading-relaxed"
          >
            {solution.summary}
          </motion.p>

          {solution.stats && (
            <motion.dl
              variants={item}
              className="border-border mt-14 grid grid-cols-1 border-t sm:grid-cols-3"
            >
              {solution.stats.map((stat, index) => (
                <div
                  key={stat.value}
                  className={`border-border flex flex-col gap-2 py-8 sm:px-8 sm:first:pl-0 ${
                    index < solution.stats!.length - 1
                      ? "border-b sm:border-r sm:border-b-0"
                      : ""
                  }`}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="flex flex-col gap-2">
                    <span className="font-rinter text-accent text-4xl tracking-tight lg:text-5xl">
                      {stat.value}
                    </span>
                    <span className="text-foreground-muted max-w-xs text-sm leading-relaxed">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </motion.div>
      </div>
    </section>
  );
}
