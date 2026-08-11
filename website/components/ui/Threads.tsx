"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";

/**
 * Purpose: animated WebGL background of flowing, noise-driven thread lines
 * (React Bits' "Threads" component, github.com/DavidHDev/react-bits --
 * 14_DESIGN_AND_DEVELOPMENT_RESOURCES.md lists React Bits as a preferred
 * library). Sourced from the upstream repo's `ts-tailwind` variant and
 * adapted to this project's conventions (docblock, "use client" placement,
 * no other logic changes -- the shader/render loop is verbatim upstream,
 * not reinvented).
 *
 * WHY THIS EXISTS IN THE HERO: explicit client direction, given directly
 * ("Apply this, remove static illustration"), REVERSING the hero's earlier
 * "complete staticcccc... nothing moving" decision from earlier in this
 * engagement -- flagged plainly and confirmed before implementing, not
 * silently overridden. Replaces both the static grid-texture background AND
 * the static brand-mark illustration (HeroBackdrop.tsx, now removed) that
 * previously lived in Hero.tsx.
 *
 * REDUCED MOTION: this component has no built-in `prefers-reduced-motion`
 * handling (verified against upstream source -- it only gates on
 * IntersectionObserver visibility and `document.hidden`, both perf
 * optimizations, not accessibility ones). Hero.tsx does NOT mount this
 * component at all when `useReducedMotion()` is true -- see that file --
 * rather than patching motion-sensitivity into a vendored component, to
 * keep this file a clean, easily-updatable copy of the upstream source.
 *
 * COLOR: pass brand colors as normalized [r, g, b] floats (0-1), not hex --
 * this is a WebGL shader uniform, not CSS. Hero.tsx passes the jade
 * `--accent-hover` token (#0f9c7f -> [0.0588, 0.6118, 0.498]), the same
 * color introduced for the button hover state in this same session, so the
 * background and the interactive accent share one secondary color rather
 * than introducing a third.
 */
interface ThreadsProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
  /**
   * When false, the wave lines are drawn ONCE and the requestAnimationFrame
   * loop is never started -- a still image of the same artwork, at zero
   * ongoing CPU/GPU cost.
   *
   * Added 2026-08-10 for `prefers-reduced-motion`. Hero.tsx previously
   * skipped mounting this component altogether for those visitors, which
   * over-applied the rule: `prefers-reduced-motion` is about MOVEMENT, not
   * imagery, and dropping the whole background left reduced-motion users
   * looking at a flat black panel while everyone else got the brand's
   * signature visual. Freezing the animation removes the motion and keeps
   * the design. See Hero.tsx's own note for the fuller reasoning.
   */
  animate?: boolean;
}

/**
 * `iTime` value (in the same seconds unit the render loop feeds the shader)
 * used for the single static frame when `animate` is false. NOT zero -- at
 * t=0 the per-line phase offsets have not yet separated, so the lines stack
 * into a flat, nearly straight band that reads as a rendering fault rather
 * than as the intended wave field. This value was chosen by rendering
 * candidates and comparing them against a frame of the live animation.
 */
const STATIC_FRAME_TIME = 3.2;

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * RESPONSIVE BANDS (2026-08-11).
 *
 * THE PROBLEM, measured rather than guessed: this shader's wavelength is
 * NORMALISED (the Perlin input is `st.x`, 0..1, times a fixed 2.5/3.5, so it
 * always draws ~2.5 crests across the frame however narrow the frame gets),
 * while its amplitude is a fraction of canvas HEIGHT. So the single number
 * that governs how the wave READS is steepness = amplitude_px / wavelength_px,
 * which reduces to ~0.6875 * height/width. On the approved 1374x836 desktop
 * canvas that is 0.42. On a 286x656 phone canvas it is 1.58 -- the same
 * gesture drawn 3.8x steeper, which is why it stops looking like a wave and
 * turns into a crosshatch mesh sitting on the copy.
 *
 * KEYED ON ASPECT RATIO, NOT VIEWPORT WIDTH. That is the important part. A
 * landscape phone (667x375 -> canvas aspect 1.42) already renders correctly
 * and measures 1.15x desktop steepness; banding purely on viewport width
 * would "fix" it into something worse. Everything below is driven by the
 * canvas's own aspect, so landscape phones and landscape tablets fall out at
 * ~desktop values automatically.
 *
 * WHY GLSL LITERALS AND NOT UNIFORMS -- this was tried and measured, do not
 * "simplify" it back:
 *  - `u_line_count` is a `for` bound; GLSL ES 1.0 requires a constant
 *    expression there, and the `if (i >= uCount) break;` workaround defeats
 *    the loop unrolling that the GPU saving actually comes from.
 *  - Making the widths uniforms changed 2-7 pixels per frame by 1/255 at
 *    desktop sizes (constant folding replaced by a runtime divide). Harmless
 *    to look at, but it breaks a hard byte-identity requirement for no gain.
 * Baked as literals, `bandFor()` returns DESKTOP_BAND above 1024px and the
 * generated source string is then CHARACTER-IDENTICAL to the pre-change
 * shader -- so the frozen desktop/laptop rendering is identical by
 * construction.
 */
