import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const prisma = new PrismaClient()

const seedSources = [
    {
        slug: 'runda-furnished-garden-house',
        sourceUrl:
            'https://www.buyrentkenya.com/listings/3-bedroom-house-for-rent-runda-3931913',
        title: 'Furnished 3 Bedroom Garden House in Runda',
        summary:
            'A quiet furnished home in Runda with a fireplace, mature garden, and staff quarter.',
        description:
            'Located in Runda, this furnished three-bedroom house is set in a secure leafy compound and includes a sunken lounge with a fireplace, a separate dining area, a large pantry kitchen, and a mature garden.',
        county: 'Nairobi',
        city: 'Nairobi',
        neighborhood: 'Runda',
        propertyType: 'House',
        listingPurpose: 'rent',
        price: 280000,
        bedrooms: 3,
        bathrooms: 4,
        toilets: 4,
        billingPeriod: 'monthly',
        furnishingStatus: 'furnished',
        petsAllowed: true,
        parkingSlots: 2,
        latitude: -1.2245,
        longitude: 36.8059,
        amenities: ['Garden', 'Parking', 'Fibre Internet', 'Gated Community'],
        nearbyPlaces: [
            {
                name: 'Village Market',
                category: 'shopping_centre',
                distanceKm: 3.4,
            },
            { name: 'Rosslyn Academy', category: 'school', distanceKm: 2.8 },
        ],
        featured: true,
    },
    {
        slug: 'diani-resort-style-mansion',
        sourceUrl:
            'https://www.buyrentkenya.com/listings/furnished-4-bedroom-house-for-sale-diani-3931445',
        title: 'Resort-Style 4 Bedroom Mansion in Diani',
        summary:
            'A newly built Diani home with a private pool, balconies, and beach access within minutes.',
        description:
            'This newly built four-bedroom mansion in Diani is designed for resort-style living, with all bedrooms en suite, private balconies, a movie room, a swimming pool, and generous outdoor space close to the beach and Ukunda Airstrip.',
        county: 'Kwale',
        city: 'Ukunda',
        neighborhood: 'Diani',
        propertyType: 'House',
        listingPurpose: 'sale',
        price: 40000000,
        bedrooms: 4,
        bathrooms: 5,
        toilets: 5,
        furnishingStatus: 'furnished',
        petsAllowed: false,
        parkingSlots: 4,
        latitude: -4.3158,
        longitude: 39.5757,
        amenities: ['Swimming Pool', 'Balcony', 'Parking', 'Garden', 'CCTV'],
        nearbyPlaces: [
            { name: 'Diani Beach', category: 'beach', distanceKm: 0.7 },
            { name: 'Ukunda Airstrip', category: 'airport', distanceKm: 0.6 },
        ],
        featured: true,
    },
    {
        slug: 'kilifi-creek-italian-villa',
        sourceUrl:
            'https://www.buyrentkenya.com/listings/furnished-3-bedroom-villa-for-sale-kilifi-town-3730646',
        title: 'Italian-Style Villa Overlooking Kilifi Creek',
        summary:
            'A furnished creekside villa with an infinity pool, mature trees, and guest accommodation.',
        description:
            'This furnished villa overlooking Kilifi Creek combines coastal views with an Italian-inspired layout. The home includes three creek-facing bedrooms, an open kitchen, an infinity pool, mature baobab-lined gardens, and a separate guest wing.',
        county: 'Kilifi',
        city: 'Kilifi',
        neighborhood: 'Kilifi Creek',
        propertyType: 'Villa',
        listingPurpose: 'sale',
        price: 151000000,
        bedrooms: 3,
        bathrooms: 4,
        toilets: 4,
        furnishingStatus: 'furnished',
        petsAllowed: false,
        parkingSlots: 4,
        latitude: -3.6292,
        longitude: 39.8526,
        amenities: [
            'Swimming Pool',
            'Garden',
            'Parking',
            'Security',
            'Scenic View',
        ],
        nearbyPlaces: [
            { name: 'Kilifi Creek', category: 'waterfront', distanceKm: 0.1 },
            {
                name: 'Naivas Kilifi',
                category: 'shopping_centre',
                distanceKm: 0.3,
            },
        ],
        featured: true,
    },
    {
        slug: 'nanyuki-new-2-bedroom-bungalow',
        sourceUrl:
            'https://www.buyrentkenya.com/listings/furnished-2-bedroom-house-for-sale-nanyuki-3871345',
        title: 'New 2 Bedroom Bungalow in Nanyuki',
        summary:
            'A newly completed gated bungalow in Nanyuki with en suite bedrooms and strong value pricing.',
        description:
            'This newly completed two-bedroom bungalow in Nanyuki offers an open-plan kitchen, bright living spaces, en suite bedrooms, a walk-in closet in the primary suite, a laundry area, and a gated setting a short drive from the CBD.',
        county: 'Laikipia',
        city: 'Nanyuki',
        neighborhood: 'Baraka',
        propertyType: 'House',
        listingPurpose: 'sale',
        price: 6000000,
        bedrooms: 2,
        bathrooms: 3,
        toilets: 3,
        furnishingStatus: 'furnished',
        petsAllowed: false,
        parkingSlots: 2,
        latitude: 0.017,
        longitude: 37.0819,
        amenities: ['Parking', 'Garden', 'Fibre Internet', 'Gated Community'],
        nearbyPlaces: [
            { name: 'Nanyuki CBD', category: 'town_centre', distanceKm: 5.0 },
            {
                name: 'Nanyuki Teaching and Referral Hospital',
                category: 'hospital',
                distanceKm: 4.2,
            },
        ],
        featured: false,
    },
]

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
}

