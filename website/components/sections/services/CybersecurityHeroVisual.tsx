"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Bug,
  Eye,
  EnvelopeSimpleOpen,
  LockKey,
  Prohibit,
  SealCheck,
  ShieldCheck,
  ShieldWarning,
  WarningOctagon,
} from "@phosphor-icons/react";
import { CornerBrackets } from "@/components/ui/CornerBrackets";

/**
 * Cybersecurity & ISMS hero visual -- HTML + CSS + Framer Motion.
 *
 * FIFTH PASS. Full history in ServiceHero.tsx's own note; the short version:
 * raster generation was blocked outright, two hand-authored isometric SVGs
 * were rejected for floating elements, a first HTML/CSS/Motion pass fixed
 * that but was flagged as "a dashboard with four unrelated cards," and a
 * second pass added connector lines and a single travelling signal but was
 * still carrying decorative squares with no individual purpose (per-node
 * badges, checkpoint marks, a lime/transparent inner core layer).
 *
 * THIS PASS removes every one of those squares and replaces the two things
 * that mattered most:
 *
 *   1. The single travelling dot is now FOUR simultaneous light pulses,
 *      one per connector line, converging on the core together -- a
 *      synchronised "sweep" rather than one arbitrary origin.
 *   2. The core is no longer a square-in-a-square. It is a CIRCLE (the
 *      protective boundary) holding the protected system mark, with four
 *      small, dim THREAT icons sitting just outside the circle, inside the
 *      outer frame -- Bug, Prohibit, WarningOctagon, EnvelopeSimpleOpen
 *      (malware, blocked access, anomaly, phishing). The circle is what
 *      keeps them out; that is the entire visual argument for why this is
 *      a cybersecurity diagram rather than an abstract network diagram.
 *
 * ============================ WHAT WAS REMOVED ===========================
 *
 * - The per-node square badges (the lime pulsing squares on Monitoring/
 *   Detection, the outline square on Access Control, the solid square on
 *   Compliance). They were four more small squares in a component already
 *   carrying too many; the new circle-and-threats core now carries the
 *   "this system is protected" meaning on its own, so the per-node badges
 *   were vestigial rather than load-bearing.
 * - The checkpoint marks (small grey squares partway along each line).
 *   Superseded by the travelling light pulses, which show activity ALONG
 *   the line directly -- a static mark next to a moving one was redundant.
 * - The core's inner `border-accent/40 bg-accent/10` square layer -- the
 *   literal "lime and transparent square" -- replaced by the circle.
 *
 * KEPT DELIBERATELY: the top status row's lime square (next to "Continuous
 * Monitoring"). That is a DIFFERENT, sitewide pattern -- every section on
 * this site opens with an identical lime-square-plus-label eyebrow
 * (`SectionEyebrow`, used on every page). Removing it here would make this
 * one component inconsistent with the other sixteen sections that use it.
 * CornerBrackets on the core frame also stays -- an L-shaped blueprint
 * mark, not a square, and an existing sitewide primitive reused rather
 * than reinvented.
 *
 * ============================ THE RAYS ==================================
 *
 * Each connector is now TWO overlaid SVG lines: a static, muted "wire"
 * (always visible, low contrast) and a bright lime line using
 * `pathLength={100}` with `strokeDasharray="10 90"` -- a standard SVG
 * technique that normalises dash math to a 0-100 scale regardless of the
 * line's actual on-screen length, so the same dasharray produces a
 * correctly-sized moving segment on all four lines without hand-computing
 * their geometric lengths. Animating `strokeDashoffset` from `0` to `-100`
 * sweeps that one bright segment smoothly from the outer node to the core.
 * All four lines share IDENTICAL transition timing, so they arrive
 * together -- the "ray of light... from all 4 simultaneously" this was
 * asked for, not four independently-timed dots.
 *
 * `strokeDashoffset` is NOT one of framer-motion's positional keys (that
 * set covers width/height/top/left/right/bottom and transform props only),
 * so it is NOT auto-frozen by the sitewide `MotionConfig
 * reducedMotion="user"` the way the earlier version's `left`/`top` signal
 * was. Unlike that earlier case, this is handled EXPLICITLY here
 * (`useReducedMotion()`, gating the `animate` prop directly) rather than
 * left to rely on a mechanism that does not cover this property --
 * deliberate, not an oversight. Under reduced motion the rays simply do
 * not animate, leaving the bright segment parked at dashoffset 0 (i.e. at
 * each outer node) as a small static marker -- a legible fallback, not a
 * frozen mid-travel glitch, since 0 is the pattern's natural rest state.
 *
 * ============================ THE NODE RINGS ============================
 *
 * Added after the client reported the connector lines colliding with the
 * node icons and labels. The cause: every line ran to `POS[node]` exactly
 * -- the SAME point the node's icon+label stack was centred on -- so the
 * wire visually cut through the glyph rather than stopping before it.
 *
 * Fixed by giving each outer node its own protective ring (echoing the
 * core's, per the client's direct request) and deriving the line's actual
 * endpoint from that ring's geometry rather than from the node's raw
 * centre: `pointAtDistance()` walks `NODE_RING_R + NODE_RING_GAP` units
 * in from the node along the line toward the core, landing exactly on the
 * ring's edge. Because the SAME `NODE_RING_R` constant sizes the rendered
 * ring AND computes where the line stops, the two cannot drift apart --
 * retuning the ring's size keeps the clearance correct automatically,
 * rather than leaving a second, separately-tuned gap value that could
 * silently fall out of sync with it (the exact class of bug this file has
 * been careful to design out everywhere else).
 *
 * The ring itself is an SVG `<circle>`, not an HTML div -- it has to share
 * the connector lines' exact 0-100 coordinate space for that geometry to
 * be exact, not an approximation. The icon and label were also split into
 * two INDEPENDENTLY positioned elements (previously one flex column
 * centred as a unit): centring an icon+label stack on `POS` put `POS`
 * itself somewhere in the gap between them, not on the icon, which was
 * the other half of the original collision. The icon now centres exactly
 * on `POS` -- the same point the ring and the line's trim both reference
 * -- and the label sits below at an offset derived from `NODE_RING_R`, so
 * it always clears the ring regardless of future retuning.
 *
 * ============================ THE CORE ==================================
 *
 * A circle (`rounded-full`, thin `border-accent` ring) centred in the
 * frame, holding a small `ShieldCheck` -- "all elements inside the
 * circle" is the protected system. Four threat icons sit at the frame's
 * own corners, OUTSIDE the circle: dim (`opacity-40`, neutral grey, no
 * red/amber -- this palette has none), static, no animation of their own.
 * Their stillness is deliberate contrast against the actively-pulsing
 * circle and travelling rays: the threats are dormant/blocked, the
 * defence is live. That contrast is the whole mechanism communicating
 * "protected from" rather than just "here are some icons".
 *
 * The circle still breathes continuously at very low amplitude (`scale`,
 * a positional key, auto-safe under reduced motion, unchanged from the
 * previous pass) and still flares once per cycle -- retimed so the flare
 * coincides with the four rays' arrival, not a single signal's.
 */

