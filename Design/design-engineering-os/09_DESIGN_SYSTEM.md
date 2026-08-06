# 09_DESIGN_SYSTEM.md

# Design System

## Purpose

This document serves as the living design system for the Lyftek website.

Unlike the previous documents that establish philosophy, visual direction, and design principles, this file defines the reusable UI components that make up the final product.

This is a living document.

It will evolve throughout the project as new components are introduced, existing components are refined, implementation details change, and design decisions mature.

Every reusable UI element should ultimately be documented here.

This document should become the single source of truth for the Lyftek interface.

---

# Living Design System

This design system is expected to evolve.

Do not assume that the first version of any component is final.

During the design and development process:

- existing components may be refined
- spacing may be adjusted
- typography may evolve
- interaction patterns may improve
- accessibility may require updates
- implementation constraints may introduce changes

Whenever new information is provided, incorporate it into this design system while maintaining consistency with the previously established principles.

Do not create conflicting component variations unless there is a justified use case.

The design system should become stronger over time rather than more fragmented.

---

# Research Before Designing Components

Before designing any reusable component, perform structured research.

Create a team consisting of:

- Senior Product Designer
- Design Systems Architect
- Enterprise UX Specialist
- UI Designer
- Accessibility Expert
- Frontend Engineer
- Motion Designer

Each expert should independently evaluate how leading enterprise products solve similar interface problems.

Study references such as:

- Stripe
- Vercel
- Linear
- Apple
- Anthropic
- IBM
- Microsoft
- GitHub
- Figma
- Atlassian
- Notion

Research beyond these examples whenever better implementations exist.

Do not recreate components from memory.

Understand why they work.

Extract reusable design principles.

---

# Component Philosophy

Every component should satisfy the following goals:

- reusable
- modular
- scalable
- accessible
- responsive
- maintainable
- visually consistent
- implementation friendly

Components should solve problems.

Never create decorative components without purpose.

---

# Component Standards

Every documented component should define:

## Purpose

Why does this component exist?

What user problem does it solve?

---

## Usage

Where should it be used?

Where should it not be used?

---

## Structure

Document:

- layout
- spacing
- typography
- alignment
- visual hierarchy

---

## Variants

If multiple variants exist, explain:

- when each variant should be used
- when each variant should not be used

Avoid unnecessary component variations.

---

## States

Every interactive component should define:

- default
- hover
- focus
- active
- disabled
- loading
- success
- error

where applicable.

---

## Responsive Behaviour

Explain how the component adapts across:

- Desktop
- Tablet
- Mobile

Responsiveness should be intentional.

---

## Accessibility

Every component should satisfy accessibility requirements.

Consider:

- keyboard navigation
- focus visibility
- screen readers
- semantic HTML
- contrast
- touch targets

Accessibility is mandatory.

---

## Motion

If animation is required:

Document:

- purpose
- timing
- easing
- interaction

Motion should improve usability.

Never animate purely for decoration.

---

## Implementation Notes

Consider implementation alongside design.

Components should be practical to build using the project's frontend stack.

Avoid designs that are unnecessarily difficult to maintain.

---

# Initial Component Library

The following components will be designed and documented throughout the project.

## Navigation

### Navbar ✅ Built — `website/components/layout/Navbar.tsx`

**Purpose:** Single unified site navigation, replacing the live site's two-layer header (contact bar + nav) that the Docs PDF flagged for adding unnecessary height and burying the logo.

**Usage:** Rendered once, in `app/layout.tsx`, so every route inherits it automatically. Never import it directly into a page.

**Structure:** `Lyftek` wordmark (left) — primary links (center-right, desktop only) — primary CTA button (right, desktop only) — mobile menu toggle (right, replaces links+CTA below the `lg` breakpoint). Content constrained to the standard 1280px container from `06_LAYOUT_AND_SPACING.md`.

**Variants:** None yet — one navbar for the whole site. If a page ever needs a transparent/hero-blended variant, extend via props rather than forking the component.

