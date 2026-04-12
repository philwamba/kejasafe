export type QueryPrimitive = string | number | boolean
export type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined
export type QueryState = Record<string, QueryValue>

export function readStringParam(
    params: URLSearchParams,
    key: string,
): string | undefined {
    const value = params.get(key)?.trim()

    return value ? value : undefined
}

export function readNumberParam(
    params: URLSearchParams,
    key: string,
): number | undefined {
    const value = readStringParam(params, key)

    if (!value) {
        return undefined
    }

    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : undefined
}

export function readBooleanParam(
    params: URLSearchParams,
    key: string,
): boolean | undefined {
    const value = readStringParam(params, key)

    if (!value) {
        return undefined
    }

    if (value === 'true' || value === '1') {
        return true
    }

    if (value === 'false' || value === '0') {
        return false
    }

    return undefined
}

export function readArrayParam(params: URLSearchParams, key: string): string[] {
    return params
        .getAll(key)
        .flatMap(value => value.split(','))
        .map(value => value.trim())
        .filter(Boolean)
}

export function buildQueryString(state: QueryState): string {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(state)) {
        if (value === undefined || value === null || value === '') {
            continue
        }

        if (Array.isArray(value)) {
            for (const item of value) {
                params.append(key, String(item))
            }
            continue
        }

        params.set(key, String(value))
    }

    return params.toString()
}
