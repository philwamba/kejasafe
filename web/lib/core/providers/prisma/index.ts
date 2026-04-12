import type { ApplicationProvider } from '@/lib/core/contracts/providers'
import { prismaAuthProvider } from '@/lib/core/providers/prisma/auth'
import { prismaPropertyProvider } from '@/lib/core/providers/prisma/properties'
import { prismaSystemProvider } from '@/lib/core/providers/prisma/system'

export const prismaProvider: ApplicationProvider = {
    mode: 'prisma_neon',
    auth: prismaAuthProvider,
    properties: prismaPropertyProvider,
    system: prismaSystemProvider,
}
