import type { PaginatedResult } from '@/lib/core/contracts/common'
import type { PaginationMeta } from '@/lib/shared/types/api'

export interface PaginationInput {
    page?: number
    perPage?: number
}

export interface NormalizedPaginationInput {
    page: number
    perPage: number
}

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 12
const MAX_PER_PAGE = 100

export function normalizePaginationInput(
    input: PaginationInput = {},
): NormalizedPaginationInput {
    const page = Number.isFinite(input.page)
        ? Math.max(1, Number(input.page))
        : DEFAULT_PAGE
    const perPage = Number.isFinite(input.perPage)
        ? Math.min(MAX_PER_PAGE, Math.max(1, Number(input.perPage)))
        : DEFAULT_PER_PAGE

    return { page, perPage }
}

export function buildPaginationMeta(
    input: PaginationInput,
    total: number,
): PaginationMeta {
    const { page, perPage } = normalizePaginationInput(input)
    const totalPages = total === 0 ? 0 : Math.ceil(total / perPage)

    return {
        page,
        perPage,
        total,
        totalPages,
    }
}

export function toPaginatedResult<T>(
    data: T[],
    input: PaginationInput,
    total: number,
): PaginatedResult<T> {
    return {
        data,
        meta: buildPaginationMeta(input, total),
    }
}

export function emptyPaginatedResult<T>(
    input: PaginationInput = {},
): PaginatedResult<T> {
    return toPaginatedResult<T>([], input, 0)
}

export function toOffset(input: PaginationInput = {}): number {
    const { page, perPage } = normalizePaginationInput(input)

    return (page - 1) * perPage
}
