import type { RequestContext } from '@/lib/core/contracts/common'

export interface AdminActivityEntry {
    id: string
    action: string
    entityType: string
    entityId: string | null
    createdAt: Date
    actor: {
        id: string
        fullName: string
        email: string
    } | null
}

export interface AdminDashboardSummary {
    pendingCount: number
    publishedCount: number
    totalProperties: number
    totalUsers: number
    recentActivity: AdminActivityEntry[]
}

export interface AdminShellSummary {
    pendingModerationCount: number
}

export interface AuditLogListInput {
    page: number
    perPage: number
    search?: string
    level?: string
    entityType?: string
}

export interface AuditLogEntry extends AdminActivityEntry {
    level: string
    backendProcessedBy: string
}

export interface AuditLogListResult {
    items: AuditLogEntry[]
    total: number
    allCount: number
}

export interface AdminUserListInput {
    page: number
    perPage: number
    search?: string
    status?: string
}

export interface RoleOption {
    id: string
    name: string
    description: string | null
}

export interface AdminUserListItem {
    id: string
    fullName: string
    email: string
    phone: string | null
    status: string
    lastLoginAt: Date | null
    createdAt: Date
    userRoles: Array<{ role: { name: string } }>
}

export interface AdminUserListResult {
    users: AdminUserListItem[]
    total: number
    totals: number
}

export interface UserDetail {
    id: string
    fullName: string
    email: string
    phone: string | null
    status: string
    emailVerifiedAt: Date | null
    phoneVerifiedAt: Date | null
    lastLoginAt: Date | null
    lastLoginIp: string | null
    createdAt: Date
    avatarUrl: string | null
    userRoles: Array<{ role: RoleOption }>
}

export interface UserAuditEntry {
    id: string
    action: string
    entityType: string
    entityId: string | null
    createdAt: Date
}

export interface UserDetailResult {
    user: UserDetail | null
    allRoles: RoleOption[]
    recentActivity: UserAuditEntry[]
}

export interface ModerationQueueInput {
    page: number
    perPage: number
    search?: string
    status?: string
}

export interface ModerationQueueItem {
    id: string
    title: string
    price: number
    listingPurpose: string
    moderationStatus: string
    submittedAt: Date | null
    county: { name: string }
    city: { name: string } | null
    propertyType: { name: string }
    images: Array<{ url: string }>
    owner: {
        id: string
        fullName: string
        email: string
        phone: string | null
    }
}

export interface ModerationQueueResult {
    items: ModerationQueueItem[]
    total: number
    pendingTotal: number
}

export interface ModerationDetail {
    id: string
    title: string
    summary: string
    description: string
    price: number
    bedrooms: number | null
    bathrooms: number | null
    listingPurpose: string
    submittedAt: Date | null
    county: { name: string }
    city: { name: string } | null
    neighborhood: { name: string } | null
    propertyType: { name: string }
    images: Array<{
        id: string
        url: string
        altText: string | null
        isCover: boolean
    }>
    owner: {
        id: string
        fullName: string
        email: string
        phone: string | null
        createdAt: Date
    }
}

export interface AdminProvider {
    shellSummary(ctx: RequestContext): Promise<AdminShellSummary>
    dashboardSummary(ctx: RequestContext): Promise<AdminDashboardSummary>
    auditLogs(
        input: AuditLogListInput,
        ctx: RequestContext,
    ): Promise<AuditLogListResult>
    users(
        input: AdminUserListInput,
        ctx: RequestContext,
    ): Promise<AdminUserListResult>
    userDetail(id: string, ctx: RequestContext): Promise<UserDetailResult>
    roles(ctx: RequestContext): Promise<RoleOption[]>
    moderationQueue(
        input: ModerationQueueInput,
        ctx: RequestContext,
    ): Promise<ModerationQueueResult>
    moderationDetail(
        id: string,
        ctx: RequestContext,
    ): Promise<ModerationDetail | null>
}
