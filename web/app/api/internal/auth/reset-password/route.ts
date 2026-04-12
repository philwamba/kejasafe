import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { resetPasswordSchema } from '@/lib/core/auth/schemas'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { resetPasswordWithProvider } from '@/lib/core/services/auth-service'

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    try {
        const body = resetPasswordSchema.parse(await request.json())
        const mode = await resolveBackendModeForRequest(request)
        const result = await resetPasswordWithProvider(
            mode,
            {
                email: body.email,
                token: body.token,
                password: body.password,
            },
            buildRequestContextFromNextRequest(request),
        )

        return jsonSuccess(result)
    } catch (error) {
        return jsonError(
            error instanceof Error
                ? error.message
                : 'Unable to reset password.',
            422,
        )
    }
}
