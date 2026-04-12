"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/lib/core/auth/schemas";
import { fetchCsrfToken, loginWithCredentials } from "@/lib/core/sdk/auth-client";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        await loginWithCredentials(values, csrfToken);
        router.push(next);
        router.refresh();
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Unable to sign in.",
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
          placeholder="you@example.com"
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-rose-300">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-white" htmlFor="password">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm text-orange-300">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          {...form.register("password")}
          className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-orange-400"
          placeholder="Your password"
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-rose-300">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <label className="inline-flex items-center gap-3 text-sm text-stone-300">
        <input
          type="checkbox"
          {...form.register("rememberMe")}
          className="size-4 rounded border-white/20 bg-white/5"
        />
        Keep me signed in on this device
      </label>

      {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-2xl bg-orange-400 px-5 text-sm font-semibold text-stone-950 transition hover:bg-orange-300 disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
