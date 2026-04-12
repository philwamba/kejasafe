import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { getPropertyBySlug } from '@/lib/core/services/property-service'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> },
) {
    try {
        const mode = await resolveBackendModeForRequest(request)
        const { slug } = await context.params
        const property = await getPropertyBySlug(
            mode,
            slug,
            buildRequestContextFromNextRequest(request),
        )

        if (!property) {
            return jsonError('Property not found.', 404)
        }

        return jsonSuccess(property)
    } catch (error) {
        return jsonError(error)
    }
}
