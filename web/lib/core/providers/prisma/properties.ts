import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/core/prisma/client'
import {
    normalizePaginationInput,
    toOffset,
    toPaginatedResult,
} from '@/lib/core/pagination'
import type {
    CreatePropertyInput,
    PropertyCardDto,
    PropertyDetailDto,
    PropertyProvider,
    PropertySearchInput,
} from '@/lib/core/contracts/property'
import type { AuthContext, RequestContext } from '@/lib/core/contracts/common'

type PrismaPropertyListPayload = Prisma.PropertyGetPayload<{
    include: {
        county: true
        city: true
        neighborhood: true
        propertyType: true
        images: {
            orderBy: {
                position: 'asc'
            }
        }
    }
}>

type PrismaPropertyDetailPayload = Prisma.PropertyGetPayload<{
    include: {
        county: true
        city: true
        neighborhood: true
        propertyType: true
        images: {
            orderBy: {
                position: 'asc'
            }
        }
        amenities: {
            include: {
                amenity: true
            }
        }
    }
}>

function buildWhere(input: PropertySearchInput): Prisma.PropertyWhereInput {
    return {
        listingStatus: 'published',
        county: input.county
            ? {
                  slug: {
                      equals: input.county,
                      mode: 'insensitive',
                  },
              }
            : undefined,
        city: input.city
            ? {
                  slug: {
                      equals: input.city,
                      mode: 'insensitive',
                  },
              }
            : undefined,
        neighborhood: input.neighborhood
            ? {
                  slug: {
                      equals: input.neighborhood,
                      mode: 'insensitive',
                  },
              }
            : undefined,
        propertyType: input.propertyType
            ? {
                  slug: {
                      equals: input.propertyType,
                      mode: 'insensitive',
                  },
              }
            : undefined,
        listingPurpose: input.listingPurpose,
        price: {
            gte: input.minPrice,
            lte: input.maxPrice,
        },
        bedrooms: input.bedrooms ?? undefined,
        bathrooms: input.bathrooms ?? undefined,
        petsAllowed: input.petsAllowed,
        furnishingStatus:
            input.furnished === undefined
                ? undefined
                : input.furnished
                  ? { not: null }
                  : null,
        amenities:
            input.amenities && input.amenities.length > 0
                ? {
                      some: {
                          amenity: {
                              slug: {
                                  in: input.amenities,
                              },
                          },
                      },
                  }
                : undefined,
    }
}

