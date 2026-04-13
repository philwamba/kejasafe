import { laravelApiClient } from '@/lib/core/http/axios'
import type {
    CreatePropertyInput,
    PropertyDetailDto,
    PropertyProvider,
    PropertySearchInput,
} from '@/lib/core/contracts/property'
import type { AuthContext, RequestContext } from '@/lib/core/contracts/common'
import type { ApiDataEnvelope, ApiListEnvelope } from '@/lib/shared/types/api'
import type { PropertyCardDto } from '@/lib/shared/types/property'

function buildHeaders(ctx: RequestContext) {
    return {
        ...(ctx.cookieHeader ? { Cookie: ctx.cookieHeader } : {}),
        'X-Request-Id': ctx.requestId,
    }
}

export const laravelPropertyProvider: PropertyProvider = {
    async list(input: PropertySearchInput, ctx: RequestContext) {
        const response = await laravelApiClient.get<
            ApiListEnvelope<PropertyCardDto>
        >('/public/properties', {
            headers: buildHeaders(ctx),
            params: input,
        })

        return response.data
    },

    async getBySlug(slug: string, ctx: RequestContext) {
        try {
            const response = await laravelApiClient.get<
                ApiDataEnvelope<PropertyDetailDto>
            >(`/public/properties/${slug}`, {
                headers: buildHeaders(ctx),
            })

            return response.data.data
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.toLowerCase().includes('not found')
            ) {
                return null
            }

            throw error
        }
    },

    async create(input: CreatePropertyInput, ctx: AuthContext) {
        const response = await laravelApiClient.post<
            ApiDataEnvelope<PropertyDetailDto>
        >('/properties', input, {
            headers: buildHeaders(ctx),
        })

        return response.data.data
    },
}
