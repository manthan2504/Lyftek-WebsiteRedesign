"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { LyftekMark } from "@/components/ui/LyftekMark";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { NAV_LINKS } from "@/constants/navigation";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  POLICY_LINKS,
  SOCIAL_LINKS,
} from "@/constants/footer";

// "Company" column links -- NAV_LINKS minus "Home" (the logo already covers
// that, and repeating it here was pure noise) -- see the decluttering
// docblock below.
const COMPANY_LINKS = NAV_LINKS.filter((link) => link.href !== "/");

/**
 * Purpose: site-wide footer -- wayfinding, legal/compliance links, and a
 * final contact/trust touchpoint.
 *
 * DECLUTTERED 2026-08-08 -- supersedes the original 5-column build (brand /
 * menu / services / policies / address, all at equal visual weight), which
 * the client's own assessment of the live site's footer (Docs/
 * Mythoughts.md) had originally said needed "no changes" structurally.
 * Direct client feedback later in the engagement reversed that: "the
 * current footer is very cluttered." A senior-UX pass on it found the real
 * problem wasn't link COUNT, it was flat hierarchy -- four full columns
 * (Menu, Services, Policies, Address) all competing at identical visual
 * weight, when they don't carry equal importance for a B2B lead-gen site.
 * Fixed by:
 * - Dropping the standalone "Services" column entirely -- it duplicated
 *   the homepage "What We Do" section a few scrolls up. One "Services"
 *   link now lives inside the "Company" column instead of 8 individual
 *   service names repeated here.
 * - Merging "Menu" into "Company" and dropping "Home" from it (the logo
 *   already covers that -- see `COMPANY_LINKS` above).
 * - Collapsing "Policies" out of its own column into one small, muted
 *   inline row next to the copyright line at the very bottom -- still
 *   fully present/compliant, just no longer matching the same visual
 *   weight as actual contact info.
 * - Promoting Contact (address/phone/email) to a full, equal column
 *   instead of being "the 5th column that happened to be last" -- it's
 *   the one thing a footer on a lead-gen site should actually prioritize.
 *
 * Net: 5 columns + a separate legal row -> 3 columns + one quiet line,
 * same information, clear hierarchy.
 *
 * "use client" is required here (no interactivity of its own otherwise) --
 * Phosphor's icon components use React Context internally, which throws
 * ("createContext only works in Client Components") when rendered from a
 * Server Component. Same reason Navbar.tsx, the only other icon consumer,
 * is also a Client Component.
 *
 * Usage: rendered once, in app/layout.tsx (global chrome, same pattern as
 * Navbar) -- never import it directly into a page.
 *
 * Structure: a boxed `bg-panel` panel using `DASHBOARD_CONTAINER` -- the
 * SAME width/gutter treatment as Navbar and Hero, not a full-bleed band.
 * CORRECTED 2026-08-07: the first version made the footer a full-viewport-
 * width band with only its inner content constrained to PANEL_CONTAINER --
 * that broke the "everything lives inside the boxed dashboard frame" visual
 * identity Navbar+Hero establish (both float as an inset panel with visible
 * page-background gutters on either side; a full-bleed bg-panel band has
 * zero gutter and reads as breaking out of that frame). The rule going
 * forward for this whole page: any section whose OWN background color
 * differs from the page background (`bg-panel` vs. `bg-background`) MUST be
 * boxed in `DASHBOARD_CONTAINER`, not full-bleed -- a color change is only
 * a "frame violation" when it reaches the true viewport edge. Sections that
 * use the plain `bg-background` (matching the page itself) don't have this
 * problem and can stay full-width with `PANEL_CONTAINER`-constrained inner
 * content instead -- there's no visible seam either way. `bg-panel`
 * deliberately bookends the page against Hero's own `bg-panel` open, with
 * every section between the two using plain `bg-background` -- see the
 * approved homepage section plan (2026-08-07) for the full page-level
 * rationale.
 *
 * Three-column layout at `lg:` (brand+social / company / contact),
 * stacking to a single column below that -- see the decluttering docblock
 * above for what changed from the original 5-column build.
 *
 * BOXED/PARTITIONED, then corners reconsidered (2026-08-08). First tried
 * per direct client instruction: "remove that lyftek logo and text both
 * on the footer... put these columns in box, with partitions... each
 * column would act as a square with brand color corner just like navbar"
 * -- the 3 columns got a `border-border` rectangle, `divide-x`/`divide-y`
 * partitions between them (reusing Services.tsx's "one continuous bordered
 * grid" pattern), and `CornerBrackets` on each column individually.
 *
 * Client then flagged it as feeling unprofessional, floated removing the
 * boxes entirely, then self-corrected to a narrower diagnosis and asked
 * for a senior-UI/UX judgment call: "remove that green color cornering
 * only and keep boxes." Agreed with that read over the fuller reversal --
 * the bordered/partitioned grid ITSELF isn't the problem (Services.tsx
 * uses the exact same "one continuous bordered grid" pattern for its 8
 * service cells and that was never flagged); what actually reads as
 * unprofessional is the lime `CornerBrackets` accent, whose entire
 * function elsewhere on this site (Navbar, formerly WhyLyftek) is to mark
 * ONE specific panel as special/branded -- repeating it 3 times back-to-
 * back within one small footer block (12 lime marks total) dilutes that
 * signal into a decorative pattern instead, which is exactly what
 * 04_VISUAL_LANGUAGE.md's "distinction from hierarchy, not decoration"
 * component philosophy warns against. Kept: the border + partitions.
 * Removed: `CornerBrackets` from all 3 columns (and the now-unneeded
 * `relative` positioning context each one only needed to host it).
 *
 * Data accuracy: address/phone/email/social URLs in constants/footer.ts
 * were copied from the live site during this session -- flagged there for
 * reconfirmation before launch, not assumed permanently correct.
 */
