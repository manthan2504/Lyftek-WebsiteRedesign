import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { WhyLyftek } from "@/components/sections/WhyLyftek";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    // 2026-08-08: no more negative top margin here -- that -mt-16 hack
    // existed only to pull Hero's panel up behind/around the old floating,
    // margined Navbar so the page background showed through around the
    // float. Navbar is now flush, full-width chrome (see Navbar.tsx's own
    // docblock) with nothing to sit behind, so <main> just flows normally
    // beneath it. scroll-mt-16 reserves NAVBAR_FOOTPRINT_PX (64px, Navbar's
    // row height) so the skip link's jump target isn't hidden under the
    // sticky Navbar. See constants/layout.ts and claudeContextExchange.md
    // for the full reasoning/history.
    //
    // Section order below Hero follows the approved homepage section plan
    // (2026-08-07): About ("Who We Are") -> Services ("What We Do") ->
    // WhyLyftek (merged credibility/stats) -> ContactCTA. Testimonials is
    // deliberately absent -- deferred until real client quotes exist, per
    // that same plan. Footer is global chrome, rendered in app/layout.tsx,
    // not here.
    <main id="main-content" className="scroll-mt-16">
      <Hero />
      <About />
      <Services />
      <WhyLyftek />
      <ContactCTA />
    </main>
  );
}
