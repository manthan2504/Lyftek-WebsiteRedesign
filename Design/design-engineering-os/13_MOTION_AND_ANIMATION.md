# 13_MOTION_AND_ANIMATION.md

# Motion & Animation Guidelines

## Purpose

Motion is a fundamental part of the Lyftek user experience.

Its purpose is not to entertain users or showcase animation capabilities.

Its purpose is to improve usability, reinforce hierarchy, guide attention, communicate responsiveness, and elevate the perceived quality of the website.

Every animation should feel intentional, subtle, performant, and consistent with the identity of an enterprise technology company.

The ideal motion system should be felt before it is noticed.

---

# Research First

Before implementing any animation or interaction, perform structured research.

Create a multidisciplinary motion team consisting of:

- Motion Design Director
- Senior Product Designer
- Senior UI Designer
- UX Research Specialist
- Framer Motion Expert
- GSAP Specialist
- Creative Frontend Engineer
- Performance Engineer
- Accessibility Specialist
- Human Interface Design Specialist

Each specialist should independently evaluate modern interaction systems and identify:

- best practices
- common mistakes
- interaction quality
- perceived performance
- usability improvements
- accessibility considerations

Only after comparing multiple approaches should a final implementation be recommended.

Never animate because a library makes it possible.

Animate because it improves the experience.

---

# Research Leading Motion Systems

Study world-class products known for exceptional interaction design.

Primary inspiration:

- Apple
- Stripe
- Linear
- Anthropic
- Vercel
- Figma
- Notion
- Arc Browser
- Raycast
- Framer
- GitHub

Research additional references whenever stronger interaction patterns exist.

Study:

- page transitions
- hero interactions
- navigation
- hover states
- scrolling
- content reveal
- loading states
- micro interactions
- form feedback
- button interactions

Extract principles rather than recreating animations.

---

# Technology Stack

Preferred implementation order:

## CSS & Tailwind

Use for:

- hover states
- focus states
- opacity transitions
- color transitions
- simple transforms

CSS should always be the first choice for lightweight interactions.

---

## Framer Motion

Primary animation framework.

Use for:

- section reveals
- page transitions
- shared layout animations
- scroll-based interactions
- component transitions
- animated layouts
- interaction choreography

Framer Motion should handle the majority of the website's animation system.

---

## GSAP

Research GSAP before introducing it.

Only use GSAP when Framer Motion cannot efficiently achieve the desired interaction.

Potential use cases:

- advanced timelines
- complex scroll experiences
- SVG animation
- highly coordinated sequences
- interactive storytelling

Avoid introducing GSAP for simple fades or transforms.

Choose the simplest solution that achieves the objective.

---

## Native Browser APIs

Where appropriate, consider:

- Intersection Observer
- View Transitions API
- requestAnimationFrame

Use browser capabilities whenever they improve performance or reduce dependencies.

---

# Motion Philosophy

Motion should communicate:

- quality
- confidence
- responsiveness
- hierarchy
- continuity

Avoid motion that feels:

- playful
- distracting
- exaggerated
- chaotic
- unnecessarily dramatic

Enterprise motion should feel calm and deliberate.

---

# Motion Principles

Every animation should satisfy at least one purpose:

- guide attention
- improve orientation
- reinforce hierarchy
- provide interaction feedback
- communicate state changes
- reduce perceived waiting time

If an animation serves no purpose, remove it.

---

# Interaction Hierarchy

Not all elements deserve equal animation.

Prioritize motion for:

- navigation
- hero content
- CTAs
- important sections
- form interactions
- trust-building components

Background elements should remain subtle.

Content should always remain the primary focus.

---

# Scroll Animations

Reveal content progressively.

Recommended characteristics:

- subtle fade
- slight translate
- gentle scale where appropriate

Avoid:

- excessive parallax
- spinning elements
- dramatic rotations
- oversized motion
- bouncing animations

Scrolling should feel smooth and effortless.

---

# Micro Interactions

Micro interactions communicate craftsmanship.

Examples include:

- button hover
- icon transitions
- navigation indicators
- input focus
- success states
- loading feedback
- accordion expansion
- card hover
- tooltip appearance

Small interactions collectively create a premium experience.

---

# Page Transitions

Page transitions should reinforce continuity.

Navigation should feel seamless rather than abrupt.

Transitions should never delay users.

Speed is more important than spectacle.

---

# Hero Animation

The hero should establish quality immediately.

Possible techniques:

- staggered typography
- subtle content reveal
- image or illustration transitions
- gentle background movement
- progressive CTA appearance

Avoid:

- overwhelming entrance animations
- excessive delays
- cinematic intros

Visitors should reach meaningful content immediately.

---

# Performance First

Motion should never compromise performance.

Prioritize animations using:

- transform
- opacity
- scale
- translate

Avoid expensive animations involving:

