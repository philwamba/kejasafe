import { headers } from 'next/headers'

import type { BackendMode } from '@/lib/core/contracts/common'
import { getCurrentUser } from '@/lib/core/services/auth-service'
import { getConfiguredBackendMode } from '@/lib/core/system/control-plane'

async function buildServerCookieHeader() {
    const headerStore = await headers()

    return headerStore.get('cookie')
}

export async function getServerCurrentUser(mode?: BackendMode) {
    const headerStore = await headers()
    const resolvedMode =
        mode ??
        (headerStore.get('x-backend-mode') as BackendMode | null) ??
        (await getConfiguredBackendMode())

    return getCurrentUser(resolvedMode, {
        requestId: headerStore.get('x-request-id') ?? 'server-render',
        ipAddress:
            headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: headerStore.get('user-agent'),
        cookieHeader: await buildServerCookieHeader(),
    })
}
