# 07_TYPOGRAPHY.md

# Typography Guidelines

## Purpose

Typography is one of the strongest contributors to the perceived quality of an enterprise website.

Well-structured typography improves readability, establishes hierarchy, reinforces professionalism, and creates trust.

For Lyftek, typography should communicate clarity, precision, confidence, and technical expertise rather than visual decoration.

Typography should remain timeless and highly readable across all devices.

---

# Research First

Before selecting any font family, perform independent research.

Create a review team consisting of:

- Senior Product Designer
- Brand Designer
- Typography Specialist
- UX Researcher
- Accessibility Specialist
- Frontend Engineer

Each expert should evaluate available font families based on:

- readability
- professionalism
- enterprise suitability
- scalability
- accessibility
- multilingual support
- web performance
- long-term maintainability

Prefer high-quality open-source fonts before considering commercial alternatives.

The selected typography should be justified with reasoning rather than personal preference.

---

# Typography Philosophy

Typography should feel:

- Professional
- Modern
- Clean
- Technical
- Confident
- Calm
- Premium
- Highly readable

Avoid typography that feels:

- Playful
- Decorative
- Experimental
- Trend-driven
- Overly futuristic

Good typography should become almost invisible, allowing users to focus on the content.

---

# Primary Typeface

The primary typeface will be used for:

- Headlines
- Body text
- Navigation
- Forms
- Cards
- Buttons
- Documentation
- UI Components

Candidate fonts include:

- Inter
- Manrope
- Plus Jakarta Sans
- Geist
- Rinter
- IBM Plex Sans
- Source Sans 3
- Public Sans

Claude should also research additional modern open-source fonts that fit Lyftek's brand direction.

Evaluate each option based on enterprise usability rather than popularity.

---

# Accent Typeface

A secondary typeface may be used sparingly for subtle emphasis.

Potential use cases:

- Buttons
- Labels
- Small metadata
- Section identifiers
- Technical highlights

Candidate fonts include:

- Space Mono
- IBM Plex Mono
- JetBrains Mono
- Geist Mono

Use only when it strengthens the visual identity.

The website should never look like a developer portfolio.

Accent typography should remain subtle.

---

# Numeric Typeface

Statistics and numerical data should have a distinct visual identity.

Consider using a monospaced or tabular-number font for:

- Company statistics
- Performance metrics
- Years of experience
- Project counts
- Success metrics
- Timelines
- Technical specifications

Candidate fonts include:

- Space Mono
- IBM Plex Mono
- JetBrains Mono
- Geist Mono

Numbers should feel engineered, precise, and trustworthy.

---

# Typography Hierarchy

Establish a clear and predictable hierarchy.

Typography should immediately communicate:

- Page title
- Section title
- Supporting text
- Body content
- Metadata
- Captions
- Calls to action

Hierarchy should rely primarily on:

- Size
- Weight
- Spacing
- Position

Avoid excessive variation.

Consistency creates confidence.

---

# Readability

Optimize typography for reading rather than visual impact.

Maintain:

- Comfortable line height
- Appropriate paragraph width
- Balanced font weights
- Clear letter spacing
- Strong contrast

Avoid:

- Long line lengths
- Dense paragraphs
- Tiny text
- Excessively bold typography
- Decorative styling

Reading should feel effortless.

---

# Responsive Typography

Typography should scale naturally across devices.

Every breakpoint should preserve:

- hierarchy
- readability
- rhythm
- balance

Never reduce readability to preserve layout.

---

# Accessibility

Typography must meet accessibility standards.

Consider:

- minimum readable sizes
- sufficient contrast
- scalable text
- predictable hierarchy
- readable font rendering
- adequate spacing

Accessibility should be considered during font selection rather than after implementation.

---

# Font Loading & Performance

Typography should remain performant.

Prioritize:

- Variable fonts where appropriate
- Efficient loading strategies
- Minimal font files
- Limited font families
- Limited font weights

Avoid loading unnecessary assets.

Performance contributes to perceived quality.

---

# Inspiration

Study typography systems used by leading enterprise products.

Primary references:

- Stripe
- Linear
- Vercel
- Anthropic
- Apple
- IBM
- Microsoft
- Notion

Research additional examples if stronger references are available.

Analyze:

- heading scale
- font pairing
- paragraph width
- body readability
- numerical presentation
- font weights
- responsive behavior
- spacing around typography

Extract principles rather than copying styles.

