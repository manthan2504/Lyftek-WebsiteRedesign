# 17_CODING_STANDARDS.md

# Coding Standards

## Purpose

This document defines the coding standards, architecture conventions, naming conventions, file organization, and implementation practices for the Lyftek website.

Every piece of code should be written as if it will be maintained by another senior engineer years from now.

Prioritize readability, consistency, maintainability, scalability, accessibility, and performance over clever or overly complex implementations.

---

# Research First

Before implementing any significant feature, assign relevant engineering specialists.

Examples include:

- Senior Frontend Architect
- Senior Next.js Engineer
- Senior React Engineer
- TypeScript Specialist
- Performance Engineer
- Accessibility Engineer
- Design Systems Engineer
- Code Quality Reviewer

Research:

- official documentation
- current best practices
- implementation trade-offs
- performance implications

Only then begin implementation.

---

# General Principles

Code should be:

- Simple
- Predictable
- Modular
- Reusable
- Readable
- Testable
- Maintainable

Avoid unnecessary abstractions.

Avoid premature optimization.

Optimize only where measurable benefits exist.

---

# Project Structure

Organize the project by responsibility.

Recommended structure:

```text
app/
components/
components/ui/
components/layout/
components/sections/
hooks/
lib/
utils/
types/
constants/
styles/
public/
```

Keep related files together.

Avoid deeply nested folders without clear purpose.

---

# Naming Conventions

Use descriptive names.

Components:

```text
HeroSection.tsx
ServicesGrid.tsx
ContactForm.tsx
```

Hooks:

```text
useScrollAnimation.ts
useWindowSize.ts
```

Utilities:

```text
formatDate.ts
generateMetadata.ts
```

Types:

```text
service.ts
navigation.ts
contact.ts
```

Avoid abbreviations unless universally understood.

---

# Component Standards

Each component should have a single responsibility.

Prefer small, composable components over large monolithic ones.

Every component should:

- accept typed props
- remain reusable
- avoid hidden side effects
- be self-contained where practical

---

# Component File Structure

Follow a consistent structure.

```tsx
Imports

Types

Constants

Helpers

Component

Export
```

Maintain the same order across every file.

---

# React Guidelines

Prefer:

- Functional Components
- Composition
- Custom Hooks
- Server Components when possible

Avoid:

- unnecessary Client Components
- deeply nested JSX
- duplicated logic

Lift shared logic into reusable hooks or utilities.

---

# Next.js Guidelines

Prefer:

- Server Components by default
- Client Components only when interaction is required
- App Router conventions
- Metadata API
- Route Groups where appropriate
- Loading and Error boundaries

Avoid outdated Pages Router patterns unless explicitly required.

---

# TypeScript Standards

Use strict typing throughout the project.

Prefer:

- interfaces for object contracts
- reusable types
- inferred types where appropriate
- discriminated unions when useful

Avoid:

- any
- unknown type assertions
- implicit any
- overly broad types

Type safety is a core engineering requirement.

---

# Tailwind CSS Standards

Use Tailwind as the primary styling solution.

Prefer reusable utility patterns.

Avoid:

- inline style objects
- duplicated utility groups
- arbitrary values unless justified

Extract repeated class combinations into reusable utilities or components.

Follow the project's spacing, typography, and color systems.

---

# Styling Philosophy

The Design System is the single source of truth.

Never introduce:

- random spacing
- inconsistent radius values
- unapproved colors
- ad-hoc typography

Every visual decision should align with the documented design language.

---

# State Management

Prefer the simplest solution.

Order of preference:

1. React State
2. Server Components
3. URL State
4. Context API

Only introduce external state libraries when justified by project complexity.

---

# Data Fetching

Use modern Next.js patterns.

Prefer:

- Server Components
- async data fetching
- caching where appropriate

Avoid unnecessary client-side fetching.

---

# Forms

Every form should include:

- validation
- loading state
- success state
- error state
- accessible labels
- keyboard support

Provide clear user feedback.

---

# Accessibility Standards

Every component must support:

- semantic HTML
- keyboard navigation
- visible focus indicators
- ARIA where appropriate
- screen readers
- sufficient contrast
- reduced motion preferences

Accessibility is mandatory.

---

# Performance Standards

Optimize for:

- Core Web Vitals
- Lighthouse
- bundle size
- rendering efficiency
- image optimization
- font loading
- code splitting

Avoid unnecessary re-renders.

Measure before optimizing.

---

# Images

Always use:

Next.js Image component

Optimize:

- dimensions
- compression
- loading strategy
- alt text

Avoid oversized assets.

---

# Icons

Primary icon library:

Phosphor Icons

Maintain consistent:

- stroke weight
- sizing
- spacing

Avoid mixing multiple icon systems without justification.

---

# Motion

Follow the Motion Guidelines.

Prefer:

- CSS transitions
- Framer Motion

Only use GSAP when advanced animation requirements justify the additional complexity.

Motion should remain subtle and purposeful.

---

# Error Handling

Handle errors gracefully.

Provide:

- meaningful messages
- fallback UI
- loading states

Avoid exposing implementation details to users.

---

# Comments

Write self-explanatory code.

Use comments only when they explain:

- business logic
- architectural decisions
- non-obvious implementation details

Do not comment obvious code.

---

# Imports

Group imports consistently.

Recommended order:

1. React / Next.js
2. External Libraries
3. Internal Components
4. Hooks
5. Utilities
6. Types
7. Styles

Keep import ordering consistent across the project.

---

# Environment Variables

Never hardcode secrets.

Use environment variables for:

- API keys
- SMTP credentials
- database connections
- external services

Validate required variables during startup where appropriate.

---

# Git Standards

Write meaningful commit messages.

Examples:

```text
feat: add enterprise services section

fix: improve mobile navigation

refactor: simplify hero component

perf: optimize image loading
```

Keep commits focused on a single logical change.

---

# Code Reviews

Before considering implementation complete, verify:

Design

- follows Design System
- responsive
- visually consistent

Engineering

- reusable
- typed
- modular
- maintainable

Accessibility

- keyboard support
- focus states
- semantic HTML

Performance

- optimized rendering
- optimized assets
- efficient components

Business

- supports user goals
- supports conversion
- reinforces trust

---

# Continuous Improvement

When better implementation patterns become available:

- evaluate objectively
- compare trade-offs
- update standards where appropriate

Maintain consistency across the codebase.

---

# Final Principle

The best code is not the shortest or the most clever.

The best code is the code that is easiest to understand, safest to modify, simplest to maintain, and most faithfully implements the Lyftek design system while delivering an exceptional experience for enterprise clients.