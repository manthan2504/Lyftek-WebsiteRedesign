/**
 * Shape of a single Solutions detail page.
 *
 * Normalised from the live site's own solution pages (lyftek.in/solutions/*,
 * scraped 2026-08-10). Those pages are broadly consistent -- intro, a
 * problem statement, a capability list, and an outcomes list -- but not
 * perfectly: some carry an extra process breakdown, one carries headline
 * statistics, and several repeat a section heading twice. This interface is
 * the common denominator, so every page renders through one template
 * instead of nine bespoke layouts (10_PAGE_BLUEPRINTS.md's "scalable
 * architecture rather than a fixed sitemap", and 17_CODING_STANDARDS.md's
 * "avoid one-off solutions").
 *
 * Optional fields are genuinely optional: a page simply omits the section
 * when the source had nothing real to put in it. Nothing here is invented
 * to fill a slot -- the same no-fabrication rule SERVICE_PILLARS and
 * WhyLyftek's stats follow.
 */

export type SolutionCategoryId = "enterprise-finance" | "healthcare";

export interface SolutionCapability {
  title: string;
  description: string;
}

export interface SolutionProcessGroup {
  title: string;
  items: string[];
}

export interface SolutionStat {
  /** Rendered verbatim -- these are industry figures, not Lyftek's results. */
  value: string;
  label: string;
}

export interface SolutionDetail {
  /** URL segment. Matches the live site's own slug so inbound links survive. */
  slug: string;
  category: SolutionCategoryId;
  /** Short label used in navigation and on the index page. */
  label: string;
  /** Page H1. */
  title: string;
  /** One-line positioning statement under the H1. */
  summary: string;
  /** <meta name="description">. */
  metaDescription: string;

  /** "What's wrong today" -- omitted where the source had no problem framing. */
  challenges?: {
    heading: string;
    points: string[];
  };

  capabilities: {
    heading: string;
    items: SolutionCapability[];
  };

  /** Grouped checklists -- the source's workflow/scope breakdowns. */
  process?: {
    heading: string;
    groups: SolutionProcessGroup[];
  };

  benefits: {
    heading: string;
    items: SolutionCapability[];
  };

  /** Headline figures. Only Revenue Cycle Management has real ones. */
  stats?: SolutionStat[];
}
