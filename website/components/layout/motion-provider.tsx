"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Sitewide reduced-motion policy, in ONE place instead of per-section.
 *
 * THE BUG THIS FIXES (2026-08-10): every section used to branch its own
 * `initial` prop on `useReducedMotion()`:
 *
 *     initial={prefersReducedMotion ? false : "hidden"}
 *
 * That is a guaranteed hydration mismatch for any visitor who actually has
 * reduced motion enabled. framer-motion resolves the preference from
 * `window.matchMedia`, and its own state module says so explicitly
 * (`motion-dom/.../reduced-motion/state.mjs`: "Does this device prefer
 * reduced motion? Returns `null` server-side."). So:
 *
 *   - Server: `null` -> falsy -> `initial="hidden"` -> React serializes
 *     `style="opacity:0; transform:translateY(16px)"` into the HTML.
 *   - Client, reduced motion ON: `true` -> `initial={false}` -> no style at
 *     all -> attributes don't match -> React throws, discards the server
 *     tree, and re-renders the whole subtree on the client.
 *
 * An earlier session looked at this exact shape and concluded it was safe
 * because "`null` and the false-branch both resolve to the same initial
 * 'hidden' variant" -- that reasoning is correct ONLY for visitors who do
 * not prefer reduced motion, which is why it went unnoticed until a machine
 * with the OS setting enabled loaded the site. Reproduced deterministically
 * with Playwright's `reducedMotion: "reduce"` context option (errors on both
 * routes) vs. `"no-preference"` (clean), before and after this fix.
 *
 * WHY `reducedMotion="user"` IS THE RIGHT FIX, rather than a mounted-flag
 * dance around the same branch: the branch is unsalvageable on its own,
 * because `initial` is only read on first mount -- deferring the real
 * preference until after hydration would come too late to affect it, and
 * reduced-motion visitors would end up watching the full animation anyway.
 * `MotionConfig` moves the decision out of render entirely. framer-motion
 * resolves it in `VisualElement.mount()` (client-only, after hydration), so
 * it can never influence server markup; then, at animation time, every
 * positional key -- `y` included, via `positionalKeys` -- is given
 * `{ type: false }`, an instant snap, while non-positional keys like
 * `opacity` still tween.
 *
 * NET EFFECT for a reduced-motion visitor: no movement at all (the 16px
 * rise every section uses is applied instantly), just a plain fade. That is
 * a deliberate, small softening of the previous stated intent ("content
 * immediately, with no animated variant applied at all") and worth knowing
 * about: `prefers-reduced-motion` exists for vestibular triggers -- travel
 * and parallax -- and an opacity fade is not one, which is exactly why
 * framer-motion's own `"user"` mode keeps opacity animating. The old intent
 * is not reachable through `initial` without the hydration bug above.
 *
 * NOT COVERED HERE, deliberately -- three cases this cannot reach, each
 * handled at its own call site:
 *   - `Hero.tsx`'s `<Threads>` WebGL background is conditionally MOUNTED,
 *     not animated. Conditional mounting is a structural mismatch (a whole
 *     DOM node present on the server, absent on the client), which no
 *     motion config can fix -- see that file's own mount-gate comment.
 *   - `WhyLyftek.tsx`'s stat counter uses the imperative `animate()`
 *     function plus React state, not a `motion` component, so it never
 *     passes through this context.
 *   - `Navbar.tsx`'s mobile menu and `Select.tsx`'s dropdown keep their own
 *     explicit `duration: prefersReducedMotion ? 0 : 0.2` gates. Those are
 *     read at animation time, not render time, so they were never part of
 *     this bug -- and they animate `height`, which is NOT a positional key
 *     this config would snap, so removing them would silently reintroduce
 *     motion for the visitors we are trying to spare.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
