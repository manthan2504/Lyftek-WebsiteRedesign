import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerHero } from "@/components/sections/careers/CareerHero";
import { CareerBody } from "@/components/sections/careers/CareerBody";
import { CAREER_OPENINGS, getCareerBySlug } from "@/constants/careers";

/**
 * Pre-renders every opening at build time, same reasoning as
 * /solutions/[slug] and /services/[slug]: combined with `dynamicParams =
 * false`, a slug that doesn't exist is a real 404 instead of an empty
 * server-rendered page.
 */
export function generateStaticParams() {
  return CAREER_OPENINGS.map((opening) => ({ slug: opening.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const opening = getCareerBySlug(slug);
  if (!opening) return {};

  return {
    title: opening.title,
    description: opening.metaDescription,
  };
}

export default async function CareerDetailPage({
  params,
}: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const opening = getCareerBySlug(slug);

  // Unreachable with `dynamicParams = false`, but kept as a real guard --
  // see /solutions/[slug]/page.tsx's own note on why.
  if (!opening) notFound();

  return (
    // Same skeleton as every other page. No ContactCTA at the end, same
    // call as the /careers index -- see CareersIndex.tsx's docblock. The
    // application form inside CareerBody is this page's own single CTA.
    <main id="main-content" className="scroll-mt-16">
      <CareerHero opening={opening} />
      <CareerBody opening={opening} />
    </main>
  );
}