function buildOrderBy(
    input: PropertySearchInput,
): Prisma.PropertyOrderByWithRelationInput[] {
    switch (input.sortBy) {
        case 'price_asc':
            return [{ price: 'asc' }, { publishedAt: 'desc' }]
        case 'price_desc':
            return [{ price: 'desc' }, { publishedAt: 'desc' }]
        case 'newest':
        default:
            return [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
    }
}

function toPropertyCardDto(
    property: PrismaPropertyListPayload,
): PropertyCardDto {
    const coverImage =
        property.images.find(image => image.isCover) ?? property.images[0]

    return {
        id: property.id,
        slug: property.slug,
        title: property.title,
        summary: property.summary,
        price: Number(property.price),
        currency: 'KES',
        listingPurpose: property.listingPurpose,
        listingStatus: property.listingStatus,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        county: property.county.name,
        city: property.city?.name ?? null,
        neighborhood: property.neighborhood?.name ?? null,
        propertyType: property.propertyType.name,
        coverImageUrl: coverImage?.url ?? null,
        isFeatured: property.featuredAt !== null,
    }
}

function toPropertyDetailDto(
    property: PrismaPropertyDetailPayload,
): PropertyDetailDto {
    return {
        ...toPropertyCardDto(property),
        description: property.description,
        amenities: property.amenities.map(entry => entry.amenity.name),
        gallery: property.images.map(image => ({
            id: image.id,
            url: image.url,
            altText: image.altText,
            isCover: image.isCover,
        })),
        coordinates:
            property.latitude !== null && property.longitude !== null
                ? {
                      latitude: Number(property.latitude),
                      longitude: Number(property.longitude),
                  }
                : null,
    }
}

export const prismaPropertyProvider: PropertyProvider = {
    async list(input: PropertySearchInput, _ctx: RequestContext) {
        const pagination = normalizePaginationInput(input)
        const where = buildWhere(input)
        const orderBy = buildOrderBy(input)

        const [properties, total] = await prisma.$transaction([
            prisma.property.findMany({
                where,
                orderBy,
                skip: toOffset(pagination),
                take: pagination.perPage,
                include: {
                    county: true,
                    city: true,
                    neighborhood: true,
                    propertyType: true,
                    images: {
                        orderBy: {
                            position: 'asc',
                        },
                    },
                },
            }),
            prisma.property.count({ where }),
        ])

        return toPaginatedResult(
            properties.map(toPropertyCardDto),
            pagination,
            total,
        )
    },

    async getBySlug(slug: string, _ctx: RequestContext) {
        const property = await prisma.property.findFirst({
            where: {
                slug,
                listingStatus: 'published',
            },
            include: {
                county: true,
                city: true,
                neighborhood: true,
                propertyType: true,
                images: {
                    orderBy: {
                        position: 'asc',
                    },
                },
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        })

        return property ? toPropertyDetailDto(property) : null
    },

    async create(input: CreatePropertyInput, ctx: AuthContext) {
        if (!ctx.userId) {
            throw new Error('Authentication required to create a listing.')
        }
        if (!input.ownershipDeclared || !input.responsibilityAccepted) {
            throw new Error(
                'You must declare ownership and accept responsibility before submitting.',
            )
        }

        const [county, propertyType] = await Promise.all([
            prisma.county.findUnique({ where: { slug: input.countySlug } }),
            prisma.propertyType.findUnique({
                where: { slug: input.propertyTypeSlug },
            }),
        ])

        if (!county) throw new Error(`Unknown county: ${input.countySlug}`)
        if (!propertyType)
            throw new Error(`Unknown property type: ${input.propertyTypeSlug}`)

        const city = input.citySlug
            ? await prisma.city.findUnique({
                  where: {
                      countyId_slug: {
                          countyId: county.id,
                          slug: input.citySlug,
                      },
                  },
              })
            : null

        const neighborhood = input.neighborhoodSlug
            ? await prisma.neighborhood.findFirst({
                  where: {
                      countyId: county.id,
                      slug: input.neighborhoodSlug,
                  },
              })
            : null

        // Generate a unique slug from the title.
        const baseSlug = input.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80)
        let slug = baseSlug
        let attempt = 1
        while (await prisma.property.findUnique({ where: { slug } })) {
            attempt += 1
            slug = `${baseSlug}-${attempt}`
        }

        const now = new Date()

        const created = await prisma.property.create({
            data: {
                ownerId: ctx.userId,
                ownerType: input.ownerType,
                propertyTypeId: propertyType.id,
                countyId: county.id,
                cityId: city?.id ?? null,
                neighborhoodId: neighborhood?.id ?? null,
                title: input.title,
                slug,
                summary: input.summary,
                description: input.description,
                listingPurpose: input.listingPurpose,
                listingStatus: 'draft',
                moderationStatus: 'pending_review',
                price: input.price,
                deposit: input.deposit ?? null,
                billingPeriod: input.billingPeriod ?? null,
                bedrooms: input.bedrooms ?? null,
                bathrooms: input.bathrooms ?? null,
                furnishingStatus: input.furnishingStatus ?? null,
                petsAllowed: input.petsAllowed ?? false,
                parkingSlots: input.parkingSlots ?? null,
                latitude: input.latitude ?? null,
                longitude: input.longitude ?? null,
                addressLine1: input.addressLine1 ?? null,
                submittedAt: now,
                ownershipDeclaredAt: now,
                responsibilityAcceptedAt: now,
                images:
                    input.images.length > 0
                        ? {
                              create: input.images.map(image => ({
                                  storageKey: image.storageKey,
                                  url: image.url,
                                  altText: image.altText ?? null,
                                  position: image.position,
                                  isCover: image.isCover,
                              })),
                          }
                        : undefined,
            },
            include: {
                county: true,
                city: true,
                neighborhood: true,
                propertyType: true,
                images: { orderBy: { position: 'asc' } },
                amenities: { include: { amenity: true } },
            },
        })

        return toPropertyDetailDto(created)
    },
}
