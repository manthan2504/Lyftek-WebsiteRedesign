import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * DEV-ONLY. Origins permitted to request `/_next/*` dev assets.
   *
   * Next's dev server refuses cross-origin requests for its own chunks --
   * a deliberate protection against a malicious page in another tab
   * pulling your local source. When the site is opened from anything other
   * than localhost, every `/_next/static/chunks/*.js` comes back **403**,
   * so React never hydrates.
   *
   * That failure mode is genuinely confusing on this site, because the page
   * does not look broken -- it looks half-rendered. The server-rendered
   * HTML arrives fine (~146KB), but every section is wrapped in a Framer
   * Motion `initial="hidden"`, which SSRs as inline `opacity: 0`. With no
   * JS to run the entrance animation, all of it stays invisible. The Footer
   * is the ONLY block on the page with no motion wrapper, so a visitor sees
   * a blank page with a footer and nothing else. Diagnosed 2026-08-10 after
   * exactly that report, by loading the public IP and finding the 403s and
   * `h1Opacity: "0"`.
   *
   * This setting has NO effect on `next build` / `next start` -- production
   * serves static chunks to any origin. It only unblocks viewing the dev
   * server from another machine (a laptop, a phone on the LAN, etc.).
   *
   * The entry below is this project's VM. Add your own host/IP if you serve
   * the dev server from somewhere else; keep the list tight rather than
   * using a wildcard, since it is exactly the protection being relaxed.
   */
  allowedDevOrigins: ["202.66.174.88"],
};

export default nextConfig;
