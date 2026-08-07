"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";

/**
 * Purpose: a stack of cards that continuously swaps its front card to the
 * back on a timer, with a 3D drop/promote/return choreography (skew +
 * perspective + z-depth). Sourced from React Bits
 * (reactbits.dev/components/card-swap, github.com/DavidHDev/react-bits --
 * 14_DESIGN_AND_DEVELOPMENT_RESOURCES.md's preferred UI libraries list),
 * vendored in as project source and adapted only cosmetically (docblock,
 * "use client" placement, import formatting) -- the GSAP timeline logic
 * itself is verbatim upstream, not reinvented.
 *
 * WHY GSAP HERE (not Framer Motion, the site's primary animation library
 * everywhere else): 14_DESIGN_AND_DEVELOPMENT_RESOURCES.md's own guidance is
 * "use GSAP only when Framer Motion cannot reasonably solve the problem."
 * This component's choreography -- an interval-driven, indefinitely-
 * repeating sequence where each swap promotes N-1 other cards to new
 * z-depth slots while the front card drops and re-enters at the back, with
 * per-card staggered timing on a manually managed order array -- is
 * genuinely awkward to express as Framer Motion variants (which are built
 * around a finite set of named states, not an open-ended rotating queue).
 * GSAP's timeline/label API is the right tool for this specific shape of
 * animation.
 *
 * Client component (`"use client"`) -- uses refs, `useEffect`, and directly
 * mutates DOM nodes via GSAP, none of which can run in a Server Component.
 *
 * Usage: `<CardSwap>` wraps 2+ `<Card>` children (exported below). Current
 * homepage consumer (components/sections/About.tsx) renders it via
 * `RequirementCard` (components/ui/RequirementCard.tsx) content inside each
 * `<Card>` -- see that file's docblock for the content itself.
 */
export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  /**
   * Which corner of the nearest positioned ancestor the stack anchors to
   * and grows away from. `"bottom-right"` is upstream React Bits' own
   * default/only behavior. `"top-left"` mirrors the same offsets to the
   * opposite corner -- added for a "cropped corner peek" treatment (see
   * components/sections/About.tsx), where the stack is deliberately
   * anchored inside a small `overflow-hidden` box so most of each card
   * spills past the box edge and gets clipped, leaving only that corner
   * visible. Purely a CSS positioning change -- the GSAP slot math
   * (`makeSlot`, x/y/z offsets) is identical either way.
   */
  anchor?: "bottom-right" | "top-left";
  /**
   * How far (px) the front card drops before re-entering at the back of
   * the stack during a swap. Upstream hardcodes this at 500 -- fine for an
   * unbounded/uncontained stack, but too far for a consumer that wraps the
   * stack in a fixed-size visible box (see components/sections/About.tsx):
   * a 500px drop guarantees the animating card periodically exits any
   * reasonably-sized box, which (with that box correctly NOT using
   * `overflow-hidden`, per this project's repeated "don't clip/hide the
   * card" feedback) means the card visibly flies outside the box's border
   * instead of staying contained. Configurable so a consumer can pick a
   * drop distance that fits within its own box.
   */
  dropDistance?: number;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  ),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

// Two positioning recipes for the `anchor` prop. `bottom-right` is React
// Bits' own original classes verbatim: `right-0 bottom-0` puts the stack's
// container corner at the parent's bottom-right corner, and the added
// `translate-x-[5%] translate-y-[20%]` nudges it further right/down --
// their own fine-tuning for an unclipped demo, not a cropping mechanism.
//
// `top-left` is NOT simply that recipe mirrored with negated translate --
// tried that first and it was wrong. Verified with real
// `getBoundingClientRect()` measurements (not assumed): cards are centered
// inside the CardSwap container via `top-1/2 left-1/2` + GSAP's `xPercent/
// yPercent: -50`, which already puts a card's own top-left corner almost
// exactly at the container's top-left corner with ZERO extra translate.
// Adding a negative translate on top of that pushes the container (and
// every card in it) further up-left, PAST the crop box's top-left edge --
// which crops away the card's actual top-left content (the header row:
// avatar/role/subject) and reveals a middle/lower slice instead. The fix is
// simply `top-0 left-0 origin-top-left` with NO translate offset -- the
// natural centering already aligns correctly for a "corner peek" crop.
const ANCHOR_CLASSES: Record<NonNullable<CardSwapProps["anchor"]>, string> = {
  "bottom-right":
    "right-0 bottom-0 origin-bottom-right translate-x-[5%] translate-y-[20%] max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]",
  "top-left": "top-0 left-0 origin-top-left max-[768px]:scale-[0.75] max-[480px]:scale-[0.55]",
};

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  anchor = "bottom-right",
  dropDistance = 500,
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  // Deliberately keyed on `childArr.length`, not `childArr` itself -- new
  // refs are only needed when the number of cards changes, not when the
  // array's identity changes on every render (Children.toArray above
  // returns a new array each time). Re-creating refs on every render would
  // break GSAP's hold on the DOM nodes it's mid-animating.
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  );

  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i),
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount),
    );

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: `+=${dropDistance}`,
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
    // Upstream's own dependency list -- `refs`/`order`/`childArr`/`config`
    // are intentionally excluded (stable across the interval's lifetime;
    // re-deriving them mid-cycle would restart the animation instead of
    // continuing it, and `config` is a plain re-derivation of `easing`,
    // already listed below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, dropDistance]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div
      ref={container}
      className={`absolute transform overflow-visible perspective-[900px] ${ANCHOR_CLASSES[anchor]}`}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
