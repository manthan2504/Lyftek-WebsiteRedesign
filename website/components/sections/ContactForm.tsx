"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SERVICE_PILLARS } from "@/constants/services";

// Reuses SERVICE_PILLARS' own labels (constants/services.ts) rather than a
// second, hand-typed list -- the same "one source of truth" reasoning
// Footer.tsx and Services.tsx already apply to this data. "Something else"
// is appended because a consultative form shouldn't force a visitor whose
// need doesn't map cleanly onto one of the listed services to pick a wrong
// answer.
const SERVICE_OPTIONS = [
  ...SERVICE_PILLARS.map((pillar) => ({
    label: pillar.label,
    value: pillar.label,
  })),
  { label: "Something else", value: "other" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<
  Record<"name" | "email" | "company" | "service" | "message", string>
>;

/**
 * Required-field + email-format checks, run against the form's own
 * `FormData` at submit time. All fields are read as uncontrolled (native
 * `<form>` submission), so validation reads from `FormData` rather than
 * component state -- no separate controlled-value tracking needed just to
 * check what was typed.
 */
function validate(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your business email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (!company) errors.company = "Enter your company name.";
  if (!service) errors.service = "Select a service.";
  if (!message) errors.message = "Tell us what you're trying to build.";

  return errors;
}

/**
 * Purpose: the site's single inquiry form -- fields, submission handling,
 * and the post-submit confirmation state. Extracted 2026-08-10 from
 * ContactCTA.tsx, which until then held this markup inline as its only
 * copy.
 *
 * WHY IT WAS EXTRACTED: the /contact page redesign gave the form a second
 * home (`components/sections/contact/ContactSection.tsx`, where the form is
 * the page's primary content rather than a closing CTA). Two consumers of
 * ~60 lines of identical field markup is exactly the case
 * 16_IMPLEMENTATION_WORKFLOW.md's Component Workflow calls out ("Can an
 * existing component be reused? ... Avoid one-off implementations") and
 * 09_DESIGN_SYSTEM.md's "avoid duplicate implementations -- when similar
 * components emerge, abstract them into reusable patterns." Duplicating it
 * would also have meant the two forms could silently drift apart in fields
 * or validation, which is the same failure mode SERVICE_PILLARS exists to
 * prevent for service names.
 *
 * WHY `components/sections/` AND NOT `components/ui/`: components/ui's own
 * README scopes that folder to "small, generic, highly-reusable primitives
 * with no business meaning of their own" -- Button, Input, Textarea. This
 * form is the opposite: it is bound to Lyftek's real service catalog and to
 * a specific business process (routing an enterprise inquiry). It is built
 * FROM those primitives rather than being one. It isn't a full page section
 * either, but sections/ is where composed, business-meaningful blocks live,
 * so it sits here alongside the two sections that render it.
 *
 * FIELDS: Name, Business Email, Company Name, Mobile Number (optional),
 * Service Interested In, Message. Per Docs/Mythoughts.md's explicit
 * critique of the live site's 3-field form (Name / Mobile / Message only,
 * capturing neither a business email nor what the visitor actually needed).
 *
 * VALIDATION: required-field + email-format checks (`validate()` above),
 * run on submit against the form's own `FormData`. Errors surface through
 * each field's existing `error` prop (Input/Select/Textarea already support
 * this -- see Input.tsx's docblock -- this is the first consumer that
 * actually wires it up rather than leaving it unused). `noValidate` on the
 * `<form>` turns off the browser's own validation bubbles so this custom,
 * on-brand error state is the only one a visitor sees.
 *
 * SUBMISSION: still intentionally stubbed, unchanged by the extraction.
 * Where this should actually submit to (transactional email service, CRM
 * webhook, a Next.js Route Handler) has not been decided -- a technical
 * dependency separate from the visual/content build, not something to guess
 * at here. `handleSubmit` prevents the native page reload, validates, and
 * (once valid) flips into a confirmation state so the form is interactively
 * complete without a real network call. Swapping the body of `handleSubmit`
 * for a real request is now a ONE-place change that both consumers inherit,
 * which is a second, concrete benefit of the extraction.
 */
export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(new FormData(event.currentTarget));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Stub -- see docblock. Real integration (email/CRM/Route Handler) is a
    // separate, undecided technical dependency.
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      // No `h-full` here (ContactCTA's inline version had it): this now
      // renders in two different layouts, and stretching the confirmation
      // to fill whichever column it lands in made it a large mostly-empty
      // box in the taller of the two. Natural content height reads the
      // same in both.
      <div
        role="status"
        className="border-border flex flex-col justify-center gap-2 border p-8"
      >
        <p className="font-rinter text-foreground text-lg">Message sent.</p>
        <p className="text-foreground-muted text-sm">
          We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <Input
          label="Business Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Company Name"
          name="company"
          autoComplete="organization"
          required
          error={errors.company}
        />
        <Input
          label="Mobile Number (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
        />
      </div>
      <Select
        label="Service Interested In"
        name="service"
        options={SERVICE_OPTIONS}
        placeholder="Select a service"
        required
        error={errors.service}
      />
      <Textarea
        label="Message"
        name="message"
        placeholder="What are you trying to build?"
        required
        error={errors.message}
      />
      <div>
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Send Message
        </Button>
      </div>
    </form>
  );
}
