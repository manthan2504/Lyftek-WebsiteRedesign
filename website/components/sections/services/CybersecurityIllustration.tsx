import type { SVGProps } from "react";
import { cn } from "@/utils/cn";

/**
 * Cybersecurity & ISMS hero illustration -- a defence-in-depth diagram.
 *
 * REBUILT 2026-08-10 (third version) to an agreed plan, after the second
 * version was rejected for exactly the right reasons: elements floated off
 * their surfaces, the rings read as a racetrack rather than fortifications,
 * several paths and cubes existed for decoration only, and nothing in it
 * named a security concept. All of that traced to one mistake -- the scene
 * was positioned by reading coordinates off a screenshot instead of being
 * projected from a model.
 *
 * ============================ 1. PROJECTION ============================
 *
 * The whole scene is authored in PLAN space -- `x`/`y` across the ground,
 * `z` upward -- and every element goes through `project()`. Nothing in the
 * render below contains a hand-picked screen coordinate.
 *
 * This is what fixes the floating. "A gatehouse on the perimeter wall" is
 * written as its position along that wall at that wall's height; it lands
 * on the wall BY CONSTRUCTION, not because the numbers were nudged until it
 * looked right. The same applies to sensor towers, servers on the plinth,
 * and the endpoints of both traffic paths.
 *
 * The rings use an SVG `matrix()` that is the exact linear part of
 * `project()`, so stroked plan-space rounded rects land in the same space
 * as everything else. Height is a screen-space `translate(0,-h)`, which is
 * precisely what `project()` does with `z` -- the two cannot drift apart.
 *
 * ========================== 2. WHAT IT DEPICTS =========================
 *
 * Four concentric layers, each with one security job and one visual
 * signature, read from outside in:
 *
 *   L1 Perimeter   firewall / IPS      tallest, heaviest, unbroken wall
 *   L2 Detection   monitoring / IDS    lower wall carrying sensor towers
 *   L3 Identity    access control      gatehouses only -- a layer you pass
 *                                      THROUGH, not over
 *   L4 Core        protected assets    servers on a raised plinth
 *
 * One narrative runs across it: a threat arrives from the upper left and
 * STOPS at L1 -- the fragments break up against the wall and a blocked
 * marker sits where they land. Legitimate traffic leaves through the
 * verified gate on the far side and continues out clean.
 *
 * ======================= 3. WHY EACH ELEMENT EXISTS ====================
 *
 * Every element is one of: a wall, a gatehouse on a wall, a sensor tower on
 * a wall, a server on the plinth, or one of the two traffic paths. The
 * previous version's free-floating cubes, scattered dots and curves that
 * connected nothing are gone -- 04_VISUAL_LANGUAGE.md names "random
 * decorative lines" and "floating decorative objects" as things to avoid,
 * and they were also most of what made it read as unserious.
 *
 * Gatehouses STRADDLE their wall rather than filling a gap in it. That is
 * both semantically right (a controlled opening is a structure, not an
 * absence) and technically robust: it needs no dash-phase alignment between
 * a stroked ring and a solid, which is the kind of coupling that silently
 * breaks the moment a radius changes.
 *
 * ============================== 4. COLOUR ==============================
 *
 * Deliberately restrained, per 08_COLOR_SYSTEM.md. Greys carry all the
 * infrastructure. Jade (`--accent-hover`) marks anything active. The lime
 * `--accent` is used for EXACTLY ONE thing -- the verified egress gate --
 * so the eye lands on the one state that matters. A single desaturated red
 * marks the blocked threat. Nothing else is coloured.
 */

// ----------------------------------------------------------------------
// Projection
// ----------------------------------------------------------------------

/*
 * Origin and canvas are DERIVED from the geometry, not guessed. For a
 * rounded rect of half-extent R and corner radius r, the extreme of (x - y)
 * -- which sets the projected half-width -- occurs on the corner arc at
 * 2(R - r) + r*sqrt(2). With the perimeter ring at R=314 (300 plus half its
 * band) and r=96 that is 572 plan units, i.e. 572 * K = 495px each side, so
 * the ring alone needs ~990px. The first attempt used a 940px canvas and
 * clipped it on both sides.
 */
