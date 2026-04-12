import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { getCurrentUser } from '@/lib/core/services/auth-service'

export async function GET(request: NextRequest) {
    const mode = await resolveBackendModeForRequest(request)
    const user = await getCurrentUser(
        mode,
        buildRequestContextFromNextRequest(request),
    )

    if (!user) {
        return jsonError('Unauthenticated.', 401)
    }

    return jsonSuccess(user)
}
