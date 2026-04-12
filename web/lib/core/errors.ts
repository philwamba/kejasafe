import type { AxiosError } from 'axios'

import type { ApiErrorEnvelope } from '@/lib/shared/types/api'

export type AppErrorCode =
    | 'bad_request'
    | 'unauthenticated'
    | 'forbidden'
    | 'not_found'
    | 'conflict'
    | 'validation_failed'
    | 'rate_limited'
    | 'backend_unavailable'
    | 'internal_error'

export interface AppErrorOptions {
    status?: number
    code?: AppErrorCode
    debugToken?: string
    fieldErrors?: Record<string, string[]>
    details?: Record<string, unknown>
    cause?: unknown
}

export class AppError extends Error {
    readonly status: number
    readonly code: AppErrorCode
    readonly debugToken?: string
    readonly fieldErrors?: Record<string, string[]>
    readonly details?: Record<string, unknown>

    constructor(message: string, options: AppErrorOptions = {}) {
        super(message, { cause: options.cause })
        this.name = 'AppError'
        this.status = options.status ?? 500
        this.code = options.code ?? statusToErrorCode(this.status)
        this.debugToken = options.debugToken
        this.fieldErrors = options.fieldErrors
        this.details = options.details
    }
}

export function statusToErrorCode(status: number): AppErrorCode {
    switch (status) {
        case 400:
            return 'bad_request'
        case 401:
            return 'unauthenticated'
        case 403:
            return 'forbidden'
        case 404:
            return 'not_found'
        case 409:
            return 'conflict'
        case 422:
            return 'validation_failed'
        case 429:
            return 'rate_limited'
        case 503:
            return 'backend_unavailable'
        default:
            return 'internal_error'
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError
}

export function apiErrorFromUnknown(
    error: unknown,
    fallbackMessage = 'An unexpected request error occurred.',
): AppError {
    if (isAppError(error)) {
        return error
    }

    const axiosError = error as AxiosError<ApiErrorEnvelope>
    const payload = axiosError?.response?.data

    if (axiosError?.isAxiosError) {
        return new AppError(payload?.message ?? fallbackMessage, {
            status: axiosError.response?.status ?? 500,
            code:
                (payload?.code as AppErrorCode | undefined) ??
                statusToErrorCode(axiosError.response?.status ?? 500),
            debugToken: payload?.debugToken,
            fieldErrors: payload?.fieldErrors,
            details: payload?.details,
            cause: error,
        })
    }

    if (error instanceof Error) {
        return new AppError(error.message || fallbackMessage, {
            cause: error,
        })
    }

    if (typeof error === 'string' && error.trim().length > 0) {
        return new AppError(error, {
            status: 500,
        })
    }

    return new AppError(fallbackMessage)
}

export function toApiErrorEnvelope(error: unknown): ApiErrorEnvelope {
    const appError = apiErrorFromUnknown(error)

    return {
        message: appError.message,
        code: appError.code,
        debugToken: appError.debugToken,
        status: appError.status,
        fieldErrors: appError.fieldErrors,
        details: appError.details,
    }
}
