import type { SolutionCategoryId, SolutionDetail } from "@/types/solution";

/**
 * Content for every Solutions detail page.
 *
 * PROVENANCE (2026-08-10): every page below is a rewrite of the client's own
 * live solution page at `lyftek.in/solutions/<slug>`, captured with
 * Playwright. Nothing here is invented. Where the source stated a figure
 * (50% cycle-time reduction, 80% AP workload, Rs 1,000+ per invoice, 60-70%
 * cost, 30% faster collections, 40% less manual effort), it is the client's
 * own published claim and is preserved verbatim rather than re-estimated --
 * the same standard applied to WhyLyftek's stats, which stayed empty until
 * the client supplied real numbers.
 *
 * WHAT THE REWRITE CHANGED, per Docs/content_writing.md and
 * 11_CONTENT_STRATEGY.md:
 * - Removed the buzzword layer the source leans on ("Transform your finance
 *   function", "Redefine how your finance function operates", "unlock the
 *   true potential", "Power your growth", "seamless", "smarter",
 *   "intelligent platform", "actionable insights"). content_writing.md names
 *   this register directly as the thing to avoid.
 * - Led with the business outcome rather than the technology, and wrote for
 *   the CFO/controller actually evaluating this, not for a developer.
 * - Fixed grammar and punctuation throughout: the source runs em dashes
 *   inconsistently, has a missing space ("Experience Centerand"), a curly
 *   apostrophe in "team's", and several sentence fragments used as
 *   descriptions.
 * - Dropped filler sections that carried no information: Order to Cash's
 *   "Mission / The Vision / Strategy" block (three one-line platitudes), and
 *   its duplicated "Achieve Your Goals with Purpose & Strategy" heading,
 *   which appears twice on the live page over different content.
 *
 * ONE DELIBERATE OMISSION worth knowing about: the live Revenue Cycle
 * Management page lists twelve workflow stages (Patient Scheduling,
 * Pre-Registration, ... Payment Collection) and gives every single one the
 * IDENTICAL description, "Automated workflow ensures accuracy, speed, and
 * real-time tracking." That is placeholder copy, not content. Reproducing
 * twelve identical cards would look broken and pad the page with nothing;
 * the stages are kept as a named process list (they are real and useful),
 * and the fake per-stage descriptions are dropped rather than replaced with
 * twelve invented ones.
 *
 * NOT COVERED HERE: four Healthcare entries in `constants/solutions.ts`
 * (AI Agents / Intelligent Automation, Patient Engagement & Staff
 * Automation, Specialty Solutions, Integrations). Their `/solutions/<slug>`
 * URLs return the live site's SPA shell with zero content -- byte-identical
 * to a deliberately bogus control slug tested alongside them -- so no source
 * content exists to rewrite. They are omitted rather than invented, and need
 * copy from the client before they can ship.
 */

export const SOLUTION_CATEGORY_LABELS: Record<SolutionCategoryId, string> = {
  "enterprise-finance": "Enterprise & Finance",
  healthcare: "Healthcare",
};

