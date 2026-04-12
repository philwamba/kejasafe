import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { PropertyFiltersToggle } from '@/components/properties/PropertyFiltersToggle'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertySearchBar } from '@/components/properties/PropertySearchBar'
import { fetchProperties } from '@/lib/core/sdk/property-client'
import {
    parsePropertySearchParams,
    type PropertySearchPageParams,
} from '@/modules/properties/search'

export const metadata: Metadata = {
    title: 'Search Houses in Kenya',
    description:
        'Search verified houses, apartments, and bedsitters by county, budget, and property type.',
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<PropertySearchPageParams>
}) {
    const params = await searchParams
    const filters = parsePropertySearchParams(params)
    const result = await fetchProperties({
        ...filters,
        page: filters.page ?? 1,
        perPage: filters.perPage ?? 12,
        sortBy: filters.sortBy ?? 'newest',
    })

    return (
        <>
            <section className="space-y-4">
                <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
                    Search workspace
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-stone-950">
                    Refine listings with URL-based search filters.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-stone-600">
                    Filter-first page for shared search links, indexable
                    location results, and admin support workflows.
                </p>
            </section>
            <PropertySearchBar />
            <PropertyFiltersToggle action="/search" values={filters} />
            <PropertyGrid properties={result.data} />
        </>
    )
}
