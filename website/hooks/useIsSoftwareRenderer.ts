"use client";

import { useSyncExternalStore } from "react";

/**
 * True when the browser has no real GPU behind WebGL and is rasterizing on
 * the CPU instead (SwiftShader, llvmpipe, Microsoft Basic Render Driver).
 * Returns `false` on the server and during hydration, like every other
 * browser-only signal on this site.
 *
 * WHY (measured, 2026-08-10): the Hero's `Threads` background is a
 * full-screen fragment shader that loops per pixel. On a GPU that is
 * nothing. On a CPU rasterizer it is catastrophic -- measured on this
 * project's own GPU-less VM (QEMU QXL adapter, 0 VRAM, 4 cores):
 *
 *   production build, /about  (no WebGL) -> 60.0 fps   16.7ms/frame
 *   production build, /       (Threads)  ->  2.2 fps  457.1ms/frame
 *
 * Same build, same machine: the shader alone costs ~440ms per frame. That
 * is not a code defect -- the shader is correct and runs fine on hardware --
 * it is simply the wrong thing to ask a CPU to do sixty times a second.
 *
 * This detects the CAPABILITY, not a preference. It deliberately does NOT
 * reintroduce the `prefers-reduced-motion` check that the client removed on
 * 2026-08-10 (see Hero.tsx and 13_MOTION_AND_ANIMATION.md): visitors with a
 * working GPU still get the continuous animation regardless of their motion
 * setting, exactly as decided. Visitors whose device physically cannot draw
 * it at speed get a single static frame of the same artwork instead, via
 * `Threads`' `animate` prop -- which is strictly better for them than a
 * 2fps hero, and invisible to everyone else.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect` for the same
 * reason `useHasHydrated` uses it: this project's ESLint config bans
 * setState-in-effect (`react-hooks/set-state-in-effect`). The detection
 * result is memoised at module scope so `getSnapshot` returns a stable
 * value -- returning a fresh result each call would make
 * `useSyncExternalStore` re-render forever.
 */

let cached: boolean | null = null;

function detect(): boolean {
  if (cached !== null) return cached;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;

    if (!gl) {
      // No WebGL at all -- Threads cannot render anyway, so treat it the
      // same as software and let the consumer skip the animation.
      cached = true;
      return cached;
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : "";

    // Known CPU rasterizers. Chromium reports SwiftShader through ANGLE
    // (as on this project's VM: "ANGLE (Google, Vulkan 1.3.0 (SwiftShader
    // Device (Subzero)), SwiftShader driver)"); Mesa's software path
    // reports llvmpipe; Windows without a display driver reports the Basic
    // Render Driver. An empty `renderer` (extension unavailable, some
    // privacy-hardened browsers) is treated as hardware -- assuming the
    // worst there would needlessly freeze the hero for people who can
    // render it perfectly well.
    cached = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(
      renderer,
    );

    // Release the probe context immediately -- browsers cap simultaneous
    // WebGL contexts, and Threads needs one of its own.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    // Detection must never be the thing that breaks the page.
    cached = false;
  }

  return cached;
}

const subscribe = () => () => {};
const getSnapshot = () => detect();
const getServerSnapshot = () => false;

export function useIsSoftwareRenderer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
