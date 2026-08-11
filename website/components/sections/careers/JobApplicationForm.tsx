"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (!message) errors.message = "Tell us why you're a fit for this role.";

  return errors;
}

/**
 * Purpose: the application form on every Careers detail page -- fields
 * lifted directly from the live site's own `/careers/1`-`/6` forms (Full
 * Name, Email Address, Mobile Number, "Why should we hire you?"), which
 * were identical across all six listings. Same shared-component reasoning
 * as `ContactForm.tsx`: one form, reused per job, rather than six copies
 * that could drift.
 *
 * VALIDATION: same pattern `ContactForm.tsx` settled on -- required-field
 * and email-format checks on submit, errors surfaced through each field's
 * own `error` prop, `noValidate` on the `<form>` so the browser's native
 * validation bubbles don't also fire. Mobile Number stays optional, same
 * as the source form (its own `required` attributes were all `false`);
 * Name/Email/Message are required here because an application with none
 * of those isn't a usable submission, not because the source marked them so.
 *
 * SUBMISSION: intentionally stubbed, same open question as ContactForm's
 * own docblock -- where this should actually go (an ATS, a transactional
 * email, a Next.js Route Handler) hasn't been decided. `handleSubmit`
 * validates and flips to a confirmation state without a real network call.
 */
export function JobApplicationForm({ jobTitle }: { jobTitle: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(new FormData(event.currentTarget));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Stub -- see docblock. Real integration (ATS/email/Route Handler) is a
    // separate, undecided technical dependency.
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="border-border flex flex-col justify-center gap-2 border p-8"
      >
        <p className="font-rinter text-foreground text-lg">
          Application sent.
        </p>
        <p className="text-foreground-muted text-sm">
          We&apos;ll review it and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="role" value={jobTitle} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Full Name"
          name="name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
      </div>
      <Input
        label="Mobile Number (optional)"
        name="mobile"
        type="tel"
        autoComplete="tel"
      />
      <Textarea
        label="Why should we hire you?"
        name="message"
        placeholder={`Tell us why you're a fit for the ${jobTitle} role.`}
        required
        error={errors.message}
      />
      <div>
        <Button type="submit" variant="primary">
          Submit Application
        </Button>
      </div>
    </form>
  );
}
