# 15_PROJECT_TECH_STACK.md

# Project Technology Stack

## Purpose

This document defines the official technology stack for the Lyftek website redesign.

Its purpose is to establish a clear, modern, production-ready architecture that aligns with the project's goals, design philosophy, and long-term maintainability.

All implementation decisions should follow this document unless explicitly updated by the project owner.

Do not introduce additional frameworks or libraries without a clear technical justification.

Simplicity, maintainability, performance, and scalability should always take priority.

---

# Engineering Philosophy

The Lyftek website is an enterprise marketing website—not a web application.

Choose technologies based on project requirements rather than familiarity.

The stack should prioritize:

- Performance
- SEO
- Accessibility
- Maintainability
- Developer Experience
- Scalability
- Simplicity

Avoid unnecessary backend complexity.

---

# Research First

Before introducing any new dependency or implementation approach, create an internal engineering review team consisting of:

- Senior Frontend Architect
- Senior Next.js Engineer
- Senior React Engineer
- TypeScript Specialist
- Performance Engineer
- Accessibility Specialist
- DevOps Engineer

Each expert should evaluate:

- necessity
- community adoption
- maintenance
- documentation quality
- bundle size
- performance impact
- compatibility with the existing stack

Only recommend a dependency when it provides clear value.

---

# Frontend

## Next.js (App Router)

The primary framework for the project.

Responsibilities:

- Routing
- Server Components
- Client Components
- Static Site Generation (SSG)
- Server Side Rendering (SSR)
- Metadata API
- SEO
- Image Optimization
- API Routes
- Performance Optimization

Next.js serves as the backbone of the application.

Leverage modern App Router patterns and avoid outdated Pages Router practices unless absolutely required.

---

## React

React should be used to build reusable, composable UI components.

Examples include:

- Navbar
- Hero
- Cards
- CTA Sections
- Service Components
- Footer
- Forms
- Layout Components

Favor composition over duplication.

Build reusable components aligned with the project's Design System.

---

## TypeScript

All application code should be written in TypeScript.

Type safety should be treated as a core engineering principle.

Avoid:

- any
- loosely typed objects
- unnecessary type assertions

Prefer:

- strict typing
- interfaces
- reusable types
- type inference where appropriate

---

## Tailwind CSS

Tailwind CSS is the official styling solution.

Use utility-first styling to build:

- responsive layouts
- reusable design patterns
- spacing systems
- typography
- color system

Avoid excessive custom CSS.

If styles are repeatedly duplicated, abstract them into reusable utilities or components.

---

## Framer Motion

Primary animation framework.

Use for:

- page transitions
- section reveals
- shared layout animations
- scroll interactions
- component transitions
- micro-interactions

Motion should remain subtle, purposeful, and performance-conscious.

Avoid excessive or decorative animations.

---

# Backend

The website primarily functions as an enterprise marketing website.

A dedicated backend server is unnecessary.

---

## Next.js API Routes

Use API Routes for lightweight backend functionality.

Examples:

- Contact Form
- Consultation Requests
- Quote Requests
- Newsletter Signup

Do not introduce Express.js unless future requirements justify a dedicated backend.

---

## Email Services

Preferred options:

- Resend
- Nodemailer

Use these services to process contact form submissions and send emails to Lyftek.

Choose the simplest and most reliable solution for the deployment environment.

---

# Data Layer

The website should remain database-free unless data persistence becomes a genuine business requirement.

Examples include:

- storing leads
- contact history
- newsletter subscriptions
- CMS integration

---

## PostgreSQL

Preferred relational database if persistence is required.

Use PostgreSQL for:

- structured business data
- contact forms
- lead management
- future scalability

Do not introduce MongoDB for this project without a clear business need.

---

## Prisma

Preferred ORM.

Reasons:

- excellent TypeScript support
- type-safe queries
- clean developer experience
- maintainability

Prisma should be the default choice when database integration becomes necessary.

---

# Images & Assets

Use Next.js Image component for all images.

Benefits include:

- automatic optimization
- lazy loading
- responsive image sizing
- improved Core Web Vitals

Optimize assets before importing them into the project.

---

# Tooling

## Git & GitHub

Version control should follow standard collaborative workflows.

Recommended practices:

- feature branches
- meaningful commit messages
- pull requests
- code reviews

Do not develop directly on the main branch.

---

## ESLint

Use ESLint to enforce consistent code quality and identify potential issues early.

Linting should remain enabled throughout development.

---

## Prettier

Use Prettier for automatic formatting.

Maintain a consistent coding style across the entire codebase.

Formatting should never become a discussion during code reviews.

---

# Package Philosophy

Prefer mature, actively maintained libraries.

Before installing any dependency, ask:

- Is it actively maintained?
- Is it compatible with Next.js App Router?
- Does it improve developer experience?
- Does it reduce implementation complexity?
- Is it necessary?

Avoid unnecessary dependencies.

Every package increases long-term maintenance.

---

# Performance

Performance is a core requirement.

Optimize for:

- Core Web Vitals
- Lighthouse
- SEO
- minimal JavaScript
- lazy loading
- optimized fonts
- optimized images
- efficient rendering

Performance should never be treated as a final optimization step.

Build with performance in mind from the beginning.

---

# Accessibility

Accessibility is a mandatory engineering requirement.

Every implementation should support:

- keyboard navigation
- semantic HTML
- screen readers
- visible focus states
- sufficient color contrast
- reduced motion preferences

Meet or exceed WCAG AA guidelines wherever practical.

---

# Future Expansion

As the project evolves, additional technologies may be introduced.

Examples include:

- CMS integration
- Analytics
- Authentication
- Blog functionality
- CRM integration

Before adopting any new technology:

Research

↓

Evaluate

↓

Compare

↓

Justify

↓

Implement

Technology decisions should remain intentional rather than reactive.

---

# Official Stack Summary

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend

- Next.js API Routes
- Resend or Nodemailer

## Data (Only If Required)

- PostgreSQL
- Prisma ORM

## Tooling

- Git
- GitHub
- ESLint
- Prettier

---

# Final Principle

The technology stack exists to support an exceptional product—not to showcase frameworks.

Every engineering decision should improve:

- maintainability
- scalability
- accessibility
- performance
- developer experience
- business value

A simple, well-architected codebase will always outperform an unnecessarily complex one.