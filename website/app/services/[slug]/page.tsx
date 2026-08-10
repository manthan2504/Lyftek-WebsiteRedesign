import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ServiceBody,
  ServiceHero,
} from "@/components/sections/services/ServiceDetailSections";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SERVICE_DETAILS, getServiceBySlug } from "@/constants/serviceDetails";

/**
 * Pre-renders all eight services at build time. `dynamicParams = false`
 * makes any other slug a real 404 rather than an empty rendered page --
 * deliberately unlike the live site, which answers 200 with an empty SPA
 * shell for every path, including ones that were never built.
 */
export function generateStaticParams() {
  return SERVICE_DETAILS.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.metaDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  // Unreachable while `dynamicParams` is false, but kept as a real guard so
  // the non-null access below is honest and the page stays correct if that
  // flag is relaxed.
  if (!service) notFound();

  return (
    // Same skeleton as every other page -- see app/page.tsx's docblock.
    //
    // NOTE there is no `/services` index route. That is deliberate and
    // predates this work: the client decided on 2026-08-08 that the
    // homepage's "What We Do" section IS the services listing ("there is no
    // need of a separate services page, we already have that section at
    // homepage"), which is why the top-level nav item points at
    // `/#services`. These detail pages extend that decision rather than
    // reverse it -- each one links back up to that homepage section.
    <main id="main-content" className="scroll-mt-16">
      <ServiceHero service={service} />
      <ServiceBody service={service} />
      <ContactCTA />
    </main>
  );
}
