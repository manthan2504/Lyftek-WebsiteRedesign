import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicts (e.g. "px-2 px-4" -> "px-4")
 * the way the last class wins. Use this instead of string-concatenating
 * className props anywhere conditional classes are involved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