type ThreadsBand = {
  lineCount: number;
  lineWidth: string;
  lineBlur: string;
  freqA: string;
  freqB: string;
  centerY: string;
  amplitudeScale: number;
};

/** Verbatim pre-2026-08-11 values. Emits the original shader source exactly. */
const DESKTOP_BAND: ThreadsBand = {
  lineCount: 40,
  lineWidth: "10.0",
  lineBlur: "10.0",
  freqA: "2.5",
  freqB: "3.5",
  centerY: "0.5",
  amplitudeScale: 1,
};

/**
 * `aspect` is the CANVAS's width/height, not the viewport's.
 *
 * Quantised to 0.05 so the compiled-program cache stays small (a resize drag
 * would otherwise recompile every tick). Values are chosen so that a desktop
 * aspect of ~1.64 lands exactly on DESKTOP_BAND's numbers, making the ramp
 * continuous across the freeze boundary rather than a visible step.
 */
function bandFor(viewportWidth: number, aspect: number): ThreadsBand {
  // Hard gate: the client's laptop/desktop bands are frozen. Never compute.
  if (viewportWidth >= 1025) return DESKTOP_BAND;

  const q = Math.round(Math.min(Math.max(aspect, 0.35), 1.7) / 0.05) * 0.05;

  // Restores desktop steepness: freq ~= 0.608 * aspect makes wavelength grow
  // as the canvas narrows, so amplitude_px / wavelength_px stays ~0.42.
  const freq = Math.min(Math.max(0.608 * q, 0.25), 1);
  // 0 for anything landscape-ish (leave it alone), ramping to 1 as the canvas
  // goes strongly portrait. Drives the "quieten it" levers only.
  const p = Math.min(Math.max((1.2 - q) / 0.8, 0), 1);

  return {
    lineCount: Math.round(40 - 16 * p), // 40 -> 24: fewer strands to mat together (and ~38% less fragment work)
    lineWidth: (10 - 3 * p).toFixed(2), // thinner as the band shrinks, so thickness/band-span stays constant
    lineBlur: (10 - 3 * p).toFixed(2),
    freqA: (2.5 * freq).toFixed(4),
    freqB: (3.5 * freq).toFixed(4),
    // GL uv has y=0 at the BOTTOM, so a smaller value sinks the band. On a
    // portrait canvas the text block is vertically centred and so is the
    // wave, which guarantees they collide -- measured as a WCAG AA failure
    // on the body paragraph (2.3:1 where the crest crosses a glyph). This
    // drops the band into the empty space beneath the CTA instead.
    centerY: (0.5 - 0.22 * p).toFixed(4),
    amplitudeScale: 1 - 0.35 * p, // shrinks the band away from the body copy
  };
}

