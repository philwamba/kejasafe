import { internalApiClient } from '@/lib/core/http/axios'
import { isAppError } from '@/lib/core/errors'
import { buildQueryString } from '@/lib/core/query-state'
import type {
    PropertyDetailDto,
    PropertySearchInput,
} from '@/lib/core/contracts/property'
import type { ApiDataEnvelope, ApiListEnvelope } from '@/lib/shared/types/api'
import type { PropertyCardDto } from '@/lib/shared/types/property'

export async function fetchProperties(input: PropertySearchInput = {}) {
    const query = buildQueryString({
        ...input,
        amenities: input.amenities?.length ? input.amenities : undefined,
    })
    const path = query ? `/properties?${query}` : '/properties'
    const response =
        await internalApiClient.get<ApiListEnvelope<PropertyCardDto>>(path)

    return response.data
}

export async function fetchPropertyBySlug(slug: string) {
    try {
        const response = await internalApiClient.get<
            ApiDataEnvelope<PropertyDetailDto>
        >(`/properties/${slug}`)

        return response.data.data
    } catch (error) {
        if (isAppError(error) && error.status === 404) {
            return null
        }

        throw error
    }
}
