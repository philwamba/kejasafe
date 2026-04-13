import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readFileSync } from 'node:fs'

const prisma = new PrismaClient()
const locationCatalog = JSON.parse(
    readFileSync(
        new URL('../../data/locations/kenya.json', import.meta.url),
        'utf8',
    ),
)

const baseSeedSources = [
   
]

function buildNairobiRegionalSeedSources() {
    const profiles = [
       
    ]

    return profiles.flatMap(profile =>
        profile.variants.map(
            ([
                slug,
                title,
                price,
                bedrooms,
                bathrooms,
                toilets,
                parkingSlots,
                featured,
            ]) => ({
                slug: `${profile.slugPrefix}-${slug}`,
                sourceUrl: profile.sourceUrl,
                title: `${title} in ${profile.neighborhood}`,
                summary: `${bedrooms}-bedroom ${profile.propertyType.toLowerCase()} in ${profile.neighborhood} with strong access to ${profile.nearbyPlaces[0].name.toLowerCase()} and established daily conveniences.`,
                description: `${profile.intro}, this ${bedrooms}-bedroom ${profile.propertyType.toLowerCase()} is seeded to represent active Nairobi-metro demand. It includes core family and commuter features such as ${profile.amenities.slice(0, 4).join(', ').toLowerCase()}, plus proximity to ${profile.nearbyPlaces[0].name} and ${profile.nearbyPlaces[1].name}.`,
                county: profile.county,
                city: profile.city,
                neighborhood: profile.neighborhood,
                propertyType: profile.propertyType,
                listingPurpose: profile.listingPurpose,
                price,
                bedrooms,
                bathrooms,
                toilets,
                billingPeriod: profile.billingPeriod ?? null,
                furnishingStatus: profile.furnishingStatus ?? null,
                petsAllowed: profile.petsAllowed,
                parkingSlots,
                latitude: profile.latitude,
                longitude: profile.longitude,
                amenities: profile.amenities,
                nearbyPlaces: profile.nearbyPlaces,
                featured,
            }),
        ),
    )
}

const seedSources = [...baseSeedSources, ...buildNairobiRegionalSeedSources()]

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

const sourceImageCache = new Map()

