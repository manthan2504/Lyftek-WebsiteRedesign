import { cn } from "@/utils/cn";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const POSITION_CLASSES: Record<Corner, string> = {
  "top-left": "top-0 left-0 border-t-2 border-l-2",
  "top-right": "top-0 right-0 border-t-2 border-r-2",
  "bottom-left": "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-right": "bottom-0 right-0 border-b-2 border-r-2",
};

interface CornerBracketsProps {
  corners: Corner[];
}

/**
 * Purpose: small L-shaped accent marks at specific corners of a bounded
 * panel -- viewfinder/blueprint-style corner marks, deliberately NOT a full
 * border around the panel. Marks a boundary at 4 discrete points instead of
 * outlining it entirely, matching 04_VISUAL_LANGUAGE.md's "distinction from
 * hierarchy, not decoration" component philosophy, and giving the brand
 * accent color a small, precise appearance rather than a wash of color.
 *
 * Usage: place inside a `relative` ancestor sized to the panel. Pass only
 * the corners that panel owns -- e.g. Navbar owns the top two corners of
 * the fused nav+hero panel, Hero owns the bottom two.
 */
export function CornerBrackets({ corners }: CornerBracketsProps) {
  return (
    <>
      {corners.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={cn(
            "border-accent pointer-events-none absolute h-6 w-6",
            POSITION_CLASSES[corner],
          )}
        />
      ))}
    </>
  );
}
