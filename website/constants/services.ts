import {
  Code,
  Robot,
  Users,
  ShieldCheck,
  Cloud,
  Sparkle,
  Bug,
  GraduationCap,
  type Icon,
} from "@phosphor-icons/react";
import type { NavLink } from "@/types/navigation";

export interface ServicePillar extends NavLink {
  icon: Icon;
  description: string;
  /**
   * URL segment, and the anchor id of this service's card in the homepage
   * "What We Do" grid.
   *
   * Added 2026-08-10 when the per-service detail pages were built. Before
   * that, `href` was `/#<slug>` and Services.tsx recovered the id by
   * slicing two characters off the front of it -- which silently breaks the
   * moment `href` stops starting with `/#`, as it now does. Carrying the
   * slug explicitly removes that coupling: `href` describes where the card
   * GOES, `slug` identifies WHAT it is, and neither has to be parsed out of
   * the other.
   */
  slug: string;
}

/**
 * Homepage-level service pillars. Revised 2026-08-08, second revision same
 * day: the client's first message during the footer decluttering pass gave
 * a 6-item approximation; a follow-up message gave the REAL, complete
 * 8-service catalog copied directly from the live site (lyftek.in),
 * including the exact live copy for each description -- this replaces the
 * 6-item version, which was itself only ever a placeholder pending this
 * confirmation. All 8 of the live site's services are represented now,
 * not a curated subset -- the earlier "4 pillars" consolidation this file
 * used to describe (dropping IT Staffing and Corporate Training as
 * homepage-level pillars) is fully superseded; see git history /
 * claudeContextExchange.md for that now-outdated reasoning.
 *
 * Shared by the homepage "What We Do" section (components/sections/
 * Services.tsx) and the Footer's single "Services" link -- the footer no
 * longer lists these individually (see Footer.tsx's 2026-08-08 decluttering
 * docblock), but this remains the one place the service catalog is defined
 * so both consumers read from one source.
 *
 * HREFS -- two changes, in order:
 *
 * 2026-08-08 (client): were `/services#slug`, pointing at a standalone
 * services page that was never built -- "there is no need of a separate
 * services page, we already have that section at homepage." Changed to
 * `/#slug`, an in-page anchor into this same homepage section.
 *
 * 2026-08-10 (client): now `/services/<slug>`, a real per-service detail
 * page (`app/services/[slug]/page.tsx`, content in
 * `constants/serviceDetails.ts`). This does NOT reinstate a `/services`
 * index -- that decision stands, the homepage section is still the listing,
 * and every detail page links back up to it. Only the individual pages are
 * new.
 *
 * The per-card `id={slug}` anchors in Services.tsx are kept even though
 * nothing in this codebase now links to them: they cost nothing, and any
 * external or previously-shared `/#slug` link keeps working.
 *
 * COVERAGE: only three of the eight below have real source content
 * (Customized Software Development, Cybersecurity & ISMS, Cloud Services &
 * IT Support). The other five render an explicit "detail to follow" panel
 * pending copy from the client -- see constants/serviceDetails.ts for the
 * full mismatch note, including three live pages whose content has no home
 * in this catalogue.
 */
export const SERVICE_PILLARS: ServicePillar[] = [
  {
    label: "Customized Software Development",
    slug: "customized-software-development",
    href: "/services/customized-software-development",
    icon: Code,
    description: "Tailor-made applications built to meet your unique business needs.",
  },
  {
    label: "RPA & Automation Solutions",
    slug: "rpa-automation-solutions",
    href: "/services/rpa-automation-solutions",
    icon: Robot,
    description: "Automate repetitive processes and boost efficiency using RPA.",
  },
  {
    label: "IT Staffing & Resource Augmentation",
    slug: "it-staffing-resource-augmentation",
    href: "/services/it-staffing-resource-augmentation",
    icon: Users,
    description: "On-demand skilled IT professionals to scale your team quickly.",
  },
  {
    label: "Cybersecurity & ISMS (ISO 27001)",
    slug: "cybersecurity-isms",
    href: "/services/cybersecurity-isms",
    icon: ShieldCheck,
    description: "Protect systems and data with enterprise-grade cybersecurity.",
  },
  {
    label: "Cloud Services & IT Support",
    slug: "cloud-services-it-support",
    href: "/services/cloud-services-it-support",
    icon: Cloud,
    description: "Cloud migration, optimization, and 24x7 IT infrastructure support.",
  },
  {
    label: "GenAI & AI/ML Solutions",
    slug: "genai-ai-ml-solutions",
    href: "/services/genai-ai-ml-solutions",
    icon: Sparkle,
    description: "AI-powered automation, predictions, and intelligent solutions.",
  },
  {
    label: "QA & Software Testing Services",
    slug: "qa-software-testing",
    href: "/services/qa-software-testing",
    icon: Bug,
    description: "Ensure quality, reliability, and performance with structured QA.",
  },
  {
    label: "Corporate Training & Enablement",
    slug: "corporate-training-enablement",
    href: "/services/corporate-training-enablement",
    icon: GraduationCap,
    description: "Upskill teams with hands-on training in modern technologies.",
  },
];
