import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { clearAuthCookies, clearCsrfCookie } from '@/lib/core/auth/cookies'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { env } from '@/lib/config/env'
import { jsonError, jsonMessage } from '@/lib/core/http/response'
import { logoutCurrentSession } from '@/lib/core/services/auth-service'

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const mode = await resolveBackendModeForRequest(request)
    const result = await logoutCurrentSession(
        mode,
        buildRequestContextFromNextRequest(request),
    )
    const response = jsonMessage(result.message)

    clearAuthCookies(response)
    clearCsrfCookie(response)
    response.cookies.delete(env.LARAVEL_SESSION_COOKIE)
    response.cookies.delete('XSRF-TOKEN')

    return response
}
