import type { Metadata } from "next";
import { IBM_Plex_Sans, Public_Sans, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

// Heading typeface -- IBM Plex Sans, only applied via the `font-heading`
// utility on H1/H2/section headings + the nav wordmark. See
// 07_TYPOGRAPHY.md and the Session Log in claudeContextExchange.md for why
// this pairing was chosen over Geist-only.
// Only load weights actually used: 600 (nav wordmark) and 700 (Hero H1 --
// bumped to Bold, IBM Plex Sans's heaviest available cut, for a Fulcrum-
// Labs-style heavy display headline). Add more only when a real element
// needs them -- an unused preloaded weight trips Next.js's "preloaded but
// not used" warning and wastes a font request for nothing.
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Body typeface -- Public Sans. This is the site's default (`font-sans`),
// applied automatically to everything that doesn't opt into `font-heading`.
const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

// Numeric/label accent typeface -- unchanged, still used sparingly for
// stats, eyebrow labels, and captions.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${ibmPlexSans.variable} ${publicSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        Switzer (display headline font, scoped to the Hero H1 only via the
        `font-switzer` utility -- see app/globals.css -- NOT the sitewide
        `font-heading`/IBM Plex Sans). Free for commercial use under
        Fontshare's ITF Free Font License, but self-hosting the files
        requires ITF's written consent -- loading via Fontshare's own API
        (their intended distribution path) rather than bundling font files
        ourselves. React 19 hoists <link> tags rendered anywhere in the tree
        into <head> automatically -- but a stylesheet link specifically
        needs an explicit `precedence` so React knows where in cascade
        order to place it; without it, React errors instead of guessing.
        `precedence="default"` here is deliberately lower than Next's own
        Google-Fonts stylesheets (which the framework inserts at a higher
        precedence), so Switzer never wins a specificity fight against the
        self-hosted fonts. Confirmed working URL/weights via a direct fetch
        of the API response before wiring this in -- not guessed.
      */}
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link
        href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800&display=swap"
        rel="stylesheet"
        precedence="default"
      />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
