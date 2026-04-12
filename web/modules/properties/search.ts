import type { PropertySearchInput } from '@/lib/core/contracts/property'

export interface PropertySearchPageParams {
    page?: string
    perPage?: string
    county?: string
    city?: string
    neighborhood?: string
    propertyType?: string
    listingPurpose?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    amenities?: string | string[]
    petsAllowed?: string
    furnished?: string
    sortBy?: string
}

function toNumber(value?: string) {
    if (!value) {
        return undefined
    }

    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : undefined
}

function toBoolean(value?: string) {
    if (!value) {
        return undefined
    }

    if (value === 'true' || value === '1') {
        return true
    }

    if (value === 'false' || value === '0') {
        return false
    }

    return undefined
}

function toArray(value?: string | string[]) {
    if (!value) {
        return undefined
    }

    const values = Array.isArray(value) ? value : value.split(',')
    const normalized = values.map(item => item.trim()).filter(Boolean)

    return normalized.length > 0 ? normalized : undefined
}

export function parsePropertySearchParams(
    params: PropertySearchPageParams,
): PropertySearchInput {
    return {
        page: toNumber(params.page),
        perPage: toNumber(params.perPage),
        county: params.county,
        city: params.city,
        neighborhood: params.neighborhood,
        propertyType: params.propertyType,
        listingPurpose:
            params.listingPurpose as PropertySearchInput['listingPurpose'],
        minPrice: toNumber(params.minPrice),
        maxPrice: toNumber(params.maxPrice),
        bedrooms: toNumber(params.bedrooms),
        bathrooms: toNumber(params.bathrooms),
        amenities: toArray(params.amenities),
        petsAllowed: toBoolean(params.petsAllowed),
        furnished: toBoolean(params.furnished),
        sortBy: params.sortBy as PropertySearchInput['sortBy'],
    }
}

export function formatKes(amount: number) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    }).format(amount)
}

export function buildPropertySubtitle(parts: Array<string | null | undefined>) {
    return parts.filter(Boolean).join(' • ')
}
