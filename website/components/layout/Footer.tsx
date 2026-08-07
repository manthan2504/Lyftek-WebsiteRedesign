"use client";

import Link from "next/link";
import { LyftekMark } from "@/components/ui/LyftekMark";
import { DASHBOARD_CONTAINER } from "@/constants/layout";
import { NAV_LINKS } from "@/constants/navigation";
import { SERVICE_PILLARS } from "@/constants/services";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  POLICY_LINKS,
  SOCIAL_LINKS,
} from "@/constants/footer";

/**
 * Purpose: site-wide footer -- wayfinding, legal/compliance links, and a
 * final contact/trust touchpoint. Client's own assessment of the live
 * site's footer (Docs/Mythoughts.md): "No changes needed" structurally --
 * this is a rebuild of the same content/structure, not a redesign.
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
 * Five-column layout at `lg:` (brand+social / menu / services / policies /
 * address+contact), stacking to a single column below that. Services links
 * pull from `SERVICE_PILLARS` (constants/services.ts) -- the SAME data the
 * future homepage "What We Do" section will use, so the two never drift
 * into two different lists of service names.
 *
 * LyftekMark: small, quiet placement next to the wordmark -- colors
 * overridden from the component's own defaults (`strokeTop` defaults to
 * `--color-accent-foreground`, a deep teal that's nearly invisible against
 * this near-black panel background, the same visibility problem already
 * diagnosed and fixed for the accent-hover/accent-surface tokens earlier in
 * this engagement -- see 08_COLOR_SYSTEM.md). Uses `--color-foreground-muted`
 * instead, matching how HeroBackdrop handled the same mark on the same kind
 * of background previously.
 *
 * Data accuracy: address/phone/email/social URLs in constants/footer.ts
 * were copied from the live site during this session -- flagged there for
 * reconfirmation before launch, not assumed permanently correct.
 */
export function Footer() {
  return (
    <footer className="border-divider mt-16 mb-8 border-t lg:mt-24 lg:mb-12">
      {/*
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
      */}
      <div
        className={`bg-panel px-6 py-16 md:px-8 lg:py-20 ${DASHBOARD_CONTAINER}`}
      >
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          {/* Brand + social -- spans full width on mobile/tablet, own column at lg */}
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <LyftekMark
                className="h-8 w-8"
                strokeTop="var(--color-foreground-muted)"
                strokeBottom="var(--color-accent)"
                strokeWidth={8}
              />
              {/*
                2026-08-07, locked trio: footer wordmark matches Navbar's
                own treatment (font-martian-mono, "navbar/footer brand
                elements" per app/layout.tsx's type-system docblock) so the
                "Lyftek" mark reads identically in both places.
              */}
              <span className="font-martian-mono text-foreground text-lg font-semibold tracking-tight">
                Lyftek
              </span>
            </div>
            <p className="text-foreground-muted max-w-xs text-sm">
              Empowering digital transformation through intelligent
              technology solutions.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: SocialIcon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="focus-visible:ring-accent text-foreground-muted hover:text-foreground rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <SocialIcon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer menu" className="flex flex-col gap-3">
            <h3 className="font-martian-mono text-foreground text-sm font-semibold">
              Menu
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-visible:ring-accent text-foreground-muted hover:text-foreground rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services" className="flex flex-col gap-3">
            <h3 className="font-martian-mono text-foreground text-sm font-semibold">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5">
              {SERVICE_PILLARS.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="focus-visible:ring-accent text-foreground-muted hover:text-foreground rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer policies" className="flex flex-col gap-3">
            <h3 className="font-martian-mono text-foreground text-sm font-semibold">
              Policies
            </h3>
            <ul className="flex flex-col gap-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-visible:ring-accent text-foreground-muted hover:text-foreground rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-1">
            <h3 className="font-martian-mono text-foreground text-sm font-semibold">
              Address &amp; Contact
            </h3>
            <address className="text-foreground-muted text-sm not-italic">
              {COMPANY_ADDRESS}
            </address>
            <a
              href={`tel:${COMPANY_PHONE.replace(/\s+/g, "")}`}
              className="focus-visible:ring-accent text-foreground-muted hover:text-foreground w-fit rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {COMPANY_PHONE}
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="focus-visible:ring-accent text-foreground-muted hover:text-foreground w-fit rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {COMPANY_EMAIL}
            </a>
          </div>
        </div>

        <div className="border-panel-border mt-12 border-t pt-6 lg:mt-16">
          <p className="text-foreground-muted text-xs">
            &copy; {new Date().getFullYear()} Lyftek Solutions Pvt. Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
