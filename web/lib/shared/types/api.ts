export interface PaginationMeta {
    page: number
    perPage: number
    total: number
    totalPages: number
}

export interface ApiDataEnvelope<T> {
    data: T
}

export interface ApiListEnvelope<T> {
    data: T[]
    meta: PaginationMeta
}

export interface ApiMessageEnvelope {
    message: string
    debugToken?: string
}

export interface ApiErrorEnvelope {
    message: string
    code?: string
    debugToken?: string
    status?: number
    fieldErrors?: Record<string, string[]>
    details?: Record<string, unknown>
}
