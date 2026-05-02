import { laravelApiClient } from '@/lib/core/http/axios'
import type {
    DashboardProvider,
    PortalDashboardSummary,
    TenantDashboardStats,
} from '@/lib/core/contracts/dashboard'
import type { RequestContext } from '@/lib/core/contracts/common'
import type { ApiDataEnvelope } from '@/lib/shared/types/api'

function buildHeaders(ctx: RequestContext) {
    return {
        ...(ctx.cookieHeader ? { Cookie: ctx.cookieHeader } : {}),
        'X-Request-Id': ctx.requestId,
    }
}

export const laravelDashboardProvider: DashboardProvider = {
    async tenantStats(_userId, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<TenantDashboardStats>
        >('/dashboard/tenant', { headers: buildHeaders(ctx) })

        return response.data.data
    },

    async portalSummary(_userId, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<PortalDashboardSummary>
        >('/dashboard/portal', { headers: buildHeaders(ctx) })

        return response.data.data
    },

    async portalPendingCount(_userId, ctx) {
        const summary = await this.portalSummary(_userId, ctx)

        return summary.pendingCount
    },
}
