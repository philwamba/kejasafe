import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { jsonError, jsonPaginated } from '@/lib/core/http/response'
import { prisma } from '@/lib/core/prisma/client'

export async function GET(request: NextRequest) {
    const user = await getServerCurrentUser()
    if (!user) return jsonError('Authentication required.', 401)
    if (!hasAnyPermission(user.permissions, ['approve_listings'])) {
        return jsonError('Forbidden.', 403)
    }

    // Context reserved for future audit/logging use.
    void buildRequestContextFromNextRequest(request)
    void (await resolveBackendModeForRequest(request))

    const page = Number(request.nextUrl.searchParams.get('page') ?? 1)
    const perPage = Math.min(
        Number(request.nextUrl.searchParams.get('perPage') ?? 20),
        100,
    )

    const [items, total] = await prisma.$transaction([
        prisma.property.findMany({
            where: { moderationStatus: 'pending_review' },
            orderBy: { submittedAt: 'asc' },
            skip: (page - 1) * perPage,
            take: perPage,
            include: {
                county: true,
                city: true,
                neighborhood: true,
                propertyType: true,
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
                images: { orderBy: { position: 'asc' } },
            },
        }),
        prisma.property.count({
            where: { moderationStatus: 'pending_review' },
        }),
    ])

    return jsonPaginated(items, {
        page,
        perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
    })
}
