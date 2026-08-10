import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { OfficeMap } from "@/components/sections/contact/OfficeMap";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Lyftek -- an enterprise technology and digital transformation partner. Email, phone, our Pune office, and a direct line to a senior engineer.",
};

export default function ContactPage() {
  return (
    // Same skeleton app/page.tsx (Home) and app/about/page.tsx use -- see
    // those files' own docblocks. `scroll-mt-16` reserves Navbar's real row
    // height (NAVBAR_FOOTPRINT_PX) so the skip link's jump target isn't
    // hidden under the sticky Navbar; no negative top margin, since Navbar
    // is flush full-width chrome with nothing to pull this <main> up behind.
    //
    // TWO SECTIONS, REDESIGNED 2026-08-10. The first build of this page had
    // three (ContactHero -> OfficeLocation -> ContactCTA) and buried the
    // form -- the page's only real objective -- below a full-viewport hero
    // AND the map, behind three competing headings that all said a version
    // of "contact us". Now: ContactSection (heading + direct contact
    // methods on the left, the form on the right, above the fold) then
    // OfficeMap (full-width). See ContactSection.tsx's docblock for the
    // research and the full reasoning; ContactHero.tsx and
    // OfficeLocation.tsx were deleted rather than left unused.
    //
    // NOTE this page does NOT render `ContactCTA` the way Home and /about
    // do. That section is a CLOSING call-to-action built around the same
    // shared `ContactForm`; including it here would put two identical forms
    // on one page. 10_PAGE_BLUEPRINTS.md's "single primary objective" still
    // holds -- there is exactly one form on this page, it is just the
    // page's main content now rather than its footer. Footer is global
    // chrome, rendered in app/layout.tsx, not here.
    <main id="main-content" className="scroll-mt-16">
      <ContactSection />
      <OfficeMap />
    </main>
  );
}
