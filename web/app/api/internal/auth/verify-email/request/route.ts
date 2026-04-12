import { NextRequest } from 'next/server'

import { buildAuthContext } from '@/lib/core/auth/session'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import {
    getCurrentUser,
    requestEmailVerificationForUser,
} from '@/lib/core/services/auth-service'

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const mode = await resolveBackendModeForRequest(request)
    const requestContext = buildRequestContextFromNextRequest(request)
    const user = await getCurrentUser(mode, requestContext)

    if (!user) {
        return jsonError('Unauthenticated.', 401)
    }

    const result = await requestEmailVerificationForUser(
        buildAuthContext(
            user.id,
            user.backendMode,
            user.roles,
            user.permissions,
            requestContext,
        ),
    )

    return jsonSuccess(result)
}
