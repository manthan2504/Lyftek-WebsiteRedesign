# 08_COLOR_SYSTEM.md

# Color System

## Purpose

This document defines the color philosophy, palette, semantic usage, accessibility standards, and theme strategy for the Lyftek website.

Colors should reinforce trust, professionalism, clarity, and modern engineering rather than becoming decorative elements.

The objective is to create a timeless enterprise color system that aligns with Lyftek's existing brand identity while elevating it through a refined and scalable design language.

---

# Research First

Before finalizing the color system, perform independent research.

Create a specialized review team consisting of:

- Senior Brand Designer
- Senior Product Designer
- UI Design Director
- Color Theory Specialist
- Accessibility Expert
- Enterprise UX Consultant

Each expert should independently evaluate:

- Enterprise color psychology
- Modern B2B technology websites
- Accessibility compliance
- Long-term maintainability
- Visual hierarchy
- Brand consistency

Study how leading enterprise companies use color to establish trust rather than visual excitement.

Research should include, but not be limited to:

- Stripe
- IBM
- Microsoft
- Anthropic
- Vercel
- Apple
- GitHub
- Linear
- Notion

If stronger references exist, include them in the analysis.

Do not simply accept the proposed palette.

Evaluate it objectively and improve it where necessary while preserving Lyftek's visual identity.

---

# Color Philosophy

Color should support communication.

It should never become the primary source of visual interest.

Typography, spacing, hierarchy, and layout should carry most of the interface.

Color should be used intentionally to:

- guide attention
- establish hierarchy
- communicate actions
- indicate status
- reinforce branding
- improve usability

Restraint creates a premium appearance.

---

# Brand Identity

Lyftek's current visual identity is strongly associated with green.

This recognition should be preserved.

Rather than replacing the brand color, refine and modernize it into a complete design system.

The website should feel familiar to existing clients while appearing significantly more modern and professional.

---

# Candidate Color Palette

The following palette should serve as the initial design direction.

Evaluate and refine where appropriate.

## Neutral Foundation

**Updated 2026-08-10 to match the shipped tokens.** A consistency audit found
this table had drifted from `website/app/globals.css`: it still listed the
original `#1D1D1D` background, and it was missing the two `--panel` tokens
entirely, which have been live since the boxed-panel treatment was
introduced. Corrected below — the "Live token" column is the authority, since
that is what actually renders.

| Role | Live token | Value | Note |
|-------|-----------|--------|------|
| Primary Background | `--background` | **#0A0A0A** (was #1D1D1D) | **Revised.** Client asked to unify the page background with the boxed-panel colour once the grey content sections sat next to black panels; the two are now the same pure black. |
| Boxed panel surface | `--panel` | **#0A0A0A** | **Newly documented.** The `bg-panel` used by Hero/AboutHero/ContactSection/WhyLyftek/WhyDifferent/Footer. Identical to `--background` since the unification above — panels now read as distinct through their `border-x` rails and `border-t` hairlines, not through colour. |
| Boxed panel border | `--panel-border` | **#2A2D31** | **Newly documented.** Distinct from `--border`; used for panel edges. |
| Secondary Background | `--surface` | #25272B | Unchanged. |
| Surface / Cards | `--surface-hover` | #2F3338 | Unchanged. |
| Borders | `--border` | #3E434A | Unchanged. The rails/hairlines token. |
| Dividers | `--divider` | #4B525A | Unchanged. |

The neutral palette should provide depth without relying on colour alone;
since the background/panel unification, separation comes from hairline
borders rather than from tonal steps.

Large areas should feel calm rather than visually heavy.

### Tokens defined but currently unused

The same audit found four tokens with **zero consumers** anywhere in
`components/`. They are deliberately kept (they cost nothing and the
semantic set should stay complete), but nobody should assume they are
"in use" or that their values have ever been reviewed against a real
rendered surface:

- `--accent-surface` (#14B8A6) — was the Hero's background glow tint; that
  glow was replaced by the `Threads` WebGL background, which takes its
  colour from `--accent-hover` instead. No current consumer.
- `--success` (#22C55E), `--warning` (#F59E0B), `--info` (#38BDF8) — no
  component renders a success/warning/info state yet.

`--error` (#EF4444) **is** in use — `Input`, `Select`, and `Textarea` all
render `border-error` / `text-error` in their error state.

---

## Typography

| Role | Color |
|-------|--------|
| Primary Text | #F8FAFC |
| Secondary Text | #CBD5E1 |
| Muted Text | #94A3B8 |

Typography should always maintain excellent readability and sufficient contrast.

---

## Accent Palette

**Updated 2026-08-07 — locked.** The original `Hover / Active` and `Accent Surface` values below were revised; `Light Accent` and `Primary Accent` are unchanged from the initial candidate palette.

| Role | Color | Status |
|-------|--------|--------|
| Light Accent | #CDFC8A | Unchanged |
| Primary Accent (text-on-accent) | #022E21 | Unchanged |
| Hover / Active | #0F9C7F (was #034A35) | **Revised** |
| Accent Surface | #14B8A6 (was #10392D) | **Revised** |

These colors should reinforce Lyftek's identity.

The fresh lime accent communicates innovation and growth.

The teal-green family communicates trust, engineering, stability, and professionalism.

Both colors should work together rather than competing.

**Why the revision:** the original `#034A35`/`#10392D` values are dark enough that against the panel/background neutrals (`#0A0A0A`/`#1D1D1D`) they read as "just went dark" rather than as a color — confirmed live (Button hover state, Hero background glow) rather than assumed from the hex values alone. Client direction: keep the pairing in the green family (do not introduce a rival hue like blue or magenta), just raise it to a value/saturation that actually survives against the near-black neutrals. `#0F9C7F` (jade) and `#14B8A6` (brighter teal-500) are the result — same hue family, still clearly distinct from the yellow-green Light Accent, now visible. `Primary Accent` (#022E21) was deliberately left alone — it's dark text sitting *on top of* the light lime accent (button labels), a completely different contrast job than a standalone color rendered on black, and was never actually the problem.

---

## Semantic Colors

| Role | Color |
|-------|--------|
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #EF4444 |
| Information | #38BDF8 |

Semantic colors should remain consistent throughout the design system.

---

# Accent Usage

Accent colors should be used intentionally.

They may appear in:

- Primary buttons
- Secondary buttons
- Icons
- Links
- Interactive states
- Active navigation
- Highlights
- Small illustrations
- Charts
- Badges
- Focus states
- Progress indicators

Do not reserve accent colors only for hover states.

The brand identity should be visible throughout the experience without becoming overwhelming.

---

# Theme Strategy

The website should support both:

- Dark Theme
- Light Theme

Both themes should be designed independently rather than automatically generated from one another.

Each theme should feel intentional.

Dark mode should communicate:

- engineering
- premium quality
- modern technology
- confidence

Light mode should communicate:

- openness
- clarity
- professionalism
- accessibility

Neither theme should feel like an afterthought.

---

# Accessibility

Every color combination should meet modern accessibility standards.

Validate:

- text contrast
- button contrast
- icon visibility
- border visibility
- focus indicators
- interactive states

Meet or exceed WCAG AA requirements wherever possible.

Accessibility should never be sacrificed for aesthetics.

---

# Color Usage Principles

Avoid excessive color variation.

Most of the interface should rely on neutral tones.

Accent colors should draw attention only to meaningful actions and important information.

Color should support hierarchy rather than replace it.

Users should understand priority through layout and typography before relying on color.

---

# What To Avoid

Do not:

- use excessive gradients
- create glowing neon interfaces
- overuse accent colors
- assign random colors to sections
- use saturated backgrounds unnecessarily
- introduce decorative rainbow palettes
- imitate AI startup aesthetics

Professional restraint creates stronger enterprise credibility.

---

# Emotional Goals

The final color system should communicate:

- Trust
- Stability
- Growth
- Precision
- Technical expertise
- Modern engineering
- Reliability
- Long-term partnership

Visitors should feel that Lyftek is an established technology company embracing modern innovation rather than chasing visual trends.

---

# Final Principle

The color system should never become the defining feature of the interface.

If the website still feels premium, trustworthy, and well-structured when viewed in grayscale, the design system is likely successful.

Color should enhance an already excellent design—not compensate for a weak one.

The final implementation should strengthen Lyftek's existing green brand identity while presenting it through a modern, scalable, and enterprise-grade visual language suitable for today's technology landscape.