const buildFragmentShader = (band: ThreadsBand) => `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = ${band.lineCount};
const float u_line_width = ${band.lineWidth}; // was 7.0 -- client asked for slightly thicker wavy lines
const float u_line_blur = ${band.lineBlur};

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * ${band.freqA}),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * ${band.freqB}) / 1.5,
        st.x * 0.3
    );

    float y = ${band.centerY} + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export function Threads({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  animate = true,
  ...rest
}: ThreadsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  const propsRef = useRef({
    color,
    amplitude,
    distance,
    enableMouseInteraction,
    animate,
  });
  // Writing to a ref directly during render trips React 19's
  // react-hooks/refs lint rule (a real rule, not upstream's original
  // pattern -- the vendored source did this inline). useLayoutEffect keeps
  // the update synchronous, before the next paint, so the render loop below
  // never reads a stale value for more than one frame -- unlike a plain
  // useEffect, which would still be correct but adds a strictly later timing
  // guarantee than this needs.
  useLayoutEffect(() => {
    propsRef.current = {
      color,
      amplitude,
      distance,
      enableMouseInteraction,
      animate,
    };
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    /*
     * ONE uniform object, shared by every band's program. OGL only reads
     * `.value` off these at draw time, so swapping which program the mesh
     * points at carries the live uniform state across untouched -- no
     * re-syncing and no frame of stale values at a breakpoint.
     */
    const uniforms = {
      iTime: { value: 0 },
      iResolution: {
        value: new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ),
      },
      uColor: { value: new Color(...propsRef.current.color) },
      uAmplitude: { value: propsRef.current.amplitude },
      uDistance: { value: propsRef.current.distance },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
    };

    /*
     * Compiled lazily and cached per band, keyed on the generated source, so
     * crossing an aspect step costs one compile the first time and nothing
     * after. The WebGL CONTEXT is never recreated -- that stays mount-once.
     */
    const programCache = new Map<string, Program>();
    function programFor(b: ThreadsBand): Program {
      const src = buildFragmentShader(b);
      let p = programCache.get(src);
      if (!p) {
        p = new Program(gl, { vertex: vertexShader, fragment: src, uniforms });
        programCache.set(src, p);
      }
      return p;
    }

    let band = DESKTOP_BAND;
    const mesh = new Mesh(gl, { geometry, program: programFor(band) });

    // Assigned further down, only on the non-animating path. Declared here
    // because `resize` has to be able to call it: with no render loop
    // running, nothing else would ever redraw the canvas, so a resized
    // window would keep showing a stale frame at the wrong scale.
    let staticRender: (() => void) | null = null;

    const MAX_RENDER_DIM = 1920;
    function resize() {
      const { clientWidth, clientHeight } = container;
      const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
      const longestSide = Math.max(clientWidth, clientHeight) * baseDpr;
      const dpr =
        longestSide > MAX_RENDER_DIM
          ? (baseDpr * MAX_RENDER_DIM) / longestSide
          : baseDpr;
      renderer.dpr = dpr;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.iResolution.value.r = gl.canvas.width;
      uniforms.iResolution.value.g = gl.canvas.height;
      uniforms.iResolution.value.b = gl.canvas.width / gl.canvas.height;

      /*
       * The ONLY place the responsive band is decided, and it runs inside the
       * mount effect -- i.e. client-only, never during render. That is why
       * this needs no hydration gate of its own and why Hero.tsx is
       * untouched: none of this is markup, so it cannot disagree with the
       * server. Aspect is taken from the CSS box, not the backing store, so
       * the DPR clamp above doesn't skew it.
       */
      const nextBand = bandFor(
        window.innerWidth,
        clientHeight > 0 ? clientWidth / clientHeight : 1.64,
      );
      if (nextBand !== band) {
        band = nextBand;
        mesh.program = programFor(band);
      }

      staticRender?.();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    resize();

    const currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    function handleMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }
    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    // Draw exactly one frame at shader-time `time` (seconds). Split out of
    // `update` below so the static path can reuse it without scheduling a
    // single requestAnimationFrame callback.
    function renderFrame(time: number, trackMouse: boolean) {
      const { color, amplitude, distance } = propsRef.current;

      uniforms.uColor.value.set(...color);
      // The prop stays the artistic intent (1.1); the band supplies the
      // viewport correction. Applied here because this line already runs
      // every frame and would otherwise clobber a value set in resize().
      uniforms.uAmplitude.value = amplitude * band.amplitudeScale;
      uniforms.uDistance.value = distance;

      if (trackMouse) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        uniforms.uMouse.value[0] = currentMouse[0];
        uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        uniforms.uMouse.value[0] = 0.5;
        uniforms.uMouse.value[1] = 0.5;
      }
      uniforms.iTime.value = time;

      renderer.render({ scene: mesh });
    }

    function update(t: number) {
      animationFrameId.current = requestAnimationFrame(update);
      if (!isVisible || document.hidden) return;
      renderFrame(t * 0.001, propsRef.current.enableMouseInteraction);
    }

    // Read through propsRef, not the closure variable, matching how this
    // mount-once effect already reads every other prop -- keeps the `[]`
    // dependency list honest.
    if (propsRef.current.animate) {
      animationFrameId.current = requestAnimationFrame(update);
    } else {
      // Reduced-motion path: one frame, no loop, no mouse tracking (mouse
      // response is motion too). `staticRender` is also wired into `resize`
      // above -- without that, resizing the window would leave the canvas
      // showing a stale, wrongly-scaled frame, since nothing would ever
      // redraw it.
      staticRender = () => renderFrame(STATIC_FRAME_TIME, false);
      staticRender();
    }

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Mount-once effect, intentionally -- live prop updates flow through
    // propsRef (see useLayoutEffect above) instead of re-running the whole
    // WebGL setup/teardown on every prop change.
  }, []);

  return <div ref={containerRef} className="h-full w-full" {...rest} />;
}
