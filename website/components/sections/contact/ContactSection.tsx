"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  EnvelopeSimple,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { buildDirectionsUrl } from "@/constants/contact";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_PHONE,
} from "@/constants/footer";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

// `as const` preserves the "easeOut" literal type Framer Motion's Transition
// expects -- same reasoning as every other hero-equivalent panel's `item`
// variant (Hero.tsx, AboutHero.tsx).
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

// One shared row treatment for the three direct-contact methods below.
// Every row is a real link (email -> mailto, phone -> tel, office ->
// Google Maps directions), so they get identical affordances rather than
// two clickable rows and one inert block of text.
const ROW_CLASSES =
  "group border-border focus-visible:ring-accent flex items-start gap-4 border-b py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none hover:bg-surface/40";

// Email/Office rows' hover arrow: rolled back to `ArrowUpRight` per direct
// client instruction (2026-08-11) after a same-day detour into a bordered
// "boxy" version -- the client wanted the original diagonal icon kept, not
// replaced. Two position attempts followed: first `ml-auto` (pushed the
// arrow to the row's far-right edge, reported as feeling disconnected from
// short content), then `ml-4` as a sibling of the label/value block (a
// fixed gap, but still positioned against the whole row rather than the
// text itself). Final placement -- this pass -- puts the icon INSIDE the
// value line (`{COMPANY_EMAIL}<ArrowUpRight .../>`, and the same inside
// `<address>`), so it sits immediately after the actual email/address text
// on the same line, which is what "beside the text" turned out to mean:
// beside the VALUE, not centred against the row that also contains the
// icon and uppercase label above it.

/**
 * Purpose: the /contact page's primary section -- the page's entire job in
 * one screen. Left column: who to talk to and how to reach them directly.
 * Right column: the form. Replaces the previous three-section build
 * (ContactHero -> OfficeLocation -> ContactCTA), both of whose extra
 * sections are deleted as of 2026-08-10.
 *
 * WHY THE REDESIGN (the real problem with the previous build): /contact had
 * three stacked sections carrying three competing headings -- "Contact.",
 * "Visit our office.", and "Let's build something together." -- all
 * variations on the same message, which 10_PAGE_BLUEPRINTS.md's "single
 * primary objective" principle argues directly against. Worse, the form was
 * the THIRD thing on the page, below a full-viewport-height hero AND the
 * map: on a 900px laptop a visitor scrolled roughly two full screens before
 * seeing a single input, on the one page whose entire purpose is
 * conversion. Reusing `ContactCTA` there was also a tonal mismatch -- it is
 * written as a CLOSING call-to-action for a visitor who came to read about
 * services, not as the opening of a page someone navigated to deliberately.
 *
 * RESEARCH (16_IMPLEMENTATION_WORKFLOW.md Steps 3-4, done before designing
 * rather than after): pulled live captures of Linear's and Vercel's
 * contact-sales pages, Thoughtworks' contact page, and the Dribbble shot
 * the client referenced. The strongest, most consistent pattern across the
 * two enterprise references is identical and is what this section adopts:
 * heading plus supporting/direct-contact content on the left, form on the
 * right, the two separated by a single vertical rule, with NO separate
 * full-height hero above -- the form sits above the fold. Linear pairs its
 * form with an explicit "you can also email us at..." escape hatch, which
 * is the same job the direct-contact rows do here.
 *
 * The client's Dribbble reference contributed the overall page skeleton
 * (split content/form section, then a full-width map below) but NOT its
 * styling -- that shot puts every block in a filled, rounded card, which is
 * precisely the "repetitive rounded cards everywhere" pattern
 * 04_VISUAL_LANGUAGE.md names as making a site read AI-generated, and which
 * the client's own critique of the live site (Docs/Mythoughts.md) already
 * flagged. Per 99_GLOBAL_RULES.md's "Never Copy" rule, the structure was
 * extracted and the surface re-expressed in this site's existing flat,
 * hairline-ruled language.
 *
 * WHY THE DIRECT-CONTACT ROWS EARN THEIR SPACE: a meaningful share of
 * enterprise buyers -- the CTO/CIO audience 01_PROJECT_CONTEXT.md names --
 * will not fill in a form at all; they forward an email address to an
 * assistant or call. A contact page offering only a form quietly loses
 * those visitors. Giving email/phone/office equal prominence beside the
 * form costs nothing and removes that friction, which is 03_DESIGN_
 * PRINCIPLES.md's "remove friction wherever possible" applied literally.
 *
 * DATA: address/phone/email all come from constants/footer.ts -- the same
 * constants Footer.tsx renders -- rather than a second hand-typed copy, so
 * the two can never drift. Same no-fabrication standard applied everywhere
 * else in this project (SERVICE_PILLARS, SOLUTION_CATEGORIES).
 *
 * FORM: the shared `ContactForm` (components/sections/ContactForm.tsx),
 * extracted from ContactCTA.tsx when this section became its second
 * consumer -- see that file for the submission contract, still stubbed.
 *
 * LAYOUT/DIVIDER: `lg:grid-cols-2`, the two columns separated by a single
 * vertical rule (`lg:border-r` on the left column) at desktop. When they
 * stack, the direct-contact list's own closing rule serves as the divider
 * instead -- see the comment on that column for why adding a second
 * `border-b` there was wrong. The form is NOT wrapped in its own bordered
 * box: the vertical rule already does the separating work, and a box there
 * would sit as a border inside the panel's own `border-x` rails -- a box in
 * a box.
 *
 * STACKING ORDER is deliberate and NOT reversed for small screens: the
 * direct-contact rows come before the form on mobile. A phone visitor is
 * substantially more likely to tap a number or an email address than to
 * complete six fields on a handset, so the one-tap actions get the top of
 * the page and the form follows. On desktop, where filling the form costs
 * nothing, the two sit side by side and the question doesn't arise.
 *
 * PANEL/CONTAINER: `bg-panel` + `border-x` + `DASHBOARD_CONTAINER` with no
 * `border-t`, the locked treatment for the first section under Navbar
 * (identical to Hero.tsx and AboutHero.tsx), and padded directly on the
 * container rather than via `PANEL_CONTAINER_NESTED` -- per constants/
 * layout.ts, hero-equivalent panels keep their own flush-left content
 * padding as a deliberate one-off, and only the sections BELOW them share
 * the indented pattern. Keeps `min-h-[calc(100svh-4rem)]` as a floor for
 * consistency with the other two pages' opening panels; real content
 * exceeds it at most viewports.
 */
