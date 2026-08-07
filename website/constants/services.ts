import {
  Code,
  Cloud,
  Sparkle,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import type { NavLink } from "@/types/navigation";

export interface ServicePillar extends NavLink {
  icon: Icon;
  description: string;
}

/**
 * Homepage-level service pillars -- a curated 4-item consolidation of the
 * live site's 8 separate offerings (Custom Software Development, RPA &
 * Automation, IT Staffing & Resource Augmentation, Cybersecurity & ISMS,
 * Cloud Services & IT Support, GenAI & AI/ML, QA & Software Testing,
 * Corporate Training & Enablement), per Docs/Mythoughts.md's critique that
 * listing all 8 with equal weight buries Lyftek's core strengths.
 *
 * Mapping (first pass -- flagged for client confirmation, see
 * claudeContextExchange.md and status.md):
 * - Software Engineering  <- Custom Software Development, QA & Testing
 * - AI & Automation       <- GenAI/AI-ML, RPA & Automation
 * - Cloud & Infrastructure <- Cloud Services & IT Support
 * - Security & Compliance <- Cybersecurity & ISMS (ISO 27001)
 *
 * Deliberately NOT featured here (stay on the full /services catalog, not
 * dropped from the business -- just not homepage-level pillars): IT
 * Staffing & Resource Augmentation, Corporate Training & Enablement. Neither
 * fits the 4 technology pillars above, and forcing a 5th/6th pillar to
 * include them would undercut the whole point of consolidating (per the
 * approved homepage section plan, `/plan`, 2026-08-07).
 *
 * Shared by both the homepage "What We Do" section and the Footer's
 * "Services" link list, so the two never drift into two different lists of
 * service names -- see Footer.tsx.
 */
export const SERVICE_PILLARS: ServicePillar[] = [
  {
    label: "Software Engineering",
    href: "/services#software-engineering",
    icon: Code,
    description: "Custom applications built for how your business runs.",
  },
  {
    label: "AI & Automation",
    href: "/services#ai-automation",
    icon: Sparkle,
    description: "GenAI, ML, and process automation that ships to production.",
  },
  {
    label: "Cloud & Infrastructure",
    href: "/services#cloud-infrastructure",
    icon: Cloud,
    description: "Migration, optimization, and 24x7 infrastructure support.",
  },
  {
    label: "Security & Compliance",
    href: "/services#security-compliance",
    icon: ShieldCheck,
    description: "ISO 27001-aligned cybersecurity and information security.",
  },
];
