"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { OFFICE_MAP_EMBED_URL } from "@/constants/contact";
import { cn } from "@/utils/cn";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

/**
 * Purpose: the /contact page's closing wayfinding tile -- a single
 * full-width map of the Baner office, directly below `ContactSection`.
 *
 * FULL WIDTH, WITHIN THE RAILS -- a deliberate reading of the client's
 * "full width" instruction, not a loose one. The map fills the entire
 * `DASHBOARD_CONTAINER` interior edge to edge: no `PANEL_CONTAINER_NESTED`
 * inset and no `px-6`/`md:px-8` padding, unlike every other below-hero
 * section. What it does NOT do is break past the `border-x` rails to the
 * true viewport edge. Those rails run unbroken from Navbar to Footer on
 * every page and are the site's "everything lives inside the boxed
 * dashboard frame" identity -- the client has already had to correct a
 * "cracked boxy vibe" once (see About.tsx / constants/layout.ts), and a
 * single section punching outside them would reintroduce exactly that.
 * Edge-to-edge within the frame is the widest a section can legitimately
 * be in this design system, and reads as full-bleed in context.
 *
 * NO HEADING, NO OVERLAY CARD: the address, phone, and email all sit in
 * ContactSection's left column immediately above, so a heading here would
 * be a third restatement of the same information -- the exact redundancy
 * the /contact redesign existed to remove. A floating overlay panel on top
 * of the map was considered and rejected on the same grounds it would have
 * been rejected anywhere else on this site: it is a floating rounded card
 * over a background, which 04_VISUAL_LANGUAGE.md's component philosophy
 * argues against, and it would add avoidable z-index and small-viewport
 * complexity for content already stated 200px higher up the page. An
 * `sr-only` heading is kept so the section is a labelled landmark for
 * screen readers and holds its place in the document outline, rather than
 * being an unnamed region containing one unlabelled iframe.
 *
 * MAP STYLING: Google's stock embed renders a bright, light-themed tile by
 * design -- a glaring white rectangle in an otherwise near-black page, and
 * far more jarring at this size than it was in the previous half-width
 * version. Rather than adopt the Maps JavaScript API and a custom dark
 * style JSON (an API key, a billing account, and a new dependency, to
 * restyle one static map -- against 15_PROJECT_TECH_STACK.md's package
 * philosophy for a need this small), the iframe carries a CSS
 * `grayscale + invert + contrast` filter: a zero-dependency approximation
 * of a dark base map. It is an approximation -- road and label colours
 * won't match a truly styled dark map -- but it reads as this site's
 * palette rather than as Google's default, which is the actual goal, and
 * it was checked at size to confirm streets and labels stay legible.
 *
 * The embed URL itself (constants/contact.ts) is the client's own pin,
 * lifted verbatim from the live site rather than re-geocoded -- see that
 * file for why that distinction matters.
 *
 * HEIGHT: fixed and responsive (`h-[420px]` -> `lg:h-[560px]`) rather than
 * an aspect ratio. An aspect-ratio box at this width would be enormous on
 * desktop (16/9 of ~1440px is 810px) and cramped on mobile; explicit
 * heights let each breakpoint get a sensible one. A fixed height also
 * gives the iframe the definite parent it needs -- a percentage height
 * against an auto-height parent collapses to the iframe's own tiny
 * default.
 *
 * MOTION: one-time `whileInView` fade-up, matching every other below-hero
 * section. `loading="lazy"` because this sits below the fold -- the map's
 * tile requests shouldn't compete with the form above it on first paint.
 */
export function OfficeMap() {
  const [mapActive, setMapActive] = useState(false);

  return (
    <section className="bg-background" aria-labelledby="office-map-heading">
      <div className={`border-border border-t border-x ${DASHBOARD_CONTAINER}`}>
        <h2 id="office-map-heading" className="sr-only">
          Our office location
        </h2>
        {/*
          `h-[320px]` below 480px: 420px of map on a 568px-tall iPhone SE
          viewport is 74% of the screen. The fixed-height ramp is kept rather
          than an `aspect-*` ratio -- this element spans the full container,
          so `aspect-[16/9]` would produce an 810px-tall map at 1440.
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="xs:h-[420px] relative h-[320px] w-full md:h-[480px] lg:h-[560px]"
        >
          <iframe
            src={OFFICE_MAP_EMBED_URL}
            title="Lyftek office location on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={cn(
              "h-full w-full grayscale invert-[0.92] contrast-[0.9]",
              !mapActive && "pointer-events-none",
            )}
            style={{ border: 0 }}
          />
          {/*
            TOUCH SCROLL TRAP. Google's cross-origin embed swallows touch
            pan, so a finger landing anywhere on a 320-560px-tall map cannot
            scroll the page past it -- on a phone the map is most of the
            screen, so this strands the user. `touch-action` can't be applied
            across an origin boundary, so the only real fix is to leave the
            iframe inert until an explicit tap activates it.

            Rendered unconditionally, NOT `md:hidden`: a display-hidden
            overlay would leave the iframe permanently `pointer-events-none`
            on desktop, i.e. a dead map. No content is hidden either way --
            the map still renders, and the address plus a directions link
            already sit above it in ContactSection.
          */}
          {!mapActive && (
            <button
              type="button"
              onClick={() => setMapActive(true)}
              className="focus-visible:ring-accent absolute inset-0 flex items-end justify-center pb-8 focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="bg-panel/90 border-border text-foreground border px-4 py-2 text-sm">
                Tap to interact with the map
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