const POS = {
  monitoring: { x: 20, y: 20 },
  detection: { x: 80, y: 20 },
  access: { x: 20, y: 82 },
  compliance: { x: 80, y: 82 },
  core: { x: 50, y: 51 },
} as const;

/**
 * Radius of each OUTER node's protective ring, in the same 0-100 viewBox
 * units as `POS` -- added per the client's request to echo the core's
 * "circle as protection layer" at every node, not just the centre.
 *
 * This single number now does two jobs, which is deliberate: it sizes the
 * rendered SVG ring AND it drives where the connector lines stop (see
 * `pointAtDistance` below). Previously the lines ran to the node's exact
 * centre point -- the same point the icon was centred on -- so the wire
 * visually passed straight through the glyph ("text and icons are
 * colliding with the lines"). Deriving the stopping point from the SAME
 * radius that draws the ring means the line always ends exactly on the
 * ring's edge, by construction -- if this radius is ever retuned, the line
 * clearance stays correct automatically, rather than being a second,
 * separately-tuned number that could drift out of sync with the ring.
 */
const NODE_RING_R = 7;
/** Extra breathing room between the ring's edge and the line's cut end. */
const NODE_RING_GAP = 1.5;

/** Point at `distance` from `from`, along the straight line toward `to`. */
function pointAtDistance(
  from: { x: number; y: number },
  to: { x: number; y: number },
  distance: number,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  return { x: from.x + (dx / len) * distance, y: from.y + (dy / len) * distance };
}

// `times` outside the `as const` for the same reason `CORE_FLARE_TRANSITION`
// documents below -- `as const` on an object containing an array freezes
// that array to a `readonly` tuple, which Framer Motion's `Transition` type
// rejects. Third time this exact trap has come up in this file; the
// pattern now is "put `as const` only on the `ease` field, never on the
// whole object."
const RAY_TRANSITION = {
  duration: 1.6,
  times: [0, 0.82, 1],
  repeat: Infinity,
  repeatDelay: 5.2,
  ease: "easeInOut" as const,
};

