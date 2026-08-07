import { FacebookLogo, InstagramLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import type { FooterLink, SocialLink } from "@/types/footer";

/**
 * Footer content -- ported from the live site (lyftek.in) verbatim where the
 * facts are structural/stable (policy pages, social handles), per the
 * client's own assessment that the Footer needs no redesign, just a rebuild
 * (Docs/Mythoughts.md: "No changes needed").
 *
 * FLAG: address/phone/email/social URLs below were copied directly from the
 * live site during this session (2026-08-07) -- confirm still current before
 * launch, per the approved homepage section plan's "data-accuracy check."
 * Don't assume they're still correct indefinitely without re-verifying.
 */

export const POLICY_LINKS: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookies Policy", href: "/cookies-policy" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1ATxNBndLt/",
    icon: FacebookLogo,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lyfteksolutions",
    icon: InstagramLogo,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/lyftek-solutions/",
    icon: LinkedinLogo,
  },
  {
    label: "X",
    href: "https://x.com/lyftek",
    icon: XLogo,
  },
];

export const COMPANY_ADDRESS =
  "Elite Brookland, Near Syngenta, Baner - Balewadi Rd, Laxman Nagar, Baner, Pune, Maharashtra 411045";
export const COMPANY_PHONE = "+91 98230 09500";
export const COMPANY_EMAIL = "info@lyftek.in";
