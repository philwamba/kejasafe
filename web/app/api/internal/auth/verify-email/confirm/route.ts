import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { verifyEmailWithProvider } from '@/lib/core/services/auth-service'

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    try {
        const body = (await request.json()) as { token?: string }

        if (!body.token) {
            return jsonError('Verification token is required.', 422)
        }

        const result = await verifyEmailWithProvider(
            await resolveBackendModeForRequest(request),
            { token: body.token },
            buildRequestContextFromNextRequest(request),
        )

        return jsonSuccess(result)
    } catch (error) {
        return jsonError(error)
    }
}
