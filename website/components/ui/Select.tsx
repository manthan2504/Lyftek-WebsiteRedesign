"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  /** Shown on the trigger when nothing is selected yet -- e.g. "Select a service". */
  placeholder?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  defaultValue?: string;
}

/**
 * Purpose: dropdown form field -- see Input.tsx's docblock for the shared
 * label/focus/error conventions this follows.
 *
 * REBUILT 2026-08-08 (was a native `<select>` + an absolutely-positioned
 * caret icon laid on top) -- two direct client instructions in the same
 * message: (1) a real layout bug -- the native `<select>` had no `w-full`,
 * so it shrank to fit only its own text content while the wrapping
 * `relative` div (which the caret was positioned against) stretched to the
 * full field width, leaving a narrow text box with the caret stranded far
 * to the right, reading as a broken/incomplete field; (2) "add a modern
 * dropdown... create a good form" -- a custom-styled listbox instead of
 * the browser's native dropdown chrome (which can't be styled -- the
 * native `<select>`'s OPTION LIST itself always renders as plain OS/browser
 * UI, regardless of how the closed trigger is styled).
 *
 * This is still NOT a dependency-heavy combobox (no Radix/Base UI) --
 * 17_CODING_STANDARDS.md's "avoid unnecessary abstractions" and this
 * project's established pattern (Avatar.tsx, Button.tsx, Input.tsx) of
 * building just enough of a primitive locally rather than reaching for a
 * library. It IS a real listbox now (button trigger + `role="listbox"`
 * popover, keyboard nav, click-outside-to-close), because that's what a
 * genuinely custom-styled dropdown requires -- the native `<select>`
 * couldn't do this at all, which is exactly why the client asked for it.
 *
 * FORM COMPATIBILITY: a hidden `<input type="hidden" name={name}>` carries
 * the actual value for native `<form>` submission (`FormData`,
 * `event.currentTarget` reads, etc. all still work) -- the visible
 * button/listbox never touches the DOM's native form-control value APIs
 * directly.
 *
 * Accessibility: `role="combobox"` trigger + `role="listbox"`/`role=
 * "option"` popover (the ARIA 1.2 "combobox with a listbox popup" pattern),
 * `aria-expanded`/`aria-controls`/`aria-activedescendant`, full keyboard
 * support (Enter/Space open + confirm, Arrow Up/Down move + open, Escape
 * close), closes on outside click, respects `prefers-reduced-motion` (the
 * open/close animation is skipped, not just shortened, when set).
 */
export function Select({
  label,
  name,
  options,
  placeholder,
  error,
  required,
  containerClassName,
  defaultValue,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const generatedId = useId();
  const buttonId = `${generatedId}-button`;
  const listboxId = `${generatedId}-listbox`;
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function selectOption(index: number) {
    setValue(options[index].value);
    setActiveIndex(index);
    setOpen(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(options.findIndex((option) => option.value === value));
        } else if (activeIndex >= 0) {
          selectOption(activeIndex);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(options.findIndex((option) => option.value === value));
        } else {
          setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (open) {
          setActiveIndex((index) => Math.max(index - 1, 0));
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)} ref={containerRef}>
      <label
        htmlFor={buttonId}
        className="text-foreground-muted font-mono text-xs font-semibold tracking-[0.15em] uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          id={buttonId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${buttonId}-error` : undefined}
          onClick={() => {
            setOpen((wasOpen) => !wasOpen);
            setActiveIndex(options.findIndex((option) => option.value === value));
          }}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            // 2026-08-08, direct client request ("for interested service
            // when hovered hand cursor must be visible not pointer"):
            // `cursor-pointer` added explicitly -- native <button>
            // elements don't reliably get the hand cursor from browser
            // defaults alone (Firefox in particular defaults buttons to
            // the plain arrow), so this shouldn't be left implicit.
            "bg-surface border-border text-foreground flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm border px-4 py-2.5 text-left text-sm transition-colors outline-none",
            "focus-visible:border-accent focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-0",
            !selected && "text-foreground-muted",
            error && "border-error",
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <CaretDown
            aria-hidden
            size={16}
            className={cn(
              "text-foreground-muted shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              id={listboxId}
              role="listbox"
              aria-label={label}
              tabIndex={-1}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-surface border-border absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-sm border py-1"
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => selectOption(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm transition-colors",
                    index === activeIndex
                      ? "bg-surface-hover text-foreground"
                      : "text-foreground-secondary",
                  )}
                >
                  <span className={cn("truncate", option.value === value && "text-accent")}>
                    {option.label}
                  </span>
                  {option.value === value && (
                    <Check aria-hidden size={14} className="text-accent shrink-0" />
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <input type="hidden" name={name} value={value} required={required} />
      {error && (
        <p id={`${buttonId}-error`} className="text-error text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
