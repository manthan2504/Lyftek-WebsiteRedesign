"use client";

import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import { cn } from "@/utils/cn";
import type { SolutionDetail } from "@/types/solution";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Interior divider classes for one capability cell, computed per breakpoint
 * rather than hand-picked per index -- the same generalised approach
 * Services.tsx's `pillarBorderClasses` documents, and for the same reason:
 * the grid reflows 1 -> 2 -> 3 columns, each layout needs its dividers in
 * different places, and every breakpoint must state BOTH the on and off
 * state (Tailwind's responsive variants are min-width-based, so an
 * `sm:border-r` left unset at `lg:` would still apply there).
 *
 * Three columns at `lg`, not four: capability counts here run 4-6 rather
 * than Services' fixed 8, and three columns keeps the last row from
 * stranding a single cell in most cases.
 */
function cellBorders(index: number, total: number, lgCols: number) {
  const SM = 2;
  const smLastRow = Math.floor((total - 1) / SM);
  const lgLastRow = Math.floor((total - 1) / lgCols);

  return cn(
    index === total - 1 ? "border-b-0" : "border-b",
    index % SM === 0 ? "sm:border-r" : "sm:border-r-0",
    Math.floor(index / SM) === smLastRow ? "sm:border-b-0" : "sm:border-b",
    index % lgCols !== lgCols - 1 ? "lg:border-r" : "lg:border-r-0",
    Math.floor(index / lgCols) === lgLastRow ? "lg:border-b-0" : "lg:border-b",
  );
}

/**
 * Column count at `lg`, chosen from the item count rather than fixed at
 * three.
 *
 * Fixed at three, a four-item grid rendered as 3 + 1 and left TWO empty
 * bordered cells sitting beside the final card -- visible on every solution
 * page, since every "Outcomes" grid has exactly four entries. An empty cell
 * inside a continuous rule box does not read as deliberate whitespace; it
 * reads as content that failed to load.
 *
 * Four items therefore go to two columns (a clean 2x2). Five and six both
 * take three: six is exact, and five leaves a single gap, which is the best
 * any rectangular grid can do for a prime count and is far less conspicuous
 * than two. Both class strings appear as literals below so Tailwind's
 * scanner emits them -- a computed `lg:grid-cols-${n}` would not exist in
 * the stylesheet at all.
 */
function lgColumnsFor(total: number): 2 | 3 {
  if (total % 3 === 0) return 3;
  if (total % 2 === 0) return 2;
  return 3;
}

/**
 * A numbered capability / benefit grid. One continuous bordered rule box
 * with interior dividers, NOT a set of individually shadowed cards --
 * 04_VISUAL_LANGUAGE.md's component philosophy and the same call
 * Services.tsx makes ("one border system reads as one instrument panel;
 * separate shadowed cards read as unrelated widgets").
 *
 * Numbered rather than icon-led, unlike Services.tsx. Deliberate: across
 * nine solution pages these grids hold roughly fifty entries, and inventing
 * fifty icons would produce either meaningless repetition or a visual
 * vocabulary nobody can read. A two-digit index is honest ordinal
 * information and keeps the grid distinct from the homepage's icon grid, so
 * the two never read as the same component.
 */
function CapabilityGrid({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  const lgCols = lgColumnsFor(items.length);

  return (
    <div
      className={cn(
        "border-border mt-12 grid grid-cols-1 border sm:grid-cols-2",
        lgCols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3",
      )}
    >
      {items.map((cap, index) => (
        <div
          key={cap.title}
          className={cn(
            "border-border flex flex-col gap-3 p-6 xs:p-8 lg:p-10",
            cellBorders(index, items.length, lgCols),
          )}
        >
          <span
            aria-hidden
            className="text-accent font-mono text-xs font-semibold tracking-[0.15em]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-rinter text-foreground text-lg tracking-tight">
            {cap.title}
          </h3>
          <p className="text-foreground-muted text-sm leading-relaxed">
            {cap.description}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Every below-hero section of a Solutions detail page, in one component:
 * challenges, capabilities, process breakdown, and outcomes. Each renders
 * only if the data carries it, so a page with no problem framing simply
 * doesn't get that band rather than getting an invented one.
 *
 * Every band uses the locked below-hero skeleton -- `border-t`/`border-x` on
 * a `DASHBOARD_CONTAINER` div with `PANEL_CONTAINER_NESTED` content inside --
 * so the vertical rails run unbroken from Navbar to Footer, and background
 * alternates `bg-background` / `bg-panel` to give the page rhythm without
 * introducing a new surface treatment (06_LAYOUT_AND_SPACING.md's "alternate
 * between information-heavy and breathing sections").
 */
export function SolutionBody({ solution }: { solution: SolutionDetail }) {
  return (
    <>
      {solution.challenges && (
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
              <SectionEyebrow>The problem</SectionEyebrow>
              <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
                {solution.challenges.heading}
              </h2>
              <ul className="text-foreground-secondary mt-10 flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
                {solution.challenges.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden className="text-accent shrink-0">
                      /
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}

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
            <SectionEyebrow>Capabilities</SectionEyebrow>
            <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
              {solution.capabilities.heading}
            </h2>
            <CapabilityGrid items={solution.capabilities.items} />
          </motion.div>
        </div>
      </section>

      {solution.process && (
        <section>
          <div
            className={`bg-panel border-border border-t border-x ${DASHBOARD_CONTAINER}`}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className={`flex flex-col px-6 py-16 xs:py-20 md:px-8 md:py-24 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
            >
              <SectionEyebrow>Scope</SectionEyebrow>
              <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
                {solution.process.heading}
              </h2>

              <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {solution.process.groups.map((group) => (
                  <div key={group.title} className="flex flex-col">
                    <h3 className="font-rinter text-foreground border-border border-b pb-4 text-lg tracking-tight">
                      {group.title}
                    </h3>
                    <ul className="mt-6 flex flex-col gap-3">
                      {group.items.map((entry) => (
                        <li
                          key={entry}
                          className="text-foreground-muted flex gap-3 text-sm leading-relaxed"
                        >
                          <span aria-hidden className="text-accent shrink-0">
                            /
                          </span>
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

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
            <SectionEyebrow>Outcomes</SectionEyebrow>
            <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
              {solution.benefits.heading}
            </h2>
            <CapabilityGrid items={solution.benefits.items} />
          </motion.div>
        </div>
      </section>
    </>
  );
}
