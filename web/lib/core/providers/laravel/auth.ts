import type {
  AuthMutationResult,
  AuthProvider,
  MessageResult,
  SessionSummaryDto,
} from "@/lib/core/contracts/auth";
import type { AuthContext, RequestContext } from "@/lib/core/contracts/common";
import { laravelApiClient } from "@/lib/core/http/axios";
import type { LaravelAuthPayloadEnvelope, VerifyEmailInput } from "@/lib/shared/types/auth";

function forwardedCookies(headers: unknown): string[] {
  if (!headers) {
    return [];
  }

  if (Array.isArray(headers)) {
    return headers;
  }

  return [String(headers)];
}

function buildHeaders(ctx: RequestContext) {
  return {
    ...(ctx.cookieHeader ? { Cookie: ctx.cookieHeader } : {}),
    "X-Request-Id": ctx.requestId,
  };
}

async function ensureCsrf(ctx: RequestContext) {
  const response = await laravelApiClient.get("/auth/csrf-cookie", {
    headers: buildHeaders(ctx),
  });

  return forwardedCookies(response.headers["set-cookie"]);
}

async function statefulPost<T>(
  path: string,
  body: unknown,
  ctx: RequestContext,
): Promise<{ data: T; setCookieHeaders: string[] }> {
  const csrfCookies = await ensureCsrf(ctx);
  const cookieHeader = csrfCookies
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
  const xsrfCookie = csrfCookies.find((cookie) => cookie.startsWith("XSRF-TOKEN="));
  const xsrfToken = xsrfCookie?.split(";")[0].split("=")[1];
  const mergedCookieHeader = [ctx.cookieHeader, cookieHeader].filter(Boolean).join("; ");

  const response = await laravelApiClient.post<T>(path, body, {
    headers: {
      ...buildHeaders(ctx),
      Cookie: mergedCookieHeader,
      ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
    },
  });

  return {
    data: response.data,
    setCookieHeaders: [...csrfCookies, ...forwardedCookies(response.headers["set-cookie"])],
  };
}

export const laravelAuthProvider: AuthProvider = {
  async me(ctx) {
    try {
      const response = await laravelApiClient.get<LaravelAuthPayloadEnvelope>("/auth/me", {
        headers: buildHeaders(ctx),
      });

      return response.data.data;
    } catch {
      return null;
    }
  },

  async login(input, ctx): Promise<AuthMutationResult> {
    const response = await statefulPost<LaravelAuthPayloadEnvelope>("/auth/login", input, ctx);

    return {
      user: response.data.data,
      cookies: {
        backendMode: "laravel_api",
        forwardedSetCookieHeaders: response.setCookieHeaders,
      },
    };
  },

  async register(input, ctx): Promise<AuthMutationResult> {
    const response = await statefulPost<LaravelAuthPayloadEnvelope>("/auth/register", input, ctx);

    return {
      user: response.data.data,
      cookies: {
        backendMode: "laravel_api",
        forwardedSetCookieHeaders: response.setCookieHeaders,
      },
    };
  },

  async logout(ctx): Promise<MessageResult> {
    const response = await statefulPost<{ message: string }>("/auth/logout", {}, ctx);

    return {
      message: response.data.message,
    };
  },

  async logoutAll(ctx: AuthContext): Promise<MessageResult> {
    const response = await statefulPost<{ message: string }>("/auth/logout-all", {}, ctx);

    return {
      message: response.data.message,
    };
  },

  async listSessions(ctx: AuthContext): Promise<SessionSummaryDto[]> {
    const response = await laravelApiClient.get<{ data: SessionSummaryDto[] }>(
      "/auth/sessions",
      {
        headers: buildHeaders(ctx),
      },
    );

    return response.data.data;
  },

  async revokeSession(sessionId: string, ctx: AuthContext): Promise<void> {
    const csrfCookies = await ensureCsrf(ctx);
    const cookieHeader = csrfCookies
      .map((cookie) => cookie.split(";")[0])
      .join("; ");
    const xsrfCookie = csrfCookies.find((cookie) => cookie.startsWith("XSRF-TOKEN="));
    const xsrfToken = xsrfCookie?.split(";")[0].split("=")[1];

    await laravelApiClient.delete(`/auth/sessions/${sessionId}`, {
      headers: {
        ...buildHeaders(ctx),
        Cookie: [ctx.cookieHeader, cookieHeader].filter(Boolean).join("; "),
        ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
      },
    });
  },

  async forgotPassword(input, ctx): Promise<MessageResult> {
    const response = await statefulPost<{ message: string }>(
      "/auth/forgot-password",
      input,
      ctx,
    );

    return {
      message: response.data.message,
    };
  },

  async resetPassword(input, ctx): Promise<MessageResult> {
    const response = await statefulPost<{ message: string }>(
      "/auth/reset-password",
      input,
      ctx,
    );

    return {
      message: response.data.message,
    };
  },

  async requestEmailVerification(ctx: AuthContext): Promise<MessageResult> {
    const response = await statefulPost<{ message: string; debugToken?: string }>(
      "/auth/verify-email/request",
      {},
      ctx,
    );

    return {
      message: response.data.message,
      debugToken: response.data.debugToken,
    };
  },

  async verifyEmail(input: VerifyEmailInput, ctx: RequestContext): Promise<MessageResult> {
    const response = await statefulPost<{ message: string }>(
      "/auth/verify-email/confirm",
      input,
      ctx,
    );

    return {
      message: response.data.message,
    };
  },
};
