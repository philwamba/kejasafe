import { NextRequest } from 'next/server'
import { z } from 'zod'

import { getServerCurrentUser } from '@/lib/core/auth/server'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import {
    isAllowedImageType,
    presignPropertyImageUpload,
} from '@/lib/core/storage/r2'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

const presignSchema = z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().min(1).max(100),
    contentLength: z.number().int().positive().max(MAX_BYTES),
})

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const user = await getServerCurrentUser()
    if (!user) {
        return jsonError('Authentication required.', 401)
    }

    try {
        const body = await request.json()
        const parsed = presignSchema.parse(body)

        if (!isAllowedImageType(parsed.contentType)) {
            return jsonError(
                `Unsupported content type. Allowed: image/jpeg, image/png, image/webp, image/avif.`,
                415,
            )
        }

        const result = await presignPropertyImageUpload({
            ownerUserId: user.id,
            filename: parsed.filename,
            contentType: parsed.contentType,
            contentLength: parsed.contentLength,
        })

        return jsonSuccess(result)
    } catch (error) {
        return jsonError(
            error instanceof Error ? error.message : 'Unable to presign upload.',
            422,
        )
    }
}
