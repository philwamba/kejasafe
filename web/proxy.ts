import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { env } from '@/lib/config/env'
import { authCookieNames } from '@/lib/core/auth/constants'

const protectedPrefixes = ['/dashboard', '/portal', '/admin']
const authPages = ['/login', '/register']

function isProtectedPath(pathname: string) {
    return protectedPrefixes.some(prefix => pathname.startsWith(prefix))
}

function isAuthPage(pathname: string) {
    return authPages.includes(pathname)
}

function hasSessionCookie(request: NextRequest) {
    if (request.cookies.has(authCookieNames.session)) {
        return true
    }
    if (env.LARAVEL_SESSION_COOKIE) {
        return request.cookies.has(env.LARAVEL_SESSION_COOKIE)
    }
    return false
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const authenticated = hasSessionCookie(request)

    if (isProtectedPath(pathname) && !authenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', pathname)

        return NextResponse.redirect(loginUrl)
    }

    if (isAuthPage(pathname) && authenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/portal/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
}