const K = 0.866; // cos(30deg) -- standard 2:1 isometric
const OX = 520; // +5 over the computed minimum: a clipping check showed the
const OY = 346; // perimeter ring overflowing the left edge by 2.6px.

/** Plan (x, y, z) -> screen [x, y]. The single source of truth for position. */
function project(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y) * K, OY + (x + y) * 0.5 - z];
}

/** SVG matrix identical to project()'s linear part, for plan-space rects. */
const ISO = `matrix(${K},0.5,${-K},0.5,${OX},${OY})`;

const pt = (x: number, y: number, z = 0) => project(x, y, z).join(",");
const polyline = (points: [number, number, number?][]) =>
  points.map(([x, y, z]) => project(x, y, z ?? 0).join(",")).join(" ");

// ----------------------------------------------------------------------
// Layer model -- plan-space geometry. Every solid references these, so a
// change to a radius or a wall height moves whatever sits on it too.
// ----------------------------------------------------------------------

const L1 = { r: 300, corner: 96, band: 28, h: 36 }; // perimeter / firewall
const L2 = { r: 212, corner: 68, band: 22, h: 26 }; // detection / IDS
const L3 = { r: 138, corner: 44, band: 14, h: 12 }; // identity / access
const CORE = { r: 84, corner: 22, h: 16 }; // protected plinth

const C = {
  ground: "#0D1013",
  wallSide: "#123124",
  wallTop: "#275B44",
  wallSideAlt: "#16232C",
  wallTopAlt: "#33465A",
  kerbSide: "#14202A",
  kerbTop: "#2B3E4E",
  plinthSide: "#151A20",
  plinthTop: "#1E252D",
  steelTop: "#D1D5DB",
  steelRight: "#9CA3AF",
  steelLeft: "#6B7280",
  slateTop: "#8B94A0",
  slateRight: "#5C6672",
  slateLeft: "#3F4854",
  jade: "#0F9C7F",
  jadeDim: "#0B6E5A",
  lime: "#CDFC8A",
  limeDim: "#7FA347",
  threat: "#8C5A5A",
  line: "#2A3038",
};

// ----------------------------------------------------------------------
// Solids
// ----------------------------------------------------------------------

/**
 * An axis-aligned box in plan space, projected. `z` is the BASE height, so
 * placing something on a wall is `z={L1.h}` -- the surface it stands on.
 * Only the two viewer-facing side faces are drawn (+x and +y), which is all
 * that is visible in this projection.
 */
function IsoBox({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  top,
  right,
  left,
}: {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  top: string;
  right: string;
  left: string;
}) {
  const hw = w / 2;
  const hd = d / 2;
  const zt = z + h;
  return (
    <g>
      <polygon
        fill={top}
        points={[
          pt(x - hw, y - hd, zt),
          pt(x + hw, y - hd, zt),
          pt(x + hw, y + hd, zt),
          pt(x - hw, y + hd, zt),
        ].join(" ")}
      />
      <polygon
        fill={right}
        points={[
          pt(x + hw, y - hd, zt),
          pt(x + hw, y + hd, zt),
          pt(x + hw, y + hd, z),
          pt(x + hw, y - hd, z),
        ].join(" ")}
      />
      <polygon
        fill={left}
        points={[
          pt(x - hw, y + hd, zt),
          pt(x + hw, y + hd, zt),
          pt(x + hw, y + hd, z),
          pt(x - hw, y + hd, z),
        ].join(" ")}
      />
    </g>
  );
}

/**
 * One fortified ring: a stroked plan-space rounded rect drawn twice -- once
 * at ground level as the shadowed side, once lifted by `h` as the lit top
 * face. No centreline stroke: that is what made the previous version read
 * as a road rather than a wall.
 */
function Wall({
  r,
  corner,
  band,
  h,
  side,
  top,
  coursing = true,
}: {
  r: number;
  corner: number;
  band: number;
  h: number;
  side: string;
  top: string;
  coursing?: boolean;
}) {
  const rect = { x: -r, y: -r, width: r * 2, height: r * 2, rx: corner };
  return (
    <>
      <g transform={ISO}>
        <rect {...rect} fill="none" stroke={side} strokeWidth={band} />
      </g>
      <g transform={`translate(0,${-h})`}>
        <g transform={ISO}>
          <rect {...rect} fill="none" stroke={top} strokeWidth={band} />
          {coursing && (
            <rect
              {...rect}
              fill="none"
              stroke={side}
              strokeWidth={band}
              strokeDasharray="2 26"
              opacity={0.55}
            />
          )}
        </g>
      </g>
    </>
  );
}