export const SOLUTION_DETAILS: SolutionDetail[] = [
  {
    slug: "procurement-to-pay",
    category: "enterprise-finance",
    label: "Procurement to Pay (P2P / AP)",
    title: "Procurement to Pay",
    summary:
      "One connected process from vendor onboarding to payment, so procurement and accounts payable stop working from separate systems and separate versions of the truth.",
    metaDescription:
      "End-to-end Procurement to Pay automation from Lyftek: vendor onboarding, purchase orders, invoice matching, and payment scheduling in one connected process.",
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "Automated procurement workflows",
          description:
            "Procurement and accounts payable run in one system rather than two, which cuts cycle times by around half.",
        },
        {
          title: "Audit-ready compliance",
          description:
            "Continuous monitoring checks records against policy as work happens, instead of finding breaches at audit.",
        },
        {
          title: "Supplier collaboration",
          description:
            "Suppliers submit, track, and query through their own portal, so status chasing stops arriving by email.",
        },
        {
          title: "Real-time visibility",
          description:
            "Spend dashboards give finance a current picture for planning rather than a month-old one.",
        },
      ],
    },
    process: {
      heading: "What it covers",
      groups: [
        {
          title: "Procurement",
          items: [
            "Vendor onboarding and compliance checks",
            "Material creation",
            "Purchase requisition workflows",
            "Purchase order creation",
            "Contract lifecycle management",
            "Supplier portal integration",
            "Approvals and procurement activity tracking",
            "Goods and services receipting",
          ],
        },
        {
          title: "Invoice and payment",
          items: [
            "Vendor portal",
            "Invoice capture via OCR, AI, and IDP",
            "Two- and three-way matching across PO, GRN, and invoice",
            "Approval workflows",
            "ERP parking and posting",
            "Payment scheduling",
            "Fraud detection and compliance monitoring",
          ],
        },
        {
          title: "Reporting and controls",
          items: [
            "AP dashboards and spend analytics",
            "Vendor and material master data governance",
            "Payment terms optimisation",
            "Exception reporting and audit controls",
          ],
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Shorter cycles",
          description:
            "Requisition-to-payment time drops by more than half once approvals stop waiting on manual handoffs.",
        },
        {
          title: "Lower cost per transaction",
          description:
            "Duplicate payments disappear, overheads fall, and early-payment discounts become reachable.",
        },
        {
          title: "Fewer supplier disputes",
          description:
            "Matching across purchase order, goods receipt, and invoice catches mismatches before they reach a supplier.",
        },
        {
          title: "One system of record",
          description:
            "The process integrates with your existing ERP and finance stack, so there is no second set of data to reconcile.",
        },
      ],
    },
  },

  {
    slug: "accounts-payable-automation",
    category: "enterprise-finance",
    label: "Accounts Payable Automation",
    title: "Accounts Payable Automation",
    summary:
      "A touchless invoice-to-pay process that removes the repetitive work from AP without giving up control over compliance or cash.",
    metaDescription:
      "AI-led Accounts Payable automation from Lyftek: touchless invoice capture, automated reconciliation, GST validation, and audit-ready records.",
    challenges: {
      heading: "What manual AP costs you",
      points: [
        "More than Rs 1,000 in processing cost for every invoice handled",
        "GST inaccuracies and the compliance exposure that follows",
        "Delayed closings and reporting errors",
        "Strained vendor relationships caused by late and disputed payments",
        "Little visibility, and no audit readiness without a scramble",
        "Experienced finance staff spending their week on data entry",
      ],
    },
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "AI-driven invoice processing",
          description:
            "Reads any invoice format without per-vendor templates or training, so onboarding a new supplier costs nothing.",
        },
        {
          title: "Automated reconciliation",
          description:
            "Matches purchase orders, invoices, and goods receipts, and escalates only the exceptions.",
        },
        {
          title: "Built-in compliance checks",
          description:
            "Validates every invoice against GST rules, tax policy, and your own internal controls before it posts.",
        },
        {
          title: "Real-time cash position",
          description:
            "Liabilities, ageing, and working capital are visible across business units as they change.",
        },
        {
          title: "Vendor self-service",
          description:
            "Suppliers submit invoices and track payment status themselves, through a secure portal or WhatsApp.",
        },
        {
          title: "Complete audit trail",
          description:
            "Every transaction is timestamped, validated, and stored, so an audit is a query rather than a project.",
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Up to 80% less AP workload",
          description:
            "Automated handling removes manual entry, mismatch chasing, and the repetitive tasks around them.",
        },
        {
          title: "Faster month-end close",
          description:
            "Validation happens continuously, so close is not the first time anyone checks the numbers.",
        },
        {
          title: "Finance work worth doing",
          description:
            "The team moves from processing invoices to the analysis the business actually needs from them.",
        },
        {
          title: "Coordination across departments",
          description:
            "Finance, procurement, and leadership work from the same record rather than three exports.",
        },
      ],
    },
  },

  {
    slug: "order-to-cash",
    category: "enterprise-finance",
    label: "Order to Cash (O2C / AR)",
    title: "Order to Cash",
    summary:
      "Automation across the receivables cycle that shortens the gap between delivering work and being paid for it, without making customers chase you.",
    metaDescription:
      "End-to-end Order to Cash automation from Lyftek: invoice generation, AI cash application, collections management, and customer self-service portals.",
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "Automated invoice generation",
          description:
            "Accurate invoices are created and delivered at volume without manual assembly.",
        },
        {
          title: "AI cash application",
          description:
            "Incoming payments are matched to outstanding invoices as they arrive, including partial and grouped settlements.",
        },
        {
          title: "Dispute and deduction handling",
          description:
            "Exceptions route through a defined workflow instead of sitting in an individual inbox.",
        },
        {
          title: "Customer self-service",
          description:
            "Customers view invoices, track payments, and raise queries without contacting your team first.",
        },
        {
          title: "Collections management",
          description:
            "Receivables are prioritised by value and risk, and follow-ups run on schedule rather than on memory.",
        },
        {
          title: "Receivables reporting",
          description:
            "Ageing, DSO, and collection performance are available as current figures, not month-end reconstructions.",
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Collections around 30% faster",
          description:
            "Shorter DSO releases working capital that was previously tied up in unpaid invoices.",
        },
        {
          title: "40% less manual effort",
          description:
            "Matching, chasing, and re-keying come out of the process, and with them most of the rework.",
        },
        {
          title: "Fewer disputes",
          description:
            "Accurate first-time invoicing removes the corrections that delay payment and irritate customers.",
        },
        {
          title: "A better customer experience",
          description:
            "Self-service access improves satisfaction and, measurably, on-time payment rates.",
        },
      ],
    },
  },

  {
    slug: "record-to-report",
    category: "enterprise-finance",
    label: "Record to Report (R2R / Accounting)",
    title: "Record to Report",
    summary:
      "Automated reconciliations, journals, and reporting, so the close is a shorter, more predictable event and the team spends its time on what the numbers mean.",
    metaDescription:
      "Record to Report automation from Lyftek: automated journal entries, account and intercompany reconciliation, consolidation support, and audit-ready controls.",
    challenges: {
      heading: "Why the close takes so long",
      points: [
        "Manual reconciliations and journal entries stretch the close well past the deadline",
        "High transaction volumes raise the risk of misstatement and missed adjustments",
        "Without standardisation, entities close inconsistently and comparisons break",
        "Finance spends its time satisfying compliance rather than informing strategy",
      ],
    },
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "Automated journal entries",
          description:
            "Accruals, allocations, and adjustments are generated from rules rather than assembled by hand.",
        },
        {
          title: "Account reconciliation",
          description:
            "Transactions match across ledgers automatically, and only genuine exceptions reach a person.",
        },
        {
          title: "Intercompany matching",
          description:
            "Mismatches between entities surface early, when they are still cheap to resolve.",
        },
        {
          title: "General ledger posting",
          description:
            "Approved entries flow into the ERP with the correct coding already applied.",
        },
        {
          title: "Consolidation support",
          description:
            "Mapping and templates produce consistent group reporting across entities and currencies.",
        },
        {
          title: "Controls and audit trail",
          description:
            "Every entry carries its timestamp, author, justification, and supporting files.",
        },
      ],
    },
    process: {
      heading: "Core capabilities",
      groups: [
        {
          title: "Planning and management accounting",
          items: [
            "Cost and revenue allocation against pre-set rules",
            "Budget versus actual variance tracking by department",
          ],
        },
        {
          title: "General accounting and reporting",
          items: [
            "Rule-based accruals, depreciation, and adjustments",
            "Consolidated multi-entity, multi-currency statements",
          ],
        },
        {
          title: "Fixed assets and payroll",
          items: [
            "Depreciation runs driven by asset classification",
            "Payroll postings mapped to GL accounts automatically",
          ],
        },
        {
          title: "Master data governance",
          items: [
            "Vendor and material master accuracy",
            "Duplicate prevention and fraud controls across P2P transactions",
          ],
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Shorter close cycles",
          description:
            "Month-end and year-end timelines contract because the work is spread across the period, not compressed into it.",
        },
        {
          title: "Greater accuracy",
          description:
            "Automated validation catches errors at entry rather than at review.",
        },
        {
          title: "Compliance readiness",
          description:
            "Audit trails are built to stand up to SOX, IFRS, and GAAP scrutiny.",
        },
        {
          title: "Better insight",
          description:
            "Clean, consistent data makes reporting worth reading rather than worth checking.",
        },
      ],
    },
  },

  {
    slug: "treasury-cash-management",
    category: "enterprise-finance",
    label: "Treasury & Cash Management",
    title: "Treasury & Cash Management",
    summary:
      "Real-time visibility of cash, tighter controls, and forecasting built on live ERP data, so treasury informs decisions rather than reporting on them afterwards.",
    metaDescription:
      "Treasury and cash management automation from Lyftek: multi-account reconciliation, bank account governance, rolling cash forecasts, and automated fund transfers.",
    challenges: {
      heading: "Why treasury transformation matters",
      points: [
        "Liquidity is hard to confirm when balances live across disconnected accounts and regions",
        "Governance depends on spreadsheets that nobody can audit with confidence",
        "Manual reconciliation absorbs the time treasury needs for planning",
        "Decisions get made on yesterday's cash position rather than today's",
      ],
    },
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "Policies, governance, and controls",
          description:
            "Treasury policy and workflow are defined in the system, which tightens control and reduces fraud exposure.",
        },
        {
          title: "Cash management and reconciliation",
          description:
            "Reconciliation runs across multiple accounts automatically and flags mismatches as they appear.",
        },
        {
          title: "Bank account management",
          description:
            "Global bank, loan, and intercompany accounts are held centrally for transparency and compliance.",
        },
        {
          title: "Daily balance monitoring",
          description:
            "Positions across accounts and regions are visible in real time, which removes the blind spots.",
        },
        {
          title: "Cash flow forecasting",
          description:
            "Rolling forecasts build on live ERP, AP, and AR data rather than a periodic manual extract.",
        },
        {
          title: "Automated fund transfers",
          description:
            "Payments execute through structured, secure workflows, cutting manual error and settlement delay.",
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Reliable liquidity",
          description:
            "Funds are confirmed available when they are needed, rather than assumed to be.",
        },
        {
          title: "Audit-ready governance",
          description:
            "Controls are transparent and evidenced, so compliance is a standing state rather than an exercise.",
        },
        {
          title: "Faster decisions",
          description:
            "Live treasury data shortens the cycle between a question and a defensible answer.",
        },
        {
          title: "Lower operating cost",
          description:
            "Automated compliance reduces penalties, and digitised processes cut treasury overhead.",
        },
      ],
    },
  },

  {
    slug: "tax-compliance-automation",
    category: "enterprise-finance",
    label: "Tax & Compliance Automation",
    title: "Tax & Compliance Automation",
    summary:
      "From GST and TDS through to multi-country reporting, an automated tax lifecycle that reduces filing risk and gives tax leaders evidence rather than assurances.",
    metaDescription:
      "Tax and compliance automation from Lyftek: centralised GST and TDS data, AI validation, automated calculation, and audit-ready compliance reporting.",
    challenges: {
      heading: "What makes tax hard to get right",
      points: [
        "Regulations change faster than manual processes can absorb",
        "Manual preparation introduces the errors that attract penalties",
        "Domestic and international rules together consume specialist capacity",
        "Leadership needs confidence in a filing, not just a completed one",
      ],
    },
    capabilities: {
      heading: "The automated tax lifecycle",
      items: [
        {
          title: "Tax data collection",
          description:
            "GST, TDS, invoice, and multi-country tax data is centralised instead of gathered per filing.",
        },
        {
          title: "Validation and error checks",
          description:
            "Anomalies are identified and raised before submission, not discovered afterwards.",
        },
        {
          title: "Automated calculation",
          description:
            "Deferred tax and complex adjustments are computed consistently every period.",
        },
        {
          title: "Compliance reporting",
          description:
            "Audit-ready reports are generated on demand rather than assembled under deadline.",
        },
        {
          title: "Filing and archival",
          description:
            "Submissions go out digitally and the compliance record is retained automatically.",
        },
      ],
    },
    process: {
      heading: "Where automation applies",
      groups: [
        {
          title: "Tax strategy and planning",
          items: [
            "Scenario simulation to support decisions",
            "Tax position aligned to business objectives",
            "Tax-saving opportunities identified in advance",
          ],
        },
        {
          title: "Tax master data",
          items: [
            "Centralised, standardised tax data",
            "Consistency enforced across systems",
            "Automated validation to reduce error",
          ],
        },
        {
          title: "Consolidated tax planning",
          items: [
            "Multi-entity tax data unified in one place",
            "Automated calculation for faster compliance",
            "Liability optimised using analytics",
          ],
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Lower filing risk",
          description:
            "Validation before submission removes most of the errors that lead to penalties and revisions.",
        },
        {
          title: "Faster compliance cycles",
          description:
            "Centralised data and automated calculation shorten preparation from weeks to days.",
        },
        {
          title: "Evidence on demand",
          description:
            "Audit-ready reporting is available whenever it is asked for, in the form it is asked for.",
        },
        {
          title: "Specialist time recovered",
          description:
            "Tax professionals spend their time on position and planning rather than on collation.",
        },
      ],
    },
  },

  {
    slug: "working-capital-optimization",
    category: "enterprise-finance",
    label: "Working Capital Optimization",
    title: "Capital Planning & Project Approvals",
    summary:
      "A governed way to evaluate, prioritise, and approve capital projects, with the financial clarity to defend each decision after it is made.",
    metaDescription:
      "Capital planning and project approval automation from Lyftek: structured proposals, scenario modelling, tiered approval governance, and real-time budget tracking.",
    challenges: {
      heading: "Where capital planning breaks down",
      points: [
        "Competing proposals are hard to rank without a consistent basis",
        "Cost estimates prove optimistic and overruns follow",
        "Approvals stall because the workflow is spread across teams and tools",
        "Budget utilisation and project progress are difficult to see while there is still time to act",
      ],
    },
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "Multi-scenario modelling",
          description:
            "Alternative project plans and funding strategies can be compared side by side before commitment.",
        },
        {
          title: "Capital budgeting dashboards",
          description:
            "Dashboards read directly from ERP and general ledger, so the numbers are the accounting numbers.",
        },
        {
          title: "Automated governance",
          description:
            "Configurable, tiered approval rules enforce policy without anyone policing it manually.",
        },
        {
          title: "Variance tracking",
          description:
            "Deviations in cost, schedule, and funding are surfaced against plan as they emerge.",
        },
        {
          title: "Full audit trail",
          description:
            "Every step in the approval chain is logged, with its rationale, for compliance and review.",
        },
      ],
    },
    process: {
      heading: "How it works",
      groups: [
        {
          title: "Capital planning",
          items: [
            "Investments prioritised against strategy",
            "Scenarios evaluated before funding is committed",
            "Proposals standardised through structured templates",
          ],
        },
        {
          title: "Project approvals",
          items: [
            "Configurable multi-level approval workflows",
            "Governance rules applied automatically",
            "Decisions taken with complete supporting data",
          ],
        },
        {
          title: "Performance monitoring",
          items: [
            "Budget utilisation tracked in real time",
            "Risks and schedules monitored against plan",
            "Capital spend held to strategic objectives",
          ],
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Stronger returns",
          description:
            "Capital goes to the projects with the best value and the lowest risk, judged on the same basis.",
        },
        {
          title: "Financial discipline",
          description:
            "Overruns reduce because budget alignment is checked continuously rather than at review points.",
        },
        {
          title: "Faster decisions",
          description:
            "Proposals are approved or declined quickly, because the data needed to decide is already attached.",
        },
        {
          title: "Regulatory confidence",
          description:
            "Audit-ready documentation is produced as a by-product of the process, not afterwards.",
        },
      ],
    },
  },

  {
    slug: "document-data-automation",
    category: "enterprise-finance",
    label: "Document & Data Automation (OCR + AI / IDP)",
    title: "Document & Data Automation",
    summary:
      "Invoices in any format turned into structured, validated data, so accounts payable starts from clean input instead of correcting bad input.",
    metaDescription:
      "Document and data automation from Lyftek: OCR, AI, and IDP that capture invoices in any format, validate them, and post straight into your ERP.",
    challenges: {
      heading: "Why capture needs automating",
      points: [
        "Manual invoice entry is slow, expensive, and unreliable at volume",
        "Conventional OCR struggles with varied formats and unstructured layouts",
        "Finance teams lose hours validating vendor details by hand",
        "Compliance risk grows wherever validation depends on someone remembering",
      ],
    },
    capabilities: {
      heading: "OCR, AI, and IDP together",
      items: [
        {
          title: "Universal invoice capture",
          description:
            "PDFs, scanned images, handwritten notes, mobile photos, email, and EDI files are all read, across languages.",
        },
        {
          title: "AI validation that learns",
          description:
            "Fields are validated against known patterns, and accuracy improves with every document processed.",
        },
        {
          title: "Zero-touch processing",
          description:
            "Clean documents pass straight through without human handling; only exceptions stop.",
        },
        {
          title: "Fraud and compliance checks",
          description:
            "Suspicious documents are flagged and policy rules are enforced before anything posts.",
        },
        {
          title: "ERP integration",
          description:
            "Connects to Tally, SAP, Oracle, Microsoft Dynamics, and NetSuite without bespoke middleware.",
        },
      ],
    },
    benefits: {
      heading: "What changes for the business",
      items: [
        {
          title: "Up to 80% faster processing",
          description:
            "Invoice cycle times fall sharply once capture and validation stop being manual steps.",
        },
        {
          title: "60-70% lower handling cost",
          description:
            "The per-invoice cost of touching, checking, and correcting documents largely disappears.",
        },
        {
          title: "Fewer payment errors",
          description:
            "Accurate capture reduces rework and the disputes that follow incorrect payments.",
        },
        {
          title: "Audit readiness",
          description:
            "A complete digital trail exists for every document, from receipt through to posting.",
        },
      ],
    },
  },

  {
    slug: "revenue-cycle-management",
    category: "healthcare",
    label: "Revenue Cycle Management (RCM)",
    title: "Revenue Cycle Management",
    summary:
      "Automation across the healthcare revenue cycle, from patient scheduling through to payment posting, aimed at the denials and delays that cost providers most.",
    metaDescription:
      "Healthcare Revenue Cycle Management automation from Lyftek: scheduling, insurance verification, coding, claims, denial management, and payment posting.",
    stats: [
      { value: "25-30%", label: "of claims denied because of data errors" },
      { value: "40%", label: "of staff time spent on repetitive admin work" },
      { value: "$20B+", label: "lost annually to billing inefficiency" },
    ],
    challenges: {
      heading: "Where revenue leaks",
      points: [
        "Claims are denied for data errors that were detectable before submission",
        "Skilled staff spend a large share of their week on repetitive administration",
        "Denials are worked reactively, long after the cash impact has landed",
        "Leadership lacks a current view across claims, payments, and receivables",
      ],
    },
    capabilities: {
      heading: "What the platform does",
      items: [
        {
          title: "Eligibility and verification",
          description:
            "Insurance is verified before service, which removes a large share of downstream denials.",
        },
        {
          title: "Coding and charge capture",
          description:
            "Charges and codes are captured accurately at the point of care rather than reconstructed later.",
        },
        {
          title: "Claims submission and tracking",
          description:
            "Claims are validated before they go out and tracked through to adjudication.",
        },
        {
          title: "Denial management",
          description:
            "Denials are categorised, routed, and worked by root cause, so the same error stops recurring.",
        },
        {
          title: "Payment posting and AR follow-up",
          description:
            "Remittances post automatically and outstanding balances are pursued on schedule.",
        },
        {
          title: "Reporting and analytics",
          description:
            "Dashboards give finance and RCM leaders current visibility across claims, payments, denials, and revenue.",
        },
      ],
    },
    process: {
      heading: "Stages covered end to end",
      groups: [
        {
          title: "Front office",
          items: [
            "Patient scheduling",
            "Pre-registration",
            "Insurance verification",
          ],
        },
        {
          title: "Mid cycle",
          items: ["Charge capture", "Medical coding", "Claims submission"],
        },
        {
          title: "Back office",
          items: [
            "Claims processing",
            "Payment posting",
            "Denial management",
            "AR follow-up",
            "Statement processing",
            "Payment collection",
          ],
        },
      ],
    },
    benefits: {
      heading: "What changes for the provider",
      items: [
        {
          title: "Fewer denials",
          description:
            "Validation before submission addresses the data errors behind roughly a quarter of denials.",
        },
        {
          title: "Faster cash collection",
          description:
            "Cleaner claims adjudicate sooner, which shortens the gap between care delivered and cash received.",
        },
        {
          title: "Administrative capacity returned",
          description:
            "Automating repetitive work gives clinical and billing staff their time back for higher-value tasks.",
        },
        {
          title: "Financial accuracy",
          description:
            "Charges, codes, and postings reconcile, so reported revenue reflects what was actually delivered.",
        },
      ],
    },
  },
];

/** Convenience lookup used by the dynamic route's `generateStaticParams`. */
export function getSolutionBySlug(slug: string): SolutionDetail | undefined {
  return SOLUTION_DETAILS.find((s) => s.slug === slug);
}
