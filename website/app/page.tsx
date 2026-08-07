import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { WhyLyftek } from "@/components/sections/WhyLyftek";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    // -mt-16 (-64px) pulls this <main> up from its normal flow position
    // (NAVBAR_FOOTPRINT_PX, 96px) to leave a 32px gap above Hero's dashboard
    // panel -- matching Navbar's own mt-8 floating-gap unit for rhythm
    // consistency, rather than jamming the panel flush against the very top
    // of the viewport. scroll-mt-24 is unrelated to that gap -- it reserves
    // the full 96px NAVBAR_FOOTPRINT_PX so the skip link's jump target isn't
    // left hidden under the floating (sticky) Navbar. See
    // constants/layout.ts and claudeContextExchange.md for the full
    // reasoning.
    //
    // Section order below Hero follows the approved homepage section plan
    // (2026-08-07): About ("Who We Are") -> Services ("What We Do") ->
    // WhyLyftek (merged credibility/stats) -> ContactCTA. Testimonials is
    // deliberately absent -- deferred until real client quotes exist, per
    // that same plan. Footer is global chrome, rendered in app/layout.tsx,
    // not here.
    <main id="main-content" className="-mt-16 scroll-mt-24">
      <Hero />
      <About />
      <Services />
      <WhyLyftek />
      <ContactCTA />
    </main>
  );
}
