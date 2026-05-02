import type { BackendMode, RequestContext } from '@/lib/core/contracts/common'
import type { ApplicationProvider } from '@/lib/core/contracts/providers'
import { logger } from '@/lib/core/logger'
import { getProvider } from '@/lib/core/providers/provider-registry'
import { getConfiguredBackendMode } from '@/lib/core/system/control-plane'

export async function readFromActiveProvider<T>(
    ctx: RequestContext,
    reader: (provider: ApplicationProvider) => Promise<T>,
    options: {
        feature: string
        mode?: BackendMode
        fallbackMode?: BackendMode
    },
) {
    const mode = options.mode ?? (await getConfiguredBackendMode())
    const primaryProvider = getProvider(mode)

    try {
        return await reader(primaryProvider)
    } catch (error) {
        const fallbackMode =
            options.fallbackMode ??
            (mode === 'prisma_neon' ? undefined : 'prisma_neon')

        if (!fallbackMode || fallbackMode === mode) {
            throw error
        }

        logger.warn('Active provider read failed. Falling back.', {
            requestId: ctx.requestId,
            backendMode: mode,
            fallbackMode,
            feature: options.feature,
            error: error instanceof Error ? error.message : 'Unknown error',
        })

        return reader(getProvider(fallbackMode))
    }
}
