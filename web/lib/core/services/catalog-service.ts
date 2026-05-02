import type { RequestContext } from '@/lib/core/contracts/common'
import { readFromActiveProvider } from '@/lib/core/services/provider-read'

export function listPropertyTypeOptions(ctx: RequestContext) {
    return readFromActiveProvider(
        ctx,
        provider => provider.catalog.listPropertyTypes(ctx),
        { feature: 'catalog.propertyTypes' },
    )
}
