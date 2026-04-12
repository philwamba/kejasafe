"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  fetchCsrfToken,
  requestEmailVerification,
  verifyEmailToken,
} from "@/lib/core/sdk/auth-client";
import type { AuthUserDto } from "@/lib/shared/types/auth";

interface VerifyEmailPanelProps {
  user: AuthUserDto | null;
  token?: string;
}

export function VerifyEmailPanel({ user, token }: VerifyEmailPanelProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runRequest = () => {
    setMessage(null);
    setServerError(null);

    startTransition(async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        const result = await requestEmailVerification(csrfToken);
        const detail = result.debugToken
          ? `${result.message} Debug token: ${result.debugToken}`
          : result.message;
        setMessage(detail);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Unable to issue verification instructions.",
        );
      }
    });
  };

  const runConfirm = () => {
    if (!token) {
      return;
    }

    setMessage(null);
    setServerError(null);

    startTransition(async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        const result = await verifyEmailToken(token, csrfToken);
        setMessage(result.message);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Unable to verify email.",
        );
      }
    });
  };

  if (user?.emailVerifiedAt) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-sm leading-7 text-green-800">
        Your email is already verified. You can return to{" "}
        <Link href="/dashboard" className="font-semibold text-brand hover:underline">
          the dashboard
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-stone-700">
        {token
          ? "A verification token was supplied. Confirm it below to mark your email as verified."
          : "Request a verification email to confirm your account."}
      </div>

      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

      {token ? (
        <Button
          type="button"
          size="lg"
          onClick={runConfirm}
          disabled={isPending}
          className="h-12 rounded-xl"
        >
          {isPending ? "Verifying..." : "Verify email"}
        </Button>
      ) : user ? (
        <Button
          type="button"
          size="lg"
          onClick={runRequest}
          disabled={isPending}
          className="h-12 rounded-xl"
        >
          {isPending ? "Sending..." : "Send verification email"}
        </Button>
      ) : (
        <p className="text-sm text-stone-600">
          Sign in first to request verification for your account.
        </p>
      )}
    </div>
  );
}
