"use client";

import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import { JobApplicationForm } from "./JobApplicationForm";
import type { CareerOpening } from "@/types/career";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * One labeled list band -- Roles, Responsibilities, or Benefits. Reuses
 * SolutionBody.tsx's "challenges" list treatment (accent `/` marker, not a
 * bordered grid) rather than `CapabilityGrid`: these are short single-line
 * items straight from the source with no separate title/description pair
 * to give a grid cell two levels of hierarchy, so the plain list is the
 * honest shape for this content rather than stretching it into a heavier
 * component built for richer data.
 */
function ListBand({
  eyebrow,
  heading,
  items,
  background,
}: {
  eyebrow: string;
  heading: string;
  items: string[];
  background: "panel" | "background";
}) {
  return (
    <section className={background === "panel" ? "bg-panel" : "bg-background"}>
      <div className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className={`flex flex-col px-6 py-16 xs:py-20 md:px-8 md:py-24 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
        >
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
            {heading}
          </h2>
          <ul className="text-foreground-secondary mt-10 flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
            {items.map((point) => (
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
  );
}

/**
 * Every below-hero section of a Careers detail page: what the role does,
 * what you're responsible for, what you get, then the application form.
 * Same locked below-hero skeleton (`border-t`/`border-x` on
 * `DASHBOARD_CONTAINER`, `PANEL_CONTAINER_NESTED` content, alternating
 * `bg-background`/`bg-panel`) every Services/Solutions detail page uses, so
 * a Careers page reads as the same site rather than a bolted-on section.
 */
export function CareerBody({ opening }: { opening: CareerOpening }) {
  return (
    <>
      <ListBand
        eyebrow="What You'll Do"
        heading="Role"
        items={opening.roles}
        background="background"
      />
      <ListBand
        eyebrow="Day To Day"
        heading="Responsibilities"
        items={opening.responsibilities}
        background="panel"
      />
      <ListBand
        eyebrow="What You Get"
        heading="Benefits"
        items={opening.benefits}
        background="background"
      />

      <section className="bg-panel">
        <div className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className={`flex flex-col px-6 py-16 xs:py-20 md:px-8 md:py-24 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
          >
            <SectionEyebrow>Apply</SectionEyebrow>
            <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
              Apply for {opening.title}.
            </h2>
            <div className="mt-12 max-w-2xl">
              <JobApplicationForm jobTitle={opening.title} />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
