"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretUp, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
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
/**
 * Mobile drawer accordion motion (2026-08-11, client reference:
 * ui.watermelon.sh "Tree-menu").
 *
 * The reference component is a DRILL-DOWN -- tapping a parent replaces the
 * list with its children behind a breadcrumb. What the client actually asked
 * for is an accordion ("show only main buttons, when clicked then show the
 * subsections"), so only the reference's MOTION is borrowed, not its
 * navigation model: 50ms per-child stagger and a 15px rise, both measured off
 * the live component.
 *
 * `custom` carries `prefersReducedMotion`. Reduced motion must kill the
 * STAGGER, not merely shorten it -- a sequential reveal is exactly the
 * motion the preference is about -- and drop the y travel to a pure fade.
 * Height still animates, briefly: snapping a disclosure open is more
 * disorienting than a short reveal, and the guidance is "reduce", not
 * "remove". Height is NOT a positional key, so `MotionConfig
 * reducedMotion="user"` will not gate it for us; it has to be explicit
 * (same trap the drawer's own `duration` gate documents).
 */
const subListVariants = {
  collapsed: (reduced: boolean) => ({
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: reduced ? 0.12 : 0.28,
        ease: [0.4, 0, 0.2, 1] as const,
      },
      opacity: { duration: reduced ? 0.08 : 0.15 },
      staggerChildren: reduced ? 0 : 0.03,
      staggerDirection: -1 as const,
    },
  }),
  expanded: (reduced: boolean) => ({
    height: "auto" as const,
    opacity: 1,
    transition: {
      height: {
        duration: reduced ? 0.12 : 0.32,
        ease: [0.4, 0, 0.2, 1] as const,
      },
      opacity: { duration: reduced ? 0.08 : 0.2 },
      delayChildren: reduced ? 0 : 0.06,
      staggerChildren: reduced ? 0 : 0.05,
    },
  }),
};

