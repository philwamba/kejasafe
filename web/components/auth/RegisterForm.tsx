"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/lib/core/auth/schemas";
import { fetchCsrfToken, registerAccount } from "@/lib/core/sdk/auth-client";

type RegisterFormValues = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        await registerAccount(values, csrfToken);
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Unable to create account.",
        );
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-white" htmlFor="fullName">
          Full name
        </label>
        <input
          id="fullName"
          {...form.register("fullName")}
          className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-sky-400"
          placeholder="Your full name"
        />
        {form.formState.errors.fullName ? (
          <p className="text-sm text-rose-300">
            {form.formState.errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-white" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-sky-400"
            placeholder="you@example.com"
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-rose-300">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-white" htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            {...form.register("phone")}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-sky-400"
            placeholder="+254..."
          />
          {form.formState.errors.phone ? (
            <p className="text-sm text-rose-300">
              {form.formState.errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-white" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-sky-400"
            placeholder="Minimum 8 characters"
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
            className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-sky-400"
            placeholder="Repeat password"
          />
          {form.formState.errors.passwordConfirmation ? (
            <p className="text-sm text-rose-300">
              {form.formState.errors.passwordConfirmation.message}
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-sm leading-7 text-stone-300">
        By creating an account, you agree to the platform terms and consent to secure session handling via cookie-based authentication.
      </p>

      {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-2xl bg-sky-300 px-5 text-sm font-semibold text-stone-950 transition hover:bg-sky-200 disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-stone-300">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}
