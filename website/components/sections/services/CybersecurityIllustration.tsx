import type { SVGProps } from "react";
import { cn } from "@/utils/cn";

/**
 * Cybersecurity & ISMS hero illustration -- an isometric defence-in-depth
 * diagram: concentric fortified rings around a protected core, with threat
 * debris deflected at the outer edge and clean traffic routed out the far
 * side.
 *
 * REBUILT 2026-08-10 against the client's reference image
 * (`website/inspirations/CyberSecurityHeroSectionGoal.jpeg`). The previous
 * version was structurally different in the way that mattered most: it drew
 * angular diamond tracks, thin flat wall slabs, and a sparse three-block
 * core. The reference is built on CONCENTRIC ROUNDED rings -- a racetrack
 * footprint in isometric projection -- with thick extruded walls and a
 * citadel of light buildings at the centre. That ring geometry is the whole
 * silhouette, so it drives this rebuild.
 *
 * HOW THE GEOMETRY WORKS, because it is not obvious from the path data:
 *
 * Everything circular is drawn as a PLAN-VIEW rounded `<rect>` inside a
 * group carrying the isometric matrix below. Projecting a rounded rectangle
 * by hand means solving for the tangent points of four elliptical arcs;
 * letting the matrix do it is exact, adjustable (change `rx` and the corner
 * radius stays correct), and readable. The matrix is the standard 2:1
 * isometric basis -- x maps to (0.866, 0.5), y maps to (-0.866, 0.5).
 *
 * Each ring is a STROKED rect, not a filled one: a stroke of width N in
 * plan space projects to a band of constant width, which is exactly what a
 * circular track is. Wall segments are the same rect stroked with a
 * `stroke-dasharray`, so the gaps between segments follow the curve for
 * free. Extrusion is a screen-space `translate(0,-H)` on an outer group
 * wrapping a second copy of the same ring -- the lifted copy reads as the
 * wall's top face, the unlifted one as its shadowed side. That trick is why
 * this file has no hand-computed wall polygons.
 *
 * Boxes (buildings, crates, icon tiles) use a plain 2:1 isometric cell:
 * top face is a rhombus of half-width A and half-height A/2, with left and
 * right faces dropped H below it. Consistent A/H values are what keep every
 * solid on the same projection.
 *
 * COLOUR: pulled onto this project's own tokens rather than the reference's
 * palette. The reference sits on a mid-charcoal ground; this panel is
 * `--panel` (#0A0A0A), so the greens are lifted slightly to hold contrast
 * against near-black, and the brightest accents are the real `--accent`
 * lime (#CDFC8A) instead of the reference's #A3E635. Greys follow the
 * neutral ramp already in 08_COLOR_SYSTEM.md.
 *
 * MOTION: one dashed path marches along the egress route, disabled under
 * `prefers-reduced-motion`. Pure CSS on a single path -- no WebGL, so it
 * stays smooth on this project's GPU-less VM where the Hero's shader could
 * not. Note this does NOT ride on the Hero's documented reduced-motion
 * exception in 13_MOTION_AND_ANIMATION.md; that one is scoped to the
 * homepage Threads background and recorded there as not a precedent.
 *
 * SCOPING: every id and class is `sec-`-prefixed and every CSS rule is
 * nested under `.sec-illus`. SVG `<defs>` ids are document-global and a
 * `<style>` inside inline SVG leaks page-wide, so unprefixed names here
 * would match elements anywhere on the site.
 */
