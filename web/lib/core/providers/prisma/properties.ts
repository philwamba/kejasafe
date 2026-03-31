import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/core/prisma/client";
import { normalizePaginationInput, toOffset, toPaginatedResult } from "@/lib/core/pagination";
import type {
  CreatePropertyInput,
  PropertyCardDto,
  PropertyDetailDto,
  PropertyProvider,
  PropertySearchInput,
} from "@/lib/core/contracts/property";
import type { AuthContext, RequestContext } from "@/lib/core/contracts/common";

type PrismaPropertyListPayload = Prisma.PropertyGetPayload<{
  include: {
    county: true;
    city: true;
    neighborhood: true;
    propertyType: true;
    images: {
      orderBy: {
        position: "asc";
      };
    };
  };
}>;

type PrismaPropertyDetailPayload = Prisma.PropertyGetPayload<{
  include: {
    county: true;
    city: true;
    neighborhood: true;
    propertyType: true;
    images: {
      orderBy: {
        position: "asc";
      };
    };
    amenities: {
      include: {
        amenity: true;
      };
    };
  };
}>;

function buildWhere(input: PropertySearchInput): Prisma.PropertyWhereInput {
  return {
    listingStatus: "published",
    county: input.county
      ? {
          slug: {
            equals: input.county,
            mode: "insensitive",
          },
        }
      : undefined,
    city: input.city
      ? {
          slug: {
            equals: input.city,
            mode: "insensitive",
          },
        }
      : undefined,
    neighborhood: input.neighborhood
      ? {
          slug: {
            equals: input.neighborhood,
            mode: "insensitive",
          },
        }
      : undefined,
    propertyType: input.propertyType
      ? {
          slug: {
            equals: input.propertyType,
            mode: "insensitive",
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
      input.furnished === undefined ? undefined : input.furnished ? { not: null } : null,
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
  };
}

function buildOrderBy(input: PropertySearchInput): Prisma.PropertyOrderByWithRelationInput[] {
  switch (input.sortBy) {
    case "price_asc":
      return [{ price: "asc" }, { publishedAt: "desc" }];
    case "price_desc":
      return [{ price: "desc" }, { publishedAt: "desc" }];
    case "newest":
    default:
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }
}

function toPropertyCardDto(property: PrismaPropertyListPayload): PropertyCardDto {
  const coverImage = property.images.find((image) => image.isCover) ?? property.images[0];

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    summary: property.summary,
    price: Number(property.price),
    currency: "KES",
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
  };
}

function toPropertyDetailDto(property: PrismaPropertyDetailPayload): PropertyDetailDto {
  return {
    ...toPropertyCardDto(property),
    description: property.description,
    amenities: property.amenities.map((entry) => entry.amenity.name),
    gallery: property.images.map((image) => ({
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
  };
}

export const prismaPropertyProvider: PropertyProvider = {
  async list(input: PropertySearchInput, _ctx: RequestContext) {
    const pagination = normalizePaginationInput(input);
    const where = buildWhere(input);
    const orderBy = buildOrderBy(input);

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
              position: "asc",
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return toPaginatedResult(
      properties.map(toPropertyCardDto),
      pagination,
      total,
    );
  },

  async getBySlug(slug: string, _ctx: RequestContext) {
    const property = await prisma.property.findFirst({
      where: {
        slug,
        listingStatus: "published",
      },
      include: {
        county: true,
        city: true,
        neighborhood: true,
        propertyType: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    return property ? toPropertyDetailDto(property) : null;
  },

  async create(_input: CreatePropertyInput, _ctx: AuthContext) {
    throw new Error("Prisma property creation is not implemented yet.");
  },
};
