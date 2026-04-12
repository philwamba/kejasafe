import type { PaginationMeta } from '@/lib/shared/types/api'

export type BackendMode = 'prisma_neon' | 'laravel_api'

export interface RequestContext {
    requestId: string
    ipAddress?: string | null
    userAgent?: string | null
    cookieHeader?: string | null
}

export interface AuthContext extends RequestContext {
    userId: string
    roles: string[]
    permissions: string[]
    backendMode: BackendMode
}

export interface PaginatedResult<T> {
    data: T[]
    meta: PaginationMeta
}