- layout shifts
- width
- height
- large blur filters
- excessive shadows
- unnecessary repaint-heavy effects

Measure performance throughout implementation.

---

# Accessibility

Support users who prefer reduced motion.

Respect:

prefers-reduced-motion

Provide graceful fallbacks where appropriate.

Animations should never prevent users from accessing content.

Accessibility always takes priority.

---

## Documented exception — the Hero's Threads background (2026-08-10)

**One element on this site deliberately ignores `prefers-reduced-motion`:**
the homepage Hero's WebGL wave background (`components/ui/Threads.tsx` as
rendered by `components/sections/Hero.tsx`). It animates continuously for
every visitor, including those whose OS or browser requests reduced motion.

This is an **explicit client decision**, taken on 2026-08-10 with the
trade-off stated plainly, and it knowingly departs from this section and
from 99_GLOBAL_RULES.md's "accessibility is mandatory / never sacrifice
accessibility for aesthetics". It is recorded here rather than left as an
undocumented gap in the code so that:

- a future session does not "fix" it back on the assumption it was an
  oversight, and
- it is not mistaken for a precedent. **Everything else on this site still
  honours the preference** -- section entrance animations (via
  `MotionConfig reducedMotion="user"`, see components/layout/
  motion-provider.tsx), the Navbar mobile menu, the Select dropdown, and
  WhyLyftek's stat count-up all continue to respect it.

**Context worth keeping**, because it explains why the question came up at
all: the client reported the waves as "missing", which traced to their
Windows Server development VM shipping with "Adjust for best performance".
That setting disables UI animations, and Chromium maps the flag directly to
`prefers-reduced-motion: reduce` -- so that one machine was receiving the
reduced-motion treatment while real visitors had been seeing the animation
throughout. The VM setting was corrected as well; this exception is
belt-and-braces rather than the fix for that symptom.

**The route back**, if this is ever reversed: `Threads` accepts an `animate`
prop. Passing `animate={false}` renders a single static frame of the
identical shader -- the artwork without the movement -- at zero ongoing
cost.

## Performance guard on the same background (2026-08-10, measured)

Separately from the accessibility exception above, Hero DOES fall back to
that static frame on devices with **no GPU**, via
`hooks/useIsSoftwareRenderer.ts`. Measured on this project's own GPU-less VM
(QEMU QXL adapter, 0 VRAM, 4 cores), production build:

| Page | Before guard | After guard |
|---|---|---|
| `/about` (no WebGL) | 60.0 fps | 60.0 fps |
| `/` (Threads) | **2.2 fps** (457ms/frame) | **60.0 fps** (16.7ms/frame) |

Chromium falls back to SwiftShader (a CPU rasterizer) when there is no GPU,
and a full-screen per-pixel-looping fragment shader is simply the wrong
thing to ask a CPU to do 60 times a second. The shader is not at fault and
runs fine on hardware.

**This is a capability check, not a preference check** -- keep the two
distinct when reading the code. Visitors with a working GPU get the
continuous animation regardless of their reduced-motion setting, exactly as
the client decided. Only devices that physically cannot draw it at speed get
the still frame, which is strictly better for them than a 2fps hero.

**Also worth recording for whoever next reviews performance:** the same
measurement run showed `next dev` is a poor guide to real performance here
-- `/about` measured 9.6 fps in dev against 60.0 fps in a production build
on the same machine. Judge performance from `npm run build && npm start`,
never from the dev server.

---

# Timing & Easing

Research industry standards before implementation.

Study motion guidance from:

- Apple Human Interface Guidelines
- Material Design Motion
- Microsoft Fluent Motion
- Framer Motion documentation

Maintain consistency throughout the website.

Avoid arbitrary durations and easing curves.

---

# Motion Resources

Before implementing animations, study:

Official Documentation

- Framer Motion
- GSAP
- Motion.dev

Design Systems

- Apple Human Interface Guidelines
- Material Design Motion
- Microsoft Fluent Design

Inspiration

- Awwwards (for ideas, not imitation)
- Godly
- Land-book
- Lapa Ninja
- Design Systems repositories

Critically evaluate every reference.

Enterprise usability should always take precedence over visual novelty.

---

# Continuous Improvement

Interaction design evolves continuously.

As development progresses:

- new interaction patterns may emerge
- performance improvements may become available
- browser APIs may mature
- implementation techniques may improve

When new requirements or ideas are introduced, evaluate them objectively and integrate them only if they strengthen the overall experience.

Avoid introducing motion simply because it is technically possible.

---

# Final Principle

Motion should make the website feel more refined—not more animated.

When users leave the website, they should remember:

- the professionalism
- the clarity
- the smooth experience
- the confidence it inspired

They should not remember the animations.

The highest quality motion system is one that quietly enhances every interaction while allowing the content, engineering expertise, and brand credibility of Lyftek to remain the true focus.