**States:**
- Default (top of page): transparent border, solid background, no blur.
- Scrolled (`scrollY > 8px`): border + `backdrop-blur-md` fade in via CSS transition — reinforces orientation without being decorative.
- Active link: `aria-current="page"`, full-opacity text vs. `foreground-secondary` for inactive links.
- Mobile menu open/closed: toggled by a Phosphor `List`/`X` icon button with `aria-expanded`/`aria-controls`.
- Focus: visible `focus-visible` ring (accent color) on every interactive element.

**Responsive:** `lg` (1024px) breakpoint splits desktop (inline links + CTA) from mobile (hamburger → slide-down panel with the same links + full-width CTA). Chosen over the more common `md` breakpoint because 6 nav items + CTA + logo felt cramped in the 768–1023px tablet range during review.

**Accessibility:** Skip-to-content link (targets `#main-content` — every page's top-level landmark must carry that id), semantic `<header>`/`<nav aria-label="Primary|Mobile">`, `aria-current` on the active link, Escape closes the mobile menu, menu also resets on route change, all interactive elements keyboard-reachable with visible focus rings.

**Motion:** Mobile menu open/close is a Framer Motion height/opacity transition (`duration: 0.2s`), skipped entirely (`duration: 0`) when `useReducedMotion()` reports a preference for reduced motion. Scroll-elevation and link hover states are plain CSS transitions (color/background/border/blur only — no layout-affecting properties), per `13_MOTION_AND_ANIMATION.md`'s performance rules.

**Implementation notes:** Nav items + CTA live in `constants/navigation.ts` (data), not hardcoded in the component — changing the sitemap means editing one array. Uses the shared `Button` component (see Buttons section below) rather than one-off button markup. Logo is currently a **text wordmark**, not an image — no Lyftek logo asset has been supplied to any Claude session yet; swap it for a real `<Image>` logo as soon as brand assets exist, in `components/layout/Navbar.tsx`.

- Mobile Navigation — built as part of Navbar above, not a separate component.
- Sticky Navigation — built as part of Navbar above (`position: sticky`).
- Navigation Links — built as part of Navbar above.
- CTA Navigation — built as part of Navbar above, via the shared `Button` component.

---

## Hero ✅ Built (v1) — `website/components/sections/Hero.tsx`

**Purpose:** first thing every visitor sees; must communicate what Lyftek does and why it's trustworthy within a few seconds (01_PROJECT_CONTEXT.md).

**Structure:** centered single column, eyebrow label → H1 → supporting subhead → primary+secondary CTA row → small trust caption. Constrained to the standard 1280px container. No two-column split, no hero image/illustration/video.

**Copy decisions (subject to content review, not final copy sign-off):**
- Headline: "Engineering **technology** businesses can trust." — deliberately broader than the Docs PDF's suggested "AI era" framing, because 02_BRAND_GUIDELINES.md explicitly warns against positioning Lyftek as AI-first ("This company is building for the future," not "this company only does AI").
- Subhead: short fragment style ("Custom software, AI, cloud, and cybersecurity — engineered for businesses that need to get it right"), matching the PDF's own critique that the original subhead read like a tech-stack list instead of answering "how will you help my business."
- Primary CTA "Book a Consultation" reuses the exact Navbar CTA (same destination, `/contact`) rather than introducing new wording — one consistent action across the site.
- Secondary CTA "Explore Our Services" → `/services` — this was the *original* site's sole hero CTA; kept, just demoted to secondary now that a stronger primary exists.
- Trust caption: the ISO 9001:2015 / ISO/IEC 27001:2022 certification line still appears, but as small muted text below the CTAs, not a bordered badge competing with the headline (direct fix for the PDF's "competes with the main message" critique).

**Visual Area:** intentionally empty of imagery. No product screenshots, dashboards, or illustrations exist yet, and fabricating a stand-in graphic would misrepresent the product (see 04_VISUAL_LANGUAGE.md's warning against "generic marketing illustrations" and the project-wide "never fabricate information" rule). In their place: a static, very-low-opacity 64px grid texture (masked to fade toward the bottom) plus a soft accent-tinted radial gradient behind the headline — both restrained enough to avoid the "glowing UI" / "blurred glow orb" pattern 04_VISUAL_LANGUAGE.md explicitly bans. Revisit this once real product/case-study visuals exist.

**Motion:** entrance is a staggered fade+rise (eyebrow → headline → subhead → CTAs → trust line, 0.08s stagger, 0.5s ease-out per element), skipped entirely via `useReducedMotion()` when the user prefers reduced motion. No background motion, no looping animation, no parallax — matches 13_MOTION_AND_ANIMATION.md's "Hero Animation" guidance (progressive reveal, not a cinematic intro).

**Not built yet:** a dedicated Trust/Certifications section (the PDF explicitly recommended moving the ISO badge out of the hero into its own section — that section itself doesn't exist yet, the hero just no longer crowds it in). A real visual/proof element for the hero once product assets exist.

---

## Buttons

### Button 🔶 Partially built — `website/components/ui/Button.tsx`

Built now: `primary` (solid accent, e.g. nav CTA) and `ghost` (used for the mobile menu icon toggle), plus `outline`. Sizes: `md` (default) and `icon` (square, for icon-only buttons). Renders as a Next.js `Link` when given an `href`, otherwise a native `<button>`.

Not built yet: `Secondary` variant, and full HTML-attribute passthrough (currently a deliberately minimal prop surface — `onClick`, `type`, `aria-*` — extend it when a real use case needs more, rather than speculatively). `Link Button` (text-only, no background) also not built yet — first real need for it will define its API.

---

## Cards

- Service Cards
- Feature Cards
- Information Cards
- Statistics Cards

Cards should only be used when they improve structure and readability.

Do not place every section inside a rounded card.

---

## Content Components

- Section Headers
- Feature Lists
- Statistics
- Timelines
- Process Steps
- Technology Stack
- Industry Cards
- Client Logos
- Certifications

---

## Forms

- Inputs
- Textareas
- Dropdowns
- Checkboxes
- Radio Buttons
- Validation
- Error States
- Success States

---

## Trust Components

- Testimonials
- Case Studies
- Awards
- Certifications
- Success Metrics

---

## Calls To Action

- Inline CTA
- Section CTA
- Final CTA

---

## Footer

Enterprise footer with clear navigation and company information.

---

## Future Components

As the project evolves, additional components may be introduced.

Examples include:

- Pricing tables
- Resource cards
- Blog components
- Search
- Filters
- Data tables
- Dashboards
- Careers
- Team members
- Job listings
- Documentation blocks

Add new components only when there is a genuine product requirement.

Avoid unnecessary complexity.

---

# Consistency Rules

Every component should feel like it belongs to the same product.

Maintain consistency in:

- spacing
- typography
- border radius
- iconography
- elevation
- colors
- interactions
- motion
- responsive behaviour

The interface should feel cohesive rather than assembled from unrelated parts.

---

# Design Reviews

Whenever a new component is created or an existing component is modified, evaluate:

- Does it solve a real problem?
- Does it follow the design principles?
- Does it follow the visual direction?
- Is it accessible?
- Is it responsive?
- Is it reusable?
- Is it maintainable?
- Does it improve the user experience?

Refine components until they meet these standards.

---

# Project Evolution

Throughout this project, additional instructions may be provided by the user.

These instructions may:

- modify existing components
- introduce new components
- replace outdated patterns
- refine interaction behaviour
- improve implementation details
- simplify existing solutions

Treat these updates as authoritative project decisions.

Incorporate them into this design system while preserving consistency with all previously established documents.

The design system should continuously improve rather than remain static.

---

# Final Principle

A design system is not a collection of components.

It is a framework for creating consistent, scalable, accessible, and maintainable user experiences.

Every new component should strengthen the overall quality of the Lyftek website rather than existing as an isolated design.

As the project evolves, this document should remain the definitive reference for every reusable interface element, ensuring that all future design and development decisions remain aligned with the project's vision, principles, and enterprise-quality standards.