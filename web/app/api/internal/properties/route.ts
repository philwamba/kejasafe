import { NextRequest } from 'next/server'

import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { jsonError, jsonPaginated } from '@/lib/core/http/response'
import {
    readArrayParam,
    readBooleanParam,
    readNumberParam,
    readStringParam,
} from '@/lib/core/query-state'
import { listProperties } from '@/lib/core/services/property-service'
import type { PropertySearchInput } from '@/lib/core/contracts/property'

function buildSearchInput(request: NextRequest): PropertySearchInput {
    const params = request.nextUrl.searchParams

    return {
        page: readNumberParam(params, 'page'),
        perPage: readNumberParam(params, 'perPage'),
        county: readStringParam(params, 'county'),
        city: readStringParam(params, 'city'),
        neighborhood: readStringParam(params, 'neighborhood'),
        propertyType: readStringParam(params, 'propertyType'),
        listingPurpose: readStringParam(
            params,
            'listingPurpose',
        ) as PropertySearchInput['listingPurpose'],
        minPrice: readNumberParam(params, 'minPrice'),
        maxPrice: readNumberParam(params, 'maxPrice'),
        bedrooms: readNumberParam(params, 'bedrooms'),
        bathrooms: readNumberParam(params, 'bathrooms'),
        amenities: readArrayParam(params, 'amenities'),
        petsAllowed: readBooleanParam(params, 'petsAllowed'),
        furnished: readBooleanParam(params, 'furnished'),
        sortBy: readStringParam(
            params,
            'sortBy',
        ) as PropertySearchInput['sortBy'],
    }
}

export async function GET(request: NextRequest) {
    try {
        const mode = await resolveBackendModeForRequest(request)
        const result = await listProperties(
            mode,
            buildSearchInput(request),
            buildRequestContextFromNextRequest(request),
        )

        return jsonPaginated(result.data, result.meta)
    } catch (error) {
        return jsonError(error)
    }
}