function getStorageConfig() {
    const driver = process.env.STORAGE_DRIVER ?? 'r2'

    if (!['r2', 's3'].includes(driver)) {
        return null
    }

    const bucket = process.env.S3_BUCKET
    const region = process.env.S3_REGION ?? 'auto'
    const endpoint = process.env.S3_ENDPOINT
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL
    const forcePathStyle =
        (process.env.S3_FORCE_PATH_STYLE ?? 'false') === 'true'

    if (
        !bucket ||
        !region ||
        !endpoint ||
        !accessKeyId ||
        !secretAccessKey ||
        !publicBaseUrl
    ) {
        return null
    }

    return {
        bucket,
        region,
        endpoint,
        accessKeyId,
        secretAccessKey,
        publicBaseUrl: publicBaseUrl.replace(/\/$/, ''),
        forcePathStyle,
    }
}

function createS3Client(config) {
    return new S3Client({
        region: config.region,
        endpoint: config.endpoint,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        },
        forcePathStyle: config.forcePathStyle,
    })
}

function inferContentType(url, response) {
    const header = response.headers.get('content-type')

    if (header) {
        return header.split(';')[0]
    }

    if (url.endsWith('.png')) {
        return 'image/png'
    }

    if (url.endsWith('.webp')) {
        return 'image/webp'
    }

    return 'image/jpeg'
}

