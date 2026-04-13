import { NextRequest } from 'next/server'
import { z } from 'zod'

import { getServerCurrentUser } from '@/lib/core/auth/server'
import {
    buildRequestContextFromNextRequest,
    resolveBackendModeForRequest,
} from '@/lib/core/auth/request'
import { verifyRequestCsrf } from '@/lib/core/auth/csrf'
import { writeAuditLog } from '@/lib/core/audit/log'
import { jsonError, jsonPaginated, jsonSuccess } from '@/lib/core/http/response'
import {
    readArrayParam,
    readBooleanParam,
    readNumberParam,
    readStringParam,
} from '@/lib/core/query-state'
import {
    createProperty,
    listProperties,
} from '@/lib/core/services/property-service'
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

const createPropertySchema = z.object({
    title: z.string().min(6).max(180),
    summary: z.string().min(20).max(400),
    description: z.string().min(60).max(5000),
    propertyTypeSlug: z.string().min(1),
    countySlug: z.string().min(1),
    citySlug: z.string().min(1).optional(),
    neighborhoodSlug: z.string().min(1).optional(),
    listingPurpose: z.enum(['rent', 'sale', 'short_stay']),
    price: z.number().positive().max(1_000_000_000),
    deposit: z.number().nonnegative().optional(),
    billingPeriod: z.enum(['monthly', 'weekly', 'daily', 'yearly']).optional(),
    bedrooms: z.number().int().nonnegative().max(50).optional(),
    bathrooms: z.number().int().nonnegative().max(50).optional(),
    furnishingStatus: z
        .enum(['furnished', 'semi_furnished', 'unfurnished'])
        .optional(),
    petsAllowed: z.boolean().optional(),
    parkingSlots: z.number().int().nonnegative().max(50).optional(),
    latitude: z.number().gte(-5).lte(5).optional(),
    longitude: z.number().gte(33).lte(42).optional(),
    addressLine1: z.string().max(200).optional(),
    ownerType: z.enum(['landlord', 'agent', 'property_manager']),
    contactPhone: z.string().min(10).max(20),
    ownershipDeclared: z.literal(true),
    responsibilityAccepted: z.literal(true),
    images: z
        .array(
            z.object({
                storageKey: z.string().min(1),
                url: z.string().url(),
                altText: z.string().max(200).optional(),
                position: z.number().int().nonnegative(),
                isCover: z.boolean(),
            }),
        )
        .min(1, 'At least one image is required')
        .max(15, 'Maximum 15 images per listing'),
})

export async function POST(request: NextRequest) {
    if (!verifyRequestCsrf(request)) {
        return jsonError('CSRF validation failed.', 419)
    }

    const user = await getServerCurrentUser()
    if (!user) {
        return jsonError('Authentication required.', 401)
    }

    try {
        const body = await request.json()
        const parsed = createPropertySchema.parse(body)
        const mode = await resolveBackendModeForRequest(request)
        const ctx = buildRequestContextFromNextRequest(request)

        const created = await createProperty(
            mode,
            parsed,
            {
                ...ctx,
                userId: user.id,
                roles: user.roles,
                permissions: user.permissions,
                backendMode: mode,
            },
        )

        await writeAuditLog({
            actorUserId: user.id,
            action: 'property.submitted',
            entityType: 'property',
            entityId: created.id,
            backendProcessedBy: mode,
            metadata: {
                title: created.title,
                listingPurpose: created.listingPurpose,
                county: created.county,
                city: created.city,
            },
            ctx,
        })

        return jsonSuccess(created, { status: 201 })
    } catch (error) {
        return jsonError(
            error instanceof Error ? error.message : 'Unable to submit listing.',
            422,
        )
    }
}
