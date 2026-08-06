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
  { label: "Services", href: "/services" },
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
