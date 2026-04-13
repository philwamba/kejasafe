import { NextRequest } from 'next/server'
import argon2 from 'argon2'
import { z } from 'zod'

import { writeAuditLog } from '@/lib/core/audit/log'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { jsonError, jsonPaginated, jsonSuccess } from '@/lib/core/http/response'
import { prisma } from '@/lib/core/prisma/client'

export async function GET(request: NextRequest) {
    const actor = await getServerCurrentUser()
    if (!actor) return jsonError('Authentication required.', 401)
    if (!hasAnyPermission(actor.permissions, ['manage_users'])) {
        return jsonError('Forbidden.', 403)
    }

    const params = request.nextUrl.searchParams
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const perPage = Math.min(
        100,
        Math.max(1, Number(params.get('perPage') ?? 20)),
    )
    const search = (params.get('q') ?? '').trim()
    const status = params.get('status') ?? undefined
    const roleFilter = params.get('role') ?? undefined

    const where = {
        ...(status
            ? {
                  status: status as
                      | 'active'
                      | 'invited'
                      | 'suspended'
                      | 'deactivated',
              }
            : {}),
        ...(search
            ? {
                  OR: [
                      { fullName: { contains: search, mode: 'insensitive' as const } },
                      { email: { contains: search, mode: 'insensitive' as const } },
                      { phone: { contains: search, mode: 'insensitive' as const } },
                  ],
              }
            : {}),
        ...(roleFilter
            ? {
                  userRoles: {
                      some: { role: { name: roleFilter } },
                  },
              }
            : {}),
    }

    const [items, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
                userRoles: {
                    select: {
                        role: { select: { name: true } },
                    },
                },
            },
        }),
        prisma.user.count({ where }),
    ])

    return jsonPaginated(
        items.map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            status: user.status,
            roles: user.userRoles.map(r => r.role.name),
            emailVerifiedAt: user.emailVerifiedAt,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        })),
        {
            page,
            perPage,
            total,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
        },
    )
}

const inviteSchema = z.object({
    fullName: z.string().min(3).max(120),
    email: z.string().email(),
    phone: z.string().min(10).max(20),
    roles: z.array(z.string()).min(1),
})

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const actor = await getServerCurrentUser()
    if (!actor) return jsonError('Authentication required.', 401)
    if (!hasAnyPermission(actor.permissions, ['manage_users'])) {
        return jsonError('Forbidden.', 403)
    }

    try {
        const body = await request.json()
        const parsed = inviteSchema.parse(body)
        const mode = await resolveBackendModeForRequest(request)
        const ctx = buildRequestContextFromNextRequest(request)

        const existing = await prisma.user.findUnique({
            where: { email: parsed.email.toLowerCase() },
        })
        if (existing) {
            return jsonError('A user with this email already exists.', 409)
        }

        const tempPassword = crypto.randomUUID().slice(0, 16)
        const passwordHash = await argon2.hash(tempPassword)

        const roles = await prisma.role.findMany({
            where: { name: { in: parsed.roles } },
        })
        if (roles.length === 0) {
            return jsonError('No valid roles provided.', 422)
        }

        const created = await prisma.user.create({
            data: {
                fullName: parsed.fullName,
                email: parsed.email.toLowerCase(),
                phone: parsed.phone,
                passwordHash,
                status: 'invited',
                profile: { create: {} },
                userRoles: {
                    create: roles.map(role => ({
                        roleId: role.id,
                        assignedBy: actor.id,
                    })),
                },
            },
            select: { id: true, email: true, fullName: true },
        })

        await writeAuditLog({
            actorUserId: actor.id,
            action: 'user.invited',
            entityType: 'user',
            entityId: created.id,
            backendProcessedBy: mode,
            metadata: { email: created.email, roles: parsed.roles },
            ctx,
        })

        return jsonSuccess(
            {
                user: created,
                temporaryPassword: tempPassword,
            },
            { status: 201 },
        )
    } catch (error) {
        return jsonError(
            error instanceof Error ? error.message : 'Unable to invite user.',
            422,
        )
    }
}
