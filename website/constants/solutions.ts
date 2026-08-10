import type { NavLink } from "@/types/navigation";

export interface SolutionCategory {
  label: string;
  items: NavLink[];
}

/**
 * Navbar "Solutions" mega-menu content -- direct client-supplied catalog
 * (2026-08-08), copied verbatim (labels, grouping, and order), same
 * no-fabrication standard `constants/services.ts` documents: nothing here
 * is invented or reworded.
 *
 * Two categories, matching the client's own grouping exactly -- NOT
 * flattened into one list, since "Enterprise / Finance Solutions" and
 * "Healthcare Solutions" are two distinct verticals, not one undifferentiated
 * catalog the way SERVICE_PILLARS's 8 items are.
 *
 * HREFS (REWIRED 2026-08-10, when the Solutions pages were actually built):
 * the nine entries with real content now point at their own detail page,
 * `/solutions/<slug>` -- statically generated from
 * `constants/solutionDetails.ts` via `app/solutions/[slug]/page.tsx`. They
 * were previously `/solutions#slug`, anchors written for a page that did not
 * exist yet.
 *
 * The four Healthcare entries below still point at `/solutions` (the index)
 * rather than a detail page, and that is deliberate. Their source pages on
 * the live site -- `lyftek.in/solutions/ai-agents-intelligent-automation`
 * and the other three -- return the site's empty SPA shell with zero
 * content, byte-identical to a deliberately bogus control slug tested
 * alongside them. There is nothing to rewrite, and this project does not
 * invent page content (the same rule that kept WhyLyftek's stats empty until
 * the client supplied real figures). They keep their catalogue entry, since
 * the client supplied these as real offerings, but link to the index until
 * copy exists. Move them to `/solutions/<slug>` the moment it does.
 */
export const SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    label: "Enterprise / Finance Solutions",
    items: [
      { label: "Procurement to Pay (P2P / AP)", href: "/solutions/procurement-to-pay" },
      { label: "Accounts Payable Automation", href: "/solutions/accounts-payable-automation" },
      { label: "Order to Cash (O2C / AR)", href: "/solutions/order-to-cash" },
      { label: "Record to Report (R2R / Accounting)", href: "/solutions/record-to-report" },
      { label: "Treasury & Cash Management", href: "/solutions/treasury-cash-management" },
      { label: "Tax & Compliance Automation", href: "/solutions/tax-compliance-automation" },
      { label: "Working Capital Optimization", href: "/solutions/working-capital-optimization" },
      {
        label: "Document & Data Automation (OCR + AI / IDP)",
        href: "/solutions/document-data-automation",
      },
    ],
  },
  {
    label: "Healthcare Solutions",
    items: [
      { label: "Revenue Cycle Management (RCM)", href: "/solutions/revenue-cycle-management" },
      // The four below have no source content yet -- see the HREFS note in
      // this file's docblock. They point at the index rather than a detail
      // page that would have to be invented.
      { label: "AI Agents / Intelligent Automation", href: "/solutions" },
      { label: "Patient Engagement & Staff Automation", href: "/solutions" },
      {
        label: "Specialty Solutions (Radiology, Cardiology, Oncology)",
        href: "/solutions",
      },
      { label: "Integrations (EHR, Payer, Clearinghouse)", href: "/solutions" },
    ],
  },
];