const CSS = `
.sec-illus .sec-track      { fill: none; stroke: #16191D; }
.sec-illus .sec-track-edge { fill: none; stroke: #232830; }
.sec-illus .sec-wall-side  { fill: none; stroke: #0E3A26; }
.sec-illus .sec-wall-top   { fill: none; stroke: #2F6B48; }
.sec-illus .sec-wall-cap   { fill: none; stroke: #7C8794; }
.sec-illus .sec-course     { fill: none; stroke: #174630; stroke-width: 1; opacity: .7; }
.sec-illus .sec-route      { fill: none; stroke: #2A3038; stroke-width: 1.5; }
.sec-illus .sec-route-live { fill: none; stroke: #0F9C7F; stroke-width: 1.5; }
.sec-illus .sec-flow       { fill: none; stroke: #CDFC8A; stroke-width: 1.75; stroke-dasharray: 7 15; animation: sec-flow 3.2s linear infinite; }
.sec-illus .sec-threat     { fill: none; stroke: #4B5563; stroke-width: 1.5; stroke-dasharray: 3 4; }
.sec-illus .sec-arrow      { fill: none; stroke: #9CA3AF; stroke-width: 1.5; }
.sec-illus .sec-dot-lime   { fill: #CDFC8A; }
.sec-illus .sec-dot-jade   { fill: #0F9C7F; }
.sec-illus .sec-dot-grey   { fill: #4B5563; }
.sec-illus .sec-shard      { fill: #374151; }
.sec-illus .sec-shard-lime { fill: #4E6B32; }
@keyframes sec-flow { to { stroke-dashoffset: -44; } }
@media (prefers-reduced-motion: reduce) {
  .sec-illus .sec-flow { animation: none; }
}
`;

/** 2:1 isometric basis, centred on the citadel. */
const ISO = "matrix(0.866,0.5,-0.866,0.5,620,300)";

/** One extruded isometric box: top rhombus (half-width a) plus two faces of height h. */
function Box({
  x,
  y,
  a,
  h,
  top,
  left,
  right,
}: {
  x: number;
  y: number;
  a: number;
  h: number;
  top: string;
  left: string;
  right: string;
}) {
  const b = a / 2;
  return (
    <g>
      <polygon points={`${x - a},${y} ${x},${y - b} ${x + a},${y} ${x},${y + b}`} fill={top} />
      <polygon points={`${x - a},${y} ${x},${y + b} ${x},${y + b + h} ${x - a},${y + h}`} fill={left} />
      <polygon points={`${x + a},${y} ${x},${y + b} ${x},${y + b + h} ${x + a},${y + h}`} fill={right} />
    </g>
  );
}

/** Small floating cube used as scattered packet/asset detail. */
function Cube({ x, y, a = 9, tone = "grey" }: { x: number; y: number; a?: number; tone?: "grey" | "green" }) {
  const p =
    tone === "green"
      ? { top: "#3E8A5C", left: "#0E3A26", right: "#1C5136" }
      : { top: "#6B7280", left: "#1F2937", right: "#374151" };
  return <Box x={x} y={y} a={a} h={a * 0.8} top={p.top} left={p.left} right={p.right} />;
}

