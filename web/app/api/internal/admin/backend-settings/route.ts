import { NextRequest } from 'next/server'

import { attachBackendModeCookie } from '@/lib/core/auth/cookies'
import { buildAuthContext } from '@/lib/core/auth/session'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { hasPermission } from '@/lib/core/rbac/access'
import {
    getConfiguredBackendSetting,
    switchConfiguredBackend,
} from '@/lib/core/services/system-service'
import { getCurrentUser } from '@/lib/core/services/auth-service'
import type { BackendMode } from '@/lib/core/contracts/common'

export async function GET(_request: NextRequest) {
    const setting = await getConfiguredBackendSetting()

    return jsonSuccess(setting)
}

export async function PUT(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const mode = await resolveBackendModeForRequest(request)
    const requestContext = buildRequestContextFromNextRequest(request)
    const user = await getCurrentUser(mode, requestContext)

    if (!user) {
        return jsonError('Unauthenticated.', 401)
    }

    if (!hasPermission(user.permissions, 'switch_backend')) {
        return jsonError('Forbidden.', 403)
    }

    try {
        const body = (await request.json()) as {
            activeMode?: BackendMode
            fallbackMode?: BackendMode | null
            switchNotes?: string
        }

        if (
            body.activeMode !== 'prisma_neon' &&
            body.activeMode !== 'laravel_api'
        ) {
            return jsonError('A valid backend mode is required.', 422)
        }

        const setting = await switchConfiguredBackend(
            {
                activeMode: body.activeMode,
                fallbackMode:
                    body.fallbackMode === 'prisma_neon' ||
                    body.fallbackMode === 'laravel_api'
                        ? body.fallbackMode
                        : null,
                switchNotes: body.switchNotes,
            },
            buildAuthContext(
                user.id,
                user.backendMode,
                user.roles,
                user.permissions,
                requestContext,
            ),
        )

        const response = jsonSuccess(setting)
        attachBackendModeCookie(response, setting.activeMode)

        return response
    } catch (error) {
        return jsonError(error)
    }
}
