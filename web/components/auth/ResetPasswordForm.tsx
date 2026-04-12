"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema } from "@/lib/core/auth/schemas";
import { fetchCsrfToken, resetPassword } from "@/lib/core/sdk/auth-client";

type ResetPasswordValues = {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
};

interface ResetPasswordFormProps {
  defaultEmail?: string;
  defaultToken?: string;
}

export function ResetPasswordForm({
  defaultEmail = "",
  defaultToken = "",
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
      token: defaultToken,
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    setServerError(null);

    startTransition(async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        const result = await resetPassword(values, csrfToken);
        setMessage(result.message);
        setTimeout(() => {
          router.push("/login");
        }, 900);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Unable to reset password.",
        );
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-white" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          {...form.register("email")}
          className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-orange-400"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-white" htmlFor="token">
          Reset token
        </label>
        <input
          id="token"
          {...form.register("token")}
          className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-orange-400"
        />
      </div>
      <div className="grid gap-2 md:grid-cols-2 md:gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-white" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-orange-400"
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-rose-300">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-white" htmlFor="passwordConfirmation">
            Confirm password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            {...form.register("passwordConfirmation")}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-orange-400"
          />
          {form.formState.errors.passwordConfirmation ? (
            <p className="text-sm text-rose-300">
              {form.formState.errors.passwordConfirmation.message}
            </p>
          ) : null}
        </div>
      </div>

      {message ? <p className="text-sm text-orange-300">{message}</p> : null}
      {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-2xl bg-orange-400 px-5 text-sm font-semibold text-stone-950 transition hover:bg-orange-300 disabled:opacity-60"
      >
        {isPending ? "Resetting..." : "Reset password"}
      </button>

      <p className="text-sm text-stone-300">
        Already fixed?{" "}
        <Link href="/login" className="text-orange-300">
          Return to sign in
        </Link>
      </p>
    </form>
  );
}
