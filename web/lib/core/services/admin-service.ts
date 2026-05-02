import type {
    AdminUserListInput,
    AuditLogListInput,
    ModerationQueueInput,
} from '@/lib/core/contracts/admin'
import type { RequestContext } from '@/lib/core/contracts/common'
import { readFromActiveProvider } from '@/lib/core/services/provider-read'

export function getAdminShellSummary(ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.shellSummary(ctx),
        { feature: 'admin.shellSummary' },
    )
}

export function getAdminDashboardSummary(ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.dashboardSummary(ctx),
        { feature: 'admin.dashboardSummary' },
    )
}

export function listAuditLogs(input: AuditLogListInput, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.auditLogs(input, ctx),
        { feature: 'admin.auditLogs' },
    )
}

export function listAdminUsers(input: AdminUserListInput, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.users(input, ctx),
        { feature: 'admin.users' },
    )
}

export function getAdminUserDetail(id: string, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.userDetail(id, ctx),
        { feature: 'admin.userDetail' },
    )
}

export function listAdminRoles(ctx: RequestContext) {
    return readFromActiveProvider(ctx, provider => provider.admin.roles(ctx), {
        feature: 'admin.roles',
    })
}

export function listModerationQueue(
    input: ModerationQueueInput,
    ctx: RequestContext,
) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.moderationQueue(input, ctx),
        { feature: 'admin.moderationQueue' },
    )
}

export function getModerationDetail(id: string, ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.admin.moderationDetail(id, ctx),
        { feature: 'admin.moderationDetail' },
    )
}
