import type { Metadata } from "next";
import { SolutionsIndex } from "@/components/sections/solutions/SolutionsIndex";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Lyftek automates the finance and healthcare processes that cost the most to run manually -- procure to pay, order to cash, record to report, tax, treasury, and revenue cycle management.",
};

export default function SolutionsPage() {
  return (
    // Same skeleton every other page uses -- see app/page.tsx's docblock.
    // `scroll-mt-16` reserves Navbar's real row height so the skip link's
    // jump target isn't hidden under the sticky Navbar.
    //
    // ContactCTA closes the page, as it does on Home and /about: this is a
    // browse page, so the form is a closing call to action rather than the
    // page's own content (contrast /contact, which renders the form as its
    // primary section instead -- see ContactCTA.tsx's docblock).
    <main id="main-content" className="scroll-mt-16">
      <SolutionsIndex />
      <ContactCTA />
    </main>
  );
}