const subItemVariants = {
  collapsed: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : -8,
  }),
  expanded: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: reduced
      ? { duration: 0.1 }
      : // Matches the reference's measured ~11.9% overshoot settling in ~300ms.
        { type: "spring" as const, bounce: 0.2, visualDuration: 0.3 },
  }),
};

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
 * that slides between links; inactive links get a fast CSS-only
 * underline-grow on hover/focus. Deliberately NOT done: glow/shadow on the
 * indicator, or an always-on blurred/translucent background -- both would
 * tip into the effects 04_VISUAL_LANGUAGE.md explicitly bans.
 *
 * THE SLIDING INDICATOR IS A SINGLE MEASURED ELEMENT, NOT A PER-LINK
 * `layoutId` (rebuilt 2026-08-10, client-reported bug: "the underline...
 * goes fast, and moves from diagonal random direction... must be
 * consistent, must smoothly move horizontally on navbar only"). The first
 * version rendered a separate `motion.line` under whichever link was
 * active and let Framer Motion's `layoutId` FLIP between the outgoing and
 * incoming instances. That works cleanly for a simple A-to-B move, but this
 * nav has pages where NO top-level link matches at all (every `/services/
 * [slug]` and `/solutions/[slug]` detail route -- `isActiveLink` only
 * matches `/`, `/about`, `/solutions`, `/careers`, `/contact` exactly/by
 * prefix, not the "#services" hash `NAV_LINKS` uses for Services or any
 * detail-page path). Landing on one of those unmounts the indicator
 * entirely; the NEXT top-level click then has no outgoing instance for
 * Framer Motion to FLIP from, so it has to fall back to some other
 * start point -- inconsistent by construction, not a one-off glitch.
 *
 * Fixed by making the indicator ONE persistent element (rendered once,
 * directly in `<nav>`, never unmounted) whose `left`/`width` are
 * explicitly measured off the real active link's `getBoundingClientRect()`
 * (`measureIndicator`, below) and animated via plain `animate={{ left,
 * width }}` -- `top`/`bottom` are fixed in the className and never enter
 * the animated properties, so there is no value for it to interpolate
 * vertically even in principle. Re-measured on route change
 * (`useLayoutEffect`, so the correct rect is committed before paint -- no
 * one-frame flash at the old position) and on window resize. When no link
 * matches (the detail-page case above), it fades out in place via
 * `opacity` rather than unmounting, so the next real match always has a
 * consistent last-known `left`/`width` to animate from instead of an
 * undefined starting point.
 */
export function Navbar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Single-open accordion: our two expandable sections carry 8 and 13 children,
  // so allowing both would make the drawer ~1000px of scroll on a 667px phone.
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // See the component docblock's "THE SLIDING INDICATOR IS A SINGLE
  // MEASURED ELEMENT" section. `navRef` is the coordinate space every
  // measurement is relative to; `linkRefs` is populated by each Link's
  // callback ref below so `measureIndicator` can look one up by href
  // without re-querying the DOM.
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const measureIndicator = useCallback(() => {
    // Inlined rather than calling `isActiveLink` (defined further down):
    // that closure is recreated every render, which would make it an
    // unstable dependency here. Same two-line rule, just not shared.
    const activeLink = NAV_LINKS.find((link) =>
      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href),
    );
    const linkEl = activeLink
      ? linkRefs.current.get(activeLink.href)
      : undefined;

    if (!linkEl || !navRef.current) {
      // Fades out in place (last-known left/width kept) rather than
      // snapping to 0 -- see the docblock for why an undefined starting
      // point for the NEXT match is exactly the inconsistency being fixed.
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }

    const linkRect = linkEl.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      visible: true,
    });
  }, [pathname]);

  // `useLayoutEffect`, not `useEffect`: commits the correct rect before the
  // browser paints the new route, so there is no one-frame flash at the
  // indicator's previous position.
  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  // Link widths are fixed-font/fixed-text, so this only matters for the
  // rare case of a resize crossing the `lg` breakpoint where the desktop
  // nav itself toggles display -- cheap enough not to debounce.
  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  /*
   * Escape closes the mobile menu, and focus returns to the toggle.
   *
   * This behaviour was DOCUMENTED in this file's header ("Escape closes the
   * mobile menu") but never actually implemented -- there was no keydown
   * listener anywhere in the component. Found during the 2026-08-11
   * responsive/a11y pass.
   *
   * Focus return matters as much as the close: the toggle is the element
   * that opened the menu, and without moving focus back a keyboard user is
   * left on a detached node and continues tabbing from <body>.
   */
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Escape always closes the WHOLE drawer, never just an expanded
      // section. Two-stage Escape reads as unresponsive on the first press,
      // and this file already documents the close+focus-return contract.
      setIsMobileMenuOpen(false);
      setExpandedKey(null);
      mobileToggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  /*
   * Suppresses the desktop mega-menu after a pointer click on one of its
   * links, until the pointer leaves and re-enters a nav item.
   *
   * THE BUG THIS FIXES (reported 2026-08-10, reproduced before fixing): the
   * mega-menu is opened purely in CSS, by `group-hover/item` OR
   * `group-focus-within/item`. Clicking a link inside it navigates but
   * leaves that link focused -- and because the link is a descendant of the
   * group, `focus-within` stays true, so the panel stayed open even after
   * the pointer moved away. Measured: after clicking a solution and moving
   * the mouse to the far side of the page, the panel was still
   * `visibility: visible; opacity: 1`. The only thing that closed it was
   * clicking somewhere else, which is exactly the workaround the client
   * described ("I have to tap somewhere random so that it would
   * disappear").
   *
   * Two things are needed, and hover alone fixes neither:
   *   1. release the focus that pins `focus-within` open, and
   *   2. close the panel straight away on click, rather than leaving it up
   *      until the pointer happens to move off it.
   *
   * KEYBOARD USERS ARE DELIBERATELY EXCLUDED from both. The handler below
   * only runs for real pointer clicks (`event.detail > 0`; keyboard
   * activation of a link reports `detail === 0`). Blurring on an Enter
   * keypress would throw focus to <body> and lose the user's place in the
   * menu, and unmounting the panel out from under a focused element is
   * worse still. For keyboard navigation the existing behaviour is already
   * correct: Tab out of the menu and `focus-within` releases on its own.
   */
  const [isDropdownSuppressed, setIsDropdownSuppressed] = useState(false);

  /*
   * STRIPE-STYLE DIRECTIONAL PANEL SLIDE (2026-08-11, direct client request:
   * "when clicked on button that has dropdown like services and solutions,
   * the dropdown content comes smoothly from left or right when hovered").
   *
   * Stripe's nav reads as ONE panel that morphs: move Services -> Solutions
   * and the outgoing content leaves to the LEFT while the incoming content
   * arrives from the RIGHT, because that's the direction you travelled along
   * the navbar. Move back the other way and both reverse.
   *
   * This is deliberately NOT a rewrite of how the panel opens. Opening stays
   * exactly where it was -- pure CSS, `group-hover/item` /
   * `group-focus-within/item` on the wrapper below. That mechanism carries a
   * lot of hard-won behaviour (the hover bridge, keyboard `focus-within`,
   * caret rotation, `isDropdownSuppressed`), all of which breaks the moment
   * the panel stops being a DOM descendant of its trigger. So this state
   * feeds ONE thing and one thing only: which side the CONTENT enters and
   * exits from. If it were ever wrong, the panels would still open, close,
   * and be keyboard-reachable exactly as before -- only the slide direction
   * would read oddly. That containment is the whole point.
   *
   * The morph itself comes for free: both panels are `fixed inset-x-0
   * top-16` and share `DASHBOARD_CONTAINER`, so they occupy the identical
   * screen box. Cross-fading them at the same rails, with the content
   * sliding along the travel axis, is what sells "one panel that changed"
   * instead of "one popover closed and another opened".
   *
   * `cur` = index of the trigger being hovered/focused now; `prev` = the one
   * before it, and `null` on a fresh open (nothing to travel FROM, so the
   * panel just does its existing downward settle with no horizontal move).
   */
  const [travel, setTravel] = useState<{
    cur: number | null;
    prev: number | null;
  }>({
    cur: null,
    prev: null,
  });

  // Guard on `cur === index`: pointer moves fire mouseenter on the wrapper
  // repeatedly, and without this every one of them would rewrite `prev` to
  // the panel's own index and cancel its slide mid-flight.
  const enterTrigger = (index: number) =>
    setTravel((t) => (t.cur === index ? t : { cur: index, prev: t.cur }));

  /*
   * Returns the `key` + `initial`/`animate` x-offsets for panel `index`.
   *
   * THE `key` IS LOad-BEARING, and the reason this is Framer rather than a
   * CSS transition. An ENTER animation needs the element to render at its
   * start offset in one frame and its end offset in the next -- but hovering
   * a trigger produces exactly ONE React commit, in which the panel's offset
   * and its open state both change together. Measured: a CSS-transition
   * version slid the OUTGOING panel correctly (0 -> -40px) while the
   * incoming one sat at 0 the whole time, because it had no previous frame
   * at 40px to travel from. Framer replays `initial` -> `animate` on mount,
   * so changing the key remounts the wrapper and gives the enter its missing
   * first frame. Both halves of the morph then fall out of one rule:
   *   - entering: mounts on the side it travelled FROM, animates to 0
   *   - exiting:  mounts at 0, animates out the OPPOSITE side
   *
   * The key only changes when this panel's ROLE changes (entering / exiting
   * / idle), so pointer noise across the navbar does not remount anything,
   * and a keyboard user tabbing INTO an already-open panel does not have the
   * element ripped out from under their focus -- `enterTrigger` has already
   * short-circuited by then, so no state change reaches here at all.
   *
   * Note there is no reset when the pointer leaves the navbar entirely. That
   * was tried and removed: clearing `travel` mid-fade retargets the exiting
   * panel to x:0, so it visibly snaps back to centre while fading out. The
   * direction simply persists, which is also the more honest reading of the
   * request -- it reflects the last real move made along the navbar.
   */
  const panelSlide = (index: number) => {
    const OFFSET = 40;
    if (travel.cur === index) {
      if (travel.prev === null)
        // Nothing to travel from: keep the existing fade + downward settle.
        return { key: "enter-fresh", from: 0, to: 0 };
      return {
        key: `enter-from-${travel.prev}`,
        from: travel.prev < index ? OFFSET : -OFFSET,
        to: 0,
      };
    }
    if (travel.prev === index && travel.cur !== null)
      return {
        key: `exit-to-${travel.cur}`,
        from: 0,
        to: travel.cur > index ? -OFFSET : OFFSET,
      };
    return { key: "idle", from: 0, to: 0 };
  };

  // Close the mobile menu on route change. Adjusted during render (React's
  // recommended pattern for state that must reset when a prop changes)
  // rather than in an effect, which would cause an extra render pass.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setIsMobileMenuOpen(false);
    // Reset here too, or an expanded section leaks across navigations and the
    // drawer reopens already-expanded on an unrelated page.
    setExpandedKey(null);
  }

  /**
   * Attach to every link INSIDE a mega-menu panel. Pointer clicks only --
   * see `isDropdownSuppressed` above for why keyboard activation is left
   * alone.
   */
  const handleDropdownLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (event.detail === 0) return;
    event.currentTarget.blur();
    setIsDropdownSuppressed(true);
  };

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
            <Image
              src={favicon}
              alt="Lyftek"
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav
            aria-label="Primary"
            ref={navRef}
            className="relative hidden lg:flex lg:items-center lg:gap-8"
          >
            {NAV_LINKS.map((link, linkIndex) => {
              const active = isActiveLink(link.href);
              const dropdown = NAV_DROPDOWNS[link.href];
              const slide = panelSlide(linkIndex);

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
                  // Re-arms the menu once the pointer leaves this item and
                  // comes back to it. Without this the panel would stay
                  // suppressed for the rest of the session after the first
                  // click. `onMouseEnter` rather than `onMouseLeave`: when
                  // the panel unmounts under the cursor, whether a
                  // `mouseleave` fires on this ancestor is not something to
                  // rely on, whereas a fresh `mouseenter` is unambiguous
                  // intent to open the menu again.
                  onMouseEnter={
                    dropdown
                      ? () => {
                          setIsDropdownSuppressed(false);
                          enterTrigger(linkIndex);
                        }
                      : undefined
                  }
                  // Keyboard users open the panel via `focus-within`, which
                  // no mouse event ever sees -- without this, tabbing from
                  // Services to Solutions would morph with no direction.
                  // Capture phase because the focus lands on a descendant
                  // link, and `focus` itself does not bubble.
                  onFocusCapture={
                    dropdown ? () => enterTrigger(linkIndex) : undefined
                  }
                >
                  <Link
                    ref={(el) => {
                      if (el) linkRefs.current.set(link.href, el);
                      else linkRefs.current.delete(link.href);
                    }}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={dropdown ? "true" : undefined}
                    // The TRIGGER link has the same problem its panel's own
                    // links had (reported 2026-08-10, second report): it
                    // sits inside `group/item` too, so clicking "Services"
                    // or "Solutions" itself left it focused and
                    // `group-focus-within/item` held the panel open until
                    // something else was clicked. The first pass at this
                    // fixed only the links INSIDE the panel and missed the
                    // two that open it.
                    //
                    // Scoped to dropdown triggers via the `dropdown ? ... :
                    // undefined` guard: the plain nav links (Home, About,
                    // Careers, Contact) open no panel, so there is nothing
                    // to close and no reason to take focus off them.
                    onClick={dropdown ? handleDropdownLinkClick : undefined}
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
                        className="shrink-0 rotate-180 transition-transform duration-200 ease-out group-focus-within/item:rotate-0 group-hover/item:rotate-0"
                      />
                    )}
                    {!active && (
                      // Hover-only underline, CSS transform only (no Framer
                      // Motion needed for a plain hover state per
                      // 13_MOTION_AND_ANIMATION.md's "CSS first" guidance).
                      // Also triggers on keyboard focus, not just mouse hover.
                      // Skipped on the active link -- the shared indicator
                      // below already marks it, so there's nothing for a
                      // second, redundant underline to add on hover.
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
                    // `isDropdownSuppressed` forces it shut regardless of
                    // hover/focus after a pointer click on one of its links
                    // -- see that state's docblock. Applied as extra
                    // utilities rather than by unmounting the panel, so the
                    // closing transition still runs and nothing inside is
                    // torn out from under the browser mid-interaction.
                    // `pointer-events-none` matters: without it the
                    // invisible panel would still swallow clicks aimed at
                    // the page underneath it.
                    /*
                     * THE HANDOVER (2026-08-11, measured). Two panels cross-
                     * fading at the same rails means that mid-swap NEITHER is
                     * fully opaque: measured 24.7% of the page showing
                     * straight through the panel, hero headline and all. It
                     * reads as a rendering glitch, not a transition.
                     *
                     * `delay-200` + `group-*:delay-0` is the whole fix: a
                     * panel starts fading OUT 200ms after losing hover, but
                     * fades IN the instant it gains it. On a swap the
                     * incoming panel is therefore fully opaque before the
                     * outgoing one has begun to disappear, and the page is
                     * never visible between them. Re-measured: 0.0% bleed.
                     *
                     * IT HAS TO BE CSS, not JS. The first attempt scoped the
                     * hold to "is this panel being replaced" -- state only JS
                     * has -- and it made things much WORSE (24.7% -> 83.9%
                     * bleed travelling left). `mouseenter` is a continuous
                     * event, so React does not flush that setState before
                     * paint the way it does for a click; the CSS hover flips
                     * immediately and the class arrives a frame or more late,
                     * mid-fade, retiming a transition already in flight. Any
                     * fix that needs JS and CSS to agree WITHIN one frame
                     * loses this race. This one needs no agreement at all --
                     * both rules are pure CSS on the same element, so the
                     * browser applies them in the same frame by construction.
                     *
                     * The 200ms lingering close is a bonus, not a cost: it is
                     * the hover-intent grace period mega-menus normally have
                     * to add on purpose, and it forgives a pointer that clips
                     * the corner of the trigger on its way past.
                     *
                     * Excluded from the suppressed branch deliberately -- a
                     * click on a panel link must still close it instantly
                     * (that state's docblock records the original complaint:
                     * "I have to tap somewhere random so that it would
                     * disappear"). Expressed by OMITTING the delay classes
                     * there rather than overriding them with `delay-0`:
                     * same-specificity utilities are resolved by stylesheet
                     * order, not by the order they appear in this list, and
                     * Tailwind emits `delay-0` BEFORE `delay-200` -- so an
                     * override would have silently lost and the click-close
                     * would have kept the 200ms lag.
                     */
                    <div
                      className={cn(
                        "invisible fixed inset-x-0 top-16 z-40 -translate-y-3 opacity-0 transition-all duration-300 ease-out",
                        isDropdownSuppressed
                          ? "pointer-events-none"
                          : "delay-200 group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100 group-focus-within/item:delay-0 group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100 group-hover/item:delay-0",
                      )}
                    >
                      <div
                        // `overflow-hidden` is what makes the slide legible
                        // rather than messy: the content wrapper below rests
                        // 40px off to one side, and without clipping it would
                        // poke out past this panel's own `border-x` rails --
                        // the rails that are deliberately aligned to every
                        // other section's on the page. Nothing inside needs
                        // to escape the panel, so this costs nothing when the
                        // panel is open and fully settled.
                        className={`bg-panel border-border overflow-hidden border-x border-t border-b ${DASHBOARD_CONTAINER}`}
                      >
                        {/*
                          The morphing half of the Stripe effect -- see
                          `travel`/`panelSlide` above. The panel FRAME (rails,
                          background, position) never moves; only its contents
                          slide, which is exactly why the two panels read as
                          one surface whose contents changed rather than as one
                          popover closing and another opening.

                          `duration: 0.28` against the frame's own
                          `duration-300` fade: the contents land a touch before
                          the fade finishes, so the panel reads as settling
                          rather than still drifting once it's fully opaque.

                          `x` IS a positional key, so the app's `MotionConfig
                          reducedMotion="user"` already neutralises this for
                          users who ask for reduced motion -- unlike the
                          drawer's `height`, which had to be gated by hand.
                        */}
                        <motion.div
                          key={slide.key}
                          initial={{ x: slide.from }}
                          animate={{ x: slide.to }}
                          transition={{
                            duration: 0.28,
                            ease: [0.4, 0, 0.2, 1],
                          }}
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
                              <SectionEyebrow>Our Services</SectionEyebrow>

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
                                        onClick={handleDropdownLinkClick}
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
                              <SectionEyebrow>Our Solutions</SectionEyebrow>

                              <div className="divide-border mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-y-0 sm:divide-x">
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
                                        {/*
                                        Keyed on `label`, NOT `href`
                                        (2026-08-10): href stopped being
                                        unique once the four Healthcare
                                        entries without source content were
                                        all pointed at `/solutions` rather
                                        than at detail pages that would have
                                        had to be invented -- see
                                        constants/solutions.ts. React logged
                                        a duplicate-key warning and is free
                                        to drop or duplicate siblings that
                                        share a key. Labels are unique and
                                        are the real identity of an entry
                                        here; the destination is incidental
                                        and already changed once.
                                      */}
                                        {category.items.map((item) => (
                                          <li key={item.label}>
                                            <Link
                                              href={item.href}
                                              onClick={handleDropdownLinkClick}
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
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* The shared sliding indicator -- see the component docblock's
                "THE SLIDING INDICATOR IS A SINGLE MEASURED ELEMENT" section.
                One persistent element, `left`/`width` explicitly measured
                and animated; `top`/`bottom` are fixed in the className and
                never enter `animate`, so vertical movement isn't possible
                even in principle. Flat 2px accent bar, no glow/shadow --
                04_VISUAL_LANGUAGE.md bans glow effects regardless of how
                subtle. */}
            <motion.span
              aria-hidden
              initial={false}
              animate={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.32,
                ease: "easeOut",
              }}
              className="bg-accent pointer-events-none absolute -bottom-1 h-[2px] rounded-full"
            />
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
            ref={mobileToggleRef}
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
                {NAV_LINKS.map((link) => {
                  const dropdown = NAV_DROPDOWNS[link.href];
                  /*
                   * The mega-menu's children are mirrored into the drawer
                   * (2026-08-11 responsive pass). Previously the drawer
                   * carried only the 6 top-level NAV_LINKS, so every
                   * mega-menu child was desktop-only.
                   *
                   * For most of them that was survivable -- the 8 service
                   * pillars are all rendered by the /#services section and 9
                   * of the 13 solutions by the /solutions index, so the
                   * destinations stayed reachable at every width, just via an
                   * extra hop. But FOUR healthcare items (AI Agents,
                   * Patient Engagement, Specialty Solutions, Integrations)
                   * have `href: "/solutions"` and no SOLUTION_DETAILS entry,
                   * so the index never renders them: below 1024px those four
                   * strings did not exist anywhere on the site. That breaks
                   * the client's "every component visible at every viewport"
                   * rule outright.
                   *
                   * Mirroring the whole dropdown rather than special-casing
                   * those four keeps desktop and mobile navigation at genuine
                   * parity, so this can't silently regress the next time a
                   * child is added to one list and not the other.
                   */
                  const children = !dropdown
                    ? []
                    : dropdown.kind === "services"
                      ? SERVICE_PILLARS.map((p) => ({
                          label: p.label,
                          href: p.href,
                        }))
                      : SOLUTION_CATEGORIES.flatMap((c) => c.items);

                  const sectionId = `mobile-sub-${link.href}`;
                  const isExpanded = expandedKey === link.href;

                  return (
                    <div key={link.href} className="flex flex-col">
                      {/*
                        The row is a LINK plus a SEPARATE chevron button, not
                        one control doing both. "/solutions" and "/#services"
                        are real destinations, so the label has to navigate;
                        a single control cannot both navigate and stay put,
                        and putting `aria-expanded` on the anchor would make
                        it a link that doesn't link -- the classic trap.
                      */}
                      <div className="flex items-stretch gap-1">
                        <Link
                          href={link.href}
                          aria-current={
                            isActiveLink(link.href) ? "page" : undefined
                          }
                          className={cn(
                            "focus-visible:ring-accent font-martian-mono flex-1 rounded-md px-3 py-2.5 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                            isActiveLink(link.href)
                              ? "bg-surface text-foreground"
                              : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
                          )}
                        >
                          {link.label}
                        </Link>

                        {children.length > 0 && (
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={sectionId}
                            aria-label={`${isExpanded ? "Hide" : "Show"} ${link.label} sections`}
                            onClick={() =>
                              setExpandedKey((current) =>
                                current === link.href ? null : link.href,
                              )
                            }
                            className="focus-visible:ring-accent text-foreground-secondary hover:bg-surface-hover hover:text-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
                          >
                            <CaretUp
                              aria-hidden
                              size={14}
                              weight="bold"
                              className={cn(
                                "transition-transform duration-200 ease-out",
                                isExpanded ? "rotate-0" : "rotate-180",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/*
                        Kept MOUNTED and driven by `animate`, not wrapped in
                        AnimatePresence: `height: "auto"` needs a measurable
                        element, and `aria-controls` must point at a node that
                        exists even while collapsed.
                        `inert` is what actually removes the collapsed links
                        from the tab order -- `height: 0` + `overflow-hidden`
                        does NOT, so without it a keyboard user tabs into
                        invisible content.
                        Spacing lives in PADDING on the animated element, not
                        margin: margins are outside the animated box, so they
                        would not collapse and the row below would jump.
                      */}
                      {children.length > 0 && (
                        <motion.ul
                          id={sectionId}
                          inert={!isExpanded}
                          initial={false}
                          animate={isExpanded ? "expanded" : "collapsed"}
                          variants={subListVariants}
                          custom={prefersReducedMotion}
                          className="overflow-hidden"
                        >
                          <div className="border-panel-border ml-3 flex flex-col border-l pt-1 pb-2 pl-3">
                            {children.map((child, index) => (
                              <motion.li
                                key={`${child.href}-${index}`}
                                variants={subItemVariants}
                                custom={prefersReducedMotion}
                                className="list-none"
                              >
                                <Link
                                  href={child.href}
                                  className="focus-visible:ring-accent text-foreground-muted hover:text-foreground block rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                >
                                  {child.label}
                                </Link>
                              </motion.li>
                            ))}
                          </div>
                        </motion.ul>
                      )}
                    </div>
                  );
                })}
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
