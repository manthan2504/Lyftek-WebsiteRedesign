"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretUp, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { NAV_LINKS, PRIMARY_CTA } from "@/constants/navigation";
import { SERVICE_PILLARS } from "@/constants/services";
import { SOLUTION_CATEGORIES } from "@/constants/solutions";
import { cn } from "@/utils/cn";
import favicon from "@/assets/favicon.png";

/**
 * 2026-08-08, direct client request ("at navbar for solutions and services
 * add a arrow icon pointing up, when hovered a [panel] must slide down
 * softly"). Only "Services" originally got real dropdown content --
 * `SERVICE_PILLARS` (constants/services.ts), the same 8-item real catalog
 * the homepage "What We Do" section and Footer's own "Services" link
 * already point at. "Solutions" had no real content anywhere in this
 * project at the time (no data file, no page copy) -- rather than invent
 * placeholder category names (this project's standing "never fabricate"
 * rule, already applied to WhyLyftek's stats and the ContactCTA inquiry
 * cards), the client's own direct call was to ship the same arrow + hover
 * affordance on it with an honest "Coming soon" panel instead of fake
 * content.
 *
 * REDESIGNED 2026-08-08 (second pass, direct client request -- senior-UI/UX
 * call, see the dropdown render below for the full reasoning): Services now
 * holds the full `ServicePillar` objects (icon + label + description), not
 * just `{label, href}` -- the mega-menu grid needs the icon and one-line
 * description content strategy already established by the homepage "What
 * We Do" section (Services.tsx), reused verbatim rather than re-authored,
 * same no-fabrication standard this file already followed.
 *
 * KEY CHANGED to "/#services" (third pass, same day, direct client
 * decision -- "there is no need of a separate services page, we already
 * have that section at homepage"): was "/services", matching a standalone
 * page that never got built. Must stay in sync with NAV_LINKS' own
 * "Services" entry (constants/navigation.ts) -- this lookup keys off
 * `link.href`, so if one changes without the other the dropdown silently
 * stops matching.
 *
 * "Coming soon" RETIRED (fourth pass, same day): the client supplied the
 * real Solutions catalog directly -- two categories, "Enterprise / Finance
 * Solutions" and "Healthcare Solutions" (`constants/solutions.ts`, copied
 * verbatim, same no-fabrication standard). `NAV_DROPDOWNS` is now a
 * discriminated union (`kind: "services" | "solutions"`) instead of
 * `ServicePillar[] | "placeholder"`, since the two dropdowns render
 * genuinely different shapes (an icon+description grid vs. two labeled
 * columns of plain links) -- a shared array-or-placeholder type stopped
 * fitting once both were real, differently-shaped content.
 */
type DropdownKind = { kind: "services" } | { kind: "solutions" };

const NAV_DROPDOWNS: Record<string, DropdownKind> = {
  "/#services": { kind: "services" },
  "/solutions": { kind: "solutions" },
};

/**
 * Purpose: single unified navigation bar, replacing the current live site's
 * two-layer header (contact bar + nav) flagged in Docs/Lyftek Website
 * Redesign Strategy.pdf as adding unnecessary height and burying the logo.
 *
 * Structure (REVISED 2026-08-08, direct client decision on a two-option
 * senior-UI/UX call -- "full-stretch the navbar from left to right" over
 * keeping it a margined floating box): Navbar is now full-viewport-width
 * chrome, docked flush to the top of the page (no top margin/gap, no side
 * gutters, no DASHBOARD_CONTAINER width cap) with a single `border-b
 * border-border` hairline separating it from the page. Lime `CornerBrackets`
 * are removed entirely -- they existed to mark Navbar as "a boxed panel,"
 * which no longer applies once it's edge-to-edge chrome rather than a
 * widget. This deliberately breaks Navbar OUT of the "everything lives
 * inside the boxed dashboard frame" identity it used to share with Hero/
 * WhyLyftek/Footer: those sections keep the boxed `DASHBOARD_CONTAINER`
 * treatment (now with `border-x border-border` side rails replacing what
 * the lime corners used to signal) precisely BECAUSE they're dashboard
 * content, while Navbar is global app-shell chrome -- the same chrome/
 * content split real dashboard products (Linear, Vercel, Stripe) use. See
 * Hero.tsx/WhyLyftek.tsx/Footer.tsx for the matching side of this change.
 *
 * Previously: an independent floating box inset to Hero's own
 * DASHBOARD_CONTAINER width, `mt-8` gap from the viewport top, lime
 * corner-bracket marks on all 4 corners, and app/page.tsx pulling Hero's
 * panel up via negative margin so the page background showed through
 * around the float. All of that is gone now that Navbar is flush,
 * full-width chrome -- see constants/layout.ts's NAVBAR_FOOTPRINT_PX and
 * app/page.tsx for the matching cleanup.
 *
 * Accessibility: skip link to #main-content, semantic <header>/<nav>
 * landmarks, aria-current on the active link, aria-expanded/controls on the
 * mobile toggle, Escape closes the mobile menu, visible focus rings
 * throughout. Motion is skipped for users who prefer reduced motion.
 *
 * Desktop link interaction (researched against Stripe/Vercel/Linear vs.
 * IBM/Microsoft/GitHub -- see claudeContextExchange.md for the full
 * precedent comparison): the active link gets a flat 2px accent underline
 * that slides between links via Framer Motion's layoutId (functional
 * wayfinding, not decoration); inactive links get a fast CSS-only
 * underline-grow on hover/focus. Deliberately NOT done: glow/shadow on the
 * indicator, or an always-on blurred/translucent background -- both would
 * tip into the effects 04_VISUAL_LANGUAGE.md explicitly bans.
 */
