"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const inputClass =
  "h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400";

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
        <label className="text-sm font-medium text-stone-900" htmlFor="email">
          Email address <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
          className={inputClass}
          placeholder="you@example.com"
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-stone-900" htmlFor="password">
            Password <span className="text-red-600">*</span>
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-brand hover:underline">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
          className={inputClass}
          placeholder="Your password"
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Controller
        control={form.control}
        name="rememberMe"
        render={({ field }) => (
          <label className="inline-flex items-center gap-3 text-sm text-stone-700">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
            />
            Keep me signed in on this device
          </label>
        )}
      />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

      <Button type="submit" size="lg" disabled={isPending} className="h-12 rounded-xl">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
