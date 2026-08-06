import type { Metadata } from "next";
import { IBM_Plex_Sans, Public_Sans, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

// Heading typeface -- IBM Plex Sans, only applied via the `font-heading`
// utility on H1/H2/section headings + the nav wordmark. See
// 07_TYPOGRAPHY.md and the Session Log in claudeContextExchange.md for why
// this pairing was chosen over Geist-only.
// Only load the weight actually used (semibold headings). Add 500/700 here
// only when a real element needs them -- an unused preloaded weight is
// exactly the kind of thing that trips Next.js's "preloaded but not used"
// warning and wastes a font request for nothing.
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["600"],
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
