import { ArrowRight } from "@phosphor-icons/react";

/**
 * Purpose: the "go" affordance at the end of a full-width clickable row --
 * currently the /careers and /solutions index lists (`CareersIndex.tsx`,
 * `SolutionsIndex.tsx`), both of which lay their entries out as bordered
 * rows rather than cards (see SolutionsIndex.tsx's own docblock for why).
 *
 * REPLACES a bare `ArrowUpRight` that stayed invisible (`opacity-0`) until
 * hover, then faded in while sliding diagonally into place -- direct
 * client feedback (2026-08-11): "we dont want that style of the arrow...
 * something different... boxy arrow." Two things changed, not just the
 * icon: a diagonal arrow implies "opens externally", which is wrong for a
 * same-site navigation row (the Footer's own hover-arrow docblock notes
 * `ArrowUpRight` was chosen there specifically for its external, "tilted"
 * read -- the opposite of what a row like this should signal); and an
 * icon with no boundary of its own doesn't match this site's established
 * "sharp, boxy, one border system" language (Button.tsx's docblock; the
 * same square-cornered vocabulary CornerBrackets.tsx and every bordered
 * panel on this site already share).
 *
 * `ArrowRight` (straight, not diagonal) inside its own bordered square
 * fixes both: the box is a small, self-contained control that reads as
 * "go to this", and the straight arrow reads as in-site navigation, not an
 * external link. Visible at rest (muted border/icon) rather than hidden
 * until hover -- a persistent affordance the visitor can see is there,
 * with hover only intensifying it (border and icon switch to the accent
 * colour, icon nudges right) rather than summoning it from nothing.
 *
 * PLACEMENT: end of the row, vertically centred against the row's own
 * height via `self-center` -- the row it sits in uses `md:items-baseline`
 * for its title/description text, which would otherwise align this box to
 * the text baseline instead of the row's visual centre.
 */
export function RowArrow() {
  return (
    <span
      aria-hidden
      className="border-border group-hover:border-accent flex h-10 w-10 shrink-0 items-center justify-center self-center border transition-colors duration-200 ease-out"
    >
      <ArrowRight
        size={16}
        className="text-foreground-muted group-hover:text-accent transition-all duration-200 ease-out group-hover:translate-x-0.5"
      />
    </span>
  );
}
