import { NextRequest } from 'next/server'

import { buildRequestContextFromNextRequest } from '@/lib/core/auth/request'
import { jsonError, jsonSuccess } from '@/lib/core/http/response'
import { listSystemHealth } from '@/lib/core/services/system-service'

export async function GET(request: NextRequest) {
    try {
        const result = await listSystemHealth(
            buildRequestContextFromNextRequest(request),
        )

        return jsonSuccess(result)
    } catch (error) {
        return jsonError(error)
    }
}
