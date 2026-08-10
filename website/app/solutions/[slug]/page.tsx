import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionHero } from "@/components/sections/solutions/SolutionHero";
import { SolutionBody } from "@/components/sections/solutions/SolutionBody";
import { ContactCTA } from "@/components/sections/ContactCTA";
import {
  SOLUTION_CATEGORY_LABELS,
  SOLUTION_DETAILS,
  getSolutionBySlug,
} from "@/constants/solutionDetails";

/**
 * Pre-renders every solution at build time, so all nine ship as static HTML
 * rather than being rendered on demand. Combined with `dynamicParams = false`
 * below, any slug not in this list is a real 404 instead of an empty
 * server-rendered page -- which matters because the live site currently
 * answers 200 with an empty shell for slugs that do not exist, and this
 * rebuild should not inherit that behaviour.
 */
export function generateStaticParams() {
  return SOLUTION_DETAILS.map((solution) => ({ slug: solution.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};

  return {
    title: solution.title,
    description: solution.metaDescription,
  };
}

export default async function SolutionDetailPage({
  params,
}: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  // Unreachable with `dynamicParams = false`, but kept as a real guard: it
  // is what makes the non-null access below honest, and it keeps the page
  // correct if that flag is ever relaxed.
  if (!solution) notFound();

  return (
    // Same skeleton as every other page -- see app/page.tsx's docblock.
    //
    // Section order: SolutionHero (title, summary, and for RCM the industry
    // stats) -> SolutionBody (problem, capabilities, scope, outcomes, each
    // rendered only if the data has it) -> ContactCTA, reused verbatim so
    // every solution page closes on the site's single conversion action
    // rather than a page-specific variant.
    <main id="main-content" className="scroll-mt-16">
      <SolutionHero
        solution={solution}
        categoryLabel={SOLUTION_CATEGORY_LABELS[solution.category]}
      />
      <SolutionBody solution={solution} />
      <ContactCTA />
    </main>
  );
}
