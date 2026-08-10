import type { ServiceDetail } from "@/types/service";

/**
 * Content for every Services detail page.
 *
 * COVERAGE, and the mismatch behind it (established 2026-08-10 by scraping
 * the live site): `constants/services.ts` catalogues EIGHT services, supplied
 * by the client. The live site has detail pages for SIX, under different
 * names. They overlap on only three:
 *
 *   Customized Software Development  <- lyftek.in/services/custom-software
 *   Cloud Services & IT Support      <- lyftek.in/services/cloud-solutions
 *   Cybersecurity & ISMS (ISO 27001) <- lyftek.in/services/cybersecurity
 *
 * The remaining five catalogue entries (RPA, IT Staffing, GenAI, QA,
 * Corporate Training) have no source page anywhere -- their `/services/<slug>`
 * URLs return the site's empty SPA shell, byte-identical to a deliberately
 * bogus control slug tested alongside them. They are marked `status:
 * "pending"` and render an explicit "content to follow" panel, per the
 * client's direct instruction rather than being invented.
 *
 * ORPHANED CONTENT worth knowing about: three live pages have full, real
 * content but no home in the client's eight-entry catalogue --
 * `managed-it-services`, `network-infrastructure`, and `it-consulting`.
 * Their content is NOT used here. If any of the five pending services is
 * really one of those under a different name (Managed IT Services in
 * particular reads close to "Cloud Services & IT Support"), say so and it
 * can be mapped across instead of written from scratch.
 *
 * WHAT THE REWRITE CHANGED, per Docs/content_writing.md: the source intros
 * are dense single paragraphs carrying most of the banned vocabulary at
 * once -- "cutting-edge" (named explicitly in that doc), plus "empower",
 * "seamless", "user-centric", "robust", "future-ready", "innovative
 * design", "digital transformation", "360°". Rewritten to lead with what
 * the client actually gets. Feature and benefit lists are kept close to
 * source, since those are concrete and specific; sentence fragments in them
 * were left as fragments, which is correct for a scannable list.
 *
 * FAQ SECTION DELIBERATELY ABSENT: every live service page ends with a
 * "Frequently Asked Questions" block whose questions exist as bare headings
 * with NO answer anywhere in the DOM -- clicking them does nothing. It is
 * an unfinished section, not content. Omitted at the client's direction
 * rather than shipped empty or filled with invented answers.
 */
