import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'

import { issueCsrfToken } from '@/lib/core/auth/csrf'
import { attachCsrfCookie } from '@/lib/core/auth/cookies'

export async function GET() {
    const csrfToken = issueCsrfToken(randomUUID())
    const response = NextResponse.json({
        data: {
            csrfToken,
        },
    })

    attachCsrfCookie(response, csrfToken)

    return response
}
