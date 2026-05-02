import { laravelApiClient } from '@/lib/core/http/axios'
import type { CatalogProvider } from '@/lib/core/contracts/catalog'
import type { RequestContext } from '@/lib/core/contracts/common'
import type { ApiDataEnvelope } from '@/lib/shared/types/api'

function buildHeaders(ctx: RequestContext) {
    return {
        ...(ctx.cookieHeader ? { Cookie: ctx.cookieHeader } : {}),
        'X-Request-Id': ctx.requestId,
    }
}

export const laravelCatalogProvider: CatalogProvider = {
    async listPropertyTypes(ctx) {
        const response = await laravelApiClient.get<
            ApiDataEnvelope<Array<{ slug: string; name: string }>>
        >('/catalog/property-types', {
            headers: buildHeaders(ctx),
        })

        return response.data.data
    },
}
