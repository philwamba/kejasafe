import { laravelApiClient } from '@/lib/core/http/axios'
import type {
    AdminDashboardSummary,
    AdminProvider,
    AdminShellSummary,
    AdminUserListResult,
    AuditLogListResult,
    ModerationDetail,
    ModerationQueueResult,
    RoleOption,
    UserDetailResult,
} from '@/lib/core/contracts/admin'
import type { RequestContext } from '@/lib/core/contracts/common'
import type { ApiDataEnvelope } from '@/lib/shared/types/api'

function buildHeaders(ctx: RequestContext) {
    return {
        ...(ctx.cookieHeader ? { Cookie: ctx.cookieHeader } : {}),
        'X-Request-Id': ctx.requestId,
    }
}

export const laravelAdminProvider: AdminProvider = {
    async shellSummary(ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<AdminShellSummary>
        >('/admin/shell', { headers: buildHeaders(ctx) })

        return response.data.data
    },

    async dashboardSummary(ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<AdminDashboardSummary>
        >('/admin/dashboard', { headers: buildHeaders(ctx) })

        return response.data.data
    },

    async auditLogs(input, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<AuditLogListResult>
        >('/admin/audit', { headers: buildHeaders(ctx), params: input })

        return response.data.data
    },

    async users(input, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<AdminUserListResult>
        >('/admin/users', { headers: buildHeaders(ctx), params: input })

        return response.data.data
    },

    async userDetail(id, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<UserDetailResult>
        >(`/admin/users/${id}`, { headers: buildHeaders(ctx) })

        return response.data.data
    },

    async roles(ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<RoleOption[]>
        >('/admin/roles', { headers: buildHeaders(ctx) })

        return response.data.data
    },

    async moderationQueue(input, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<ModerationQueueResult>
        >('/admin/properties/moderation', {
            headers: buildHeaders(ctx),
            params: input,
        })

        return response.data.data
    },

    async moderationDetail(id, ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<ModerationDetail>
        >(`/admin/properties/moderation/${id}`, { headers: buildHeaders(ctx) })

        return response.data.data
    },
}
