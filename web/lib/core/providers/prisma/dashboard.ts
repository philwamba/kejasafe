import { prisma } from '@/lib/core/prisma/client'
import type { DashboardProvider } from '@/lib/core/contracts/dashboard'

export const prismaDashboardProvider: DashboardProvider = {
    async tenantStats(userId) {
        const [savedCount, mySubmissions] = await Promise.all([
            prisma.favorite.count({ where: { userId } }),
            prisma.property.count({ where: { ownerId: userId } }),
        ])

        return { savedCount, mySubmissions }
    },

    async portalSummary(userId) {
        const [listings, publishedCount, pendingCount, rejectedCount] =
            await Promise.all([
                prisma.property.findMany({
                    where: { ownerId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        price: true,
                        listingPurpose: true,
                        moderationStatus: true,
                        rejectionReason: true,
                        submittedAt: true,
                        county: { select: { name: true } },
                        city: { select: { name: true } },
                        images: {
                            take: 1,
                            orderBy: { position: 'asc' },
                            select: { url: true },
                        },
                    },
                }),
                prisma.property.count({
                    where: { ownerId: userId, listingStatus: 'published' },
                }),
                prisma.property.count({
                    where: {
                        ownerId: userId,
                        moderationStatus: 'pending_review',
                    },
                }),
                prisma.property.count({
                    where: { ownerId: userId, moderationStatus: 'rejected' },
                }),
            ])

        return {
            listings: listings.map(listing => ({
                ...listing,
                price: Number(listing.price),
            })),
            publishedCount,
            pendingCount,
            rejectedCount,
        }
    },

    async portalPendingCount(userId) {
        return prisma.property.count({
            where: {
                ownerId: userId,
                moderationStatus: 'pending_review',
            },
        })
    },
}
