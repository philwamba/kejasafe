import { createHmac, timingSafeEqual } from 'node:crypto'

import type { NextRequest } from 'next/server'

import { authCookieNames } from '@/lib/core/auth/constants'
import { requireEnv } from '@/lib/config/env'

function signToken(rawToken: string) {
    return createHmac('sha256', requireEnv('CSRF_SECRET'))
        .update(rawToken)
        .digest('hex')
}

export function issueCsrfToken(rawToken: string) {
    return `${rawToken}.${signToken(rawToken)}`
}

export function verifyCsrfToken(token: string): boolean {
    const [rawToken, signature] = token.split('.')

    if (!rawToken || !signature) {
        return false
    }

    const expected = Buffer.from(signToken(rawToken))
    const actual = Buffer.from(signature)

    return (
        expected.length === actual.length && timingSafeEqual(expected, actual)
    )
}

export function verifyRequestCsrf(request: NextRequest): boolean {
    const headerToken = request.headers.get('x-csrf-token')
    const cookieToken = request.cookies.get(authCookieNames.csrf)?.value

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        return false
    }

    return verifyCsrfToken(headerToken)
}
