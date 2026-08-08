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
 * so both consumers (plus any future /services page) read from one source.
 */
export const SERVICE_PILLARS: ServicePillar[] = [
  {
    label: "Customized Software Development",
    href: "/services#customized-software-development",
    icon: Code,
    description: "Tailor-made applications built to meet your unique business needs.",
  },
  {
    label: "RPA & Automation Solutions",
    href: "/services#rpa-automation-solutions",
    icon: Robot,
    description: "Automate repetitive processes and boost efficiency using RPA.",
  },
  {
    label: "IT Staffing & Resource Augmentation",
    href: "/services#it-staffing-resource-augmentation",
    icon: Users,
    description: "On-demand skilled IT professionals to scale your team quickly.",
  },
  {
    label: "Cybersecurity & ISMS (ISO 27001)",
    href: "/services#cybersecurity-isms",
    icon: ShieldCheck,
    description: "Protect systems and data with enterprise-grade cybersecurity.",
  },
  {
    label: "Cloud Services & IT Support",
    href: "/services#cloud-services-it-support",
    icon: Cloud,
    description: "Cloud migration, optimization, and 24x7 IT infrastructure support.",
  },
  {
    label: "GenAI & AI/ML Solutions",
    href: "/services#genai-ai-ml-solutions",
    icon: Sparkle,
    description: "AI-powered automation, predictions, and intelligent solutions.",
  },
  {
    label: "QA & Software Testing Services",
    href: "/services#qa-software-testing",
    icon: Bug,
    description: "Ensure quality, reliability, and performance with structured QA.",
  },
  {
    label: "Corporate Training & Enablement",
    href: "/services#corporate-training-enablement",
    icon: GraduationCap,
    description: "Upskill teams with hands-on training in modern technologies.",
  },
];
