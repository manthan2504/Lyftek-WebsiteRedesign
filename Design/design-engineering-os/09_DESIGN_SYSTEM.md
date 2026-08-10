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

### Navbar ✅ Built (v2 — locked 2026-08-07) — `website/components/layout/Navbar.tsx`

**Purpose:** Single unified site navigation, replacing the live site's two-layer header (contact bar + nav) that the Docs PDF flagged for adding unnecessary height and burying the logo.

**Usage:** Rendered once, in `app/layout.tsx`, so every route inherits it automatically. Never import it directly into a page.

**Structure (v2 — superseded the original 1280px inline-header version):** an independent **floating boxed panel**, not an inline header — `bg-panel` (near-black), square corners, `DASHBOARD_CONTAINER` width (1440px, same as Hero's panel below it, via `constants/layout.ts`), `sticky top-8 mt-8` so it keeps its floating gap from the viewport edge even after scrolling rather than snapping flush. `CornerBrackets` (lime L-shaped marks, `components/ui/CornerBrackets.tsx`) on all 4 corners — this is the only component on the page that gets the corner-bracket treatment; the Hero dashboard panel behind it stays plain. Inside the box: `Lyftek` text wordmark (left, `font-heading`) — primary links (center-right, desktop only) — primary CTA button (right, desktop only) — mobile menu toggle (right, replaces links+CTA below `lg`).

**Homepage integration:** on the homepage specifically, `app/page.tsx` pulls Hero's wider dashboard panel up via a negative margin (`NAVBAR_FOOTPRINT_PX` constant) so Hero's dark/grid background shows through above/below/around this floating box — Navbar itself has zero awareness of that and renders identically on every route.

**Variants:** None — one navbar for the whole site.

**States:**
- Default: no scroll-based border/blur change in v2 (superseded — the boxed-panel treatment above replaces the earlier inline-header's scroll-elevation state).
- Active link: `layoutId="nav-active-indicator"` Framer Motion shared-layout indicator — a flat 2px accent underline that slides smoothly between links as the active route changes, rather than just appearing/disappearing (researched against Stripe/Vercel/Linear vs. IBM/Microsoft/GitHub precedent). Inactive links get a CSS-only underline-grow on hover/focus (`scale-x-0` → `scale-x-100`), no Framer Motion needed for a plain hover state.
- Mobile menu open/closed: toggled by a Phosphor `List`/`X` icon button with `aria-expanded`/`aria-controls`.
- Focus: visible `focus-visible` ring (accent color) on every interactive element.

**Responsive:** `lg` (1024px) breakpoint splits desktop (inline links + CTA) from mobile (hamburger → slide-down panel with the same links + full-width CTA). Chosen over the more common `md` breakpoint because 6 nav items + CTA + logo felt cramped in the 768–1023px tablet range during review.

**Accessibility:** Skip-to-content link (targets `#main-content`), semantic `<header>`/`<nav aria-label="Primary|Mobile">`, `aria-current` on the active link, Escape closes the mobile menu, menu also resets on route change (via render-time state adjustment, not a `useEffect` — avoids the `react-hooks/set-state-in-effect` lint rule), all interactive elements keyboard-reachable with visible focus rings.

**Motion:** Mobile menu open/close is a Framer Motion height/opacity transition (`duration: 0.2s`), skipped entirely (`duration: 0`) when `useReducedMotion()` reports a preference for reduced motion. No glow/shadow on the active-link indicator, no always-on blur — both would tip into effects `04_VISUAL_LANGUAGE.md` bans.

**Implementation notes:** Nav items + CTA live in `constants/navigation.ts`. Uses the shared `Button` component. Logo is still a **text wordmark**, not an image — no Lyftek logo asset has been supplied yet. CTA reads "Book a Consultation," rendered as a sharp box like every other button sitewide (see Button entry below) — the pill-vs-rounded-md consistency question flagged in earlier sessions is resolved as of 2026-08-07: both this CTA and Hero's now share the same sharp corner, nothing left to reconcile.

- Mobile Navigation — built as part of Navbar above, not a separate component.
- Sticky Navigation — built as part of Navbar above (`position: sticky`).
- Navigation Links — built as part of Navbar above.
- CTA Navigation — built as part of Navbar above, via the shared `Button` component.

---

## Hero ✅ Built (v3 — LOCKED 2026-08-07) — `website/components/sections/Hero.tsx`

**This entry replaces v1 and v2 entirely — do not treat anything below as still-in-flux.** The client has explicitly confirmed satisfaction with the current build ("this hero section is locked in now"). Any future change to it is a new decision, not a continuation of an open one.

**Purpose:** first thing every visitor sees; must communicate what Lyftek does and why it's trustworthy within a few seconds (01_PROJECT_CONTEXT.md).

**Structure:** single near-full-width text column (`DASHBOARD_CONTAINER`, 1440px, same width as Navbar's floating panel above it) — eyebrow → 3-line headline → description + CTA row, side by side at `sm:` and up. No two-column grid split (a two-column "Systems Panel" diagram concept was built, shown to the client, and explicitly rejected — see claudeContextExchange.md Session log for 2026-08-06/07 — reverted in full before this version was built).

**Copy (final, client-approved):**
- Eyebrow: a lime `h-2 w-2` square + "Enterprise Technology Partner" in `font-mono`, uppercase, wide tracking.
- Headline, 3 stacked lines, `font-rinter` (sitewide big-heading face as of 2026-08-07's trio system, see 07_TYPOGRAPHY.md — was Hero-only Switzer before that), `font-extrabold` (via browser synthesis, Rinter only ships Regular), up to `lg:text-8xl`: "Technology" / "should remove" (both uppercase) / "**complexity.**" (deliberately lowercase + lime accent color — the loud problem statement answered by a quiet, calm payoff line, not a third uppercase emphasis stacked on top of the first two).
- Description: "We engineer businesses for the AI era. / One partner. Not multiple vendors." — the second line deliberately does not name a specific number of vendors (an earlier draft said "not five vendors"; client asked for a general word instead). Set in `font-delight`, the trio's body-text face.
- CTA: single sharp-boxed (no rounding, per 2026-08-07's "boxy" direction — see Button entry; was `rounded-full` via a now-removed `pill` prop before that) primary button, "Talk to Our Team", plus a small caption below it: "30 minutes. No sales pitch."

**Background — Threads (WebGL, continuous, `components/ui/Threads.tsx`):** an animated field of flowing, noise-driven thread lines, sourced from React Bits (`14_DESIGN_AND_DEVELOPMENT_RESOURCES.md`'s preferred UI libraries list), colored jade (`#0F9C7F`, same token as the Button's `accent-hover` state — one shared secondary color, not a third). This **replaced** two earlier builds in sequence: (1) a static brand-mark illustration bleeding behind the text (Fulcrum-Labs-inspired), (2) briefly, a two-column "Systems Panel" node-diagram concept (rejected by the client, fully reverted). Threads was explicit client direction, given directly with a code snippet to integrate.

**This is a deliberate, confirmed reversal of the "hero stays fully static" decision** made earlier in the same engagement (client had previously rejected Fulcrum's own scroll-linked parallax for exactly this reason). The reversal was surfaced and confirmed with the client before building it, not assumed. `Threads` has no built-in `prefers-reduced-motion` handling (verified against upstream source), so `Hero.tsx` skips mounting it entirely for reduced-motion users rather than rendering it inert — falls back to the plain `--color-panel` background.

**A real bug hit and fixed during integration, worth knowing if this pattern recurs elsewhere:** the Threads wrapper `<div>` was first given `className="absolute inset-0 -z-10"`. The canvas rendered with a healthy WebGL context, correct dimensions, and zero GL errors — but nothing was visible. Root cause: `<section>` doesn't establish its own stacking context (only `position: relative`, no `z-index`), so a negative-z-index child can escape it and stack behind an ancestor further up the DOM tree instead of just behind this section's own later siblings. Fixed by removing the explicit z-index and relying on DOM order instead (the Threads div renders first, before the text block) — the same mechanism the earlier static illustration used successfully. **Rule of thumb for this codebase: prefer DOM-order stacking over negative z-index for full-bleed section backgrounds**, unless the element genuinely needs to escape its parent's stacking context on purpose.

**Line thickness:** the shader's `u_line_width` constant was bumped from React Bits' default `7.0` to `10.0` per direct client request ("slightly increase thickness of those wavy lines") — a one-line change to a GLSL constant inside `Threads.tsx`, verified via live screenshot before/after.

**Deliberately excludes:** background video (Mythoughts.md questions its value for a services company); the ISO certification badge (belongs in its own future Trust/Certifications section, not the hero); any product mockup/screenshot (none exist yet — fabricating one would misrepresent the product). Per-character split-text entrance (Fulcrum uses this) was considered and rejected as a creative-agency signature move, not an enterprise-consulting one.

**Motion budget note:** with Threads now continuous, this hero no longer follows a "one-time entrance, then total stillness" model — the text stagger (eyebrow → headline → description/CTA, 0.08s stagger, 0.5s ease-out per element, `useReducedMotion()`-gated) is unchanged, but the background is now a standing exception to stillness.

**Not built yet:** a dedicated Trust/Certifications section. Any other homepage section below the Hero (Services, Why Choose Us, proof/stats, testimonials, final CTA) — Hero remains the only homepage section built.

---

## Buttons

### Button 🔶 Partially built — `website/components/ui/Button.tsx`

Built now: `primary` (solid accent, e.g. nav CTA), `outline`, and `ghost` (used for the mobile menu icon toggle). Sizes: `md` (default) and `icon` (square, for icon-only buttons). Renders as a Next.js `Link` when given an `href`, otherwise a native `<button>`. Primary variant gets a subtle hover scale (`1.0 → 1.02`) and active-press scale (`0.98`), researched against Stripe/Linear-tier CTA polish.

**Corners (revised 2026-08-07): sharp, no rounding at all.** Per direct client instruction ("boxy, sharp boxy... use box shape as our theme... nothing fancy clean professional"), Button no longer rounds its corners under any variant. This retires the `pill?: boolean` prop entirely (previously `rounded-full`, Hero's "Talk to Our Team" CTA only, added 2026-08-06/07) — that shape directly contradicted the new boxy direction, so it was removed from the component rather than left unreachable. This also **resolves** the Navbar-CTA-vs-Hero-CTA shape inconsistency flagged repeatedly in earlier sessions: both CTAs are the same sharp box now, nothing left open to decide.

Not built yet: `Secondary` variant, and full HTML-attribute passthrough (currently a deliberately minimal prop surface — `onClick`, `type`, `aria-*` — extend it when a real use case needs more, rather than speculatively). `Link Button` (text-only, no background) also not built yet.

---

### LyftekMark 🔶 Built, currently unused — `website/components/ui/LyftekMark.tsx`

**Purpose:** the real Lyftek brand mark (derived from the client-supplied outline reference, `website/assets/lyttekOutline.png`) as clean SVG outline paths (`fill="none"`), brand colors by default. Path data lives separately in `constants/lyftekMark.ts`.

**Status:** built and functional, but **has no current consumer** — it was originally used by the Hero background (`HeroBackdrop.tsx`), which has since been deleted after two rounds of iteration (static illustration → rejected two-column diagram panel → Threads WebGL background, see Hero entry above). Deliberately kept as a standalone, reusable component rather than deleted, per its own docblock — a likely future use is a Navbar/footer logo swap once real brand assets are formalized. Do not delete without checking whether a future session has wired it in elsewhere first.

**API:** `strokeTop`/`strokeBottom` (colors), `strokeWidth` (in the SVG's own viewBox units — note viewBox-to-screen scale affects actual rendered thickness, do not compare raw stroke-width numbers across differently-scaled SVGs without converting), `bottomScaleX` (non-uniform horizontal stretch of the bottom shape only, left-anchored).

---

### Threads (WebGL background) ✅ Built — `website/components/ui/Threads.tsx`

**Purpose:** animated field of flowing, noise-driven thread lines — currently the Hero's background (see Hero entry above for the full integration story, the z-index bug that was fixed, and the client's line-thickness adjustment). Sourced from React Bits (`github.com/DavidHDev/react-bits`, listed in `14_DESIGN_AND_DEVELOPMENT_RESOURCES.md`'s preferred UI libraries), vendored in as project source (not a live package dependency beyond `ogl`, the WebGL library it's built on) so the shader/render logic can be adjusted directly (e.g. the line-thickness change).

**Usage:** `<Threads color={[r,g,b]} amplitude={n} distance={n} enableMouseInteraction />` — color is normalized `[0-1]` floats, not hex (WebGL shader uniform, not CSS). Renders a full-bleed canvas via a `useRef` container; sizes itself to its parent via `ResizeObserver`.

**Reduced motion (REVISED 2026-08-10):** the component now has first-class handling via an **`animate` prop**. `animate={false}` draws exactly one frame and never starts the `requestAnimationFrame` loop — the same wave artwork, completely still, at zero ongoing GPU cost. The static frame renders at `iTime = 3.2`, deliberately not `0`, where the per-line phase offsets have not yet separated and the lines collapse into a flat band that reads as a rendering fault. `resize()` redraws that frame, since with no loop running nothing else would.

This replaced the earlier guidance that consumers must "conditionally skip mounting it" — that over-applied the rule, since `prefers-reduced-motion` asks to remove movement, not artwork, and skipping the mount left those visitors with a flat black hero.

**Hero does not currently use it.** Per an explicit client decision (2026-08-10) the Hero animates for every visitor with no reduced-motion branch at all — the site's one documented exception to 13_MOTION_AND_ANIMATION.md, recorded in full there and in Hero.tsx's own docblock. The `animate` prop is therefore **built and deliberately kept but currently unused**, the same status LyftekMark carries above: it is the route back if that decision is reversed. Do not delete it as dead code.

**Stacking:** must be positioned via DOM order (render early, no explicit negative z-index) rather than `-z-index`, unless its container element establishes its own stacking context — see the Hero entry's bug writeup for why.

---

### SectionEyebrow ✅ Built (2026-08-10) — `website/components/ui/SectionEyebrow.tsx`

**Purpose:** the small uppercase label that opens every section — a lime
`h-2 w-2` square followed by a Martian Mono, wide-tracked, uppercase label
("Who We Are", "What We Do", "Get In Touch", …).

**Why it exists:** this exact markup was duplicated byte-for-byte in **11
places** (nine section openers plus both Navbar mega-menu column headers).
The styling had never actually drifted, but every future change to it was
eleven identical edits, and the first one anybody missed would be the moment
it silently fell out of sync. Extracting it is what 17_CODING_STANDARDS.md
("avoid duplicated utility groups") and components/sections/README.md ("if a
section pattern repeats across pages, promote it to components/ui") both
ask for.

**Usage:** `<SectionEyebrow>Who We Are</SectionEyebrow>`. Optional
`className` merges onto the root for layout tweaks. **Do not hand-write the
eyebrow markup again** — if the style needs to change, change it here.

**Motion:** deliberately not a `motion` component and carries no variants.
Three call sites (Hero, Services, AboutHero) animate their eyebrow as one
child of a `staggerChildren` container; six do not. Those three wrap it in
their own `<motion.div variants={item}>`, keeping stagger choreography owned
by the section that defines it.

**Not used by:** Footer's column headings. Those share the lime square but
are `<h3>` navigation headings at `font-martian-mono text-sm font-semibold`
in `text-foreground` — a different role, kept deliberately distinct because
tracked-out uppercase would hurt footer legibility. See 07_TYPOGRAPHY.md's
Locked Scale table.

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