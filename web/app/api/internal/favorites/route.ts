import { NextRequest } from 'next/server'
import { z } from 'zod'

import { getServerCurrentUser } from '@/lib/core/auth/server'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { prisma } from '@/lib/core/prisma/client'

const toggleSchema = z.object({
    propertyId: z.string().uuid(),
})

export async function GET() {
    const user = await getServerCurrentUser()
    if (!user) return jsonError('Authentication required.', 401)

    const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: { propertyId: true },
    })

    return jsonSuccess({
        propertyIds: favorites.map(f => f.propertyId),
    })
}

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const user = await getServerCurrentUser()
    if (!user) return jsonError('Authentication required.', 401)

    try {
        const body = await request.json()
        const { propertyId } = toggleSchema.parse(body)

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: { userId: user.id, propertyId },
            },
        })

        if (existing) {
            await prisma.favorite.delete({ where: { id: existing.id } })
            return jsonSuccess({ propertyId, favorited: false })
        }

        await prisma.favorite.create({
            data: { userId: user.id, propertyId },
        })
        return jsonSuccess({ propertyId, favorited: true })
    } catch (error) {
        return jsonError(
            error instanceof Error ? error.message : 'Unable to toggle favorite.',
            422,
        )
    }
}
