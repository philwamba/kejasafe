import type { NextResponse } from "next/server";

import { env } from "@/lib/config/env";
import { authCookieNames } from "@/lib/core/auth/constants";
import type { BackendMode } from "@/lib/core/contracts/common";

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  domain: env.COOKIE_DOMAIN,
};

export function attachAuthCookies(
  response: NextResponse,
  sessionToken: string,
  refreshToken: string,
  expiresAt: Date,
) {
  response.cookies.set(authCookieNames.session, sessionToken, {
    ...baseCookieOptions,
    expires: expiresAt,
  });

  response.cookies.set(authCookieNames.refresh, refreshToken, {
    ...baseCookieOptions,
    expires: expiresAt,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(authCookieNames.session);
  response.cookies.delete(authCookieNames.refresh);
}

export function attachBackendModeCookie(
  response: NextResponse,
  mode: BackendMode,
) {
  response.cookies.set(authCookieNames.backendMode, mode, {
    ...baseCookieOptions,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function attachCsrfCookie(response: NextResponse, csrfToken: string) {
  response.cookies.set(authCookieNames.csrf, csrfToken, {
    ...baseCookieOptions,
    httpOnly: false,
    maxAge: 60 * 60 * 2,
  });
}

export function clearCsrfCookie(response: NextResponse) {
  response.cookies.delete(authCookieNames.csrf);
}
