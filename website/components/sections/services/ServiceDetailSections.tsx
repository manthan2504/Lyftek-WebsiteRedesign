"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { NumberedGrid } from "@/components/ui/NumberedGrid";
import {
  DASHBOARD_CONTAINER,
  PANEL_CONTAINER_NESTED,
} from "@/constants/layout";
import type { ServiceDetail } from "@/types/service";

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
 * Opening panel for a Services detail page -- the locked first-section
 * skeleton (`bg-panel` + `border-x` + `DASHBOARD_CONTAINER`, no `border-t`,
 * flush-left padding on the container itself), matching SolutionHero rather
 * than the taller page heroes: this is reference content someone navigated
 * to deliberately, so a full viewport before the first fact would be
 * padding, not pacing.
 *
 * The back link points at the homepage's Services section (`/#services`)
 * rather than a `/services` index, because no such index exists -- the
 * client's 2026-08-08 decision was that the homepage section IS the
 * services listing ("there is no need of a separate services page, we
 * already have that section at homepage"). Building individual pages
 * extends that decision without reversing it.
 */
/**
 * Per-service hero artwork was tried three ways -- raster generation
 * (blocked, no usable model on the connected MCP's free plan), a
 * hand-authored isometric SVG (`CybersecurityIllustration.tsx`, kept
 * unused in this folder as a record of why it did not work: elements
 * floated off the surfaces they were meant to stand on), and an HTML/CSS/
 * Framer Motion diagram (`CybersecurityHeroVisual.tsx`, likewise kept
 * unused) -- and removed per the client's direct instruction: no
 * illustration slot on this hero at all. Every service now gets the same
 * single-column hero unconditionally.
 */
export function ServiceHero({ service }: { service: ServiceDetail }) {
  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <div className="relative px-6 py-20 md:px-8 lg:py-28">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.div variants={item}>
            <Link
              href="/#services"
              className="text-foreground-muted hover:text-foreground focus-visible:ring-accent group inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:-mx-2 pointer-coarse:-my-3 pointer-coarse:px-2 pointer-coarse:py-3"
            >
              <ArrowLeft
                aria-hidden
                size={14}
                className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
              />
              All services
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-col items-start">
            <motion.div variants={item}>
              <SectionEyebrow>What We Do</SectionEyebrow>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-rinter text-foreground mt-4 max-w-4xl text-3xl tracking-tight xs:text-4xl sm:text-5xl lg:text-6xl"
            >
              {service.title}
            </motion.h1>

            <motion.p
              variants={item}
              className="text-foreground-secondary mt-8 max-w-3xl text-base leading-relaxed xs:text-lg"
            >
              {service.summary}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Shown instead of the content bands when a service has no source content
 * yet (`status: "pending"`).
 *
 * WHY THIS EXISTS: the client's service catalogue has eight entries; the
 * live site has detail pages for six, overlapping on three. Five services
 * therefore have nothing to rewrite. The client's instruction was explicit
 * -- "the one whose data is not there write no data available, I'll provide
 * you later" -- so the page says exactly that rather than inventing copy or
 * silently not existing.
 *
 * IT IS STILL A PLACEHOLDER, and reads as one on purpose: plainly worded,
 * clearly incomplete, and offering the two things a visitor who hit it
 * actually wants (talk to someone, or go back to the list). It must not
 * reach production in this state -- a marketing page announcing that its
 * own content is missing costs more credibility than a page that isn't
 * linked yet. Track it before launch.
 */
function PendingContent({ service }: { service: ServiceDetail }) {
  return (
    <section className="bg-background">
      <div className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className={`flex flex-col px-6 py-16 xs:py-20 md:px-8 md:py-24 lg:py-32 ${PANEL_CONTAINER_NESTED}`}
        >
          <SectionEyebrow>Detail To Follow</SectionEyebrow>
          <h2 className="font-rinter text-foreground mt-4 max-w-3xl text-2xl tracking-tight xs:text-3xl sm:text-4xl">
            Full detail for this service is being prepared.
          </h2>
          {/*
            Title interpolated AS WRITTEN, not lower-cased. A first pass
            called `.toLowerCase()` on it to make it read naturally
            mid-sentence, which mangled every acronym in the catalogue --
            "qa & software testing services", "genai & ai/ml solutions",
            "rpa & automation solutions". Sentence-casing a proper noun is
            not worth breaking the brand's own capitalisation for.
          */}
          <p className="text-foreground-secondary mt-6 max-w-2xl text-lg leading-relaxed">
            We have not published the full overview for {service.title} yet.
            If it is what you need, the fastest route is a direct
            conversation -- we can answer far more specifically than a page
            would anyway.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <Link
              href="/contact"
              className="text-accent hover:text-foreground focus-visible:ring-accent group inline-flex w-fit items-center gap-2 rounded-sm text-base transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Talk to our team
              <ArrowUpRight
                aria-hidden
                size={16}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/#services"
              className="text-foreground-muted hover:text-foreground focus-visible:ring-accent inline-flex w-fit items-center gap-2 rounded-sm text-base transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              See all services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** One band: eyebrow + heading + arbitrary children, on the locked skeleton. */
function Band({
  eyebrow,
  heading,
  panel = false,
  children,
}: {
  eyebrow: string;
  heading: string;
  panel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={panel ? undefined : "bg-background"}>
      <div
        className={`${panel ? "bg-panel " : ""}border-border border-t border-x ${DASHBOARD_CONTAINER}`}
      >
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
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * The below-hero content for a Services detail page. Each band renders only
 * if the data carries it, and the whole thing is replaced by
 * `PendingContent` when the service has no source content at all.
 *
 * Backgrounds alternate `bg-background` / `bg-panel` down the page --
 * 06_LAYOUT_AND_SPACING.md's "alternate between information-heavy and
 * breathing sections" -- while every band keeps the shared `border-t`/
 * `border-x` rails so the vertical lines run unbroken from Navbar to Footer.
 */
export function ServiceBody({ service }: { service: ServiceDetail }) {
  if (service.status === "pending") {
    return <PendingContent service={service} />;
  }

  return (
    <>
      {service.overview && (
        <Band eyebrow="Overview" heading="What this covers">
          <p className="text-foreground-secondary mt-6 max-w-3xl text-lg leading-relaxed">
            {service.overview}
          </p>

          {service.features && service.features.length > 0 && (
            <ul className="text-foreground-secondary mt-10 flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
              {service.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span aria-hidden className="text-accent shrink-0">
                    /
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </Band>
      )}

      {service.differentiators && service.differentiators.length > 0 && (
        <Band eyebrow="Why Lyftek" heading="What you get working with us">
          <NumberedGrid items={service.differentiators} className="mt-12" />
        </Band>
      )}

      {service.process && service.process.length > 0 && (
        <Band eyebrow="How It Works" heading="How an engagement runs" panel>
          <NumberedGrid items={service.process} className="mt-12" />
        </Band>
      )}

      {service.benefits && service.benefits.length > 0 && (
        <Band eyebrow="Outcomes" heading="What changes for the business">
          <ul className="text-foreground-secondary mt-10 flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <span aria-hidden className="text-accent shrink-0">
                  /
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Band>
      )}
    </>
  );
}
