import type {
    AuthContext,
    PaginatedResult,
    RequestContext,
} from '@/lib/core/contracts/common'

export interface PropertyCardDto {
    id: string
    slug: string
    title: string
    summary: string
    price: number
    currency: string
    listingPurpose: 'rent' | 'sale' | 'short_stay'
    listingStatus: string
    bedrooms?: number | null
    bathrooms?: number | null
    county: string
    city?: string | null
    neighborhood?: string | null
    propertyType?: string | null
    coverImageUrl?: string | null
    isFeatured: boolean
}

export interface PropertyDetailDto extends PropertyCardDto {
    description: string
    amenities: string[]
    gallery: Array<{
        id: string
        url: string
        altText?: string | null
        isCover: boolean
    }>
    coordinates?: {
        latitude: number
        longitude: number
    } | null
}

export interface PropertySearchInput {
    page?: number
    perPage?: number
    county?: string
    city?: string
    neighborhood?: string
    propertyType?: string
    listingPurpose?: 'rent' | 'sale' | 'short_stay'
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    amenities?: string[]
    petsAllowed?: boolean
    furnished?: boolean
    sortBy?: 'newest' | 'price_asc' | 'price_desc'
}

export interface CreatePropertyInput {
    title: string
    summary: string
    description: string
    propertyTypeId: string
    countyId: string
    cityId?: string
    neighborhoodId?: string
    listingPurpose: 'rent' | 'sale' | 'short_stay'
    price: number
}

export interface PropertyProviderContract {
    list(
        input: PropertySearchInput,
        ctx: RequestContext,
    ): Promise<PaginatedResult<PropertyCardDto>>
    getBySlug(
        slug: string,
        ctx: RequestContext,
    ): Promise<PropertyDetailDto | null>
    create(
        input: CreatePropertyInput,
        ctx: AuthContext,
    ): Promise<PropertyDetailDto>
}