async function fetchSourceImages(sourceUrl) {
    if (sourceImageCache.has(sourceUrl)) {
        return sourceImageCache.get(sourceUrl)
    }

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
        console.warn(
            `No gallery images found on ${sourceUrl} — seed will skip this listing.`,
        )
    }

    sourceImageCache.set(sourceUrl, imageUrls)

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

    for (const countyEntry of locationCatalog.counties) {
        const county = await prisma.county.upsert({
            where: { slug: slugify(countyEntry.name) },
            update: {
                name: countyEntry.name,
                code: countyEntry.code,
            },
            create: {
                name: countyEntry.name,
                slug: slugify(countyEntry.name),
                code: countyEntry.code,
            },
        })

        countyMap.set(countyEntry.name, county)

        for (const cityEntry of countyEntry.cities) {
            const cityKey = `${countyEntry.name}:${cityEntry.name}`
            const city = await prisma.city.upsert({
                where: {
                    countyId_slug: {
                        countyId: county.id,
                        slug: slugify(cityEntry.name),
                    },
                },
                update: { name: cityEntry.name },
                create: {
                    countyId: county.id,
                    name: cityEntry.name,
                    slug: slugify(cityEntry.name),
                },
            })

            cityMap.set(cityKey, city)

            for (const neighborhoodName of cityEntry.neighborhoods) {
                const neighborhoodKey = `${countyEntry.name}:${neighborhoodName}`
                const neighborhood = await prisma.neighborhood.upsert({
                    where: {
                        countyId_slug: {
                            countyId: county.id,
                            slug: slugify(neighborhoodName),
                        },
                    },
                    update: {
                        name: neighborhoodName,
                        cityId: city.id,
                    },
                    create: {
                        countyId: county.id,
                        cityId: city.id,
                        name: neighborhoodName,
                        slug: slugify(neighborhoodName),
                    },
                })

                neighborhoodMap.set(neighborhoodKey, neighborhood)
            }
        }
    }

    const PROPERTY_TYPE_CATALOG = [
        [
            'Apartment',
            'Self-contained residential unit in a multi-unit building.',
        ],
        ['Bedsitter', 'Single-room unit combining living and sleeping space.'],
        [
            'Studio',
            'Open-plan single-room unit with kitchenette and en-suite bathroom.',
        ],
        ['Single Room', 'Basic single room, often with shared facilities.'],
        [
            'One Bedroom',
            'Apartment with one bedroom separate from the living area.',
        ],
        ['Two Bedroom', 'Apartment with two bedrooms.'],
        ['Three Bedroom', 'Apartment with three bedrooms.'],
        ['Four Bedroom', 'Apartment or house with four bedrooms.'],
        ['Maisonette', 'Multi-level residential unit.'],
        ['Bungalow', 'Single-storey detached house.'],
        ['Townhouse', 'Attached multi-storey house.'],
        ['Villa', 'Detached luxury house, often gated.'],
        ['Mansion', 'Large luxury detached house.'],
        ['Penthouse', 'Top-floor luxury apartment.'],
        ['House', 'Detached residential house.'],
        [
            'Hostel / Student Housing',
            'Accommodation designed primarily for students.',
        ],
        ['Office', 'Commercial office space.'],
        ['Shop', 'Retail commercial space.'],
        ['Warehouse', 'Industrial or storage space.'],
        ['Land / Plot', 'Undeveloped land for sale or lease.'],
        ['Commercial Building', 'Full commercial building.'],
    ]

    for (const [name, description] of PROPERTY_TYPE_CATALOG) {
        const propertyType = await prisma.propertyType.upsert({
            where: { slug: slugify(name) },
            update: { name, description },
            create: {
                name,
                slug: slugify(name),
                description,
            },
        })

        propertyTypeMap.set(name, propertyType)
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
            phone: '+254700000000',
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

    let skipped = 0
    for (const entry of seedSources) {
        const city = maps.cityMap.get(`${entry.county}:${entry.city}`)
        const neighborhood = maps.neighborhoodMap.get(
            `${entry.county}:${entry.neighborhood}`,
        )
        const propertyType = maps.propertyTypeMap.get(entry.propertyType)

        let imageUrls
        try {
            imageUrls = await fetchSourceImages(entry.sourceUrl)
        } catch (error) {
            console.warn(
                `Skipping ${entry.slug} — ${error.message}`,
            )
            skipped += 1
            continue
        }

        if (imageUrls.length === 0) {
            console.warn(`Skipping ${entry.slug} — no images in source.`)
            skipped += 1
            continue
        }

        const mirroredImages = []

        for (const [index, imageUrl] of imageUrls.entries()) {
            const extension = imageUrl.includes('.png')
                ? 'png'
                : imageUrl.includes('.webp')
                  ? 'webp'
                  : 'jpg'
            const storageKey = `properties/${entry.slug}/seed-${mirroredImages.length + 1}.${extension}`
            try {
                const mirrored = await mirrorImage(
                    imageUrl,
                    storageKey,
                    storageConfig,
                    s3Client,
                )
                mirroredImages.push({
                    ...mirrored,
                    altText: `${entry.title} image ${mirroredImages.length + 1}`,
                    position: mirroredImages.length,
                    isCover: mirroredImages.length === 0,
                })
            } catch (error) {
                console.warn(
                    `  - Skipped image ${index + 1} for ${entry.slug}: ${error.message}`,
                )
            }
        }

        if (mirroredImages.length === 0) {
            console.warn(
                `Skipping ${entry.slug} — all image downloads failed.`,
            )
            skipped += 1
            continue
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

    if (skipped > 0) {
        console.log(`\n${skipped} listings skipped (source had no images).`)
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
