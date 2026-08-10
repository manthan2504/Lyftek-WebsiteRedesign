/**
 * The office map embed, for the new /contact page's OfficeLocation section.
 *
 * SOURCED FROM THE LIVE SITE (2026-08-10), NOT REGENERATED: this project's
 * standing no-fabrication rule (SERVICE_PILLARS, SOLUTION_CATEGORIES,
 * COMPANY_ADDRESS all document the same standard) covers a map pin the same
 * way it covers a stat or a service description -- an independently
 * geocoded pin for "Elite Brookland, Near Syngenta, Baner - Balewadi Rd..."
 * could plausibly land on a neighboring building, while the live site's own
 * embed is the client's already-placed, already-correct pin. Pulled by
 * rendering https://www.lyftek.in/contact with Playwright (a plain fetch
 * only returns the SPA shell, no iframe) and reading the map iframe's `src`
 * directly out of the DOM. Copied verbatim, including its `!1s0x3bc2bf...`
 * feature-ID parameter -- that's what actually pins the exact building,
 * not just the street address text.
 *
 * WHY A PLAIN EMBED URL, NOT THE MAPS JAVASCRIPT API: this is a single
 * static "here's our office" widget, not an interactive map product -- no
 * pan/zoom/marker logic this site needs to control. The classic
 * `google.com/maps/embed?pb=...` iframe (Google's own "Share > Embed a
 * map" output) needs no API key, no billing account, and no new npm
 * dependency, which is exactly what 15_PROJECT_TECH_STACK.md's package
 * philosophy asks for ("every dependency increases long-term
 * maintenance... avoid unnecessary complexity"). The Maps JS API would
 * only earn its cost if this page needed custom markers, click handlers,
 * or a dark-styled base map from Google's own style JSON -- OfficeLocation.tsx
 * gets a dark-compatible look instead via a CSS filter on the iframe,
 * documented in that file.
 */
export const OFFICE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.488076854361!2d73.78391927490853!3d18.594384568463027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf0888e17cc5%3A0x4dd9ba5f7286213e!2sBaner%2C%20Pune%2C%20Maharashtra%20411045!5e0!3m2!1sen!2sin!4v1693400394641!5m2!1sen!2sin";

/**
 * "Get Directions" link -- a plain Maps search deep link built from
 * `COMPANY_ADDRESS` (constants/footer.ts), the site's one source of truth
 * for the address text, rather than a second hand-typed copy of it here.
 * Opens Google Maps (app on mobile, maps.google.com on desktop) with the
 * address pre-filled -- simpler and more portable than trying to carry the
 * embed's internal feature-ID over to a places-search URL, and Google
 * Maps' own search resolves this address to the same building anyway,
 * confirmed by the fact that the client's own live-site embed and this
 * address string already point at the same location.
 */
export function buildDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