export function CybersecurityIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    // `className` is merged rather than spread over: an earlier version set
    // `className="sec-illus"` then `{...props}` after it, so the consumer's
    // own class replaced it and every scoped rule silently stopped matching.
    <svg
      // Cropped to the measured drawing, not the working canvas. Measured
      // in SCREEN space and converted back to viewBox units -- `getBBox()`
      // is useless here because it reports a transformed group's children
      // in their own local coordinates, so on this file it returned the
      // plan-space rects at -290 and mixed two coordinate systems. Content
      // actually occupies x60..1189, y-10..651 (79% of the old canvas);
      // this box is that plus a small margin.
      viewBox="50 -16 1150 680"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("sec-illus", className)}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------- concentric rings: track, wall side, wall top ---------- */}
      {/* Outer ring */}
      <g transform={ISO}>
        <rect x={-290} y={-290} width={580} height={580} rx={150} className="sec-track" strokeWidth={34} />
        <rect x={-290} y={-290} width={580} height={580} rx={150} className="sec-track-edge" strokeWidth={1.5} />
        <rect x={-290} y={-290} width={580} height={580} rx={150} className="sec-wall-side" strokeWidth={20} strokeDasharray="46 26" />
      </g>
      <g transform="translate(0,-20)">
        <g transform={ISO}>
          <rect x={-290} y={-290} width={580} height={580} rx={150} className="sec-wall-top" strokeWidth={20} strokeDasharray="46 26" />
          <rect x={-290} y={-290} width={580} height={580} rx={150} className="sec-wall-cap" strokeWidth={4} strokeDasharray="46 26" />
          <rect x={-290} y={-290} width={580} height={580} rx={150} className="sec-course" strokeDasharray="1 10" />
        </g>
      </g>

      {/* Middle ring */}
      <g transform={ISO}>
        <rect x={-205} y={-205} width={410} height={410} rx={110} className="sec-track" strokeWidth={30} />
        <rect x={-205} y={-205} width={410} height={410} rx={110} className="sec-track-edge" strokeWidth={1.5} />
        <rect x={-205} y={-205} width={410} height={410} rx={110} className="sec-wall-side" strokeWidth={16} strokeDasharray="38 22" />
      </g>
      <g transform="translate(0,-15)">
        <g transform={ISO}>
          <rect x={-205} y={-205} width={410} height={410} rx={110} className="sec-wall-top" strokeWidth={16} strokeDasharray="38 22" />
          <rect x={-205} y={-205} width={410} height={410} rx={110} className="sec-wall-cap" strokeWidth={3} strokeDasharray="38 22" />
        </g>
      </g>

      {/* Inner ring -- unbroken, the last line of defence */}
      <g transform={ISO}>
        <rect x={-128} y={-128} width={256} height={256} rx={70} className="sec-track" strokeWidth={24} />
        <rect x={-128} y={-128} width={256} height={256} rx={70} className="sec-wall-side" strokeWidth={13} />
      </g>
      <g transform="translate(0,-12)">
        <g transform={ISO}>
          <rect x={-128} y={-128} width={256} height={256} rx={70} className="sec-wall-top" strokeWidth={13} />
          <rect x={-128} y={-128} width={256} height={256} rx={70} className="sec-wall-cap" strokeWidth={2.5} />
        </g>
      </g>

      {/* ---------- core platform ---------- */}
      <g transform={ISO}>
        <rect x={-72} y={-72} width={144} height={144} rx={16} fill="#111418" stroke="#2A3038" strokeWidth={2} />
        <rect x={-56} y={-56} width={112} height={112} rx={10} fill="#0C0F12" />
      </g>

      {/*
        The citadel. Drawn back-to-front so overlaps resolve without needing
        explicit z-ordering. Scaled up ~25% from the first pass, where the
        buildings read as small relative to the rings surrounding them --
        the reference makes the protected core the visual anchor, and at the
        earlier size the rings dominated it. Footprints stay inside the
        platform (screen x495..745), so nothing overhangs the edge.
      */}
      <Box x={592} y={246} a={38} h={38} top="#D1D5DB" left="#6B7280" right="#9CA3AF" />
      <Box x={664} y={232} a={28} h={78} top="#E5E7EB" left="#7C8794" right="#AEB6BF" />
      <g>
        <Box x={650} y={292} a={42} h={32} top="#C7CDD4" left="#5C6672" right="#8B94A0" />
        {/* document ruling on the wide block's right face */}
        <g stroke="#5C6672" strokeWidth={1.2} opacity={0.9}>
          <line x1={656} y1={318} x2={686} y2={303} />
          <line x1={656} y1={326} x2={686} y2={311} />
          <line x1={656} y1={334} x2={686} y2={319} />
        </g>
      </g>
      <Box x={592} y={306} a={30} h={22} top="#AEB6BF" left="#4B5563" right="#6B7280" />
      {/* lime roof marker on the tallest tower */}
      <polygon points="664,218 678,225 664,232 650,225" fill="#CDFC8A" />

      {/* ---------- gate checkpoints on the rings ---------- */}
      {[
        { x: 470, y: 258 },
        { x: 782, y: 268 },
        { x: 700, y: 402 },
      ].map((g) => (
        <g key={`${g.x}-${g.y}`}>
          <Box x={g.x} y={g.y} a={15} h={22} top="#CDFC8A" left="#14472F" right="#1C5136" />
          <path
            d={`M ${g.x - 7},${g.y - 1} L ${g.x - 2},${g.y + 4} L ${g.x + 8},${g.y - 6}`}
            fill="none"
            stroke="#0B2C1C"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* ---------- inbound threats: debris, deflection arrows ---------- */}
      <g>
        <path d="M 60 96 C 190 150, 268 168, 352 206" className="sec-threat" />
        <path d="M 96 60 C 214 118, 300 140, 376 178" className="sec-threat" />
        {[
          [150, 108], [186, 86], [214, 128], [252, 104], [284, 146], [318, 122],
        ].map(([x, y], i) => (
          <polygon
            key={`${x}-${y}`}
            points={`${x},${y} ${x + 13},${y - 6} ${x + 18},${y + 5} ${x + 5},${y + 11}`}
            className={i % 3 === 0 ? "sec-shard-lime" : "sec-shard"}
          />
        ))}
        {/* deflection: arrows turned back at the wall */}
        <g className="sec-arrow">
          <path d="M 372 214 L 336 190" />
          <path d="M 400 232 L 366 208" />
        </g>
        <polygon points="330,186 345,190 337,199" fill="#9CA3AF" />
        <polygon points="360,204 375,208 367,217" fill="#9CA3AF" />
        <circle cx={392} cy={228} r={5} className="sec-dot-lime" />
      </g>

      {/* ---------- outbound: clean, verified traffic ---------- */}
      <g>
        <path d="M 880 372 C 986 424, 1064 452, 1176 470" className="sec-route" />
        <path d="M 872 396 C 980 452, 1058 486, 1168 508" className="sec-route-live" />
        <path d="M 872 396 C 980 452, 1058 486, 1168 508" className="sec-flow" />
        <Cube x={1046} y={442} a={8} tone="green" />
        <Cube x={1120} y={476} a={7} />
        <Cube x={1180} y={456} a={9} tone="green" />
        <circle cx={982} cy={420} r={4} className="sec-dot-jade" />
        <circle cx={1152} cy={500} r={4} className="sec-dot-lime" />
      </g>

      {/* ---------- peripheral routing and telemetry ---------- */}
      <g>
        <path d="M 250 330 C 300 240, 430 176, 560 160" className="sec-route" />
        <path d="M 940 214 C 1040 240, 1092 300, 1104 372" className="sec-route" />
        <path d="M 322 470 C 386 556, 520 612, 660 616" className="sec-route" />
        <circle cx={560} cy={160} r={4} className="sec-dot-jade" />
        <circle cx={1104} cy={372} r={4} className="sec-dot-jade" />
        <circle cx={322} cy={470} r={3.5} className="sec-dot-grey" />
      </g>

      {/* ---------- side asset stacks (logs / archives) ---------- */}
      <g>
        {[
          [906, 300], [934, 316], [962, 332],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <Box x={x} y={y} a={13} h={16} top="#3E8A5C" left="#0E3A26" right="#1C5136" />
            <g stroke="#0B2C1C" strokeWidth={1} opacity={0.8}>
              <line x1={x + 2} y1={y + 10} x2={x + 10} y2={y + 6} />
              <line x1={x + 2} y1={y + 15} x2={x + 10} y2={y + 11} />
            </g>
          </g>
        ))}
        {[
          [352, 386], [380, 402],
        ].map(([x, y]) => (
          <Box key={`${x}-${y}`} x={x} y={y} a={12} h={15} top="#6B7280" left="#1F2937" right="#374151" />
        ))}
      </g>

      {/* ---------- scattered field detail ---------- */}
      <g>
        <Cube x={430} y={150} a={7} />
        <Cube x={806} y={176} a={8} tone="green" />
        <Cube x={252} y={548} a={7} tone="green" />
        <Cube x={868} y={584} a={8} />
        <Cube x={1006} y={244} a={7} />
        <circle cx={468} cy={128} r={3} className="sec-dot-grey" />
        <circle cx={844} cy={148} r={3} className="sec-dot-lime" />
        <circle cx={214} cy={396} r={3} className="sec-dot-grey" />
        <circle cx={926} cy={604} r={3} className="sec-dot-jade" />
        <circle cx={556} cy={648} r={3} className="sec-dot-grey" />
        <circle cx={1042} cy={330} r={3} className="sec-dot-lime" />
      </g>
    </svg>
  );
}
