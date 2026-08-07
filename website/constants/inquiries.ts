import { createAvatar } from "@dicebear/core";
import * as personas from "@dicebear/personas";
import { SERVICE_PILLARS } from "@/constants/services";

export interface InquiryCard {
  /** Reuses a SERVICE_PILLARS label as the card's "subject line" -- see rationale below. */
  subject: string;
  /** A role, not a fabricated specific person's name -- see rationale below. */
  role: string;
  message: string;
  avatarDataUri: string;
}

/**
 * Purpose: content for the "corner-preview" CardSwap stack in About.tsx --
 * each card is styled as a mail/inbox message preview representing the
 * range of things enterprise teams come to Lyftek needing, closing (outside
 * this rotation, as a static caption in About.tsx) with a "one partner for
 * all of it" line. Built per direct client request: "each card must look
 * like a mail message screen."
 *
 * NOT TESTIMONIALS: these are illustrative inquiry examples, not claims
 * about real, verified clients -- no specific fabricated human name, no
 * claimed company, no implied endorsement/review. The project's standing
 * "never fabricate information" rule (already applied to WhyLyftek's stat
 * gate and the earlier decision to defer a real Testimonials section
 * entirely until real quotes exist) is respected here differently: instead
 * of avoiding the pattern altogether, the content is written so it can't be
 * mistaken for a real quote -- a ROLE ("IT Director"), not a specific named
 * individual, and a stated NEED, not a review/endorsement of past work.
 *
 * SUBJECT = SERVICE_PILLARS labels (constants/services.ts) verbatim -- the
 * same reuse pattern Footer.tsx and Services.tsx already apply to this
 * data, so this content and those two sections never drift into different
 * category names for the same four service lines.
 *
 * MESSAGE COPY: written per Docs/content_writing.md's tone guidance --
 * calm, specific, business-outcome-framed, no hype/buzzwords. Each reads as
 * a plausible one-line inquiry a real enterprise buyer would actually send,
 * not generic marketing copy repackaged as a "message."
 *
 * AVATARS: generated locally via @dicebear/core + @dicebear/personas (CC0
 * design license, MIT code license, same terms as every other DiceBear
 * style -- confirmed before adding this dependency). Deliberately NOT using
 * DiceBear's hosted api.dicebear.com endpoint, which is explicitly
 * restricted to non-commercial use (dicebear.com/how-to-use/http-api/) --
 * Lyftek is a commercial site, so avatars are generated locally at module
 * load from a fixed seed via `createAvatar(...).toDataUri()`, a deterministic
 * data: URI with zero runtime network requests and zero licensing ambiguity.
 *
 * STYLE CHOICE (revised 2026-08-07, direct client request for a more
 * "realistic vibe" on the cards): switched from `@dicebear/shapes`
 * (abstract geometric shapes) to `@dicebear/personas` (illustrated human
 * portraits -- hair/eyes/nose/mouth/body, https://dicebear.com/styles/
 * personas). A real photo option was considered and explicitly rejected:
 * the client's original request pasted a demo component using real,
 * identifiable people's Unsplash headshots (named "John Doe", "Jane
 * Smith", etc.) attached to these same illustrative/fabricated role cards
 * -- flagged as a real impersonation/right-of-publicity problem (real
 * strangers' faces appearing to represent fictional enterprise personas on
 * a commercial site, without consent or connection to Lyftek) and declined
 * in favor of this synthetic-illustration alternative, which keeps the
 * upgrade to "looks like a person, not a shape" without that risk -- same
 * reasoning that ruled out fabricated names/emails on this content
 * originally (see below). `hairColor`/`skinColor`/`clothingColor` are left
 * at the style's own diverse defaults rather than forced into the site's
 * brand palette (unlike the old shapes style) -- forcing e.g. green skin
 * tones would undermine the "realistic" goal this change exists for.
 * `backgroundColor` alone stays constrained to the panel's own near-black
 * tone so each avatar still blends into its card rather than showing a
 * mismatched square behind it.
 */

const AVATAR_BACKGROUND = ["0a0a0a"];

function avatarFor(seed: string): string {
  return createAvatar(personas, {
    seed,
    backgroundColor: AVATAR_BACKGROUND,
  }).toDataUri();
}

export const INQUIRY_CARDS: InquiryCard[] = [
  {
    subject: SERVICE_PILLARS[0].label, // Software Engineering
    role: "VP Engineering",
    message:
      "We need to modernize our internal tools before our next audit cycle.",
    avatarDataUri: avatarFor("lyftek-inquiry-software-engineering"),
  },
  {
    subject: SERVICE_PILLARS[1].label, // AI & Automation
    role: "Operations Director",
    message: "Looking to automate a manual approval process across three teams.",
    avatarDataUri: avatarFor("lyftek-inquiry-ai-automation"),
  },
  {
    subject: SERVICE_PILLARS[2].label, // Cloud & Infrastructure
    role: "IT Director",
    message: "Our infrastructure needs to scale before the next product launch.",
    avatarDataUri: avatarFor("lyftek-inquiry-cloud-infrastructure"),
  },
  {
    subject: SERVICE_PILLARS[3].label, // Security & Compliance
    role: "Head of Compliance",
    message: "Preparing for ISO 27001 renewal and need an outside review.",
    avatarDataUri: avatarFor("lyftek-inquiry-security-compliance"),
  },
];