/**
 * Gatehouse straddling a wall -- a controlled opening, not a gap.
 *
 * `w` is measured ACROSS the wall and must exceed that wall's band so the
 * structure visibly spans it; `d` runs ALONG the wall. All gatehouses here
 * sit on east/west runs (x = +/-r), where x is across and y is along.
 *
 * Sized relative to the wall it stands on rather than fixed: the first pass
 * used one 46x58x30 box for every gatehouse, which against the 28-wide
 * perimeter band and the 14-wide identity kerb read as slabs dropped on top
 * rather than structures built into the wall.
 */
function Gatehouse({
  x,
  y,
  z,
  band,
  verified = false,
}: {
  x: number;
  y: number;
  z: number;
  band: number;
  verified?: boolean;
}) {
  const w = band + 10; // overhangs the wall slightly on each face
  const d = band + 8;
  const h = Math.round(band * 0.85);
  const [cx, cy] = project(x, y, z + h);
  return (
    <g>
      <IsoBox
        x={x}
        y={y}
        z={z}
        w={w}
        d={d}
        h={h}
        top={verified ? C.lime : C.slateTop}
        right={verified ? C.limeDim : C.slateRight}
        left={verified ? "#5C7734" : C.slateLeft}
      />
      {verified && (
        <path
          d={`M ${cx - 7},${cy + 1} L ${cx - 2},${cy + 6} L ${cx + 7},${cy - 5}`}
          fill="none"
          stroke="#16301A"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

/** Monitoring sensor standing on the detection wall. */
function Sensor({ x, y, z }: { x: number; y: number; z: number }) {
  const [cx, cy] = project(x, y, z + 30);
  return (
    <g>
      <IsoBox x={x} y={y} z={z} w={16} d={16} h={26} top={C.slateTop} right={C.slateRight} left={C.slateLeft} />
      <circle cx={cx} cy={cy - 3} r={3.4} fill={C.jade} />
      <circle cx={cx} cy={cy - 3} r={7} fill="none" stroke={C.jade} strokeWidth={1} opacity={0.45} />
    </g>
  );
}

export function CybersecurityIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    // `className` merged, not overwritten -- setting it before `{...props}`
    // let the consumer's class replace `sec-illus` and silently killed every
    // scoped rule.
    <svg
      viewBox="0 0 1140 660"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("sec-illus", className)}
      {...props}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.sec-illus .sec-flow { stroke-dasharray: 6 14; animation: sec-flow 3.4s linear infinite; }
@keyframes sec-flow { to { stroke-dashoffset: -40; } }
@media (prefers-reduced-motion: reduce) { .sec-illus .sec-flow { animation: none; } }
`,
        }}
      />

      {/* ---------- L1 perimeter: firewall / IPS ---------- */}
      <Wall r={L1.r} corner={L1.corner} band={L1.band} h={L1.h} side={C.wallSide} top={C.wallTop} />

      {/* ---------- L2 detection: monitoring / IDS ---------- */}
      <Wall r={L2.r} corner={L2.corner} band={L2.band} h={L2.h} side={C.wallSideAlt} top={C.wallTopAlt} />

      {/* ---------- L3 identity: low kerb the gatehouses stand on ---------- */}
      <Wall r={L3.r} corner={L3.corner} band={L3.band} h={L3.h} side={C.kerbSide} top={C.kerbTop} coursing={false} />

      {/* ---------- L4 core plinth ---------- */}
      <g transform={ISO}>
        <rect x={-CORE.r} y={-CORE.r} width={CORE.r * 2} height={CORE.r * 2} rx={CORE.corner} fill={C.plinthSide} />
      </g>
      <g transform={`translate(0,${-CORE.h})`}>
        <g transform={ISO}>
          <rect x={-CORE.r} y={-CORE.r} width={CORE.r * 2} height={CORE.r * 2} rx={CORE.corner} fill={C.plinthTop} stroke={C.line} strokeWidth={1.5} />
        </g>
      </g>

      {/* ---------- protected assets, standing on the plinth ---------- */}
      {/* Drawn back (low x+y) to front so overlaps resolve without z-index. */}
      <IsoBox x={-26} y={-30} z={CORE.h} w={30} d={30} h={30} top={C.slateTop} right={C.slateRight} left={C.slateLeft} />
      <IsoBox x={16} y={-22} z={CORE.h} w={32} d={32} h={66} top={C.steelTop} right={C.steelRight} left={C.steelLeft} />
      <IsoBox x={-30} y={22} z={CORE.h} w={40} d={32} h={34} top={C.steelTop} right={C.steelRight} left={C.steelLeft} />
      <IsoBox x={26} y={32} z={CORE.h} w={30} d={28} h={22} top={C.slateTop} right={C.slateRight} left={C.slateLeft} />

      {/* ---------- L3 identity gatehouses (on the kerb) ---------- */}
      <Gatehouse x={-L3.r} y={0} z={L3.h} band={L3.band} />
      <Gatehouse x={L3.r} y={0} z={L3.h} band={L3.band} />

      {/* ---------- L2 sensors (on the detection wall) ---------- */}
      <Sensor x={-L2.r} y={30} z={L2.h} />
      <Sensor x={-40} y={-L2.r} z={L2.h} />
      <Sensor x={L2.r} y={70} z={L2.h} />

      {/* ---------- L1 gatehouses (on the perimeter wall) ---------- */}
      {/* Ingress on the threat-facing side; verified egress opposite it. */}
      <Gatehouse x={-L1.r} y={96} z={L1.h} band={L1.band} />
      <Gatehouse x={L1.r} y={-70} z={L1.h} band={L1.band} verified />

      {/* ---------- inbound threat, stopped at the perimeter ---------- */}
      <g>
        {/*
          Approach shortened from plan x=-620 to -460: at -620 the path
          projected to roughly 440px above the origin and ran off the top of
          the canvas. Both traffic paths now terminate inside the frame.
        */}
        <polyline
          points={polyline([
            [-460, -120, L1.h],
            [-400, -100, L1.h],
            [-350, -74, L1.h],
            [-300, -46, L1.h],
          ])}
          fill="none"
          stroke={C.threat}
          strokeWidth={1.6}
          strokeDasharray="4 5"
        />
        {/* fragments breaking up along the approach */}
        {[
          [-440, -113],
          [-400, -100],
          [-364, -82],
          [-330, -62],
        ].map(([fx, fy]) => {
          const [sx, sy] = project(fx, fy, L1.h + 10);
          return (
            <polygon
              key={`${fx}-${fy}`}
              points={`${sx},${sy} ${sx + 9},${sy - 4} ${sx + 12},${sy + 4} ${sx + 3},${sy + 8}`}
              fill={C.threat}
              opacity={0.9}
            />
          );
        })}
        {/* blocked marker, sitting on the wall it was stopped by */}
        {(() => {
          const [bx, by] = project(-L1.r, -46, L1.h + 6);
          return (
            <g>
              <circle cx={bx} cy={by} r={7} fill="none" stroke={C.threat} strokeWidth={2} />
              <line x1={bx - 4} y1={by - 4} x2={bx + 4} y2={by + 4} stroke={C.threat} strokeWidth={2} strokeLinecap="round" />
              <line x1={bx + 4} y1={by - 4} x2={bx - 4} y2={by + 4} stroke={C.threat} strokeWidth={2} strokeLinecap="round" />
            </g>
          );
        })()}
      </g>

      {/* ---------- verified egress ---------- */}
      <g>
        <polyline
          points={polyline([
            [L1.r, -70, L1.h],
            [380, -100, L1.h],
            [460, -128, L1.h],
            [540, -152, L1.h],
          ])}
          fill="none"
          stroke={C.jadeDim}
          strokeWidth={1.6}
        />
        <polyline
          points={polyline([
            [L1.r, -70, L1.h],
            [380, -100, L1.h],
            [460, -128, L1.h],
            [540, -152, L1.h],
          ])}
          fill="none"
          stroke={C.lime}
          strokeWidth={1.8}
          className="sec-flow"
        />
      </g>
    </svg>
  );
}
