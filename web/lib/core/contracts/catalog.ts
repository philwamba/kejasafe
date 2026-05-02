import type { RequestContext } from '@/lib/core/contracts/common'

export interface PropertyTypeOption {
    slug: string
    name: string
}

export interface CatalogProvider {
    listPropertyTypes(ctx: RequestContext): Promise<PropertyTypeOption[]>
}
