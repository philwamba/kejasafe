import type { RequestContext } from '@/lib/core/contracts/common'
import { readFromActiveProvider } from '@/lib/core/services/provider-read'

export function getTenantDashboardStats(userId: string, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.dashboard.tenantStats(userId, ctx),
        { feature: 'dashboard.tenantStats' },
    )
}

export function getPortalDashboardSummary(userId: string, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.dashboard.portalSummary(userId, ctx),
        { feature: 'dashboard.portalSummary' },
    )
}

export function getPortalPendingCount(userId: string, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.dashboard.portalPendingCount(userId, ctx),
        { feature: 'dashboard.portalPendingCount' },
    )
}
