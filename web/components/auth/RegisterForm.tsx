"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/core/auth/schemas";
import { fetchCsrfToken, registerAccount } from "@/lib/core/sdk/auth-client";

type RegisterFormValues = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
};

const inputClass =
  "h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400";
const labelClass = "text-sm font-medium text-stone-900";
const errorClass = "text-sm text-red-600";

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
        <label className={labelClass} htmlFor="fullName">
          Full name <span className="text-red-600">*</span>
        </label>
        <input
          id="fullName"
          autoComplete="name"
          autoCapitalize="words"
          {...form.register("fullName")}
          className={`${inputClass} capitalize placeholder:normal-case`}
          placeholder="Your full name"
        />
        {form.formState.errors.fullName ? (
          <p className={errorClass}>{form.formState.errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="email">
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
          <p className={errorClass}>{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="phone">
          Phone number <span className="text-red-600">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          {...form.register("phone")}
          className={inputClass}
          placeholder="+254 700 000 000"
        />
        {form.formState.errors.phone ? (
          <p className={errorClass}>{form.formState.errors.phone.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="password">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            className={inputClass}
            placeholder="Minimum 8 characters"
          />
          {form.formState.errors.password ? (
            <p className={errorClass}>
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="passwordConfirmation">
            Confirm password <span className="text-red-600">*</span>
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            {...form.register("passwordConfirmation")}
            className={inputClass}
            placeholder="Repeat password"
          />
          {form.formState.errors.passwordConfirmation ? (
            <p className={errorClass}>
              {form.formState.errors.passwordConfirmation.message}
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-xs leading-6 text-stone-500">
        By creating an account you agree to our terms and privacy policy.
      </p>

      {serverError ? <p className={errorClass}>{serverError}</p> : null}

      <Button type="submit" size="lg" disabled={isPending} className="h-12 rounded-xl">
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
