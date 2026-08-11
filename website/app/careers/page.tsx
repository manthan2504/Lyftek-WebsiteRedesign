import type { Metadata } from "next";
import { CareersIndex } from "@/components/sections/careers/CareersIndex";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Lyftek Solutions. Current openings across engineering, sales, and finance -- flexible hours, real ownership, and room to grow.",
};

export default function CareersPage() {
  return (
    // Same skeleton every other page uses -- see app/page.tsx's docblock.
    // No ContactCTA here -- see CareersIndex.tsx's own docblock for why
    // this page closes on its openings list instead.
    <main id="main-content" className="scroll-mt-16">
      <CareersIndex />
    </main>
  );
}
