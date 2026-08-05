# 14_DESIGN_AND_DEVELOPMENT_RESOURCES.md

# Design & Development Resources

## Purpose

This document defines the preferred resources, tools, skills, MCPs, libraries, design systems, and reference materials that should be consulted throughout the Lyftek redesign project.

These resources exist to improve research quality, implementation quality, design consistency, engineering standards, and overall decision making.

Do not immediately implement the first solution that comes to mind.

Instead:

Research

↓

Compare

↓

Evaluate

↓

Prototype

↓

Validate

↓

Implement

Every significant design and engineering decision should be informed by high-quality references.

---

# Multi-Agent Research Workflow

Before beginning any meaningful design, implementation, or architectural task, create a specialized internal team.

The exact composition should adapt to the task, but may include:

## Design

- Design Director
- Senior Product Designer
- Enterprise UX Specialist
- UX Researcher
- Information Architect
- Visual Designer
- Brand Designer

## Engineering

- Senior Frontend Architect
- Senior React Engineer
- Senior Next.js Engineer
- TypeScript Specialist
- Design System Engineer
- Motion Engineer
- Performance Engineer

## Content

- Enterprise Copywriter
- UX Writer
- SEO Strategist
- Content Strategist

## Quality

- Accessibility Specialist
- QA Engineer
- Technical Reviewer

Each expert should independently analyze the problem.

Only after comparing multiple perspectives should a final recommendation be produced.

---

# Required Workflow

Every major task should follow this sequence.

Understand

↓

Research

↓

Study references

↓

Evaluate trade-offs

↓

Prototype mentally

↓

Review

↓

Optimize

↓

Implement

↓

Self-review

Never skip research for complex decisions.

---

# Preferred Skills

The following Skills should be consulted whenever relevant.

## UI / UX

UI UX Pro Max

https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Use for:

- UX audits
- visual refinement
- layout improvements
- enterprise design
- accessibility
- interaction quality

---

## Motion Design

GSAP Skills

https://github.com/greensock/gsap-skills

Use for:

- animation architecture
- advanced motion
- timelines
- SVG animation
- performance optimization

Research before implementation.

Avoid unnecessary complexity.

---

## Modern Frontend

Emil Kowalski Skills

https://github.com/emilkowalski/skills

Study:

- modern frontend architecture
- premium interactions
- implementation techniques
- product thinking
- developer experience

---

## Taste

Taste Skill

https://github.com/leonxlnx/taste-skill

Use when evaluating:

- aesthetics
- visual hierarchy
- spacing
- typography
- polish

Develop refined visual judgment rather than following trends.

---

## Impeccable

https://github.com/pbakaus/impeccable

Use to understand:

- exceptional interface quality
- craftsmanship
- attention to detail
- interaction refinement

Study why premium products feel premium.

---

# Preferred MCPs

Whenever available, use the following MCPs to improve research and implementation quality.

## Context7

Primary documentation source.

Use for:

- official library documentation
- APIs
- implementation guidance
- framework best practices

Always prefer official documentation over outdated tutorials.

---

## Figma MCP

Use for:

- inspecting designs
- extracting spacing
- typography
- design tokens
- component analysis

Maintain implementation accuracy.

---

## Playwright MCP

Use for:

- UI validation
- responsive testing
- interaction testing
- regression testing
- accessibility verification

Validate implementations rather than relying on assumptions.

---

## Magic UI MCP

Use for:

- discovering reusable patterns
- animation inspiration
- implementation references

Never copy components directly.

Extract reusable ideas that align with the Lyftek design system.

---

# Preferred UI Libraries

Research these libraries before building custom solutions.

Only adopt components that align with the established design language.

## React Bits

https://reactbits.dev/

Use for:

- interaction ideas
- reusable UI
- animation references

---

## Watermelon UI

https://ui.watermelon.sh/home

Study:

- layouts
- modern UI patterns
- responsive structures

---

## Neuform AI

https://neuform.ai/

Research:

- enterprise components
- AI-era interface ideas
- modern interaction patterns

Use selectively.

Avoid introducing AI startup aesthetics.

