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

const patchSchema = z.object({
    status: z.enum(['active', 'invited', 'suspended', 'deactivated']).optional(),
    roles: z.array(z.string()).optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const actor = await getServerCurrentUser()
    if (!actor) return jsonError('Authentication required.', 401)
    if (!hasAnyPermission(actor.permissions, ['manage_users'])) {
        return jsonError('Forbidden.', 403)
    }

    const { id } = await params

    if (id === actor.id) {
        return jsonError(
            'You cannot change your own status or roles from the admin panel.',
            422,
        )
    }

    try {
        const body = await request.json()
        const parsed = patchSchema.parse(body)
        const mode = await resolveBackendModeForRequest(request)
        const ctx = buildRequestContextFromNextRequest(request)

        const updates: {
            status?: 'active' | 'invited' | 'suspended' | 'deactivated'
        } = {}
        if (parsed.status) updates.status = parsed.status

        const user = await prisma.$transaction(async tx => {
            if (Object.keys(updates).length > 0) {
                await tx.user.update({
                    where: { id },
                    data: updates,
                })
            }

            if (parsed.roles) {
                const roles = await tx.role.findMany({
                    where: { name: { in: parsed.roles } },
                })
                await tx.userRole.deleteMany({ where: { userId: id } })
                if (roles.length > 0) {
                    await tx.userRole.createMany({
                        data: roles.map(role => ({
                            userId: id,
                            roleId: role.id,
                            assignedBy: actor.id,
                        })),
                    })
                }
            }

            return tx.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    status: true,
                    userRoles: {
                        select: { role: { select: { name: true } } },
                    },
                },
            })
        })

        if (!user) {
            return jsonError('User not found.', 404)
        }

        await writeAuditLog({
            actorUserId: actor.id,
            action: parsed.status
                ? `user.status.${parsed.status}`
                : 'user.roles_updated',
            entityType: 'user',
            entityId: id,
            backendProcessedBy: mode,
            metadata: {
                status: parsed.status,
                roles: parsed.roles,
            },
            ctx,
        })

        return jsonSuccess({
            ...user,
            roles: user.userRoles.map(r => r.role.name),
        })
    } catch (error) {
        return jsonError(
            error instanceof Error ? error.message : 'Unable to update user.',
            422,
        )
    }
}
