import { NextRequest } from 'next/server'

import { getServerCurrentUser } from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { jsonError, jsonPaginated } from '@/lib/core/http/response'
import { prisma } from '@/lib/core/prisma/client'

export async function GET(request: NextRequest) {
    const actor = await getServerCurrentUser()
    if (!actor) return jsonError('Authentication required.', 401)
    if (!hasAnyPermission(actor.permissions, ['view_audit_logs'])) {
        return jsonError('Forbidden.', 403)
    }

    const params = request.nextUrl.searchParams
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const perPage = Math.min(
        100,
        Math.max(1, Number(params.get('perPage') ?? 25)),
    )
    const action = params.get('action') ?? undefined
    const entityType = params.get('entityType') ?? undefined
    const level = params.get('level') ?? undefined
    const search = (params.get('q') ?? '').trim()

    const where = {
        ...(action ? { action: { contains: action } } : {}),
        ...(entityType ? { entityType } : {}),
        ...(level
            ? { level: level as 'info' | 'warning' | 'critical' }
            : {}),
        ...(search
            ? {
                  OR: [
                      {
                          action: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          entityType: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          actor: {
                              OR: [
                                  {
                                      fullName: {
                                          contains: search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                                  {
                                      email: {
                                          contains: search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                              ],
                          },
                      },
                  ],
              }
            : {}),
    }

    const [items, total] = await prisma.$transaction([
        prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
            include: {
                actor: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        }),
        prisma.auditLog.count({ where }),
    ])

    return jsonPaginated(items, {
        page,
        perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
    })
}