---

# Motion Libraries

Preferred order:

## Framer Motion

Primary animation library.

---

## Anime.js

https://animejs.com/

Study advanced animation techniques and timing.

Use only when appropriate.

---

## GSAP

Research advanced interactions before implementation.

Use only when Framer Motion cannot reasonably solve the problem.

---

# Animated Component References

Research these resources before building custom animations.

## Skiper UI

https://skiper-ui.com/

Study:

- component interactions
- transitions
- animation ideas

Extract concepts rather than copying implementations.

---

## Animista

https://animista.net/

Use for:

- understanding animation patterns
- experimenting with transitions

Avoid excessive or decorative effects.

Enterprise restraint always comes first.

---

# Icon System

Preferred icon library:

Phosphor Icons

https://phosphoricons.com/

Reasons:

- clean geometry
- multiple weights
- excellent consistency
- modern appearance
- enterprise friendly

If another icon system is demonstrably better for a specific use case, justify the decision before adopting it.

---

# Additional Recommended Resources

Research these resources whenever appropriate.

## UI Components

- shadcn/ui
- Origin UI
- Base UI
- Radix UI
- Park UI

Study implementation quality rather than copying styles.

---

## Inspiration

- Mobbin
- Godly
- Land-book
- Lapa Ninja
- Design Systems for Figma
- DesignMD

Use these to understand structure, hierarchy, and interaction—not to imitate.

---

## Documentation

Always prioritize:

1. Official Documentation
2. RFCs / Specifications
3. Trusted Maintainers
4. Community Examples

Avoid outdated blog posts when official guidance exists.

---

# Decision Making

When multiple approaches exist:

Research

↓

Compare

↓

List trade-offs

↓

Recommend the strongest option

↓

Explain why it is preferred

Never choose technologies based solely on popularity.

Prioritize:

- maintainability
- accessibility
- scalability
- performance
- long-term support

---

# Project Alignment

Every external resource must be evaluated against the project's goals.

Remember that Lyftek is:

- an enterprise technology company
- a B2B consulting partner
- a software engineering company
- an AI and digital transformation partner

The website should communicate:

- trust
- engineering excellence
- clarity
- professionalism
- technical capability

Avoid resources that encourage:

- excessive visual effects
- AI startup clichés
- unnecessary complexity
- trend-driven design

Choose references that reinforce confidence and long-term credibility.

---

# Continuous Improvement

This resource library will evolve.

As the project progresses, additional resources, skills, MCPs, libraries, and references may be introduced.

Evaluate every addition critically before adopting it.

Quality is more important than quantity.

---

# Final Principle

Great products are rarely built from a single source of inspiration.

They emerge from thoughtful research, critical evaluation, and disciplined execution.

Use these resources to inform decisions—not to replace original thinking.

Every implementation should ultimately reflect Lyftek's own identity, business goals, and design system rather than the style of any individual reference.

A few additions I'd strongly recommend
Skills

These are genuinely high-value additions:

Steve Schoger's design taste (Refactoring UI principles) — for spacing, hierarchy, and visual polish.
Accessibility expertise (WCAG-focused references) — to keep accessibility first-class rather than an afterthought.
MCPs

Alongside the ones you've listed, I'd also keep an eye out for:

Browser DevTools MCP (if available in your environment) for performance profiling and debugging.
GitHub MCP for repository-aware code review and implementation consistency.
UI / Component Resources

I'd add:

shadcn/ui — outstanding implementation patterns, even if you don't use the components directly.
Radix UI — accessible primitives that are widely respected.
Origin UI — clean, modern enterprise component ideas.
Inspiration

Beyond your existing list:

Mobbin — interaction and layout references.
Godly — curated landing page inspiration.
Land-book and Lapa Ninja — useful for studying structure and content hierarchy.
Design Systems Repo — to understand how mature organizations document and scale their systems.

One final guideline I'd add to this document:

Never adopt a resource, library, or pattern simply because it looks impressive. Every external influence must improve Lyftek's usability, accessibility, performance, or maintainability while remaining consistent with the project's enterprise-focused design philosophy.