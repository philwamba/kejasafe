import { NextRequest } from "next/server";

import { buildAuthContext } from "@/lib/core/auth/session";
import { buildRequestContextFromNextRequest, resolveBackendModeForRequest } from "@/lib/core/auth/request";
import { verifyRequestCsrf } from "@/lib/core/auth/csrf";
import { jsonError, jsonMessage } from "@/lib/core/http/response";
import { getCurrentUser, revokeActiveSession } from "@/lib/core/services/auth-service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyRequestCsrf(request)) {
    return jsonError("CSRF validation failed.", 419);
  }

  const mode = await resolveBackendModeForRequest(request);
  const requestContext = buildRequestContextFromNextRequest(request);
  const user = await getCurrentUser(mode, requestContext);

  if (!user) {
    return jsonError("Unauthenticated.", 401);
  }

  const resolvedParams = await params;

  await revokeActiveSession(
    resolvedParams.id,
    buildAuthContext(
      user.id,
      user.backendMode,
      user.roles,
      user.permissions,
      requestContext,
    ),
  );

  return jsonMessage("Session revoked.");
}
