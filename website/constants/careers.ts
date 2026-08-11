import type { CareerDepartment, CareerOpening } from "@/types/career";

/**
 * Content for every Careers detail page.
 *
 * PROVENANCE (2026-08-10): every listing below is a light rewrite of the
 * client's own live posting at `lyftek.in/careers/<1-6>`, captured with
 * Playwright (the index page itself is a client-rendered SPA shell with no
 * server HTML at all -- a plain fetch returns nothing, so this required an
 * actual browser render, same as the Solutions scrape). Nothing here is
 * invented: every Role, Responsibility, and Benefit line is the source's
 * own, verbatim. The only edits were to the one-line summaries, trimming a
 * handful of empty superlatives content_writing.md flags directly ("next-gen",
 * "energetic", "fuel business expansion") while keeping every factual claim
 * intact -- the same standard applied to the Solutions rewrite.
 *
 * `department` does not exist on the source site (there is no grouping or
 * category anywhere in its markup) -- it is inferred once, directly from
 * each title's own obvious function, purely to label and group listings on
 * the index page. Structural scaffolding, not content.
 *
 * Slugs are new (`dotnet-developer`, not the source's opaque `/careers/1`),
 * matching the readable-slug convention `/services` and `/solutions` both
 * already use.
 */

export const CAREER_DEPARTMENT_LABELS: Record<CareerDepartment, string> = {
  Engineering: "Engineering",
  Sales: "Sales",
  "Finance & Operations": "Finance & Operations",
};

export const CAREER_OPENINGS: CareerOpening[] = [
  {
    slug: "dotnet-developer",
    department: "Engineering",
    title: ".NET Developer",
    summary:
      "Join our engineering team to build robust enterprise applications.",
    metaDescription:
      ".NET Developer opening at Lyftek Solutions -- build enterprise applications with C#, ASP.NET, and MVC.",
    roles: [
      "Develop and maintain .NET applications",
      "Work with C#, ASP.NET, MVC frameworks",
      "Optimize backend logic and performance",
      "Collaborate with cross-functional teams",
    ],
    responsibilities: [
      "Writing clean, scalable code",
      "Deploying and maintaining software",
      "Troubleshooting and resolving issues",
      "Participating in code reviews",
    ],
    benefits: [
      "Great learning environment",
      "Employee wellness programs",
      "Flexible working hours",
      "Work on enterprise-grade applications",
    ],
  },
  {
    slug: "rpa-engineer",
    department: "Engineering",
    title: "RPA Engineer",
    summary:
      "Join our automation team to build scalable RPA workflows and digital workforce pipelines.",
    metaDescription:
      "RPA Engineer opening at Lyftek Solutions -- build automation workflows with AutomationEdge and UiPath for global clients.",
    roles: [
      "Design and develop RPA bots",
      "Work with AutomationEdge / UiPath tools",
      "Analyze business processes",
      "Integrate RPA workflows with APIs",
    ],
    responsibilities: [
      "Build automation workflows",
      "Document RPA processes",
      "Monitor automation performance",
      "Collaborate with clients for automation needs",
    ],
    benefits: [
      "Latest automation tools",
      "International project exposure",
      "Certification support",
      "Career growth opportunities",
    ],
  },
  {
    slug: "ai-ml-specialist",
    department: "Engineering",
    title: "AI/ML Specialist",
    summary:
      "Build intelligent automation and predictive data models as part of our AI/ML team.",
    metaDescription:
      "AI/ML Specialist opening at Lyftek Solutions -- build ML models and predictive systems with Python, TensorFlow, and Keras.",
    roles: [
      "Build ML/AI models",
      "Train & optimize neural networks",
      "Work on NLP, CV, prediction systems",
      "Collaborate with data engineering team",
    ],
    responsibilities: [
      "Data preprocessing",
      "Model training & testing",
      "Model deployment",
      "Monitoring ML pipelines",
    ],
    benefits: [
      "Work on advanced AI systems",
      "Research-based projects",
      "Publication & patent opportunities",
      "High-performance computing resources",
    ],
  },
  {
    slug: "it-sales-executive",
    department: "Sales",
    title: "IT Sales Executive",
    summary: "Grow client relationships and drive new business for Lyftek.",
    metaDescription:
      "IT Sales Executive opening at Lyftek Solutions -- drive business growth through client relationships and IT solution sales.",
    roles: [
      "Identify new business opportunities",
      "Client communication & presentations",
      "Drive IT product/solution sales",
      "Maintain client relationships",
    ],
    responsibilities: [
      "Lead generation",
      "Pitching IT solutions",
      "Follow-ups & negotiations",
      "Meeting monthly sales targets",
    ],
    benefits: [
      "High sales incentives",
      "Training sessions",
      "Career growth opportunities",
      "Corporate events & rewards",
    ],
  },
  {
    slug: "nodejs-developer",
    department: "Engineering",
    title: "Node.js Developer",
    summary:
      "Build fast, scalable backend services and API-driven applications.",
    metaDescription:
      "Node.js Developer opening at Lyftek Solutions -- build backend services and REST APIs with Node.js, Express, and MongoDB.",
    roles: [
      "Develop backend services using Node.js & Express",
      "Build REST APIs and integrate databases",
      "Work with MongoDB, MySQL or PostgreSQL",
      "Optimize backend performance and scalability",
    ],
    responsibilities: [
      "Writing clean, maintainable backend code",
      "API development and integration",
      "Debugging and performance optimization",
      "Collaborating with frontend and DevOps teams",
    ],
    benefits: [
      "Work on scalable backend systems",
      "Latest JavaScript stack exposure",
      "Flexible timings",
      "Opportunity to work on cloud-native projects",
    ],
  },
  {
    slug: "accountant",
    department: "Finance & Operations",
    title: "Accountant",
    summary:
      "Manage company finances, maintain records, and support billing and tax compliance.",
    metaDescription:
      "Accountant opening at Lyftek Solutions -- manage bookkeeping, billing, taxation compliance, and financial reporting.",
    roles: [
      "Manage daily bookkeeping & entries",
      "Prepare invoices and maintain billing records",
      "Handle GST, TDS, and taxation compliance",
      "Assist in monthly and yearly financial reports",
    ],
    responsibilities: [
      "Record day-to-day financial data",
      "Maintain accounts payable & receivable",
      "Bank reconciliation",
      "Support audits and financial documentation",
    ],
    benefits: [
      "Stable long-term role",
      "Professional growth opportunities",
      "Supportive work environment",
      "Performance-based incentives",
    ],
  },
];

export function getCareerBySlug(slug: string): CareerOpening | undefined {
  return CAREER_OPENINGS.find((opening) => opening.slug === slug);
}