export function Footer() {
  return (
    <footer className="mb-8 lg:mb-12">
      {/*
        2026-08-08 (second pass on the same "cracked boxy vibe" complaint,
        same root cause as WhyLyftek.tsx -- see that file's docblock): the
        `mt-16 lg:mt-24` top margin this footer used to carry is gone.
        Measured a 96px empty gap between ContactCTA's bottom border and
        this footer's top border even after the border-t/border-x width fix
        below, because that margin physically pushed this box away from
        ContactCTA regardless of how well the borders lined up. `mb-8 lg:
        mb-12` stays -- trailing space at the true end of the page, after
        the last bordered box, isn't a connection problem the way a TOP
        margin between two boxes is.

        2026-08-07: first tried matching WhyLyftek's `border` +
        `CornerBrackets` outline here (a same-day fix for the two panels
        feeling inconsistent with each other). Direct follow-up feedback
        rejected that whole direction -- "we dont want that outline or
        colored corners just add seperation lines between sections." Both
        the border and CornerBrackets are removed (from here AND
        WhyLyftek.tsx, which had the same outline). Replaced with a plain
        `border-t border-divider` hairline every homepage section uses.

        Follow-up (same day): the line was originally on this div (inset
        to `DASHBOARD_CONTAINER` width) while Services/ContactCTA's lines
        were full-width -- flagged as inconsistent in a full top-to-bottom
        audit. Moved to the outer `<footer>` (full width) to match every
        other section. `bg-panel` + `DASHBOARD_CONTAINER` on the div below
        are unchanged.

        2026-08-08: `border-x border-border` added to this div -- Navbar
        lost its lime corners/shared width (now full-width chrome, see
        Navbar.tsx's docblock), so this panel (+ Hero + WhyLyftek) now
        carries the "bounded dashboard" cue itself via side rails. Side-
        only, no corner marks, no color -- deliberately narrower than the
        full outline+corners combo rejected above, not a reversal of that
        decision. The internal 3-column `border`/`divide-x` grid below is a
        separate, pre-existing thing (2026-08-08 footer restructure) and is
        unaffected by this.

        2026-08-08 (later same day): `border-t` moves BACK onto this div
        from the outer `<footer>` -- direct client feedback that the
        section-break lines running full-width past the (now-added)
        border-x rails read as "cracked," not connected (see About.tsx's
        docblock for the full reasoning). `border-divider` on the outer
        `<footer>` is dropped in favor of this div's own `border-border`, so
        the horizontal and vertical edges are the same element, same width,
        same color.

        2026-08-08 (third pass, same complaint): `border-b` added. This is
        the LAST bordered box on the page -- every other section's "bottom"
        edge is implicitly closed by the next section's `border-t` starting
        exactly where it ends, but Footer has no next section to borrow a
        bottom edge from, so it was the one box in the whole frame left open
        underneath. Explicit `border-b` closes it instead of relying on a
        neighbor that doesn't exist.
      */}
      <div
        className={`bg-panel border-border border-t border-b border-x px-6 py-16 md:px-8 lg:py-20 ${DASHBOARD_CONTAINER}`}
      >
        <div className="border-border divide-border grid grid-cols-1 divide-y border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {/* Brand + social -- logo/wordmark removed 2026-08-08, see docblock */}
          <div className="flex flex-col gap-4 p-8 lg:p-10">
            <p className="text-foreground-muted max-w-xs text-sm">
              Empowering digital transformation through intelligent
              technology solutions.
            </p>
            <div className="-ml-[13px] flex items-center">
              {SOCIAL_LINKS.map(({ label, href, icon: SocialIcon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="focus-visible:ring-accent text-foreground-muted hover:text-foreground inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <SocialIcon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/*
            2026-08-08 decluttering: was 3 separate columns (Menu, Services,
            Policies). Now one "Company" column -- `COMPANY_LINKS` (site nav
            minus "Home") plus a single "Services" link (was 8 individual
            service names, one per SERVICE_PILLARS entry -- see the
            decluttering docblock above). Policies moved to the bottom
            legal row.
          */}
          <nav
            aria-label="Footer company"
            className="flex flex-col gap-3 p-8 lg:p-10"
          >
            {/*
              2026-08-08, direct follow-up ("not at entire column just
              before that text company and contact like other section
              starting headings"): the background-grid attempts on the
              whole first column are reverted (see git history for that
              detour) -- what was actually wanted is the small solid
              `bg-accent h-2 w-2` square marker every section's own
              opening eyebrow label already uses (Hero's "Enterprise
              Technology Partner," WhyLyftek's "Why Lyftek," etc.),
              applied here to "Company" and "Contact" instead of a
              column-wide texture.
            */}
            <div className="flex items-center gap-2">
              <span aria-hidden className="bg-accent h-2 w-2 shrink-0" />
              <h3 className="font-martian-mono text-foreground text-sm font-semibold">
                Company
              </h3>
            </div>
            <ul className="-my-3 flex flex-col">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  {/*
                    2026-08-08, direct client request ("on those hyperlinks
                    when hovered can you add that tilted icon as well"): a
                    small `ArrowUpRight` (already diagonal/"tilted" by
                    design, no rotation needed) that's hidden at rest and
                    slides in from the lower-left on hover -- `opacity-0
                    -translate-x-1 translate-y-1` -> `group-hover:opacity-100
                    group-hover:translate-x-0 group-hover:translate-y-0`.
                    The `<Link>` itself is the `group` (inline-flex, so text
                    + icon sit on one line) rather than wrapping it in an
                    extra element just to host the hover state.
                  */}
                  <Link
                    href={link.href}
                    className="focus-visible:ring-accent text-foreground-muted hover:text-foreground group -mx-2 flex w-fit items-center gap-1 rounded-sm px-2 py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {link.label}
                    <ArrowUpRight
                      aria-hidden
                      size={12}
                      className="translate-x-1 translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 p-8 lg:p-10">
            <div className="flex items-center gap-2">
              <span aria-hidden className="bg-accent h-2 w-2 shrink-0" />
              <h3 className="font-martian-mono text-foreground text-sm font-semibold">
                Contact
              </h3>
            </div>
            <address className="text-foreground-muted text-sm not-italic">
              {COMPANY_ADDRESS}
            </address>
            {/*
              Same hover-arrow treatment as the Company links above -- these
              are the two other real hyperlinks in this column (the address
              itself isn't a link, so it's excluded).
            */}
            <a
              href={`tel:${COMPANY_PHONE.replace(/\s+/g, "")}`}
              className="focus-visible:ring-accent text-foreground-muted hover:text-foreground group -mx-2 flex w-fit items-center gap-1 rounded-sm px-2 py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {COMPANY_PHONE}
              <ArrowUpRight
                aria-hidden
                size={12}
                className="translate-x-1 translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="focus-visible:ring-accent text-foreground-muted hover:text-foreground group -mx-2 flex w-fit items-center gap-1 rounded-sm px-2 py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {COMPANY_EMAIL}
              <ArrowUpRight
                aria-hidden
                size={12}
                className="translate-x-1 translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </a>
          </div>
        </div>

        {/*
          2026-08-08, direct client request ("below these boxes and above
          that copyright line, we gonna add Lyftek in Rinter bold font big
          letters"), researched via two parallel agent passes (footer.design
          + this codebase's own tokens/rules) before implementing:

          - `font-rinter font-extrabold`: Rinter only ships Regular, so
            "bold" is the browser's own font-synthesis -- accepted here
            (not worked around) because the raw, slightly-unrefined stroke
            geometry synthesis produces actually suits this site's boxy/
            brutalist register at giant scale, the same reasoning already
            applied to Hero's H1.
          - `text-foreground` (plain white), NOT `text-accent` (lime) --
            lime at this size would be the single loudest element on the
            page and contradicts "not a flashy AI startup"; the accent's
            job everywhere else in this file is a precise small-footprint
            device (corner brackets, focus rings, hover arrows), not a
            canvas fill.
          - `clamp(4rem,13vw,13rem)` -- a capped fluid scale (~64px to
            ~208px; bumped up from an initial ~56-184px range per direct
            follow-up request for "slightly" bigger), not a vw-locked
            formula that forces full-width edge contact (for a 6-character
            word that would push past 350px and visually overpower the
            3-column box above it).
          - Contained within `DASHBOARD_CONTAINER` (this div), never
            full-bleed past it -- the frame rule this file already
            documents and enforces elsewhere ("any section whose own
            background differs from the page background must be boxed, not
            full-bleed") applies here too.
          - Static -- no hover, no scroll animation. It's plain text, not a
            link (see the "logo before it?" answer below for why it isn't
            wired to `/` either) -- giving inert text a hover state would
            be an affordance lie, and animating an element purely because
            it's large is decoration, not the purposeful motion this
            project's own principles ask for.
          - NO `LyftekMark` icon before it (the client asked directly).
            Text-only matches Navbar's own precedent (logo dropped there
            entirely) and this exact file's own brand-column edit a few
            messages earlier in this session (icon+wordmark just removed).
            The mark is an abstract geometric shape with no established
            inline lockup anywhere in this codebase -- pairing it with
            giant type here would be a lockup invented for this one spot,
            not a real brand system.
        */}
        {/*
          Illustration + wordmark, settled 2026-08-08 after a short back-
          and-forth: client pushed back on the text-only recommendation
          ("why not illustration?"), the first icon attempt had a real
          sizing bug (see below), the fixed version's outline stroke read
          as a thin mismatch next to the bold solid text (fixed via
          `filled`, LyftekMark.tsx), and finally: "can we add brand color
          to the illustration?" -- both shapes were solid white at that
          point (matching the wordmark exactly). `strokeBottom` (the fill
          color when `filled`) switched to `var(--color-accent)` (lime),
          `strokeTop` stays `var(--color-foreground)` (white) -- this is
          actually the SAME two-tone split the component's own defaults
          and ContactCTA's usage already establish (neutral top / lime
          bottom), just brought back after the monochrome detour.

          Sizing note (kept for context): the giant `clamp()` font-size
          lives on this flex container, not the `<p>` alone -- `em` units
          resolve against an element's OWN computed font-size, and the
          sibling `<svg>` wouldn't inherit font-size from the `<p>` next to
          it (only from ancestors) if the clamp() were set there instead.
          `items-end` lines the mark's baseline up with the wordmark's own.

          2026-08-08, further follow-up ("increase width... align both at
          center, also align both vertically at center between upper
          column boxes and the line below it"): `mx-auto w-fit` added --
          this flex row was already block-level (100% width by default),
          so plain `mx-auto` alone wouldn't visibly center it; `w-fit`
          shrinks the box down to its actual content width FIRST, then
          `mx-auto` centers that shrunk box within the full-width
          `DASHBOARD_CONTAINER` parent. Vertical centering: this block's
          own top margin and the legal row's top margin below are now
          equal (`mt-16 lg:mt-20` both places, was an intentionally
          asymmetric `mt-16/mt-8` pair binding the wordmark tightly to the
          copyright line) -- equal space above and below reads as this
          block sitting centered in the gap between the boxed columns and
          the legal row, rather than pinned to one side of it.
        */}
        <div className="text-[clamp(4rem,13vw,13rem)] mx-auto mt-16 flex w-fit items-end gap-4 lg:mt-20">
          {/*
            2026-08-08, direct follow-up ("the upper part is white, we can
            add that dark teal green shade to it, cause real logo also has
            same pattern"): strokeTop -> `var(--color-accent-foreground)`,
            the real brand mark's actual top color (#022E21, dark teal) --
            this IS the component's own original default, just overridden
            to white a few edits ago while establishing the illustration.
            Worth knowing: this exact token was flagged earlier in the
            project (08_COLOR_SYSTEM.md, Footer/ContactCTA's own small-
            scale LyftekMark usage) as low-contrast against near-black
            panels at ICON scale -- overridden to foreground-muted there
            for that reason. At this giant fill scale the same dark tone
            may read differently (a large solid shape vs. a thin stroke),
            confirmed visually via screenshot below rather than assumed
            either way.
          */}
          <LyftekMark
            className="h-[0.8em] w-auto shrink-0"
            filled
            strokeTop="var(--color-accent-foreground)"
            strokeBottom="var(--color-accent)"
          />
          {/*
            2026-08-09, client follow-up: the pointer-tracking gradient
            hover effect (see git history) was removed entirely --
            "keep simple lyftek logo text." Plain static text, no hover
            state, no ref/pointermove handler, matching how this element
            already behaved otherwise (not a link -- see the giant-wordmark
            docblock above for why this stays plain text, not wired to `/`).
          */}
          <p className="font-rinter text-foreground leading-[0.9] font-extrabold tracking-tight">
            Lyftek
          </p>
        </div>

        {/*
          2026-08-08 decluttering: Policies used to be its own full column
          (5 links, same visual weight as Address & Contact). Collapsed
          into this single row instead -- still every link, just no longer
          competing for the same attention as the columns above.
          `flex-wrap` so it degrades gracefully on narrow viewports instead
          of one long unbroken line.

          Top margin: first tightened (`mt-12` -> `mt-8`, `lg:mt-16` ->
          `lg:mt-12`) to deliberately bind the copyright line to the giant
          wordmark above it as one unit. Reversed by a later, more specific
          request ("align both vertically at center between upper column
          boxes and the line below it") -- restored to match the wordmark
          block's own top margin (`mt-16 lg:mt-20` both places) so the
          wordmark sits centered in the gap instead of pinned to this row.
        */}
        <div className="border-panel-border mt-16 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p className="text-foreground-muted text-xs">
            &copy; {new Date().getFullYear()} Lyftek Solutions Pvt. Ltd. All
            rights reserved.
          </p>
          {/*
            `gap-y-6` (24px) rather than `gap-y-2`: the links below carry
            `-my-2 py-2`, so 8px of that gap is eaten back by the negative
            margin, leaving 8px of real clearance between wrapped rows -- the
            same visual spacing as before, with no overlapping hit areas.
          */}
          <ul className="flex flex-wrap gap-x-5 gap-y-6">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  /*
                   * 32px hit area (12px text + 2x8px padding), not the 44px
                   * used elsewhere in this footer: five policy links have to
                   * wrap inside a 320px screen, and 44px rows would roughly
                   * triple the height of this block for the least-used links
                   * on the page. 32px clears the WCAG 2.2 AA floor (2.5.8,
                   * 24x24) with margin; the negative margins keep the
                   * rendered spacing identical to before.
                   */
                  className="focus-visible:ring-accent text-foreground-muted hover:text-foreground -mx-2 -my-2 inline-block rounded-sm px-2 py-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
