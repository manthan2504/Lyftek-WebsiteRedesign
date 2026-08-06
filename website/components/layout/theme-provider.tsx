"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wraps next-themes so class-based dark/light switching works with the
 * `.dark` / `.light` selectors defined in app/globals.css. Defaults to the
 * dark theme (the only fully-specified palette in 08_COLOR_SYSTEM.md) while
 * still respecting a user's explicit choice once a theme toggle exists.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
