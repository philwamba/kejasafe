import { randomUUID } from "node:crypto";

import type { AuthContext, BackendMode, RequestContext } from "@/lib/core/contracts/common";

export interface SessionRecord {
  id: string;
  userId: string;
  sessionToken: string;
  refreshToken: string;
  backendMode: BackendMode;
  expiresAt: Date;
}

export function buildRequestContext(input?: Partial<RequestContext>): RequestContext {
  return {
    requestId: input?.requestId ?? randomUUID(),
    ipAddress: input?.ipAddress ?? null,
    userAgent: input?.userAgent ?? null,
    cookieHeader: input?.cookieHeader ?? null,
  };
}

export function buildAuthContext(
  userId: string,
  backendMode: BackendMode,
  roles: string[] = [],
  permissions: string[] = [],
  input?: Partial<RequestContext>,
): AuthContext {
  return {
    ...buildRequestContext(input),
    userId,
    backendMode,
    roles,
    permissions,
  };
}
