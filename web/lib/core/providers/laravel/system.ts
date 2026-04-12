import { laravelApiClient } from '@/lib/core/http/axios'
import type { SystemProvider } from '@/lib/core/contracts/system'
import type { RequestContext } from '@/lib/core/contracts/common'

function buildHeaders(ctx: RequestContext) {
    return {
        ...(ctx.cookieHeader ? { Cookie: ctx.cookieHeader } : {}),
        'X-Request-Id': ctx.requestId,
    }
}

export const laravelSystemProvider: SystemProvider = {
    async activeBackend() {
        return 'laravel_api'
    },

    async health(ctx: RequestContext) {
        const startedAt = Date.now()

        try {
            const response = await laravelApiClient.get<{
                name: string
                status: string
                timestamp: string
            }>('/health', {
                headers: buildHeaders(ctx),
            })

            return {
                mode: 'laravel_api',
                isHealthy: response.data.status === 'ok',
                latencyMs: Date.now() - startedAt,
                checkedAt: new Date().toISOString(),
                details: response.data,
            }
        } catch (error) {
            return {
                mode: 'laravel_api',
                isHealthy: false,
                latencyMs: Date.now() - startedAt,
                checkedAt: new Date().toISOString(),
                details: {
                    reason:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
            }
        }
    },
}
