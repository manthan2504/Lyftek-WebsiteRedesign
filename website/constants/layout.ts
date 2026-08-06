/**
 * Shared container widths for the homepage's boxed "dashboard" treatment.
 * Both Navbar and Hero import these rather than each guessing matching
 * values independently. See claudeContextExchange.md for the full session
 * this came out of.
 */

/**
 * "Standard Content" width, 1280px, per 06_LAYOUT_AND_SPACING.md. Not
 * currently used by Navbar or Hero (both now use DASHBOARD_CONTAINER, full
 * width of each other) -- kept here since it's a real, named width in the
 * OS spec that future non-dashboard sections/pages will likely want.
 */
export const PANEL_CONTAINER =
  "mx-4 sm:mx-6 lg:mx-auto lg:max-w-[1280px]" as const;

/**
 * The boxed "dashboard" panel width -- 1440px, "Wide Hero Sections" per
 * 06_LAYOUT_AND_SPACING.md. Used by both Navbar and Hero so they're exactly
 * the same width, edge to edge. Uses `width: min(1440px, 100% - 4rem)`
 * instead of a plain max-width so a real gutter (>=32px/side) is guaranteed
 * at every viewport from 1024px up -- a plain max-width produces a ZERO
 * gutter at every width between 1024 and 1440px (including the very common
 * 1440x900 display), which would make the outer mesh background invisible
 * at exactly the sizes it's meant to be visible.
 */
export const DASHBOARD_CONTAINER =
  "mx-4 sm:mx-6 lg:mx-auto lg:w-[min(1440px,100%-4rem)]" as const;

/**
 * Navbar's total reserved vertical space (margin-top + row height) --
 * app/page.tsx uses this to pull Hero's dashboard panel up so it starts
 * behind/around the floating Navbar instead of below it. Keep in sync with
 * Navbar.tsx's `mt-8` (32px) + `h-16` (64px); recompute if either changes.
 */
export const NAVBAR_FOOTPRINT_PX = 96 as const;
