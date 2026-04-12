import { prisma } from '@/lib/core/prisma/client'
import type { SystemProvider } from '@/lib/core/contracts/system'
import type { RequestContext } from '@/lib/core/contracts/common'

export const prismaSystemProvider: SystemProvider = {
    async activeBackend(_ctx: RequestContext) {
        const setting = await prisma.backendSetting.findFirst({
            orderBy: {
                updatedAt: 'desc',
            },
        })

        return setting?.activeMode ?? 'prisma_neon'
    },

    async health(_ctx: RequestContext) {
        const startedAt = Date.now()

        try {
            await prisma.$queryRaw`SELECT 1`

            return {
                mode: 'prisma_neon',
                isHealthy: true,
                latencyMs: Date.now() - startedAt,
                checkedAt: new Date().toISOString(),
                details: {
                    database: 'reachable',
                },
            }
        } catch (error) {
            return {
                mode: 'prisma_neon',
                isHealthy: false,
                latencyMs: Date.now() - startedAt,
                checkedAt: new Date().toISOString(),
                details: {
                    database: 'unreachable',
                    reason:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
            }
        }
    },
}
