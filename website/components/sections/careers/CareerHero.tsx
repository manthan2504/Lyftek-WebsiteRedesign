"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { CAREER_DEPARTMENT_LABELS } from "@/constants/careers";
import type { CareerOpening } from "@/types/career";

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
 * Opening panel for a Careers detail page -- same locked skeleton as
 * SolutionHero.tsx (`bg-panel` + `border-x` + `DASHBOARD_CONTAINER`, no
 * `border-t`, no full-viewport `min-h`, since this is reference content a
 * candidate navigated to on purpose, not a page opening on a statement).
 *
 * Back link points at `/careers`, not `/#services`-style homepage anchor --
 * there is no homepage careers section to return to, only the index page
 * this detail page's own row lives on.
 */
export function CareerHero({ opening }: { opening: CareerOpening }) {
  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <div className="relative px-6 py-20 md:px-8 lg:py-28">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.div variants={item}>
            <Link
              href="/careers"
              className="text-foreground-muted hover:text-foreground focus-visible:ring-accent group inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:-mx-2 pointer-coarse:-my-3 pointer-coarse:px-2 pointer-coarse:py-3"
            >
              <ArrowLeft
                aria-hidden
                size={14}
                className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
              />
              All openings
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10">
            <SectionEyebrow>
              {CAREER_DEPARTMENT_LABELS[opening.department]}
            </SectionEyebrow>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-rinter text-foreground mt-4 max-w-4xl text-3xl tracking-tight xs:text-4xl sm:text-5xl lg:text-6xl"
          >
            {opening.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-foreground-secondary mt-8 max-w-3xl text-base leading-relaxed xs:text-lg"
          >
            {opening.summary}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
