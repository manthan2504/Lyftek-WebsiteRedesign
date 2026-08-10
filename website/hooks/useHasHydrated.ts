"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns `false` on the server AND during the client's hydration render,
 * then `true` for every render after hydration completes.
 *
 * WHY THIS EXISTS: some of our UI legitimately depends on a value that only
 * exists in the browser -- specifically `prefers-reduced-motion`, which
 * framer-motion reports as `null` server-side. Any component that lets such
 * a value decide what it RENDERS produces markup the server can't match,
 * and React responds by throwing a hydration error and regenerating the
 * subtree. This hook is the escape hatch: gate the browser-only behaviour
 * behind it, and the server and the hydration render always agree, because
 * both take the `false` branch. The real value takes effect one render
 * later, which the user never perceives.
 *
 * WHY `useSyncExternalStore` RATHER THAN THE USUAL
 * `useState(false)` + `useEffect(() => setMounted(true), [])`: that idiom
 * trips this project's ESLint config (`react-hooks/set-state-in-effect`,
 * React 19's cascading-render guard) -- the same rule the Navbar's mobile
 * menu had to be rewritten around in an earlier session. `useSyncExternalStore`
 * is React's own supported answer for "server and client disagree about a
 * value": it renders `getServerSnapshot` during SSR and hydration, then
 * switches to `getSnapshot` afterwards, with no effect and no setState.
 *
 * The three arguments are module-level constants, not inline closures, so
 * the store identity is stable across renders and React never resubscribes.
 */

// The value never changes after mount, so there is nothing to subscribe to.
// Returning a no-op unsubscribe satisfies the store contract.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useHasHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
