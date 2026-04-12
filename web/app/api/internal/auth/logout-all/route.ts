import { NextRequest } from 'next/server'

import { clearAuthCookies, clearCsrfCookie } from '@/lib/core/auth/cookies'
import { buildAuthContext } from '@/lib/core/auth/session'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { env } from '@/lib/config/env'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import {
    getCurrentUser,
    logoutAllSessions,
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

    const result = await logoutAllSessions(
        buildAuthContext(
            user.id,
            user.backendMode,
            user.roles,
            user.permissions,
            requestContext,
        ),
    )
    const response = jsonSuccess(result)

    clearAuthCookies(response)
    clearCsrfCookie(response)
    response.cookies.delete(env.LARAVEL_SESSION_COOKIE)
    response.cookies.delete('XSRF-TOKEN')

    return response
}
