import type { SVGProps } from "react";
import {
  LYFTEK_MARK_BOTTOM_PATH,
  LYFTEK_MARK_TOP_PATH,
  LYFTEK_MARK_VIEWBOX,
} from "@/constants/lyftekMark";

interface LyftekMarkProps extends SVGProps<SVGSVGElement> {
  strokeTop?: string;
  strokeBottom?: string;
  strokeWidth?: number;
  /**
   * Renders both shapes as solid fills (`strokeTop`/`strokeBottom` become
   * fill colors, no stroke) instead of the default outline-stroke
   * treatment. Added 2026-08-08 for the Footer's giant wordmark preview --
   * paired at large scale next to bold solid display type, an outline
   * stroke (even a thick one) reads as a thin sketch next to a heavy solid
   * letterform; a genuine weight mismatch, not a style choice. Default
   * `false` -- every other consumer (ContactCTA, Footer's own smaller
   * corner-bracket-adjacent use elsewhere) keeps the original outline look
   * unchanged.
   */
  filled?: boolean;
  /**
   * Non-uniform horizontal stretch applied to the bottom shape only (1 =
   * unchanged). Left-anchored (`transformOrigin: "left"` + `transformBox:
   * "fill-box"`, so the origin is that path's own bounding box, not the
   * whole viewBox) -- the shape's left/curved end stays put and it extends
   * further right, matching how the horizontal stroke of an "L" would grow
   * without moving where it meets the vertical stroke. Kept as a per-path
   * transform rather than editing constants/lyftekMark.ts's actual
   * coordinates, so the canonical mark geometry stays the true brand mark
   * for any other future use of this component -- this is a one-off
   * illustration adjustment, not a proportion change to the real logo.
   */
  bottomScaleX?: number;
}

/**
 * Purpose: the Lyftek brand mark as clean outline vector paths -- see
 * constants/lyftekMark.ts for the shared path data and where it came from.
 * Outline only (fill="none"), brand colors by default (dark
 * --color-accent-foreground on top, lime --color-accent on bottom, per
 * 08_COLOR_SYSTEM.md).
 *
 * Deliberately plain/static -- no animation, no glow -- so it stays
 * reusable anywhere a simple mark is needed (a future navbar/footer swap,
 * favicon-adjacent use, etc). The homepage Hero's illustration
 * (components/sections/HeroBackdrop.tsx) renders this same component with
 * its own positioning/sizing layered on from outside.
 *
 * Sizing: set width via className (e.g. `className="w-48 h-auto"`) --
 * the mark scales through its viewBox, not fixed width/height attributes.
 */
export function LyftekMark({
  strokeTop = "var(--color-accent-foreground)",
  strokeBottom = "var(--color-accent)",
  strokeWidth = 6,
  bottomScaleX = 1,
  filled = false,
  ...props
}: LyftekMarkProps) {
  return (
    <svg viewBox={LYFTEK_MARK_VIEWBOX} fill="none" aria-hidden {...props}>
      <path
        d={LYFTEK_MARK_TOP_PATH}
        fill={filled ? strokeTop : "none"}
        stroke={filled ? "none" : strokeTop}
        strokeWidth={filled ? undefined : strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={LYFTEK_MARK_BOTTOM_PATH}
        fill={filled ? strokeBottom : "none"}
        stroke={filled ? "none" : strokeBottom}
        strokeWidth={filled ? undefined : strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={
          bottomScaleX !== 1
            ? {
                transform: `scaleX(${bottomScaleX})`,
                transformOrigin: "left",
                transformBox: "fill-box",
              }
            : undefined
        }
      />
    </svg>
  );
}
