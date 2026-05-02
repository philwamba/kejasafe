import { randomUUID } from 'node:crypto'

import type { NextRequest } from 'next/server'

import type { BackendMode, RequestContext } from '@/lib/core/contracts/common'
import { authCookieNames } from '@/lib/core/auth/constants'
import { env } from '@/lib/config/env'
import { getConfiguredBackendMode } from '@/lib/core/system/control-plane'

export function buildRequestContextFromNextRequest(
    request: NextRequest,
): RequestContext {
    return {
        requestId: request.headers.get('x-request-id') ?? randomUUID(),
        ipAddress:
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            null,
        userAgent: request.headers.get('user-agent'),
        cookieHeader: request.headers.get('cookie'),
    }
}

export function resolveBackendModeFromRequest(
    request: NextRequest,
    requestedMode?: string | null,
): BackendMode {
    const cookieMode = request.cookies.get(authCookieNames.backendMode)?.value
    const headerMode = request.headers.get('x-backend-mode')
    const resolvedMode =
        requestedMode ?? headerMode ?? cookieMode ?? env.ACTIVE_BACKEND_MODE

    return resolvedMode === 'laravel_api' ? 'laravel_api' : 'prisma_neon'
}

function toBackendMode(value: string | null | undefined): BackendMode | null {
    return value === 'laravel_api' || value === 'prisma_neon' ? value : null
}

export async function resolveBackendModeForRequest(
    request: NextRequest,
    requestedMode?: string | null,
): Promise<BackendMode> {
    const cookieMode = request.cookies.get(authCookieNames.backendMode)?.value
    const headerMode = request.headers.get('x-backend-mode')
    const resolvedMode = toBackendMode(
        requestedMode ?? headerMode ?? cookieMode,
    )

    if (resolvedMode) {
        return resolvedMode
    }

    return getConfiguredBackendMode()
}

export async function resolveActiveBackendModeForRequest(
    request: NextRequest,
    requestedMode?: string | null,
): Promise<BackendMode> {
    const headerMode = request.headers.get('x-backend-mode')
    const resolvedMode = toBackendMode(requestedMode ?? headerMode)

    if (resolvedMode) {
        return resolvedMode
    }

    return getConfiguredBackendMode()
}

export function resolveBackendModeFromCookieHeader(
    cookieHeader: string | null | undefined,
): BackendMode | null {
    if (!cookieHeader) {
        return null
    }

    const cookie = cookieHeader
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(`${authCookieNames.backendMode}=`))

    if (!cookie) {
        return null
    }

    return toBackendMode(
        decodeURIComponent(cookie.split('=').slice(1).join('=')),
    )
}
