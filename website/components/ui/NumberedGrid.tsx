import { cn } from "@/utils/cn";

export interface NumberedGridItem {
  title: string;
  description: string;
}

/**
 * A numbered grid of short title + description entries, rendered as ONE
 * continuous bordered rule box with interior dividers -- not as a set of
 * individually elevated cards. That is 04_VISUAL_LANGUAGE.md's component
 * philosophy and the same call Services.tsx makes on the homepage: one
 * border system reads as a single instrument panel, whereas separate
 * shadowed cards read as unrelated widgets.
 *
 * Extracted to `components/ui` on 2026-08-10 when the Services detail pages
 * needed the identical grid the Solutions detail pages already had. Two
 * consumers of the same non-trivial border maths is exactly the bar
 * components/sections/README.md sets for promoting a pattern here, and
 * 09_DESIGN_SYSTEM.md's "avoid duplicate implementations" says the same.
 * It qualifies as a `ui` primitive on that folder's own terms: generic,
 * typed, no business meaning of its own -- it knows nothing about services
 * or solutions, only about laying out titled entries.
 *
 * NUMBERED RATHER THAN ICON-LED, unlike the homepage's Services grid.
 * Deliberate: across the solution and service pages these grids hold well
 * over a hundred entries between them, and inventing an icon per entry
 * would produce either meaningless repetition or a visual vocabulary nobody
 * can read. A two-digit index is honest ordinal information, and it keeps
 * this grid visually distinct from the homepage icon grid so the two never
 * read as the same component.
 */
function cellBorders(index: number, total: number, lgCols: number) {
  const SM = 2;
  const smLastRow = Math.floor((total - 1) / SM);
  const lgLastRow = Math.floor((total - 1) / lgCols);

  // Every breakpoint states BOTH the on and off state for each border
  // property. Tailwind's responsive variants are min-width-based, so an
  // `sm:border-r` left unset at `lg:` would still apply at `lg:` widths --
  // the same discipline Services.tsx's `pillarBorderClasses` documents.
  return cn(
    index === total - 1 ? "border-b-0" : "border-b",
    index % SM === 0 ? "sm:border-r" : "sm:border-r-0",
    Math.floor(index / SM) === smLastRow ? "sm:border-b-0" : "sm:border-b",
    index % lgCols !== lgCols - 1 ? "lg:border-r" : "lg:border-r-0",
    Math.floor(index / lgCols) === lgLastRow ? "lg:border-b-0" : "lg:border-b",
  );
}

/**
 * Column count at `lg`, chosen from the item count rather than fixed.
 *
 * Fixed at three, a four-item grid rendered as 3 + 1 and left TWO empty
 * bordered cells beside the final entry -- an empty cell inside a
 * continuous rule box does not read as deliberate whitespace, it reads as
 * content that failed to load. Four therefore goes to two columns (a clean
 * 2x2); five and six both take three, where six is exact and five leaves a
 * single gap, the best any rectangular grid can do for a prime count.
 *
 * Both class strings appear as literals below so Tailwind's scanner emits
 * them -- a computed `lg:grid-cols-${n}` would never exist in the
 * stylesheet.
 */
function lgColumnsFor(total: number): 2 | 3 {
  if (total % 3 === 0) return 3;
  if (total % 2 === 0) return 2;
  return 3;
}

export function NumberedGrid({
  items,
  className,
}: {
  items: NumberedGridItem[];
  className?: string;
}) {
  const lgCols = lgColumnsFor(items.length);

  return (
    <div
      className={cn(
        "border-border grid grid-cols-1 border sm:grid-cols-2",
        lgCols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((entry, index) => (
        <div
          key={entry.title}
          className={cn(
            "border-border flex flex-col gap-3 p-6 xs:p-8 lg:p-10",
            cellBorders(index, items.length, lgCols),
          )}
        >
          <span
            aria-hidden
            className="text-accent font-mono text-xs font-semibold tracking-[0.15em]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-rinter text-foreground text-lg tracking-tight">
            {entry.title}
          </h3>
          <p className="text-foreground-muted text-sm leading-relaxed">
            {entry.description}
          </p>
        </div>
      ))}
    </div>
  );
}
