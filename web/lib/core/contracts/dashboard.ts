import type { RequestContext } from '@/lib/core/contracts/common'

export interface TenantDashboardStats {
    savedCount: number
    mySubmissions: number
}

export interface PortalListingSummary {
    id: string
    slug: string
    title: string
    price: number
    listingPurpose: string
    moderationStatus: string
    rejectionReason: string | null
    submittedAt: Date | null
    county: { name: string }
    city: { name: string } | null
    images: Array<{ url: string }>
}

export interface PortalDashboardSummary {
    listings: PortalListingSummary[]
    publishedCount: number
    pendingCount: number
    rejectedCount: number
}

export interface DashboardProvider {
    tenantStats(
        userId: string,
        ctx: RequestContext,
    ): Promise<TenantDashboardStats>
    portalSummary(
        userId: string,
        ctx: RequestContext,
    ): Promise<PortalDashboardSummary>
    portalPendingCount(userId: string, ctx: RequestContext): Promise<number>
}
