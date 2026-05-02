import type {
    AuthContext,
    BackendMode,
    RequestContext,
} from '@/lib/core/contracts/common'
import type {
    CreatePropertyInput,
    PropertySearchInput,
} from '@/lib/core/contracts/property'
import { logger } from '@/lib/core/logger'
import { getProvider } from '@/lib/core/providers/provider-registry'
import { getConfiguredFallbackBackendMode } from '@/lib/core/system/control-plane'

async function configuredFallbackProvider(currentMode: BackendMode) {
    const fallbackMode = await getConfiguredFallbackBackendMode()

    if (!fallbackMode || fallbackMode === currentMode) {
        return null
    }

    return getProvider(fallbackMode)
}

export async function listProperties(
    mode: BackendMode,
    input: PropertySearchInput,
    ctx: RequestContext,
) {
    const primaryProvider = getProvider(mode)

    try {
        return await primaryProvider.properties.list(input, ctx)
    } catch (error) {
        const fallbackProvider = await configuredFallbackProvider(mode)

        if (!fallbackProvider) {
            throw error
        }

        logger.warn('Primary property list provider failed. Falling back.', {
            requestId: ctx.requestId,
            backendMode: mode,
            fallbackMode: fallbackProvider.mode,
            error: error instanceof Error ? error.message : 'Unknown error',
        })

        return fallbackProvider.properties.list(input, ctx)
    }
}

export async function getPropertyBySlug(
    mode: BackendMode,
    slug: string,
    ctx: RequestContext,
) {
    const primaryProvider = getProvider(mode)

    try {
        return await primaryProvider.properties.getBySlug(slug, ctx)
    } catch (error) {
        const fallbackProvider = await configuredFallbackProvider(mode)

        if (!fallbackProvider) {
            throw error
        }

        logger.warn('Primary property detail provider failed. Falling back.', {
            requestId: ctx.requestId,
            backendMode: mode,
            fallbackMode: fallbackProvider.mode,
            slug,
            error: error instanceof Error ? error.message : 'Unknown error',
        })

        return fallbackProvider.properties.getBySlug(slug, ctx)
    }
}

export async function createProperty(
    mode: BackendMode,
    input: CreatePropertyInput,
    ctx: AuthContext,
) {
    const primaryProvider = getProvider(mode)
    return primaryProvider.properties.create(input, ctx)
}