---

# Locked Decision (2026-08-07, superseded same day — see below)

The candidate lists above are the research inputs. The three-typeface system originally shipped here (Public Sans body / IBM Plex Sans headings / Switzer Hero H1 / Geist Mono accents) was **replaced later the same day** by the trio system below, per explicit, direct client instruction. Kept in git history / `claudeContextExchange.md` for the record, not reproduced in full here — the table below is the only typography system currently live.

---

# Locked Decision — Trio System (2026-08-07, current)

Replaces the system above in full. **Locked** — do not re-litigate without explicit client direction. Three faces, each with exactly one job, applied **sitewide** (not scoped to individual elements the way Switzer/Rinter originally were) — per the client's own instruction: *"for small heading section starters martian mono / buttons and normal text: delight / Big heading and numbers: Rinter … Apply this trio font pattern throughout."*

| Role | Typeface | Utility | Where it's used |
|---|---|---|---|
| Big headings + numbers | Rinter (self-hosted, Regular/400 only) | `font-rinter` | Every H1/H2/H3 (Hero, About, Services incl. card titles, WhyLyftek, ContactCTA incl. its form-success state), WhyLyftek's stat value |
| Small heading / section-starter labels + brand marks | Martian Mono (Google Fonts, 400/700/800) | `font-martian-mono` | Every section's uppercase eyebrow label (Hero/About/Services/WhyLyftek), Navbar wordmark + nav links, Footer wordmark + all 4 column headers |
| Buttons + normal (body/paragraph) text | Delight (self-hosted, Regular/400 only) | `font-sans` (the sitewide default now) / `font-delight` (explicit alias) | Everything that doesn't opt into one of the other two faces — paragraphs, buttons, form inputs, card body copy |

**Fully retired:** Public Sans, IBM Plex Sans, Switzer — no element uses `font-heading` or `font-switzer` anymore; both utilities and their underlying `next/font`/Fontshare loads were removed from `app/layout.tsx` and `app/globals.css`, not just left unused. **Geist Mono (`font-mono`) is the one holdover** from the old system, kept only for UI micro-copy that doesn't fit any of the trio's three categories: form field labels (Input/Select/Textarea), Avatar fallback initials, WhyLyftek's stat sub-label ("years of experience"), About's inline "Since 2011 | One partner for all of it." caption.

**Provenance and licensing** (all self-hosted files were fetched from client-supplied links and license-checked before use, not guessed):
- **Rinter** — Thunder Type foundry, free for personal & commercial use (confirmed via thunder.rs and the Befonts mirror the client linked, plus the font file's own embedded copyright string). Downloaded as a single Regular-weight `.otf`; no bold cut exists to buy or download.
- **Delight** — Rajesh Rajput, Behance/Gumroad ("Delight Typeface / Free / 09 Weights / Variable"). Freeware, free for personal and commercial use per multiple independent sources (redistribution/resale/modification of the font files themselves is restricted — standard freeware terms, not a ban on webfont use). Only the Regular weight is available via free download; the other 8 weights sit behind Gumroad's own paid-or-free checkout flow, which wasn't completed.
- **Martian Mono** — NOT the font the client originally linked. The client sent a Behance link to "AO Mono / Free Font" (Atelier Olschinsky); AO Mono's commercial-use license came back genuinely disputed across every source checked, and the designer's own site was unreachable to settle it. Martian Mono was proposed and accepted as a confirmed-license substitute with a similar geometric/constructivist "techy" monospace character — it's on Google Fonts proper (SIL Open Font License), so there's no licensing ambiguity at all.

**Known tradeoff, accepted, not hidden:** Rinter and Delight each ship only a Regular (400) weight. Anywhere the old system called for a heavier weight (headings, button labels that used `font-medium`/`font-semibold`), the browser's own `font-synthesis` behavior algorithmically embolds the Regular glyphs rather than rendering a real designed bold cut. This was verified visually (screenshot, not assumed) to read acceptably at both display size (Hero's `lg:text-8xl` H1) and smaller heading/body sizes before accepting it — but it is synthetic bold, not a designed one, and that's a real (accepted) quality tradeoff, not an oversight.

---

# Final Principle

Typography should make visitors feel that Lyftek is an experienced engineering organization.

If typography feels effortless to read, visually balanced, and professionally structured, it is likely the correct direction.

Every typographic decision should strengthen clarity, trust, and credibility rather than drawing attention to itself.