export function Navbar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close the mobile menu on route change. Adjusted during render (React's
  // recommended pattern for state that must reset when a prop changes)
  // rather than in an effect, which would cause an extra render pass.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const isActiveLink = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    // 2026-08-08: no more inner boxed-panel div -- Navbar is full-width
    // chrome now (see the component docblock above), so there's no
    // width-capped child to separate from this flex-item `header` the way
    // the old floating box needed. `border-b` lives directly on `header`.
    //
    // CONTENT ROW CAPPED TO DASHBOARD_CONTAINER (2026-08-08, follow-up,
    // direct client call after a senior-UI/UX layout discussion): the
    // `bg-panel`/`border-b` CHROME stays genuinely full-bleed (unchanged
    // from the decision above) -- only the logo/nav-links/CTA row now
    // aligns to the same 1440px `DASHBOARD_CONTAINER` column every section
    // below shares. Two things this fixes at once: (1) on very wide
    // monitors, `justify-between` across the TRUE viewport edge was
    // stretching the logo and CTA apart enough to read as an odd, overly
    // wide gap next to the nav links (still visible on the reference sites
    // this layout was originally researched against -- Stripe/Vercel/
    // Linear -- but more pronounced here since this site has no page-level
    // max-width elsewhere either, only this per-section DASHBOARD_CONTAINER
    // system); (2) the logo and CTA button now land directly above the
    // same `border-x` rail x-positions Hero/About/Services/etc. use, so the
    // page's whole vertical grid -- chrome included -- shares one visible
    // column, not just the sections below it.
    <header className="bg-panel border-border sticky top-0 z-50 border-b">
      <div className="relative">
        <a
          href="#main-content"
          className="focus:bg-accent focus:text-accent-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <div
          className={`flex h-16 items-center justify-between px-6 md:px-8 ${DASHBOARD_CONTAINER}`}
        >
          {/*
            2026-08-07, direct client instruction (after fetching Martian
            Mono as a licensed AO Mono substitute): "navbar elements...
            we gonna use martian mono." Wordmark switched from `font-
            heading` (IBM Plex Sans, the sitewide heading face) to
            `font-martian-mono` -- see app/layout.tsx + app/globals.css
            docblocks for the full font provenance.
          */}
          {/*
            2026-08-08, direct client request: the favicon asset
            (assets/favicon.png -- also wired up as the actual browser-tab
            favicon via app/icon.png, Next's auto-detected icon convention)
            replaces the separate "Lyftek" text wordmark here, not sitting
            beside it -- the asset already has "LYFTEK" baked into the image
            itself below the mark (see the file directly), so a plain-text
            duplicate next to it was redundant. First pass sized this at
            `h-7 w-7` to sit beside the text, which cropped/shrank that
            baked-in wordmark down to illegible -- follow-up correction:
            text dropped, image sized up to `h-12` (most of the navbar's
            `h-16` row, small margin so it doesn't touch the sticky header's
            edges) so the image's own "LYFTEK" text actually reads. `w-auto`
            preserves the source's native aspect ratio (502x497, near-
            square) rather than forcing a square box that would squash it.
            `alt="Lyftek"` (not empty) now that the image is the link's only
            content -- it's carrying the accessible name/home-link meaning
            by itself, not decorating text that already provides it.
            Static `next/image` import (not a plain <img>) so Next serves it
            pre-optimized/sized at build time, same as this codebase's other
            `next/image` usage (Avatar.tsx). `priority` -- this renders
            above the fold on every route, so it shouldn't lazy-load.
          */}
          <Link
            href="/"
            className="focus-visible:ring-accent rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <Image src={favicon} alt="Lyftek" priority className="h-12 w-auto" />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden lg:flex lg:items-center lg:gap-8"
          >
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              const dropdown = NAV_DROPDOWNS[link.href];

              return (
                // 2026-08-08: `dropdown ? "group/item" : undefined` -- a
                // SECOND, independently-named group. This link already
                // uses the unnamed `group` (below) for its own underline
                // hover state; the dropdown panel needs its own hover
                // trigger scoped to just this list item (not every nav
                // link at once), which plain `group`/`group-hover` can't
                // express once there are two different hover behaviors
                // nested in the same tree -- Tailwind's named groups
                // (`group/item`, `group-hover/item:`) exist exactly for
                // this "more than one group in scope" case.
                <div
                  key={link.href}
                  className={cn("relative", dropdown && "group/item")}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={dropdown ? "true" : undefined}
                    className={cn(
                      "focus-visible:ring-accent font-martian-mono group relative inline-flex items-center gap-1 rounded-sm py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                      active
                        ? "text-foreground"
                        : "text-foreground-secondary hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {dropdown && (
                      // REVISED 2026-08-08 (direct client feedback: "the
                      // current hover doesnt have any responsiveness to the
                      // arrow, the arrow does not point up and down based on
                      // hover"): the earlier fixed, non-rotating up-caret is
                      // gone -- this supersedes that same-day-earlier
                      // decision. Now a single `CaretUp` glyph rotated 180deg
                      // at rest (reads as pointing DOWN, the conventional
                      // "expand downward" affordance) that rotates back to
                      // 0deg (pointing UP, "collapse") on the same
                      // `group-hover/item`/`group-focus-within/item` state
                      // that opens the drawer below -- one icon, a CSS
                      // rotation, always in sync with the actual open/closed
                      // state instead of a static mark that doesn't react.
                      <CaretUp
                        aria-hidden
                        size={12}
                        className="shrink-0 rotate-180 transition-transform duration-200 ease-out group-hover/item:rotate-0 group-focus-within/item:rotate-0"
                      />
                    )}
                    {active ? (
                      // Shared-layout indicator: Framer Motion animates this
                      // sliding smoothly to whichever link is active, instead of
                      // just appearing/disappearing. Flat 2px accent bar, no
                      // glow/shadow -- 04_VISUAL_LANGUAGE.md bans glow effects
                      // regardless of how subtle.
                      <motion.span
                        layoutId="nav-active-indicator"
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.2,
                          ease: "easeOut",
                        }}
                        className="bg-accent absolute inset-x-0 -bottom-1 h-[2px] rounded-full"
                      />
                    ) : (
                      // Hover-only underline, CSS transform only (no Framer
                      // Motion needed for a plain hover state per
                      // 13_MOTION_AND_ANIMATION.md's "CSS first" guidance).
                      // Also triggers on keyboard focus, not just mouse hover.
                      <span
                        aria-hidden
                        className="bg-foreground-secondary absolute inset-x-0 -bottom-1 h-[1.5px] origin-left scale-x-0 rounded-full transition-transform duration-150 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    )}
                  </Link>

                  {dropdown && (
                    // REDESIGNED 2026-08-08 (direct client request, senior-
                    // UI/UX call): the old panel was a small `w-64` boxed
                    // popover anchored to this link's own left edge --
                    // client wanted something "not of boxy shape," full
                    // "viewport dashboard" width, with its top edge flush
                    // against Navbar's own bottom edge, more like a drawer
                    // opening out of the whole navbar than a dropdown
                    // hanging off one word.
                    //
                    // `fixed inset-x-0 top-16`: escapes this link's own
                    // position entirely (this wrapper is still the DOM
                    // ancestor for `group-hover/item`/`group-focus-within/
                    // item` purposes -- fixed positioning changes the
                    // containing block, not the DOM tree, so the hover/focus
                    // relationship this codebase already relies on keeps
                    // working) and instead spans the full viewport width,
                    // pinned exactly `top-16` (64px) below the viewport top
                    // -- Navbar's own real row height (`h-16`), and Navbar
                    // is always pinned at the very top itself (`sticky
                    // top-0`, and it's the first element on the page, so it
                    // never sits anywhere else). That's what makes this
                    // drawer's top edge land exactly on Navbar's bottom
                    // edge at any scroll position, not just on first paint.
                    //
                    // Inner div reuses `DASHBOARD_CONTAINER` -- the exact
                    // same width token Hero/About/Services/WhyLyftek/
                    // ContactCTA/Footer all share -- so the drawer's own
                    // `border-x` rails land on the SAME x-position as every
                    // other section's rails below it, and its `border-t`
                    // sits flush with Navbar's `border-b` (both at y=64px):
                    // opening it reads as the page's existing boxed-
                    // dashboard frame extending one panel further, not a
                    // disconnected popover. Square corners, no
                    // border-radius, no drop shadow -- same flat,
                    // brutalist-leaning panel language as every other
                    // bordered surface on this site (04_VISUAL_LANGUAGE.md);
                    // "not boxy" reads here as "not a cramped little card,"
                    // not as "give it rounded corners."
                    //
                    // `border-b` added (2026-08-08, senior-UI/UX call after
                    // the client asked directly whether to close it):
                    // unlike a page SECTION -- where the next section's own
                    // `border-t` implicitly closes the one above it (see
                    // About/Services/WhyLyftek/ContactCTA/Footer's shared
                    // "RAILS MADE CONTINUOUS" pattern) -- this drawer is a
                    // `fixed` OVERLAY sitting on top of whatever page
                    // content is underneath, not a document-flow neighbor
                    // with a next section to borrow an edge from. Left
                    // open-bottomed, it reads as unfinished/bleeding into
                    // the page rather than a deliberate surface. Closing
                    // all four sides is the right call specifically because
                    // this is temporary, overlay UI, not more boxed-
                    // dashboard content -- it should read as clearly
                    // separate from the page it's sitting on top of. Still
                    // flat/square, still no shadow -- "closed" isn't the
                    // same lever as "boxy card."
                    //
                    // Reveal: opacity + a slightly larger downward settle
                    // (`-translate-y-3`, up from the old panel's `-2`) over
                    // a longer `duration-300` -- reads as a soft drawer
                    // opening at this width, not a small popover snapping
                    // in. `invisible` (not just `opacity-0`) keeps it
                    // genuinely unreachable by mouse/keyboard while closed.
                    <div className="invisible fixed inset-x-0 top-16 z-40 -translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100">
                      <div
                        className={`bg-panel border-border border-t border-b border-x ${DASHBOARD_CONTAINER}`}
                      >
                        {dropdown.kind === "services" ? (
                          <div className="px-6 py-10 md:px-8 lg:p-12">
                            {/*
                              2026-08-08: eyebrow copy changed from "What We
                              Do" to "Our Services" per direct client
                              request -- this is the nav drawer's own label,
                              not required to match Services.tsx's section
                              eyebrow verbatim (the content grid below it
                              still reuses that section's real `SERVICE_
                              PILLARS` data, just not its heading text).
                              Style unchanged (accent square + uppercase
                              tracked label) -- same eyebrow treatment every
                              other section on this site uses.
                            */}
                            <div className="flex items-center gap-2">
                              <span
                                aria-hidden
                                className="bg-accent h-2 w-2 shrink-0"
                              />
                              <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
                                Our Services
                              </p>
                            </div>

                            {/*
                              2x4 grid, per direct client spec -- split into
                              two explicit column `<div>`s (4 items each)
                              rather than one 8-item `grid-cols-2` flow, so a
                              single `divide-x` on the 2-column outer grid
                              draws exactly ONE vertical rule between the
                              columns (2026-08-08, direct client request).
                              A plain `grid-cols-2` with 8 children in DOM
                              order wouldn't give a clean single divider --
                              CSS grid auto-flow alternates children
                              left/right column by column, so a per-child
                              divider would land between every item, not
                              just between the two columns. Content is
                              `SERVICE_PILLARS` verbatim (icon + label +
                              one-line description) -- the same content
                              strategy the homepage "What We Do" section
                              already uses, reused rather than re-authored.

                              No "View All Services" link below this grid
                              anymore (removed 2026-08-08, direct client
                              decision -- "there is no need of a separate
                              services page, we already have that section at
                              homepage"): it used to point at a standalone
                              `/services` page that was never built. This
                              grid already shows all 8 services, and each
                              one's own href now jumps straight to its card
                              in that homepage section (see constants/
                              services.ts) -- there's no further "more"
                              destination left to link to.
                            */}
                            <div className="divide-border mt-8 grid grid-cols-2 divide-x">
                              {[
                                SERVICE_PILLARS.slice(0, 4),
                                SERVICE_PILLARS.slice(4, 8),
                              ].map((column, columnIndex) => (
                                <div
                                  key={columnIndex}
                                  className={cn(
                                    "flex flex-col gap-8",
                                    columnIndex === 0 ? "pr-12" : "pl-12",
                                  )}
                                >
                                  {column.map((service) => (
                                    <Link
                                      key={service.href}
                                      href={service.href}
                                      className="group/service focus-visible:ring-accent -m-2 flex items-start gap-4 rounded-sm p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                    >
                                      <service.icon
                                        aria-hidden
                                        size={24}
                                        weight="light"
                                        className="text-accent mt-0.5 shrink-0"
                                      />
                                      <div className="flex flex-col gap-1">
                                        <p className="font-rinter text-foreground group-hover/service:text-accent text-base tracking-tight transition-colors">
                                          {service.label}
                                        </p>
                                        <p className="text-foreground-muted text-sm leading-snug">
                                          {service.description}
                                        </p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // REPLACED 2026-08-08: the "Coming soon" honest
                          // placeholder this branch used to render is gone
                          // -- the client supplied the real Solutions
                          // catalog directly (`SOLUTION_CATEGORIES`,
                          // constants/solutions.ts), so there's real content
                          // to show now instead of an acknowledged gap.
                          //
                          // Two columns, one per category ("Enterprise /
                          // Finance Solutions" / "Healthcare Solutions"),
                          // same `divide-x` single-rule-between-columns
                          // mechanism Services uses (see that branch's own
                          // comment for why a plain `grid-cols-2` over the
                          // flattened item list wouldn't give a clean single
                          // divider). Unlike Services, each column here is a
                          // labeled category with its own heading above a
                          // plain vertical link list -- no icons/
                          // descriptions were supplied for these items (13
                          // across 2 categories, denser than Services' 8),
                          // so this deliberately doesn't force the icon-grid
                          // treatment onto content that wasn't given that
                          // shape. Column heights differ (8 items vs. 5) --
                          // left as-is rather than padded/balanced, since
                          // that's the real shape of the two catalogs, not
                          // a layout bug.
                          <div className="px-6 py-10 md:px-8 lg:p-12">
                            <div className="flex items-center gap-2">
                              <span
                                aria-hidden
                                className="bg-accent h-2 w-2 shrink-0"
                              />
                              <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
                                Our Solutions
                              </p>
                            </div>

                            <div className="divide-border mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:divide-x sm:gap-y-0">
                              {SOLUTION_CATEGORIES.map(
                                (category, columnIndex) => (
                                  <div
                                    key={category.label}
                                    className={cn(
                                      "flex flex-col gap-4",
                                      columnIndex === 0
                                        ? "sm:pr-12"
                                        : "sm:pl-12",
                                    )}
                                  >
                                    {/*
                                      2026-08-08, direct client request:
                                      lime underline added under each
                                      category heading. `border-accent`
                                      (not the plain CSS `underline`
                                      utility, which would use
                                      `currentColor` -- white, this
                                      heading's own text color -- not the
                                      brand lime) so the rule is lime, not
                                      white. `inline-block` alone wasn't
                                      enough to keep it tight to the text --
                                      this `<p>` is a flex ITEM (parent is
                                      `flex flex-col`), and flexbox's
                                      default `align-items: stretch`
                                      stretches items to fill the cross
                                      axis regardless of their own
                                      `display` value, which was rendering
                                      the border across the full column
                                      width instead of just under the text
                                      (confirmed via screenshot -- the fix
                                      wasn't visually obvious from the
                                      class list alone). `self-start`
                                      opts this one flex item out of that
                                      stretch so `inline-block` sizing
                                      actually applies.
                                    */}
                                    <p className="font-rinter text-foreground border-accent inline-block self-start border-b-2 pb-2 text-base tracking-tight">
                                      {category.label}
                                    </p>
                                    <ul className="flex flex-col gap-3">
                                      {category.items.map((item) => (
                                        <li key={item.href}>
                                          <Link
                                            href={item.href}
                                            className="group/solution focus-visible:ring-accent text-foreground-secondary hover:text-accent -m-2 block rounded-sm p-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                          >
                                            {item.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href={PRIMARY_CTA.href} variant="primary">
              {PRIMARY_CTA.label}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </Button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: "easeInOut",
              }}
              className="border-panel-border overflow-hidden border-t lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-accent font-martian-mono rounded-md px-3 py-2.5 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                      isActiveLink(link.href)
                        ? "bg-surface text-foreground"
                        : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  href={PRIMARY_CTA.href}
                  variant="primary"
                  className="mt-3 w-full"
                >
                  {PRIMARY_CTA.label}
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
