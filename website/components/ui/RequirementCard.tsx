import { EnvelopeSimpleOpen } from "@phosphor-icons/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import type { InquiryCard } from "@/constants/inquiries";

interface RequirementCardProps {
  data: InquiryCard;
}

/**
 * Purpose: the visual content for one card in About.tsx's CardSwap stack --
 * split out into its own component (previously inlined
 * directly in About.tsx's JSX) so the card's own layout/styling has a
 * single, reusable home, per this project's established pattern of small
 * dedicated `components/ui/` primitives (Button, Input, Select, Textarea,
 * Avatar) rather than one large section file doing everything inline.
 *
 * PROVENANCE: the layout structure here (avatar + name row, divider, then
 * an icon + message row) was supplied directly by the client as a
 * ready-made design, referencing shadcn's Avatar and lucide-react's Mail
 * icon. Adapted to this project's actual system rather than adopted
 * verbatim -- neither dependency exists here (icon system is
 * `@phosphor-icons/react` throughout, confirmed in Navbar/Footer/Services/
 * WhyLyftek; no Radix/shadcn primitives exist anywhere in `components/ui/`,
 * see Input/Select/Textarea's own docblocks for why), and the visual
 * treatment needed reconciling with rules already enforced everywhere else
 * on this page:
 * - `shadow-2xl` -> removed. 04_VISUAL_LANGUAGE.md bans drop shadows
 *   outright, no exception made for this card.
 * - `rounded-2xl` -> kept as `rounded-xl`, a DELIBERATE, FLAGGED exception
 *   to this site's sharp-corner convention elsewhere (`rounded-sm` at most
 *   -- Input.tsx, Select.tsx, Textarea.tsx, the Services grid). The client
 *   supplied a direct reference image (website/inspirations/Screenshot
 *   2026-08-07 200118.png -- reactbits.dev's own CardSwap demo) showing
 *   clearly rounded cards and said "this is exactly what we want" after
 *   several rounds of a sharp-cornered, boxed/cropped version weren't
 *   landing. Matching an explicit client reference takes precedence over
 *   the sitewide default here -- this is the one card on the page with
 *   rounded corners, intentionally, not a drift back toward a generic
 *   template look.
 * - Raw hex/opacity utilities (`bg-[#151719]`, `border-white/10`,
 *   `text-white/45`, `text-[#CDFC8A]`) -> replaced with this site's actual
 *   design tokens (`bg-panel`, `border-border`, `text-foreground-muted`,
 *   `text-accent`). Using raw values here would silently fork the color
 *   system -- if the palette ever changes (already happened once this
 *   session, see 08_COLOR_SYSTEM.md's accent-hover/accent-surface
 *   revision), this card would be the one place that doesn't follow.
 * - lucide-react's `Mail` -> Phosphor's `EnvelopeSimpleOpen`, matching what
 *   this exact card used before this revision and the sitewide icon set.
 * - shadcn's `Avatar`/`AvatarImage`/`AvatarFallback` -> this project's own
 *   `Avatar`/`AvatarImage`/`AvatarFallback` (components/ui/Avatar.tsx),
 *   built to match shadcn's exact composition API per direct client
 *   reference (ui.shadcn.com/docs/components/base/avatar) but without
 *   pulling in Base UI, the dependency their current version needs -- see
 *   that file's docblock for the full reasoning.
 *
 * CONTENT FIELDS -- `name`/`email` in the client's original design became
 * `role`/`subject` here, NOT a drop-in rename: `constants/inquiries.ts`
 * deliberately uses role labels ("IT Director") instead of fabricated
 * specific individuals, and has never included an email field, because
 * these cards are illustrative inquiry examples, not claimed real client
 * testimonials -- seeded name+company fields already carries real weight in
 * that direction; a fabricated EMAIL ADDRESS is a further, more concrete
 * step toward "looks like verified contact info for a real person" than a
 * role label is. Rather than invent one to match the pasted design exactly,
 * the header's second line here shows the subject (service category)
 * instead -- preserves the two-line person-row layout the client's design
 * establishes without introducing a new fabrication. Initials for the
 * Avatar fallback are derived from the role, not a name, for the same
 * reason.
 */
export function RequirementCard({ data }: RequirementCardProps) {
  const initials = data.role
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-panel border-border flex h-full w-full flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Avatar size="default" className="border-border border">
          <AvatarImage src={data.avatarDataUri} alt="" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-semibold">
            {data.role}
          </p>
          <p className="text-foreground-muted truncate text-xs">
            {data.subject}
          </p>
        </div>
      </div>

      <div className="border-border mt-1 border-t pt-3">
        <div className="flex items-start gap-2.5">
          <EnvelopeSimpleOpen
            aria-hidden
            size={16}
            className="text-accent mt-0.5 shrink-0"
          />
          <p className="text-foreground-secondary text-sm leading-5">
            {data.message}
          </p>
        </div>
      </div>
    </div>
  );
}
