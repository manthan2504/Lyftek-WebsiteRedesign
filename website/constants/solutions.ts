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
 * HREFS: `/solutions#slug` -- unlike SERVICE_PILLARS (which now anchors into
 * the homepage's own "What We Do" section, see that file's docblock), there
 * is no homepage section for Solutions to anchor into, and no `/solutions`
 * page built yet either (NAV_LINKS' "Solutions" entry still points there,
 * untouched by the Services page-removal decision). These hrefs are written
 * for the page as planned, not yet a live destination -- Navbar.tsx's own
 * dropdown renders them as real links now (matching the client's request to
 * ship the real content), but `/solutions` itself remains a separate,
 * not-yet-built page, same status it already had.
 */
export const SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    label: "Enterprise / Finance Solutions",
    items: [
      { label: "Procurement to Pay (P2P / AP)", href: "/solutions#procurement-to-pay" },
      { label: "Accounts Payable Automation", href: "/solutions#accounts-payable-automation" },
      { label: "Order to Cash (O2C / AR)", href: "/solutions#order-to-cash" },
      { label: "Record to Report (R2R / Accounting)", href: "/solutions#record-to-report" },
      { label: "Treasury & Cash Management", href: "/solutions#treasury-cash-management" },
      { label: "Tax & Compliance Automation", href: "/solutions#tax-compliance-automation" },
      { label: "Working Capital Optimization", href: "/solutions#working-capital-optimization" },
      {
        label: "Document & Data Automation (OCR + AI / IDP)",
        href: "/solutions#document-data-automation",
      },
    ],
  },
  {
    label: "Healthcare Solutions",
    items: [
      { label: "Revenue Cycle Management (RCM)", href: "/solutions#revenue-cycle-management" },
      {
        label: "AI Agents / Intelligent Automation",
        href: "/solutions#ai-agents-intelligent-automation",
      },
      {
        label: "Patient Engagement & Staff Automation",
        href: "/solutions#patient-engagement-staff-automation",
      },
      {
        label: "Specialty Solutions (Radiology, Cardiology, Oncology)",
        href: "/solutions#specialty-solutions",
      },
      { label: "Integrations (EHR, Payer, Clearinghouse)", href: "/solutions#integrations" },
    ],
  },
];
