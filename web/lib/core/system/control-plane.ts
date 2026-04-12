import { unstable_cache, revalidateTag } from 'next/cache'

import { env } from '@/lib/config/env'
import { prisma } from '@/lib/core/prisma/client'
import type {
    AuthContext,
    BackendMode,
    RequestContext,
} from '@/lib/core/contracts/common'
import type { BackendSettingDto } from '@/lib/core/contracts/system'
import { getProvider } from '@/lib/core/providers/provider-registry'

const BACKEND_SETTING_TAG = 'backend-setting'

function mapBackendSetting(setting: {
    id: string
    activeMode: BackendMode
    fallbackMode: BackendMode | null
    version: number
    lastSwitchedAt: Date | null
    lastSwitchedByUserId: string | null
    lastSyncAt: Date | null
    switchNotes: string | null
}): BackendSettingDto {
    return {
        id: setting.id,
        activeMode: setting.activeMode,
        fallbackMode: setting.fallbackMode,
        version: setting.version,
        lastSwitchedAt: setting.lastSwitchedAt?.toISOString() ?? null,
        lastSwitchedByUserId: setting.lastSwitchedByUserId,
        lastSyncAt: setting.lastSyncAt?.toISOString() ?? null,
        switchNotes: setting.switchNotes,
    }
}

const loadCachedBackendSetting = unstable_cache(
    async () => {
        const setting = await prisma.backendSetting.findFirst({
            orderBy: {
                updatedAt: 'desc',
            },
        })

        return setting ? mapBackendSetting(setting) : null
    },
    ['backend-setting'],
    {
        tags: [BACKEND_SETTING_TAG],
        revalidate: 60,
    },
)

export async function getConfiguredBackendSetting() {
    return loadCachedBackendSetting()
}

export async function getConfiguredBackendMode() {
    const setting = await getConfiguredBackendSetting()

    return setting?.activeMode ?? env.ACTIVE_BACKEND_MODE
}

export async function listSystemHealth(ctx: RequestContext) {
    return Promise.all([
        getProvider('prisma_neon').system.health(ctx),
        getProvider('laravel_api').system.health(ctx),
    ])
}

export async function switchConfiguredBackend(
    input: {
        activeMode: BackendMode
        fallbackMode?: BackendMode | null
        switchNotes?: string
    },
    ctx: AuthContext,
) {
    const targetHealth = await getProvider(input.activeMode).system.health(ctx)

    if (!targetHealth.isHealthy) {
        throw new Error(
            `Cannot switch to ${input.activeMode} because it is unhealthy.`,
        )
    }

    const existing = await prisma.backendSetting.findFirst({
        orderBy: {
            updatedAt: 'desc',
        },
    })

    const setting = existing
        ? await prisma.backendSetting.update({
              where: { id: existing.id },
              data: {
                  activeMode: input.activeMode,
                  fallbackMode: input.fallbackMode ?? null,
                  version: {
                      increment: 1,
                  },
                  lastSwitchedAt: new Date(),
                  lastSwitchedByUserId: ctx.userId,
                  switchNotes: input.switchNotes ?? null,
              },
          })
        : await prisma.backendSetting.create({
              data: {
                  activeMode: input.activeMode,
                  fallbackMode: input.fallbackMode ?? null,
                  version: 1,
                  lastSwitchedAt: new Date(),
                  lastSwitchedByUserId: ctx.userId,
                  switchNotes: input.switchNotes ?? null,
              },
          })

    await prisma.auditLog.create({
        data: {
            actorUserId: ctx.userId,
            action: 'backend.switch',
            entityType: 'backend_setting',
            entityId: setting.id,
            backendProcessedBy: 'prisma_neon',
            ipAddress: ctx.ipAddress ?? undefined,
            userAgent: ctx.userAgent ?? undefined,
            metadata: {
                activeMode: input.activeMode,
                fallbackMode: input.fallbackMode ?? null,
                switchNotes: input.switchNotes ?? null,
            },
        },
    })

    await prisma.activityLog.create({
        data: {
            actorUserId: ctx.userId,
            event: 'backend_switched',
            subjectType: 'backend_setting',
            subjectId: setting.id,
            backendProcessedBy: 'prisma_neon',
            metadata: {
                activeMode: input.activeMode,
                fallbackMode: input.fallbackMode ?? null,
            },
        },
    })

    revalidateTag(BACKEND_SETTING_TAG, 'max')

    return mapBackendSetting(setting)
}
