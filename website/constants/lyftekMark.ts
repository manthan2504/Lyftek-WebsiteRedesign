/**
 * Shared vector data for the Lyftek brand mark.
 *
 * Recreated as clean outline paths from the reference artwork at
 * website/assets/lyttekOutline.png -- that PNG is reference-only (for
 * shape/proportion), never rendered directly; see claudeContextExchange.md
 * for the full reasoning. Both components/ui/LyftekMark.tsx (plain/static)
 * and components/sections/HeroIllustration.tsx (animated) render these same
 * two paths so the actual geometry only lives in one place.
 *
 * Two forms, matching the reference:
 * - Upper: a slanted parallelogram.
 * - Lower: a matching parallelogram with a swept, curved leading edge
 *   instead of a sharp corner.
 */
export const LYFTEK_MARK_VIEWBOX = "0 0 200 260" as const;

export const LYFTEK_MARK_TOP_PATH = "M97 3 L180 3 L121 171 L40 171 Z" as const;

export const LYFTEK_MARK_BOTTOM_PATH =
  "M3 257 C10 213 45 190 97 190 L197 190 L176 257 Z" as const;
