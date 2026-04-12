import { NextRequest } from 'next/server'

import { buildAuthContext } from '@/lib/core/auth/session'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import {
    getCurrentUser,
    listActiveSessions,
} from '@/lib/core/services/auth-service'

export async function GET(request: NextRequest) {
    const mode = await resolveBackendModeForRequest(request)
    const requestContext = buildRequestContextFromNextRequest(request)
    const user = await getCurrentUser(mode, requestContext)

    if (!user) {
        return jsonError('Unauthenticated.', 401)
    }

    const sessions = await listActiveSessions(
        buildAuthContext(
            user.id,
            user.backendMode,
            user.roles,
            user.permissions,
            requestContext,
        ),
    )

    return jsonSuccess(sessions)
}