function extractImageUrls(html, limit = 3) {
    const normalized = html
        .replace(/\\u002F/g, '/')
        .replace(/\\\//g, '/')
        .replace(/&amp;/g, '&')

    const candidates =
        normalized.match(/https:\/\/i\.roamcdn\.net\/[^"'\\s<]+/g) ?? []

    return [...new Set(candidates)]
        .filter(url => /gallery-(?:full|main)/.test(url))
        .slice(0, limit)
}

async function fetchSourceImages(sourceUrl) {
    const response = await fetch(sourceUrl, {
        headers: {
            'user-agent': 'kejasafe-seed-bot/1.0',
        },
    })

    if (!response.ok) {
        throw new Error(
            `Failed to fetch source listing ${sourceUrl} (${response.status})`,
        )
    }

    const html = await response.text()
    const imageUrls = extractImageUrls(html, 3)

    if (imageUrls.length === 0) {
        throw new Error(`No gallery images found on ${sourceUrl}`)
    }

    return imageUrls
}

async function mirrorImage(sourceUrl, storageKey, storageConfig, s3Client) {
    if (!storageConfig || !s3Client) {
        return {
            storageKey: `external:${storageKey}`,
            url: sourceUrl,
        }
    }

    const response = await fetch(sourceUrl, {
        headers: {
            'user-agent': 'kejasafe-seed-bot/1.0',
        },
    })

    if (!response.ok) {
        throw new Error(
            `Failed to download image ${sourceUrl} (${response.status})`,
        )
    }

    const contentType = inferContentType(sourceUrl, response)
    const body = Buffer.from(await response.arrayBuffer())

    await s3Client.send(
        new PutObjectCommand({
            Bucket: storageConfig.bucket,
            Key: storageKey,
            Body: body,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        }),
    )

    return {
        storageKey,
        url: `${storageConfig.publicBaseUrl}/${storageKey}`,
    }
}

async function upsertLocationModels() {
    const countyMap = new Map()
    const cityMap = new Map()
    const neighborhoodMap = new Map()
    const propertyTypeMap = new Map()
    const amenityMap = new Map()

    const uniqueCounties = [...new Set(seedSources.map(entry => entry.county))]

    for (const countyName of uniqueCounties) {
        const county = await prisma.county.upsert({
            where: { slug: slugify(countyName) },
            update: { name: countyName },
            create: {
                name: countyName,
                slug: slugify(countyName),
            },
        })

        countyMap.set(countyName, county)
    }

    for (const entry of seedSources) {
        const cityKey = `${entry.county}:${entry.city}`
        if (!cityMap.has(cityKey)) {
            const city = await prisma.city.upsert({
                where: {
                    countyId_slug: {
                        countyId: countyMap.get(entry.county).id,
                        slug: slugify(entry.city),
                    },
                },
                update: { name: entry.city },
                create: {
                    countyId: countyMap.get(entry.county).id,
                    name: entry.city,
                    slug: slugify(entry.city),
                },
            })

            cityMap.set(cityKey, city)
        }

        const neighborhoodKey = `${entry.county}:${entry.neighborhood}`
        if (!neighborhoodMap.has(neighborhoodKey)) {
            const neighborhood = await prisma.neighborhood.upsert({
                where: {
                    countyId_slug: {
                        countyId: countyMap.get(entry.county).id,
                        slug: slugify(entry.neighborhood),
                    },
                },
                update: { name: entry.neighborhood },
                create: {
                    countyId: countyMap.get(entry.county).id,
                    cityId: cityMap.get(cityKey).id,
                    name: entry.neighborhood,
                    slug: slugify(entry.neighborhood),
                },
            })

            neighborhoodMap.set(neighborhoodKey, neighborhood)
        }

        if (!propertyTypeMap.has(entry.propertyType)) {
            const propertyType = await prisma.propertyType.upsert({
                where: { slug: slugify(entry.propertyType) },
                update: { name: entry.propertyType },
                create: {
                    name: entry.propertyType,
                    slug: slugify(entry.propertyType),
                },
            })

            propertyTypeMap.set(entry.propertyType, propertyType)
        }
    }

    const uniqueAmenities = [
        ...new Set(seedSources.flatMap(entry => entry.amenities)),
    ]

    for (const amenityName of uniqueAmenities) {
        const amenity = await prisma.amenity.upsert({
            where: { slug: slugify(amenityName) },
            update: { name: amenityName },
            create: {
                name: amenityName,
                slug: slugify(amenityName),
            },
        })

        amenityMap.set(amenityName, amenity)
    }

    return { countyMap, cityMap, neighborhoodMap, propertyTypeMap, amenityMap }
}

async function upsertOwner() {
    const passwordHash = await argon2.hash('ChangeMe123!')

    return prisma.user.upsert({
        where: { email: 'seed-owner@kejasafe.local' },
        update: {
            fullName: 'Kejasafe Seed Owner',
            passwordHash,
            status: 'active',
        },
        create: {
            fullName: 'Kejasafe Seed Owner',
            email: 'seed-owner@kejasafe.local',
            passwordHash,
            status: 'active',
            emailVerifiedAt: new Date(),
        },
    })
}

async function seedProperties() {
    const storageConfig = getStorageConfig()
    const s3Client = storageConfig ? createS3Client(storageConfig) : null
    const owner = await upsertOwner()
    const maps = await upsertLocationModels()

    for (const entry of seedSources) {
        const city = maps.cityMap.get(`${entry.county}:${entry.city}`)
        const neighborhood = maps.neighborhoodMap.get(
            `${entry.county}:${entry.neighborhood}`,
        )
        const propertyType = maps.propertyTypeMap.get(entry.propertyType)

        const imageUrls = await fetchSourceImages(entry.sourceUrl)
        const mirroredImages = []

        for (const [index, imageUrl] of imageUrls.entries()) {
            const extension = imageUrl.includes('.png')
                ? 'png'
                : imageUrl.includes('.webp')
                  ? 'webp'
                  : 'jpg'
            const storageKey = `properties/${entry.slug}/seed-${index + 1}.${extension}`
            const mirrored = await mirrorImage(
                imageUrl,
                storageKey,
                storageConfig,
                s3Client,
            )
            mirroredImages.push({
                ...mirrored,
                altText: `${entry.title} image ${index + 1}`,
                position: index,
                isCover: index === 0,
            })
        }

        const property = await prisma.property.upsert({
            where: { slug: entry.slug },
            update: {
                ownerId: owner.id,
                propertyTypeId: propertyType.id,
                countyId: maps.countyMap.get(entry.county).id,
                cityId: city.id,
                neighborhoodId: neighborhood.id,
                ownerType: 'landlord',
                title: entry.title,
                summary: entry.summary,
                description: entry.description,
                listingPurpose: entry.listingPurpose,
                listingStatus: 'published',
                moderationStatus: 'approved',
                price: entry.price,
                bedrooms: entry.bedrooms,
                bathrooms: entry.bathrooms,
                toilets: entry.toilets,
                billingPeriod: entry.billingPeriod ?? null,
                furnishingStatus: entry.furnishingStatus ?? null,
                petsAllowed: entry.petsAllowed,
                parkingSlots: entry.parkingSlots,
                hasSecurityFeatures:
                    entry.amenities.includes('Security') ||
                    entry.amenities.includes('CCTV'),
                hasInternetAvailability:
                    entry.amenities.includes('Fibre Internet'),
                latitude: entry.latitude,
                longitude: entry.longitude,
                featuredAt: entry.featured ? new Date() : null,
                publishedAt: new Date(),
                availableFrom: new Date(),
                occupancyStatus: 'available',
            },
            create: {
                ownerId: owner.id,
                propertyTypeId: propertyType.id,
                countyId: maps.countyMap.get(entry.county).id,
                cityId: city.id,
                neighborhoodId: neighborhood.id,
                ownerType: 'landlord',
                title: entry.title,
                slug: entry.slug,
                summary: entry.summary,
                description: entry.description,
                listingPurpose: entry.listingPurpose,
                listingStatus: 'published',
                moderationStatus: 'approved',
                price: entry.price,
                bedrooms: entry.bedrooms,
                bathrooms: entry.bathrooms,
                toilets: entry.toilets,
                billingPeriod: entry.billingPeriod ?? null,
                furnishingStatus: entry.furnishingStatus ?? null,
                petsAllowed: entry.petsAllowed,
                parkingSlots: entry.parkingSlots,
                hasSecurityFeatures:
                    entry.amenities.includes('Security') ||
                    entry.amenities.includes('CCTV'),
                hasInternetAvailability:
                    entry.amenities.includes('Fibre Internet'),
                latitude: entry.latitude,
                longitude: entry.longitude,
                featuredAt: entry.featured ? new Date() : null,
                publishedAt: new Date(),
                availableFrom: new Date(),
                occupancyStatus: 'available',
            },
        })

        await prisma.propertyImage.deleteMany({
            where: { propertyId: property.id },
        })
        await prisma.propertyAmenity.deleteMany({
            where: { propertyId: property.id },
        })
        await prisma.propertyNearbyPlace.deleteMany({
            where: { propertyId: property.id },
        })

        await prisma.property.update({
            where: { id: property.id },
            data: {
                images: {
                    create: mirroredImages,
                },
                amenities: {
                    create: entry.amenities.map(amenityName => ({
                        amenityId: maps.amenityMap.get(amenityName).id,
                    })),
                },
                nearbyPlaces: {
                    create: entry.nearbyPlaces.map(place => ({
                        name: place.name,
                        category: place.category,
                        distanceKm: place.distanceKm,
                    })),
                },
            },
        })

        console.log(`Seeded ${entry.slug} from ${entry.sourceUrl}`)
    }
}

async function main() {
    await seedProperties()
}

main()
    .catch(error => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