// One shared 6.8s cycle (RAY_TRANSITION's 1.6 + 5.2), expressed as
// fractions via `times` so the core's reaction flare peaks right as the
// rays arrive (~1.6s in) without needing a second repeatDelay to keep in
// sync with -- two independent repeatDelay-based loops drift against each
// other over many cycles; one shared duration with internal `times` cannot.
//
// `times` deliberately left OUTSIDE the `as const` -- a previous pass of
// this exact file hit this trap once already, on a different animate
// object: `as const` on an object containing an array freezes that array
// to a `readonly` tuple, which Framer Motion's `Transition` type rejects
// (it wants a mutable `number[]`). Only `ease` needs the literal-type
// preservation `as const` provides, so it is annotated on that one field
// instead of the whole object.
const CORE_FLARE_TRANSITION = {
  duration: 6.8,
  times: [0, 0.2, 0.27, 0.38, 1],
  repeat: Infinity,
  ease: "easeOut" as const,
};

const breatheTransition = { duration: 4, repeat: Infinity, ease: "easeInOut" } as const;

interface NodeSpec {
  key: keyof typeof POS;
  icon: typeof Eye;
  label: string;
}

const NODES: NodeSpec[] = [
  { key: "monitoring", icon: Eye, label: "Monitoring" },
  { key: "detection", icon: ShieldWarning, label: "Detection" },
  { key: "access", icon: LockKey, label: "Access Control" },
  { key: "compliance", icon: SealCheck, label: "Compliance" },
];

const THREATS = [
  { key: "malware", icon: Bug, corner: "top-1 left-1" },
  { key: "unauthorized-access", icon: Prohibit, corner: "top-1 right-1" },
  { key: "anomaly", icon: WarningOctagon, corner: "bottom-1 left-1" },
  { key: "phishing", icon: EnvelopeSimpleOpen, corner: "bottom-1 right-1" },
] as const;

/**
 * A node's ring, in the SVG connector layer -- NOT an HTML div. It has to
 * share the exact same 0-100 coordinate space as the connector lines for
 * `pointAtDistance` to land precisely on its edge; rendering it separately
 * as HTML (in different, px-based units) would reopen the same
 * "two systems that must be kept in sync by hand" risk that caused the
 * original collision.
 */
function NodeRing({ center }: { center: { x: number; y: number } }) {
  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={NODE_RING_R}
      fill="var(--color-panel)"
      stroke="var(--color-accent)"
      strokeOpacity={0.4}
      strokeWidth={0.6}
    />
  );
}

