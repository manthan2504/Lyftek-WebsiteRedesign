import type { Metadata } from "next";
import { Geist_Mono, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

/**
 * TYPE SYSTEM (locked 2026-08-07, replacing the four-typeface system this
 * file used earlier the same day): a three-face trio, per direct, explicit
 * client instruction ("Apply this trio font pattern throughout"), each
 * with ONE clear job, applied sitewide:
 *
 *   - Rinter (`font-rinter`): big headings + numbers (H1/H2/H3s, WhyLyftek's
 *     stat value).
 *   - Martian Mono (`font-martian-mono`): small "section starter" eyebrow
 *     labels + navbar/footer brand elements.
 *   - Delight (`font-delight`, and also the sitewide `--font-sans` default
 *     now -- see app/globals.css): buttons + normal body/paragraph text.
 *
 * This SUPERSEDES and fully retires the previous system: IBM Plex Sans
 * (`font-heading`), Public Sans (`font-sans`/`--font-body`), and Switzer
 * (`font-switzer`, loaded via the Fontshare `<link>` that used to sit
 * below) are all removed -- every element that used any of them has been
 * reassigned into the trio above. Geist Mono is the one holdover, kept
 * for the handful of small UI labels the client's three categories don't
 * cover (form field labels, Avatar fallback initials, WhyLyftek's stat
 * sub-label, About's inline "Since 2011" caption) -- see 07_TYPOGRAPHY.md's
 * "Locked Decision" section for the full before/after mapping.
 */

// Numeric/label accent typeface -- the one holdover from the old system,
// see the type-system docblock above for exactly which elements still use
// it and why they weren't folded into the new trio.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Martian Mono -- fetched per direct client request (a Behance link to
// "AO Mono / Free Font" by Atelier Olschinsky). That specific font's
// commercial-use license came back genuinely disputed across every source
// checked (freebie mirrors disagreed with each other, and the designer's
// own site was unreachable to settle it) -- rather than self-host
// something with an unresolved commercial license on a client's
// commercial site, this is a confirmed-license substitute: same
// geometric/constructivist monospace "techy" character AO Mono has, but
// on Google Fonts proper (SIL Open Font License, unambiguously free for
// commercial use -- no download-mirror guesswork needed the way Rinter or
// AO Mono required). Loaded via `next/font/google` like the three sitewide
// faces above, not `next/font/local`. Weights kept minimal (400/700) plus
// 800 specifically because that heavier cut (closer to AO Mono's "Black")
// was the deciding factor over Space Mono, the other confirmed-license
// candidate presented -- Space Mono only goes up to 700.
//
// USAGE (final, per the locked trio -- see docblock above): navbar +
// footer brand elements (wordmarks, footer column headers) and every
// section's small "eyebrow" label -- the `text-xs uppercase tracking-
// [0.28em]` line that opens each section (e.g. Hero's "Enterprise
// Technology Partner", About's "Who We Are"). Geist Mono is left
// untouched for the small UI labels that don't fit any of the trio's
// three categories (form field labels, Avatar fallback initials,
// WhyLyftek's stat sub-label, About's inline "Since 2011" caption).
//
// Variable named `--font-martian-mono-raw`, NOT `--font-martian-mono` --
// next/font generates a CSS custom property with whatever name is passed
// here; naming it identically to the Tailwind-facing token in
// app/globals.css would make that token's `var(--font-martian-mono)`
// self-referential and resolve to nothing (same reasoning as `--font-
// rinter` != `--font-rinter-display` below).
const martianMono = Martian_Mono({
  variable: "--font-martian-mono-raw",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

// Rinter -- self-hosted display face, originally scoped to a single
// About-section heading ("replace this with rinter format"), now the
// trio's face for EVERY big heading and number sitewide (H1/H2/H3s,
// WhyLyftek's stat value) -- see the type-system docblock above. Not on
// Google Fonts or Fontshare, so `next/font/local` is the right tool here
// -- self-hosting is explicitly fine for this one (Thunder Type's own
// distribution, "free for personal & commercial use" per thunder.rs and
// the Befonts mirror the client pointed to, confirmed further by the
// copyright string embedded in the font file itself: "Copyright (c) Igor
// Marievi for Thunder Type"). Only a single Regular (400) weight exists
// -- no bold cut was available to download, so consumers of `font-rinter`
// should not also reach for a bold/semibold utility (the browser would
// synthesize a fake bold, which 04_VISUAL_LANGUAGE.md's typography-
// should-never-feel-decorative-or-fake guidance argues against) --
// exception: Hero's H1 keeps `font-extrabold` deliberately, at display
// size (`lg:text-8xl`) the browser's synthetic bold reads as an
// intentional heavy weight rather than a distortion, confirmed via
// screenshot before keeping it; smaller headings elsewhere drop the bold
// utility entirely instead.
const rinter = localFont({
  src: "../assets/fonts/Rinter-Regular.otf",
  variable: "--font-rinter-display",
  display: "swap",
});

// Delight -- self-hosted display face, per direct client request/link
// (behance.net/gallery/219085487, "Delight Typeface / Free / 09 Weights /
// Variable" by Rajesh Rajput). Unlike AO Mono, this one's commercial-use
// license checked out: multiple independent sources agree it's freeware,
// "free for both personal and commercial projects" -- restrictions are
// the standard freeware kind (no modifying/reselling/redistributing the
// font FILES themselves), not a ban on using it as a webfont, which is
// the normal, intended way a "free for commercial use" display font gets
// used. File downloaded from the same Befonts mirror pattern as Rinter
// (befonts.com/wp-content/uploads/.../delight-regular.otf), confirmed via
// the copyright string embedded in the font file itself ("Rajesh Rajput",
// family "Delight").
//
// Only the Regular weight is mirrored for free download -- the "09
// weights" the Behance page advertises live behind Gumroad's own
// checkout flow (pay-what-you-want, including $0, but not something this
// tool can complete), so only Regular is available here. Same
// implication as Rinter: no bold/semibold utility should be paired with
// `font-delight` unless/until a heavier weight is actually obtained.
//
// USAGE (final, per the locked trio -- see docblock above): "buttons and
// normal text" -- now the sitewide `--font-sans` default itself (see
// app/globals.css), not a separately-applied class. Originally scoped to
// just Hero's description paragraph on the client's first request; the
// follow-up "throughout" instruction is what promoted it to the actual
// default. Public Sans is fully retired (no remaining consumer once every
// body-text element inherits this instead) -- removed from this file
// entirely rather than left as dead weight.
const delight = localFont({
  src: "../assets/fonts/Delight-Regular.otf",
  variable: "--font-delight-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lyftek | Enterprise Technology & Digital Transformation Partner",
    template: "%s | Lyftek",
  },
  description:
    "Lyftek helps enterprises build, modernize, automate, and secure their businesses through custom software, AI, cloud, and cybersecurity engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} ${martianMono.variable} ${rinter.variable} ${delight.variable} h-full antialiased`}
    >
      {/*
        No Switzer <link> anymore -- it was scoped to the Hero H1 only,
        which now uses the self-hosted `font-rinter` instead (see the
        type-system docblock above). Removed rather than left loading an
        unused external stylesheet.
      */}
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {/*
            Navbar lives here (not in individual pages) so every route gets
            it automatically -- global chrome belongs in the layout per
            components/layout/README.md. Each page's top-level landmark
            should carry id="main-content" for the Navbar's skip link.
          */}
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
