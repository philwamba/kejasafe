import { internalApiClient } from '@/lib/core/http/axios'
import type { ApiDataEnvelope } from '@/lib/shared/types/api'
import type {
    AuthUserDto,
    MessageResult,
    SessionSummaryDto,
} from '@/lib/shared/types/auth'

interface CsrfTokenPayload {
    csrfToken: string
}

export interface AuthClientModePayload {
    backendMode?: 'prisma_neon' | 'laravel_api'
}

export interface LoginClientPayload extends AuthClientModePayload {
    email: string
    password: string
    rememberMe?: boolean
}

export interface RegisterClientPayload extends AuthClientModePayload {
    fullName: string
    email: string
    phone: string
    password: string
    passwordConfirmation: string
}

export async function fetchCsrfToken() {
    const response =
        await internalApiClient.get<ApiDataEnvelope<CsrfTokenPayload>>(
            '/auth/csrf',
        )

    return response.data.data.csrfToken
}

export async function loginWithCredentials(
    payload: LoginClientPayload,
    csrfToken: string,
) {
    const response = await internalApiClient.post<ApiDataEnvelope<AuthUserDto>>(
        '/auth/login',
        payload,
        {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        },
    )

    return response.data.data
}

export async function registerAccount(
    payload: RegisterClientPayload,
    csrfToken: string,
) {
    const response = await internalApiClient.post<ApiDataEnvelope<AuthUserDto>>(
        '/auth/register',
        payload,
        {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        },
    )

    return response.data.data
}

export async function fetchCurrentUser() {
    const response =
        await internalApiClient.get<ApiDataEnvelope<AuthUserDto>>('/auth/me')

    return response.data.data
}

export async function requestPasswordResetToken(
    payload: { email: string; backendMode?: 'prisma_neon' | 'laravel_api' },
    csrfToken: string,
) {
    const response = await internalApiClient.post<
        ApiDataEnvelope<MessageResult>
    >('/auth/forgot-password', payload, {
        headers: {
            'X-CSRF-Token': csrfToken,
        },
    })

    return response.data.data
}

export async function resetPassword(
    payload: {
        email: string
        token: string
        password: string
        passwordConfirmation: string
        backendMode?: 'prisma_neon' | 'laravel_api'
    },
    csrfToken: string,
) {
    const response = await internalApiClient.post<
        ApiDataEnvelope<MessageResult>
    >('/auth/reset-password', payload, {
        headers: {
            'X-CSRF-Token': csrfToken,
        },
    })

    return response.data.data
}

export async function fetchSessions() {
    const response =
        await internalApiClient.get<ApiDataEnvelope<SessionSummaryDto[]>>(
            '/auth/sessions',
        )

    return response.data.data
}

export async function revokeSession(sessionId: string, csrfToken: string) {
    const response = await internalApiClient.delete<
        ApiDataEnvelope<MessageResult> | MessageResult
    >(`/auth/sessions/${sessionId}`, {
        headers: {
            'X-CSRF-Token': csrfToken,
        },
    })

    return 'data' in response.data ? response.data.data : response.data
}

export async function logoutAllSessions(csrfToken: string) {
    const response = await internalApiClient.post<
        ApiDataEnvelope<MessageResult>
    >(
        '/auth/logout-all',
        {},
        {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        },
    )

    return response.data.data
}

export async function requestEmailVerification(csrfToken: string) {
    const response = await internalApiClient.post<
        ApiDataEnvelope<MessageResult>
    >(
        '/auth/verify-email/request',
        {},
        {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        },
    )

    return response.data.data
}

export async function verifyEmailToken(token: string, csrfToken: string) {
    const response = await internalApiClient.post<
        ApiDataEnvelope<MessageResult>
    >(
        '/auth/verify-email/confirm',
        { token },
        {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        },
    )

    return response.data.data
}
