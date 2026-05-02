import { prisma } from '@/lib/core/prisma/client'
import type { CatalogProvider } from '@/lib/core/contracts/catalog'

export const prismaCatalogProvider: CatalogProvider = {
    async listPropertyTypes() {
        return prisma.propertyType.findMany({
            orderBy: { name: 'asc' },
            select: { slug: true, name: true },
        })
    },
}
