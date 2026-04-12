"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordSchema } from "@/lib/core/auth/schemas";
import { fetchCsrfToken, requestPasswordResetToken } from "@/lib/core/sdk/auth-client";

type ForgotPasswordValues = {
  email: string;
};

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    setServerError(null);

    startTransition(async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        const result = await requestPasswordResetToken(values, csrfToken);
        setMessage(result.message);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Unable to request password reset.",
        );
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-white" htmlFor="email">
          Account email
        </label>
        <input
          id="email"
          type="email"
          {...form.register("email")}
          className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-orange-400"
          placeholder="you@example.com"
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-rose-300">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      {message ? <p className="text-sm text-orange-300">{message}</p> : null}
      {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-2xl bg-orange-400 px-5 text-sm font-semibold text-stone-950 transition hover:bg-orange-300 disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Send reset instructions"}
      </button>

      <p className="text-sm text-stone-300">
        Remembered it?{" "}
        <Link href="/login" className="text-orange-300">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
