import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { TeamSection } from "@/components/sections/about/TeamSection";
import { WhyDifferent } from "@/components/sections/about/WhyDifferent";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lyftek is an enterprise technology and digital transformation partner -- one accountable team across software, AI, cloud, and cybersecurity.",
};

export default function AboutPage() {
  return (
    // Same skeleton app/page.tsx (Home) uses -- see that file's own
    // docblock for the full reasoning. `scroll-mt-16` reserves Navbar's
    // real row height (NAVBAR_FOOTPRINT_PX) so the skip link's jump target
    // isn't hidden under the sticky Navbar; no negative top margin, since
    // Navbar is flush full-width chrome with nothing to pull this <main>
    // up behind.
    //
    // Section order, per direct client instruction (2026-08-08): AboutHero
    // ("About.") -> TeamSection ("Our Team") -> WhyDifferent (merged
    // Mission/Vision) -> ContactCTA, reused verbatim from the homepage
    // rather than rebuilt -- 10_PAGE_BLUEPRINTS.md's "single primary
    // objective" principle means this page gets exactly one conversion
    // CTA, the same one every other page uses, not a page-specific one.
    // Footer is global chrome, rendered in app/layout.tsx, not here.
    <main id="main-content" className="scroll-mt-16">
      <AboutHero />
      <TeamSection />
      <WhyDifferent />
      <ContactCTA />
    </main>
  );
}
