/**
 * Shape of a single Careers detail page.
 *
 * Normalised from the live site's own job pages (lyftek.in/careers/1
 * through /6, scraped 2026-08-10 with Playwright -- the index page itself
 * is a client-rendered SPA shell with no server HTML, so a plain fetch
 * returns nothing; every field below came from a real rendered page). All
 * six listings share an identical shape (one-line summary, four Roles,
 * four Responsibilities, four Benefits), so unlike SolutionDetail nothing
 * here needed to be made optional -- there was no inconsistent source to
 * normalise away.
 */

export type CareerDepartment =
  | "Engineering"
  | "Sales"
  | "Finance & Operations";

export interface CareerOpening {
  /** URL segment. The live site uses numeric IDs (/careers/1); this rebuild
   * uses a real slug instead, matching the /services and /solutions
   * convention rather than carrying over an opaque numeric one. */
  slug: string;
  /** Not present on the source site -- inferred once, directly from each
   * title's own function (".NET Developer" -> Engineering), purely to
   * group and label listings. Structure, not invented content. */
  department: CareerDepartment;
  /** Page H1 and index-page row title. */
  title: string;
  /** One-line role summary, shown on the index page and as the detail
   * page's sub-heading. */
  summary: string;
  /** <meta name="description">. */
  metaDescription: string;
  roles: string[];
  responsibilities: string[];
  benefits: string[];
}