export function ContactSection() {
  return (
    <section
      className={`bg-panel border-border relative border-x ${DASHBOARD_CONTAINER}`}
    >
      <div className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center px-6 py-20 md:px-8 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="grid grid-cols-1 lg:grid-cols-2"
        >
          {/*
            No `border-b` on this column when the layout stacks, despite it
            being the obvious way to divide stacked columns: the
            direct-contact list below already closes with its own full-width
            rule under the Office row, so adding one here rendered TWO
            parallel hairlines separated by this column's `pb-14` -- clearly
            visible at 900px and 390px. The list's closing rule already does
            the divider's job at those widths; only the vertical `lg:border-r`
            is needed, and it has no stacked-state counterpart to turn off.
          */}
          <motion.div
            variants={item}
            className="border-border flex flex-col pb-14 lg:border-r lg:pr-14 lg:pb-0 xl:pr-20"
          >
            <SectionEyebrow>Get In Touch</SectionEyebrow>

            <h1 className="font-rinter text-foreground mt-6 text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              Contact.
            </h1>

            <p className="text-foreground-secondary mt-8 max-w-xl text-lg leading-relaxed">
              Tell us what you&apos;re working on -- the problem, the
              constraints, the timeline if you have one. A senior engineer
              reads every message and replies with concrete next steps.
            </p>

            <p className="text-foreground-muted font-mono mt-12 text-xs font-semibold tracking-[0.15em] uppercase">
              Reach us directly
            </p>

            <div className="border-border mt-4 border-t">
              <a href={`mailto:${COMPANY_EMAIL}`} className={ROW_CLASSES}>
                <EnvelopeSimple
                  aria-hidden
                  size={20}
                  weight="light"
                  className="text-accent mt-0.5 shrink-0"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-foreground-muted font-mono text-xs font-semibold tracking-[0.15em] uppercase">
                    Email
                  </span>
                  <span className="text-foreground group-hover:text-accent inline-flex items-center gap-2 text-base transition-colors">
                    {COMPANY_EMAIL}
                    <ArrowUpRight
                      aria-hidden
                      size={14}
                      className="shrink-0 translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </span>
                </span>
              </a>

              {/*
                No arrow here, direct client request (2026-08-11): a phone
                number isn't a "go to" action the way email (opens a mail
                client) and office (opens Maps) are -- on desktop a `tel:`
                link often just sits there, so an arrow implying navigation
                would be misleading. The row keeps its other hover
                affordances (background tint, text turning accent) so it
                still reads as clickable, just without the arrow.
              */}
              <a
                href={`tel:${COMPANY_PHONE.replace(/\s+/g, "")}`}
                className={ROW_CLASSES}
              >
                <Phone
                  aria-hidden
                  size={20}
                  weight="light"
                  className="text-accent mt-0.5 shrink-0"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-foreground-muted font-mono text-xs font-semibold tracking-[0.15em] uppercase">
                    Phone
                  </span>
                  <span className="text-foreground group-hover:text-accent text-base transition-colors">
                    {COMPANY_PHONE}
                  </span>
                </span>
              </a>

              {/*
                The office row links to Google Maps directions rather than
                sitting inert -- on a contact page the address IS an action
                ("take me there"), which is also why it gets the same row
                treatment as email/phone instead of being a separate block.
                `<address>` inside the link keeps the semantic markup a
                contact page should carry (valid: `<a>` accepts flow
                content, and there is no interactive descendant here).
              */}
              <a
                href={buildDirectionsUrl(COMPANY_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className={ROW_CLASSES}
              >
                <MapPin
                  aria-hidden
                  size={20}
                  weight="light"
                  className="text-accent mt-0.5 shrink-0"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-foreground-muted font-mono text-xs font-semibold tracking-[0.15em] uppercase">
                    Office
                  </span>
                  <address className="text-foreground group-hover:text-accent max-w-sm text-base leading-relaxed transition-colors not-italic">
                    {COMPANY_ADDRESS}
                    <ArrowUpRight
                      aria-hidden
                      size={14}
                      className="ml-2 inline-block translate-x-1 align-middle opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </address>
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="pt-14 lg:pt-0 lg:pl-14 xl:pl-20"
          >
            {/*
              Heading only, deliberately no reassurance subline under it. A
              first draft carried "We reply to every enquiry within one
              business day" -- removed before it ever rendered: that is a
              measurable service commitment the business would have to
              actually honor, and no source in this project states it. Same
              no-fabrication rule that kept WhyLyftek's stats empty until
              the client supplied real figures and that keeps TeamSection's
              photo frames as honest placeholders. The left column's "reads
              every message and replies with concrete next steps" already
              carries the reassurance without inventing an SLA.
            */}
            <h2 className="font-rinter text-foreground text-2xl tracking-tight">
              Send us a message.
            </h2>

            <div className="mt-8">
              <ContactForm />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
