"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

export type AvatarSize = "sm" | "default" | "lg";

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 24,
  default: 32,
  lg: 40,
};

interface AvatarContextValue {
  failed: boolean;
  setFailed: (failed: boolean) => void;
  size: AvatarSize;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext(component: string) {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Avatar>`);
  }
  return ctx;
}

/**
 * Purpose: this site's avatar primitive -- built to match shadcn/ui's
 * current Avatar composition API (ui.shadcn.com/docs/components/base/
 * avatar: `Avatar` root + `AvatarImage` + `AvatarFallback`, a `size` prop
 * on the root taking "sm" | "default" | "lg"), per direct client reference,
 * but implemented locally rather than installing shadcn's actual package.
 * Their current version is built on Base UI (`@base-ui-components/react`),
 * a real dependency this project doesn't otherwise use anywhere -- adding
 * it for one small compound component would be a heavier footprint than
 * this needs, the same reasoning Input.tsx/Select.tsx/Textarea.tsx already
 * give for not pulling in Radix. What's reused here is the API SHAPE
 * (matching prop/component names so this reads exactly like shadcn's docs),
 * not their dependency chain.
 *
 * Composition, matching shadcn's exactly:
 *   <Avatar size="lg">
 *     <AvatarImage src={...} alt={...} />
 *     <AvatarFallback>ID</AvatarFallback>
 *   </Avatar>
 * `AvatarFallback` only renders if `AvatarImage` fails to load (tracked via
 * React Context between the two, no prop drilling needed) -- shadcn's own
 * behavior. `AvatarBadge`/`AvatarGroup` from the reference page aren't
 * built -- no current use case needs them (17_CODING_STANDARDS.md's "avoid
 * unnecessary abstractions"); add them when a real one does.
 *
 * Circular (`rounded-full`) regardless of the sitewide sharp-corner
 * convention (Button/Input/Select/Textarea/Card all use `rounded-sm` or no
 * rounding, per 04_VISUAL_LANGUAGE.md's anti-heavy-rounding guidance) --
 * that guidance is about panels/cards/buttons reading as generic template
 * chrome, not about avatar shape, which is a distinct, near-universal
 * convention orthogonal to that critique.
 */
export function Avatar({
  size = "default",
  className,
  children,
}: {
  size?: AvatarSize;
  className?: string;
  children: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const px = SIZE_PX[size];

  return (
    <AvatarContext.Provider value={{ failed, setFailed, size }}>
      <div
        style={{ width: px, height: px }}
        className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full", className)}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

export function AvatarImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const { failed, setFailed, size } = useAvatarContext("AvatarImage");
  const px = SIZE_PX[size];

  if (failed) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      unoptimized
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export function AvatarFallback({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { failed } = useAvatarContext("AvatarFallback");

  if (!failed) return null;

  return (
    <div
      className={cn(
        "bg-surface text-foreground-muted flex h-full w-full items-center justify-center font-mono text-[10px] font-semibold uppercase",
        className,
      )}
    >
      {children}
    </div>
  );
}
