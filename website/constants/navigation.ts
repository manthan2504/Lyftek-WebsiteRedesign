import type { NavLink } from "@/types/navigation";

/**
 * Primary site navigation, matching the established sitemap the business
 * already uses (confirmed against the live site + Docs/Lyftek Website
 * Redesign Strategy.pdf). Reordering/adding/removing top-level pages is an
 * information-architecture decision for 10_PAGE_BLUEPRINTS.md, not something
 * to change ad hoc while building the Navbar component.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  // 2026-08-08, direct client decision: no separate /services page --
  // "we already have that section at homepage." Was "/services" (a page
  // that was never actually built, a dead link waiting to happen); now an
  // in-page anchor to Services.tsx's own `id="services"` instead.
  // Solutions/Careers/Contact are untouched -- this only reverses the
  // /services page specifically, not the rest of the site's still-planned
  // multi-page structure (10_PAGE_BLUEPRINTS.md).
  { label: "Services", href: "/#services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/**
 * The single persistent conversion action, per 11_CONTENT_STRATEGY.md's
 * guidance to prefer consultative CTAs ("Book a Consultation") over generic
 * ones ("Contact Us") -- and to keep one consistent CTA rather than
 * fragmenting the funnel across differently-worded buttons.
 */
export const PRIMARY_CTA: NavLink = {
  label: "Book a Consultation",
  href: "/contact",
};
