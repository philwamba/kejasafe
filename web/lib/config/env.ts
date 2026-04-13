import { z } from 'zod'

const envSchema = z.object({
    APP_NAME: z.string().default('Kejasafe'),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    LARAVEL_API_BASE_URL: z.string().url().optional(),
    LARAVEL_SESSION_COOKIE: z.string().min(1).optional(),
    AUTH_SECRET: z.string().min(32),
    CSRF_SECRET: z.string().min(32),
    COOKIE_DOMAIN: z.string().min(1),
    ACTIVE_BACKEND_MODE: z
        .enum(['prisma_neon', 'laravel_api'])
        .default('prisma_neon'),
    BACKEND_FALLBACK_MODE: z.enum(['prisma_neon', 'laravel_api']).optional(),
    STORAGE_DRIVER: z.enum(['local', 's3', 'r2']).default('r2'),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ENDPOINT: z.string().url().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_PUBLIC_BASE_URL: z.string().url().optional(),
    S3_FORCE_PATH_STYLE: z
        .string()
        .transform(value => value === 'true')
        .optional(),
})

type Env = z.infer<typeof envSchema>

let cachedEnv: Env | undefined

function parseEnv(): Env {
    return envSchema.parse({
        APP_NAME: process.env.APP_NAME,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        LARAVEL_API_BASE_URL: process.env.LARAVEL_API_BASE_URL,
        LARAVEL_SESSION_COOKIE: process.env.LARAVEL_SESSION_COOKIE,
        AUTH_SECRET: process.env.AUTH_SECRET,
        CSRF_SECRET: process.env.CSRF_SECRET,
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
        ACTIVE_BACKEND_MODE: process.env.ACTIVE_BACKEND_MODE,
        BACKEND_FALLBACK_MODE: process.env.BACKEND_FALLBACK_MODE,
        STORAGE_DRIVER: process.env.STORAGE_DRIVER,
        S3_BUCKET: process.env.S3_BUCKET,
        S3_REGION: process.env.S3_REGION,
        S3_ENDPOINT: process.env.S3_ENDPOINT,
        S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
        S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
        S3_PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL,
        S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE,
    })
}

function getEnv(): Env {
    cachedEnv ??= parseEnv()
    return cachedEnv
}

export const env = new Proxy({} as Env, {
    get(_target, prop: keyof Env) {
        return getEnv()[prop]
    },
    has(_target, prop: keyof Env) {
        return prop in getEnv()
    },
    ownKeys() {
        return Reflect.ownKeys(getEnv())
    },
    getOwnPropertyDescriptor(_target, prop: keyof Env) {
        const value = getEnv()[prop]

        if (value === undefined) {
            return undefined
        }

        return {
            configurable: true,
            enumerable: true,
            value,
            writable: false,
        }
    },
})
