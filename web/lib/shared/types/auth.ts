import type { BackendMode } from '@/lib/core/contracts/common'

export interface SessionSummaryDto {
    id: string
    ipAddress?: string | null
    userAgent?: string | null
    lastSeenAt?: string | null
    expiresAt: string
    isCurrent: boolean
}

export interface AuthUserDto {
    id: string
    fullName: string
    email: string
    emailVerifiedAt?: string | null
    phone?: string | null
    avatarUrl?: string | null
    roles: string[]
    permissions: string[]
    backendMode: BackendMode
}

export interface AuthCookiesDto {
    backendMode: BackendMode
    sessionToken?: string
    refreshToken?: string
    expiresAt?: string
    forwardedSetCookieHeaders?: string[]
}

export interface AuthMutationResult {
    user: AuthUserDto
    cookies: AuthCookiesDto
}

export interface PasswordResetRequestInput {
    email: string
}

export interface PasswordResetInput {
    email: string
    token: string
    password: string
}

export interface MessageResult {
    message: string
    debugToken?: string
}

export interface VerifyEmailInput {
    token: string
}

export interface LoginInput {
    email: string
    password: string
    rememberMe?: boolean
}

export interface RegisterInput {
    fullName: string
    email: string
    phone: string
    password: string
}

export interface LaravelAuthPayloadEnvelope {
    data: AuthUserDto
}
