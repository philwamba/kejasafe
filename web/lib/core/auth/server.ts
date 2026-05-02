import { headers } from 'next/headers'

import type { BackendMode } from '@/lib/core/contracts/common'
import { getCurrentUser } from '@/lib/core/services/auth-service'
import { getConfiguredBackendMode } from '@/lib/core/system/control-plane'
import { resolveBackendModeFromCookieHeader } from '@/lib/core/auth/request'
import { buildRequestContext } from '@/lib/core/auth/session'

async function buildServerCookieHeader() {
    const headerStore = await headers()

    return headerStore.get('cookie')
}

export async function getServerCurrentUser(mode?: BackendMode) {
    const headerStore = await headers()
    const cookieHeader = await buildServerCookieHeader()
    const headerMode = headerStore.get('x-backend-mode')
    const resolvedMode =
        mode ??
        (headerMode === 'laravel_api' || headerMode === 'prisma_neon'
            ? headerMode
            : null) ??
        resolveBackendModeFromCookieHeader(cookieHeader) ??
        (await getConfiguredBackendMode())

    return getCurrentUser(resolvedMode, {
        requestId: headerStore.get('x-request-id') ?? 'server-render',
        ipAddress:
            headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: headerStore.get('user-agent'),
        cookieHeader,
    })
}

export async function getServerRequestContext() {
    const headerStore = await headers()

    return buildRequestContext({
        requestId: headerStore.get('x-request-id') ?? 'server-render',
        ipAddress:
            headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: headerStore.get('user-agent'),
        cookieHeader: headerStore.get('cookie'),
    })
}
