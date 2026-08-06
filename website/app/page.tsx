import { Hero } from "@/components/sections/Hero";

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
    <main id="main-content" className="-mt-16 scroll-mt-24">
      <Hero />
    </main>
  );
}
