import { NextResponse } from 'next/server'

import { apiErrorFromUnknown, toApiErrorEnvelope } from '@/lib/core/errors'
import type {
    ApiDataEnvelope,
    ApiListEnvelope,
    ApiMessageEnvelope,
} from '@/lib/shared/types/api'

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
    return NextResponse.json<ApiDataEnvelope<T>>({ data }, init)
}

export function jsonPaginated<T>(
    data: T[],
    meta: ApiListEnvelope<T>['meta'],
    init?: ResponseInit,
) {
    return NextResponse.json<ApiListEnvelope<T>>({ data, meta }, init)
}

export function jsonMessage(message: string, init?: ResponseInit) {
    return NextResponse.json<ApiMessageEnvelope>({ message }, init)
}

export function jsonError(message: string, status?: number): NextResponse
export function jsonError(error: unknown, status?: number): NextResponse
export function jsonError(input: string | unknown, status = 400) {
    if (typeof input === 'string') {
        return NextResponse.json(
            {
                message: input,
                code: status >= 500 ? 'internal_error' : undefined,
                status,
            },
            { status },
        )
    }

    const appError = apiErrorFromUnknown(input)

    return NextResponse.json(toApiErrorEnvelope(appError), {
        status: status === 400 ? appError.status : status,
    })
}
