import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { forgotPasswordSchema } from '@/lib/core/auth/schemas'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { requestPasswordReset } from '@/lib/core/services/auth-service'

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    try {
        const body = forgotPasswordSchema.parse(await request.json())
        const mode = await resolveBackendModeForRequest(request)
        const result = await requestPasswordReset(
            mode,
            body,
            buildRequestContextFromNextRequest(request),
        )

        return jsonSuccess(result)
    } catch (error) {
        return jsonError(
            error instanceof Error
                ? error.message
                : 'Unable to issue a password reset token.',
            422,
        )
    }
}
