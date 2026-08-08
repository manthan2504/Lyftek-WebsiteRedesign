/**
 * Shared container widths for the homepage's boxed "dashboard" treatment.
 * Hero/WhyLyftek/Footer import DASHBOARD_CONTAINER rather than each guessing
 * matching values independently. See claudeContextExchange.md for the full
 * session this came out of.
 *
 * Navbar no longer uses either container (2026-08-08: full-width chrome now,
 * see Navbar.tsx's own docblock) -- the "boxed dashboard frame" identity
 * these constants describe now belongs to Hero/WhyLyftek/Footer alone.
 *
 * RAILS MADE CONTINUOUS (2026-08-08, direct client feedback after the above
 * change: "some sections are having full left to right stretch and not
 * limited by our boxy boundary"): About/Services/ContactCTA's plain
 * `bg-background` sections were flagged in the docblocks below as correctly
 * NOT needing DASHBOARD_CONTAINER, because that rule was written for a
 * color-seam problem (a `bg-panel` band hitting the viewport edge) -- once
 * Hero/WhyLyftek/Footer grew visible `border-x` side rails (same session),
 * those three sections breaking to full width mid-page reads as the
 * vertical rails cutting in and out rather than running continuously top to
 * bottom, which is its own, separate problem the old rule didn't cover.
 * Fix: About/Services/ContactCTA each get an outer DASHBOARD_CONTAINER +
 * `border-x` rail wrapper (matching Hero/WhyLyftek/Footer's), with their
 * EXISTING `PANEL_CONTAINER`-width inner content nested inside it unchanged
 * -- the rails now run unbroken down the whole page while each section's own
 * background color and inner content width are untouched.
 */

/**
 * "Standard Content" width, 1280px, per 06_LAYOUT_AND_SPACING.md. Used by
 * About/Services/ContactCTA for their inner content -- see the rails note
 * above for why these three now ALSO sit inside an outer DASHBOARD_CONTAINER
 * rail wrapper despite staying `bg-background`.
 */
export const PANEL_CONTAINER =
  "mx-4 sm:mx-6 lg:mx-auto lg:max-w-[1280px]" as const;

/**
 * Nested variant of PANEL_CONTAINER, for use INSIDE a DASHBOARD_CONTAINER
 * rail wrapper (see the rails note above) -- omits PANEL_CONTAINER's own
 * `mx-4`/`sm:mx-6` side margins, since the DASHBOARD_CONTAINER parent
 * already provides that gutter; doubling both up would widen the mobile/
 * tablet inset for no visual reason. `lg:mx-auto` centers this 1280px
 * column inside the wider rail interior, giving it its own left inset on
 * top of `px-6`/`md:px-8` padding.
 *
 * REVISED 2026-08-08 (client tried the flush-left alternative -- dropping
 * `mx-auto` so every section matched Hero's exact left edge -- then
 * explicitly reverted it: "the homepage heading... is a fixed pattern
 * only for hero section... below sections must be aligned leaving some
 * space from left... one pattern for hero section, below sections a
 * different pattern shared between them"). So: TWO deliberate patterns,
 * not one. Hero keeps its own flush-left treatment untouched (padding
 * directly on the `DASHBOARD_CONTAINER`-width box, no centered
 * sub-column). Every section below it -- About/Services/WhyLyftek/
 * ContactCTA -- shares THIS indented pattern instead, consistently with
 * each other, deliberately NOT matching Hero. `WhyLyftek.tsx` was moved
 * onto this token specifically to join that shared pattern (previously
 * padded its `DASHBOARD_CONTAINER` box directly like Hero, which is what
 * made it inconsistent with About/Services/ContactCTA in the first
 * place).
 */
export const PANEL_CONTAINER_NESTED = "lg:mx-auto lg:max-w-[1280px]" as const;

/**
 * The boxed "dashboard" panel width -- 1440px, "Wide Hero Sections" per
 * 06_LAYOUT_AND_SPACING.md. Used by Hero/WhyLyftek/Footer (2026-08-08: no
 * longer Navbar, now full-width chrome instead -- see Navbar.tsx's own
 * docblock) so those three panels are exactly the same width, edge to edge.
 * Uses `width: min(1440px, 100% - 4rem)` instead of a plain max-width so a
 * real gutter (>=32px/side) is guaranteed at every viewport from 1024px up
 * -- a plain max-width produces a ZERO gutter at every width between 1024
 * and 1440px (including the very common 1440x900 display), which would make
 * the outer mesh background invisible at exactly the sizes it's meant to be
 * visible.
 */
export const DASHBOARD_CONTAINER =
  "mx-4 sm:mx-6 lg:mx-auto lg:w-[min(1440px,100%-4rem)]" as const;

/**
 * Navbar's total reserved vertical space -- just its row height now
 * (2026-08-08: Navbar is flush full-width chrome with no top margin
 * anymore, see Navbar.tsx's own docblock; app/page.tsx no longer needs to
 * pull Hero's panel up to sit behind/around a floating nav, since there's
 * no float left to sit behind). Used by app/page.tsx's `scroll-mt` so the
 * skip link's jump target isn't hidden under the sticky Navbar. Keep in
 * sync with Navbar.tsx's `h-16` (64px); recompute if that changes.
 */
export const NAVBAR_FOOTPRINT_PX = 64 as const;
