import { NextRequest } from 'next/server'
import { z } from 'zod'

import { writeAuditLog } from '@/lib/core/audit/log'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { prisma } from '@/lib/core/prisma/client'

const approveSchema = z.object({
    notes: z.string().max(2000).optional(),
})

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const user = await getServerCurrentUser()
    if (!user) return jsonError('Authentication required.', 401)
    if (!hasAnyPermission(user.permissions, ['approve_listings'])) {
        return jsonError('Forbidden.', 403)
    }

    const { id } = await params

    try {
        const body = await request.json().catch(() => ({}))
        const parsed = approveSchema.parse(body)
        const mode = await resolveBackendModeForRequest(request)
        const ctx = buildRequestContextFromNextRequest(request)

        const updated = await prisma.property.update({
            where: { id },
            data: {
                moderationStatus: 'approved',
                listingStatus: 'published',
                publishedAt: new Date(),
                reviewedAt: new Date(),
                reviewedByUserId: user.id,
                moderationNotes: parsed.notes ?? null,
                rejectionReason: null,
            },
        })

        await writeAuditLog({
            actorUserId: user.id,
            action: 'property.approved',
            entityType: 'property',
            entityId: id,
            backendProcessedBy: mode,
            metadata: { notes: parsed.notes },
            ctx,
        })

        return jsonSuccess(updated)
    } catch (error) {
        return jsonError(
            error instanceof Error ? error.message : 'Unable to approve.',
            422,
        )
    }
}
