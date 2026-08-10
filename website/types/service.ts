/**
 * Shape of a single Services detail page.
 *
 * Mirrors `types/solution.ts` in spirit but not in structure -- the live
 * site's service pages follow a genuinely different template from its
 * solution pages (overview, feature list, benefit list, differentiators,
 * process) so forcing one interface across both would fit neither.
 */

export interface ServicePoint {
  title: string;
  description: string;
}

/**
 * Whether this page has real source content yet.
 *
 * `pending` exists because the client's service catalogue (eight entries,
 * `constants/services.ts`) and the live site's service detail pages (six,
 * under different names) only overlap on three. Rather than invent copy for
 * the five with no source anywhere -- which this project does not do -- the
 * page renders an explicit "content to follow" panel, at the client's own
 * direction ("the one whose data is not there write no data available, I'll
 * provide you later").
 */
export type ServiceContentStatus = "complete" | "pending";

export interface ServiceDetail {
  /** URL segment: `/services/<slug>`. Matches SERVICE_PILLARS' own slug. */
  slug: string;
  /** Page H1 and index label. */
  title: string;
  /**
   * One line under the H1. Present for EVERY service, including pending
   * ones -- it comes from SERVICE_PILLARS, which is real client copy.
   */
  summary: string;
  metaDescription: string;
  status: ServiceContentStatus;

  /** Everything below exists only when `status === "complete"`. */
  overview?: string;
  features?: string[];
  benefits?: string[];
  differentiators?: ServicePoint[];
  process?: ServicePoint[];
}
