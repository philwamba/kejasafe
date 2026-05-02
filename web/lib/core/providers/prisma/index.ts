import type { ApplicationProvider } from '@/lib/core/contracts/providers'
import { prismaAdminProvider } from '@/lib/core/providers/prisma/admin'
import { prismaAuthProvider } from '@/lib/core/providers/prisma/auth'
import { prismaCatalogProvider } from '@/lib/core/providers/prisma/catalog'
import { prismaDashboardProvider } from '@/lib/core/providers/prisma/dashboard'
import { prismaPropertyProvider } from '@/lib/core/providers/prisma/properties'
import { prismaSystemProvider } from '@/lib/core/providers/prisma/system'

export const prismaProvider: ApplicationProvider = {
    mode: 'prisma_neon',
    auth: prismaAuthProvider,
    admin: prismaAdminProvider,
    catalog: prismaCatalogProvider,
    dashboard: prismaDashboardProvider,
    properties: prismaPropertyProvider,
    system: prismaSystemProvider,
}