export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "customized-software-development",
    title: "Customized Software Development",
    summary:
      "Tailor-made applications built to meet your unique business needs.",
    metaDescription:
      "Custom software development from Lyftek: bespoke ERP, workflow automation, and enterprise portals built around how your business actually operates.",
    status: "complete",
    overview:
      "We design and build applications around how your business actually works -- custom ERP, workflow automation, enterprise portals -- rather than fitting your operation to a product somebody else designed. The systems integrate with what you already run, and they can be changed when the business changes, which is usually the point at which off-the-shelf software stops being an asset.",
    features: [
      "Scalable, straightforward applications",
      "Enterprise systems and integrations",
      "Software built to your requirements, not adapted to them",
    ],
    benefits: [
      "Faster workflows",
      "Better return on the build",
      "An architecture you own outright",
    ],
    differentiators: [
      {
        title: "Built for one business",
        description:
          "Every system is designed against your requirements rather than configured from a template.",
      },
      {
        title: "Architecture that scales",
        description:
          "Systems are structured to grow with the business instead of being rebuilt when it does.",
      },
      {
        title: "Experienced engineers",
        description:
          "Senior developers with real depth in the domains they build for.",
      },
    ],
    process: [
      {
        title: "Requirement analysis",
        description:
          "We work through your existing workflows, goals, and the constraints you are actually operating under.",
      },
      {
        title: "Design and development",
        description:
          "We build secure, performant applications, with the architecture agreed before the code starts.",
      },
      {
        title: "Testing and deployment",
        description:
          "We test thoroughly and deploy with support in place, rather than handing over and leaving.",
      },
    ],
  },

  {
    slug: "rpa-automation-solutions",
    title: "RPA & Automation Solutions",
    summary: "Automate repetitive processes and boost efficiency using RPA.",
    metaDescription:
      "Robotic process automation from Lyftek -- automating the repetitive, rules-based work that consumes operational capacity.",
    status: "pending",
  },

  {
    slug: "it-staffing-resource-augmentation",
    title: "IT Staffing & Resource Augmentation",
    summary:
      "On-demand skilled IT professionals to scale your team quickly.",
    metaDescription:
      "IT staffing and resource augmentation from Lyftek -- experienced technology professionals who join your team when you need capacity.",
    status: "pending",
  },

  {
    slug: "cybersecurity-isms",
    title: "Cybersecurity & ISMS",
    summary:
      "Protect systems and data with enterprise-grade cybersecurity.",
    metaDescription:
      "Cybersecurity services from Lyftek: threat monitoring, firewalls and intrusion detection, encryption, penetration testing, and compliance management.",
    status: "complete",
    overview:
      "Protection across the areas that actually get exploited: threat detection, firewalls and intrusion prevention, encryption, access control, vulnerability testing, and compliance. Run continuously and monitored by certified staff, rather than assessed once a year and assumed to hold.",
    features: [
      "Data protection and security compliance",
      "Firewalls and intrusion detection systems",
      "Real-time threat monitoring and incident response",
      "Encryption and secure access control",
      "Vulnerability assessment and penetration testing",
      "Malware, ransomware, and phishing protection",
    ],
    benefits: [
      "A stronger security position across every system",
      "Lower risk of breach and data loss",
      "Compliance with the standards your industry is held to",
      "Customer trust that survives scrutiny",
      "Continuity, because incidents stay contained",
      "Round-the-clock cover without building the team yourself",
    ],
    differentiators: [
      {
        title: "Threat protection that runs continuously",
        description:
          "Real-time monitoring and intrusion prevention, not a quarterly report on what already happened.",
      },
      {
        title: "Regulatory compliance",
        description:
          "Work aligned to ISO, GDPR, SOC 2, HIPAA, and the regulations specific to your sector.",
      },
      {
        title: "Certified security staff",
        description:
          "Qualified professionals actively maintaining your infrastructure, not an escalation queue.",
      },
      {
        title: "Risk found before it is exploited",
        description:
          "Vulnerabilities are identified and closed ahead of the incident rather than during it.",
      },
    ],
    process: [
      {
        title: "Assessment and risk analysis",
        description:
          "We review your environment, identify vulnerabilities, and establish where the real exposure sits.",
      },
      {
        title: "Prevention setup",
        description:
          "We deploy firewalls, malware protection, encryption, access controls, and monitoring.",
      },
      {
        title: "Monitoring and response",
        description:
          "The security team provides continuous surveillance, alerting, and incident response.",
      },
      {
        title: "Optimisation and compliance",
        description:
          "Policies are updated, audits run, and protection adjusted as the threat picture moves.",
      },
    ],
  },

  {
    slug: "cloud-services-it-support",
    title: "Cloud Services & IT Support",
    summary:
      "Cloud migration, optimization, and 24x7 IT infrastructure support.",
    metaDescription:
      "Cloud services from Lyftek: migration, hosting, and ongoing management across AWS, Azure, and Google Cloud, with security, backup, and cost control.",
    status: "complete",
    overview:
      "Migration, hosting, and ongoing management across AWS, Azure, and Google Cloud -- including the security, backup, and cost controls that decide whether a cloud programme pays for itself or quietly becomes more expensive than what it replaced.",
    features: [
      "AWS, Microsoft Azure, and Google Cloud expertise",
      "Migration without data loss",
      "Cloud hosting and management",
      "Security, firewall, and encryption setup",
      "Automated backups and disaster recovery",
      "Performance monitoring and optimisation",
    ],
    benefits: [
      "Lower infrastructure and maintenance cost",
      "Capacity that scales on demand",
      "High availability with minimal downtime",
      "Stronger data security and compliance",
      "Faster deployment",
      "Spend that tracks actual usage",
    ],
    differentiators: [
      {
        title: "Multi-cloud, not single-vendor",
        description:
          "We work across AWS, Azure, and Google Cloud, so the platform choice follows the workload.",
      },
      {
        title: "Secure by architecture",
        description:
          "Encryption, firewalls, and compliance controls are designed in rather than added afterwards.",
      },
      {
        title: "Cost optimisation",
        description:
          "We analyse usage and remove the waste that accumulates in every unmanaged cloud estate.",
      },
      {
        title: "Managed end to end",
        description:
          "Planning, migration, monitoring, optimisation, and support handled by one accountable team.",
      },
    ],
    process: [
      {
        title: "Assessment and planning",
        description:
          "We evaluate your current infrastructure, workloads, security requirements, and migration path.",
      },
      {
        title: "Migration and deployment",
        description:
          "Applications, databases, and servers move across with minimal downtime.",
      },
      {
        title: "Optimisation and security",
        description:
          "We configure performance tuning, security layers, backups, and monitoring.",
      },
      {
        title: "Monitoring and support",
        description:
          "Continuous monitoring, cost control, and issue resolution once you are running.",
      },
    ],
  },

  {
    slug: "genai-ai-ml-solutions",
    title: "GenAI & AI/ML Solutions",
    summary:
      "AI-powered automation, predictions, and intelligent solutions.",
    metaDescription:
      "Generative AI and machine learning solutions from Lyftek -- applied to the business problems where they measurably outperform the alternative.",
    status: "pending",
  },

  {
    slug: "qa-software-testing",
    title: "QA & Software Testing Services",
    summary:
      "Ensure quality, reliability, and performance with structured QA.",
    metaDescription:
      "QA and software testing services from Lyftek -- structured quality assurance across functionality, performance, and reliability.",
    status: "pending",
  },

  {
    slug: "corporate-training-enablement",
    title: "Corporate Training & Enablement",
    summary:
      "Upskill teams with hands-on training in modern technologies.",
    metaDescription:
      "Corporate technology training from Lyftek -- practical, hands-on enablement for teams adopting modern engineering practice.",
    status: "pending",
  },
];

/** Lookup used by the dynamic route's `generateStaticParams`. */
export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICE_DETAILS.find((s) => s.slug === slug);
}
