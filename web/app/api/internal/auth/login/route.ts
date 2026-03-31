import { NextRequest } from "next/server";

import { buildRequestContextFromNextRequest, resolveBackendModeForRequest } from "@/lib/core/auth/request";
import { attachAuthCookies, attachBackendModeCookie } from "@/lib/core/auth/cookies";
import { loginSchema } from "@/lib/core/auth/schemas";
import { verifyRequestCsrf } from "@/lib/core/auth/csrf";
import { applyForwardedSetCookieHeaders } from "@/lib/core/http/cookies";
import { jsonError, jsonSuccess } from "@/lib/core/http/response";
import { loginWithProvider } from "@/lib/core/services/auth-service";

export async function POST(request: NextRequest) {
  if (!verifyRequestCsrf(request)) {
    return jsonError("CSRF validation failed.", 419);
  }

  try {
    const body = await request.json();
    const mode = await resolveBackendModeForRequest(request, body.backendMode);
    const input = loginSchema.parse(body);
    const result = await loginWithProvider(
      mode,
      input,
      buildRequestContextFromNextRequest(request),
    );
    const response = jsonSuccess(result.user);

    if (result.cookies.forwardedSetCookieHeaders) {
      applyForwardedSetCookieHeaders(response, result.cookies.forwardedSetCookieHeaders);
    } else if (
      result.cookies.sessionToken &&
      result.cookies.refreshToken &&
      result.cookies.expiresAt
    ) {
      attachAuthCookies(
        response,
        result.cookies.sessionToken,
        result.cookies.refreshToken,
        new Date(result.cookies.expiresAt),
      );
    }

    attachBackendModeCookie(response, result.cookies.backendMode);

    return response;
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to log in.",
      422,
    );
  }
}
