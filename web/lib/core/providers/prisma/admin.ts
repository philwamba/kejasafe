import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/core/prisma/client'
import type {
    AdminProvider,
    AdminUserListInput,
    AuditLogListInput,
    AuditLogListResult,
    ModerationQueueInput,
} from '@/lib/core/contracts/admin'

function auditWhere(input: AuditLogListInput): Prisma.AuditLogWhereInput {
    return {
        ...(input.level
            ? {
                  level: input.level as 'info' | 'warning' | 'critical',
              }
            : {}),
        ...(input.entityType ? { entityType: input.entityType } : {}),
        ...(input.search
            ? {
                  OR: [
                      {
                          action: {
                              contains: input.search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          entityType: {
                              contains: input.search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          actor: {
                              fullName: {
                                  contains: input.search,
                                  mode: 'insensitive' as const,
                              },
                          },
                      },
                  ],
              }
            : {}),
    }
}

function userWhere(input: AdminUserListInput): Prisma.UserWhereInput {
    return {
        ...(input.status
            ? {
                  status: input.status as
                      | 'active'
                      | 'invited'
                      | 'suspended'
                      | 'deactivated',
              }
            : {}),
        ...(input.search
            ? {
                  OR: [
                      {
                          fullName: {
                              contains: input.search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          email: {
                              contains: input.search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          phone: {
                              contains: input.search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : {}),
    }
}

function moderationWhere(
    input: ModerationQueueInput,
): Prisma.PropertyWhereInput {
    return {
        ...(input.status && input.status !== 'all'
            ? {
                  moderationStatus: input.status as
                      | 'pending_review'
                      | 'approved'
                      | 'rejected',
              }
            : {}),
        ...(input.search
            ? {
                  OR: [
                      {
                          title: {
                              contains: input.search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          owner: {
                              OR: [
                                  {
                                      fullName: {
                                          contains: input.search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                                  {
                                      email: {
                                          contains: input.search,
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
}

export const prismaAdminProvider: AdminProvider = {
    async shellSummary() {
        const pendingModerationCount = await prisma.property.count({
            where: { moderationStatus: 'pending_review' },
        })

        return { pendingModerationCount }
    },

    async dashboardSummary() {
        const [
            pendingCount,
            publishedCount,
            totalProperties,
            totalUsers,
            recentActivity,
        ] = await Promise.all([
            prisma.property.count({
                where: { moderationStatus: 'pending_review' },
            }),
            prisma.property.count({ where: { listingStatus: 'published' } }),
            prisma.property.count(),
            prisma.user.count(),
            prisma.auditLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 8,
                include: {
                    actor: {
                        select: { id: true, fullName: true, email: true },
                    },
                },
            }),
        ])

        return {
            pendingCount,
            publishedCount,
            totalProperties,
            totalUsers,
            recentActivity,
        }
    },

    async auditLogs(input, _ctx): Promise<AuditLogListResult> {
        const where = auditWhere(input)
        const [rows, total, allCount] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (input.page - 1) * input.perPage,
                take: input.perPage,
                select: {
                    id: true,
                    action: true,
                    entityType: true,
                    entityId: true,
                    backendProcessedBy: true,
                    level: true,
                    createdAt: true,
                    actor: {
                        select: { id: true, fullName: true, email: true },
                    },
                },
            }),
            prisma.auditLog.count({ where }),
            prisma.auditLog.count(),
        ])

        return { items: rows, total, allCount }
    },

    async users(input) {
        const where = userWhere(input)
        const [users, total, totals] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (input.page - 1) * input.perPage,
                take: input.perPage,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    status: true,
                    lastLoginAt: true,
                    createdAt: true,
                    userRoles: {
                        select: { role: { select: { name: true } } },
                    },
                },
            }),
            prisma.user.count({ where }),
            prisma.user.count(),
        ])

        return { users, total, totals }
    },

    async userDetail(id) {
        const [user, allRoles, recentActivity] = await Promise.all([
            prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    status: true,
                    emailVerifiedAt: true,
                    phoneVerifiedAt: true,
                    lastLoginAt: true,
                    lastLoginIp: true,
                    createdAt: true,
                    avatarUrl: true,
                    userRoles: {
                        select: {
                            role: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.role.findMany({
                orderBy: { name: 'asc' },
                select: { id: true, name: true, description: true },
            }),
            prisma.auditLog.findMany({
                where: {
                    OR: [
                        { actorUserId: id },
                        { entityId: id, entityType: 'user' },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    id: true,
                    action: true,
                    entityType: true,
                    entityId: true,
                    createdAt: true,
                },
            }),
        ])

        return { user, allRoles, recentActivity }
    },

    async roles() {
        return prisma.role.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, description: true },
        })
    },

    async moderationQueue(input) {
        const where = moderationWhere(input)
        const [items, total, pendingTotal] = await prisma.$transaction([
            prisma.property.findMany({
                where,
                orderBy: { submittedAt: 'asc' },
                skip: (input.page - 1) * input.perPage,
                take: input.perPage,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    listingPurpose: true,
                    moderationStatus: true,
                    submittedAt: true,
                    county: { select: { name: true } },
                    city: { select: { name: true } },
                    propertyType: { select: { name: true } },
                    images: {
                        take: 1,
                        orderBy: { position: 'asc' },
                        select: { url: true },
                    },
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            }),
            prisma.property.count({ where }),
            prisma.property.count({
                where: { moderationStatus: 'pending_review' },
            }),
        ])

        return {
            items: items.map(item => ({
                ...item,
                price: Number(item.price),
            })),
            total,
            pendingTotal,
        }
    },

    async moderationDetail(id) {
        const property = await prisma.property.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                summary: true,
                description: true,
                price: true,
                bedrooms: true,
                bathrooms: true,
                listingPurpose: true,
                submittedAt: true,
                county: { select: { name: true } },
                city: { select: { name: true } },
                neighborhood: { select: { name: true } },
                propertyType: { select: { name: true } },
                images: {
                    orderBy: { position: 'asc' },
                    select: {
                        id: true,
                        url: true,
                        altText: true,
                        isCover: true,
                    },
                },
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
        })

        return property ? { ...property, price: Number(property.price) } : null
    },
}
