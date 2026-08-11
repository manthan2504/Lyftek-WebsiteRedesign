import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * The small uppercase label that opens every section on this site -- a lime
 * `h-2 w-2` square followed by a Martian Mono, wide-tracked, uppercase
 * label ("Who We Are", "What We Do", "Get In Touch", ...).
 *
 * WHY THIS EXISTS (extracted 2026-08-10): this exact markup and class
 * string was duplicated, byte for byte, in ELEVEN places -- nine section
 * openers plus both Navbar mega-menu column headers. A consistency audit
 * found the styling itself had never drifted, which is impressive but also
 * precarious: every future change to the eyebrow (tracking, weight, the
 * square's size or colour) was eleven identical edits, and the first one
 * anybody forgot would be the moment it silently fell out of sync.
 * 17_CODING_STANDARDS.md's Tailwind section calls this out directly --
 * "avoid duplicated utility groups; extract repeated class combinations
 * into reusable utilities or components" -- as does components/sections/
 * README.md ("if a section pattern repeats across pages, promote it to
 * components/ui instead of duplicating"), which names a generic section
 * header as its example.
 *
 * WHY `components/ui/` RATHER THAN `components/sections/`: this is exactly
 * what that folder's README describes -- a small, generic, highly reusable
 * primitive with no business meaning of its own. It carries no content, no
 * data dependency, and no knowledge of which section renders it; the label
 * is passed in.
 *
 * MOTION: deliberately NOT a `motion.div` and deliberately no animation
 * props. Three call sites (Hero, Services, AboutHero) animate their eyebrow
 * as one child of a `staggerChildren` container and six do not. Baking a
 * variant in here would force the animated behaviour on the sections that
 * don't want it; instead those three wrap this component in their own
 * `<motion.div variants={item}>`, which keeps the stagger choreography
 * owned by the section that defines it. The extra wrapper element is inert.
 *
 * Not a Client Component: no hooks, no interactivity -- it renders on the
 * server and is imported freely by the client sections that use it.
 */
export function SectionEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-2 sm:items-center", className)}>
      <span aria-hidden className="bg-accent mt-1 h-2 w-2 shrink-0 sm:mt-0" />
      <p className="text-foreground-muted font-martian-mono text-xs font-semibold tracking-[0.28em] uppercase">
        {children}
      </p>
    </div>
  );
}
