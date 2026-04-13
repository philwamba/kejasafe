/**
 * Rewrite every PropertyImage.url so it points at the current
 * S3_PUBLIC_BASE_URL env value instead of whatever was baked in when
 * the image was uploaded.
 *
 * Run AFTER updating S3_PUBLIC_BASE_URL in web/.env to the new
 * pub-<hash>.r2.dev URL (or a custom domain).
 *
 *   cd web && node prisma/seeds/rewrite-image-urls.mjs
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const publicBase = (process.env.S3_PUBLIC_BASE_URL ?? '').replace(/\/$/, '')

if (!publicBase) {
    console.error('S3_PUBLIC_BASE_URL is not set. Aborting.')
    process.exit(1)
}

async function main() {
    const images = await prisma.propertyImage.findMany({
        select: { id: true, storageKey: true, url: true },
    })

    let updated = 0
    for (const image of images) {
        const expected = `${publicBase}/${image.storageKey}`
        if (image.url === expected) continue

        await prisma.propertyImage.update({
            where: { id: image.id },
            data: { url: expected },
        })
        updated += 1
    }

    console.log(
        `Checked ${images.length} images. Updated ${updated} URLs to base ${publicBase}.`,
    )
}

main()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
