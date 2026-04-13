import { randomUUID } from 'node:crypto'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { env } from '@/lib/config/env'

let cachedClient: S3Client | null = null

function getClient(): S3Client {
    if (cachedClient) {
        return cachedClient
    }

    if (
        !env.S3_BUCKET ||
        !env.S3_ENDPOINT ||
        !env.S3_ACCESS_KEY_ID ||
        !env.S3_SECRET_ACCESS_KEY
    ) {
        throw new Error(
            'Storage is not configured. Missing S3_BUCKET / S3_ENDPOINT / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY.',
        )
    }

    cachedClient = new S3Client({
        region: env.S3_REGION ?? 'auto',
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: env.S3_FORCE_PATH_STYLE ?? true,
        credentials: {
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
    })

    return cachedClient
}

export interface PresignedUploadResult {
    uploadUrl: string
    storageKey: string
    publicUrl: string
    expiresIn: number
}

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
] as const

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number]

export function isAllowedImageType(
    contentType: string,
): contentType is AllowedImageType {
    return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(contentType)
}

export async function presignPropertyImageUpload(options: {
    ownerUserId: string
    filename: string
    contentType: AllowedImageType
    contentLength: number
}): Promise<PresignedUploadResult> {
    const client = getClient()

    const extension = options.filename.includes('.')
        ? options.filename
              .slice(options.filename.lastIndexOf('.') + 1)
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '')
        : 'jpg'

    const storageKey = `property-images/${options.ownerUserId}/${randomUUID()}.${extension}`

    const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: storageKey,
        ContentType: options.contentType,
        ContentLength: options.contentLength,
    })

    const expiresIn = 60 * 5 // 5 minutes
    const uploadUrl = await getSignedUrl(client, command, { expiresIn })

    const publicBase = env.S3_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? ''
    const publicUrl = publicBase
        ? `${publicBase}/${storageKey}`
        : `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${storageKey}`

    return { uploadUrl, storageKey, publicUrl, expiresIn }
}

export function publicUrlFor(storageKey: string): string {
    const publicBase = env.S3_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? ''
    return publicBase
        ? `${publicBase}/${storageKey}`
        : `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${storageKey}`
}
