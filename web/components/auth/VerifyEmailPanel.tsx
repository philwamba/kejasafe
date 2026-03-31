"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

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
      <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-6 text-sm leading-7 text-emerald-100">
        Your email is already verified. You can return to{" "}
        <Link href="/dashboard" className="font-medium text-white">
          the dashboard
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-stone-300">
        {token
          ? "A verification token was supplied. Confirm it below to mark the account email as verified."
          : "Request a verification token from the active backend. In development, the token is exposed as a debug value so the flow can be tested without an email provider."}
      </div>

      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

      {token ? (
        <button
          type="button"
          onClick={runConfirm}
          disabled={isPending}
          className="h-12 rounded-2xl bg-emerald-400 px-5 text-sm font-semibold text-stone-950 transition hover:bg-emerald-300 disabled:opacity-60"
        >
          {isPending ? "Verifying..." : "Verify email"}
        </button>
      ) : user ? (
        <button
          type="button"
          onClick={runRequest}
          disabled={isPending}
          className="h-12 rounded-2xl bg-emerald-400 px-5 text-sm font-semibold text-stone-950 transition hover:bg-emerald-300 disabled:opacity-60"
        >
          {isPending ? "Issuing..." : "Request verification"}
        </button>
      ) : (
        <p className="text-sm text-stone-300">
          Sign in first if you want to request verification for your active account.
        </p>
      )}
    </div>
  );
}
