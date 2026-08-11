"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RowArrow } from "@/components/ui/RowArrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import {
  SOLUTION_CATEGORY_LABELS,
  SOLUTION_DETAILS,
} from "@/constants/solutionDetails";
import type { SolutionCategoryId } from "@/types/solution";
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

// Render order is fixed rather than derived from the data, so adding a
// healthcare entry can never silently push it above the finance block.
const CATEGORY_ORDER: SolutionCategoryId[] = ["enterprise-finance", "healthcare"];

/**
 * The /solutions index -- the page the Navbar's "Solutions" item and every
 * `/solutions#...` anchor lands on, and the parent every detail page links
 * back up to.
 *
 * STRUCTURE: hero panel, then one band per category, each listing its
 * solutions as full-width bordered rows rather than a card grid. Rows, not
 * cards, for two reasons: the entries are a browsable list where the label
 * is what the visitor scans (a card's padding and elevation add nothing to
 * that), and 04_VISUAL_LANGUAGE.md plus the client's own critique of the
 * live site both single out repeated rounded cards as the pattern to avoid.
 * A row that spans the column is also a much larger click target, which
 * matters more here than on the homepage's icon grid.
 *
 * `id={category}` on each band makes the existing `/solutions#slug` links
 * from the Navbar mega-menu land somewhere sensible even though those
 * anchors point at individual solutions rather than categories -- see the
 * note in constants/solutions.ts about those hrefs being written before any
 * page existed.
 *
 * COVERAGE: renders whatever is in SOLUTION_DETAILS. That is currently nine
 * of the thirteen entries in constants/solutions.ts -- the four remaining
 * Healthcare entries have no source content anywhere (their live URLs return
 * an empty SPA shell, verified against a bogus control slug), so they are
 * absent rather than fabricated. See solutionDetails.ts for the full note.
 */
export function SolutionsIndex() {
  return (
    <>
      <section
        className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
      >
        <div className="relative px-6 py-20 md:px-8 lg:py-28">
          <motion.div initial="hidden" animate="visible" variants={container}>
            <motion.div variants={item}>
              <SectionEyebrow>What We Solve</SectionEyebrow>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-rinter text-foreground mt-6 text-5xl tracking-tight sm:text-6xl lg:text-7xl"
            >
              Solutions.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-foreground-secondary mt-8 max-w-3xl text-lg leading-relaxed"
            >
              Finance and healthcare operations carry the same problem in
              different forms: work that people repeat because the systems
              underneath were never joined up. These are the processes we
              automate, and what changes for the business when we do.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {CATEGORY_ORDER.map((category) => {
        const entries = SOLUTION_DETAILS.filter((s) => s.category === category);
        if (entries.length === 0) return null;

        return (
          <section key={category} id={category} className="bg-background scroll-mt-16">
            <div
              className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className={`flex flex-col px-6 py-24 md:px-8 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
              >
                <SectionEyebrow>
                  {SOLUTION_CATEGORY_LABELS[category]}
                </SectionEyebrow>
                <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-3xl tracking-tight sm:text-4xl">
                  {category === "enterprise-finance"
                    ? "The finance processes worth automating first."
                    : "Revenue operations for healthcare providers."}
                </h2>

                <div className="border-border mt-12 border-t">
                  {entries.map((solution) => (
                    <Link
                      key={solution.slug}
                      href={`/solutions/${solution.slug}`}
                      id={solution.slug}
                      className={cn(
                        "group border-border focus-visible:ring-accent hover:bg-surface/40 flex scroll-mt-16 flex-col gap-3 border-b px-2 py-8 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        "md:flex-row md:items-baseline md:gap-10",
                      )}
                    >
                      <h3 className="font-rinter text-foreground group-hover:text-accent shrink-0 text-xl tracking-tight transition-colors md:w-2/5 lg:text-2xl">
                        {solution.title}
                      </h3>
                      <p className="text-foreground-muted flex-1 text-sm leading-relaxed">
                        {solution.summary}
                      </p>
                      <RowArrow />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}
    </>
  );
}