function Node({ spec }: { spec: NodeSpec }) {
  const { x, y } = POS[spec.key];
  const Icon = spec.icon;
  return (
    <>
      {/* Icon centred EXACTLY on POS -- the same point the ring and the
          line's trim calculation both reference, so all three stay in
          agreement by construction. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <Icon aria-hidden size={18} weight="light" className="text-foreground-secondary" />
      </div>
      {/* Label positioned independently, below the ring rather than
          stacked as part of one centred flex column with the icon -- that
          was the other half of the collision: centring an icon+label
          STACK on POS put POS itself somewhere in the gap between them,
          not on the icon, so the line's old unrimmed endpoint could clip
          either one depending on exact proportions. The offset here is
          derived from `NODE_RING_R`, the same number that sizes the ring,
          so the label always clears it regardless of future retuning. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${x}%`, top: `${y + NODE_RING_R + 6}%` }}
      >
        <span className="text-foreground-muted font-mono text-[10px] tracking-[0.12em] whitespace-nowrap uppercase">
          {spec.label}
        </span>
      </div>
    </>
  );
}

/** One connector: a static muted wire plus a bright travelling ray sharing its geometry exactly. */
function Connector({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const prefersReducedMotion = useReducedMotion();
  // Trimmed to the node's ring edge (plus a small gap), not the node's raw
  // centre -- see NODE_RING_R's docblock for why this fixes the collision
  // rather than just papering over it with an arbitrary offset. The core
  // end is untouched: it was already correctly covered by the core's own
  // filled background, rendered after this SVG in DOM order.
  const trimmedFrom = pointAtDistance(from, to, NODE_RING_R + NODE_RING_GAP);
  return (
    <>
      <line
        x1={trimmedFrom.x}
        y1={trimmedFrom.y}
        x2={to.x}
        y2={to.y}
        stroke="var(--color-border)"
        strokeWidth={0.6}
      />
      <motion.line
        x1={trimmedFrom.x}
        y1={trimmedFrom.y}
        x2={to.x}
        y2={to.y}
        pathLength={100}
        stroke="var(--color-accent)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="10 90"
        // Explicit reduced-motion gate -- see the docblock's "the rays"
        // section for why this can't rely on the sitewide positional-key
        // auto-freeze the way `left`/`top` animations elsewhere do.
        //
        // FIXED (reported by the client: the ray "snapped back" instead of
        // disappearing at the end of each pass): `strokeDasharray="10 90"`
        // totals exactly 100 units -- the same as `pathLength`. Animating
        // `strokeDashoffset` from `0` to `-100` is therefore exactly one
        // full pattern cycle, and a dash pattern repeats every cycle, so
        // `-100` renders IDENTICALLY to `0`. With no opacity animation, the
        // ray was fully bright right up to that instant, so the end of
        // every pass looked like an instant teleport back to the node
        // rather than an arrival. Fixed by fading `opacity` to 0 over the
        // final ~18% of the travel, so it is already invisible by the time
        // `strokeDashoffset` reaches the position that is visually
        // equivalent to the start -- the ray now fades out approaching the
        // core instead of snapping back to bright. Both keyframe arrays
        // are kept the SAME LENGTH (3) sharing one `times` array
        // (0/0.82/1); Framer Motion does not reliably align differently-
        // sized keyframe arrays under one shared `transition.times`.
        animate={
          prefersReducedMotion
            ? undefined
            : { strokeDashoffset: [0, -88, -100], opacity: [1, 1, 0] }
        }
        transition={RAY_TRANSITION}
      />
    </>
  );
}

export function CybersecurityHeroVisual() {
  const connectors = (["monitoring", "detection", "access", "compliance"] as const).map((k) => ({
    key: k,
    from: POS[k],
    to: POS.core,
  }));

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex items-center gap-2">
        <motion.span
          aria-hidden
          className="bg-accent h-2 w-2 shrink-0"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="text-foreground-muted font-mono text-xs tracking-[0.15em] uppercase">
          Continuous Monitoring
        </p>
      </div>

      <div
        aria-hidden
        className="border-border bg-panel relative mt-6 aspect-square w-full overflow-hidden border"
      >
        {/* Structured negative space -- a barely-visible dot field. */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Connection layer. Rings drawn BEFORE lines so a line's trimmed
            end tucks neatly under its ring's edge rather than potentially
            drawing a hairline over it; both drawn before the core, so the
            core's own filled background sits on top of where the lines
            terminate. */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connectors.map((c) => (
            <NodeRing key={`${c.key}-ring`} center={c.from} />
          ))}
          {connectors.map((c) => (
            <Connector key={c.key} from={c.from} to={c.to} />
          ))}
        </svg>

        {NODES.map((spec) => (
          <Node key={spec.key} spec={spec} />
        ))}

        {/*
          Security core: an outer square frame (the boundary of "the
          system"), a protective CIRCLE inside it (what actually blocks
          threats), and four dim threat icons sitting between the circle
          and the frame -- present, but outside the boundary, and static
          rather than animated, which is what visually marks them as
          neutralised rather than active.
        */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${POS.core.x}%`, top: `${POS.core.y}%` }}
        >
          <div className="relative h-28 w-28">
            <div className="border-border bg-panel absolute inset-0 border" />

            {THREATS.map((t) => {
              const Icon = t.icon;
              return (
                <Icon
                  key={t.key}
                  aria-hidden
                  size={13}
                  weight="light"
                  className={`text-foreground-muted absolute opacity-40 ${t.corner}`}
                />
              );
            })}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                {/* the protective boundary */}
                <div className="border-accent bg-panel absolute inset-0 rounded-full border" />
                {/* continuous slow breathing -- the system is always live */}
                <motion.div
                  aria-hidden
                  className="border-accent/40 absolute inset-0 rounded-full border"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={breatheTransition}
                />
                {/* reaction flare -- dormant most of the cycle, peaking as
                    the four rays converge (see CORE_FLARE_TRANSITION) */}
                <motion.div
                  aria-hidden
                  className="border-accent absolute inset-0 rounded-full border"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1, 1.5, 1, 1], opacity: [0, 0, 0.7, 0, 0] }}
                  transition={CORE_FLARE_TRANSITION}
                />
                {/* the protected system itself -- everything inside the circle */}
                <ShieldCheck aria-hidden size={24} weight="light" className="text-accent relative" />
              </div>
            </div>

            <CornerBrackets corners={["top-left", "top-right", "bottom-left", "bottom-right"]} />
          </div>
        </div>
      </div>
    </div>
  );
}
