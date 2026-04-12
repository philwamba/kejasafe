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
    title: 'Houses & Properties for Rent and Sale in Kenya',
    description:
        'Browse verified rentals, sales, and short-stay listings across Nairobi, Mombasa, Kisumu, and more.',
}

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<PropertySearchPageParams>
}) {
    const params = await searchParams
    const filters = parsePropertySearchParams(params)
    const result = await fetchProperties({
        ...filters,
        page: filters.page ?? 1,
        perPage: filters.perPage ?? 9,
        sortBy: filters.sortBy ?? 'newest',
    })

    return (
        <>
            <section className="flex flex-col gap-6">
                <div className="space-y-3">
                    <span className="bg-brand/10 text-brand inline-flex w-fit rounded-full px-4 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                        Verified housing intelligence
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                        Discover homes and property inventory across Kenya.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-stone-600">
                        Search by county, budget, property type, or occupancy
                        need.
                    </p>
                </div>
                <PropertySearchBar />
            </section>

            <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs tracking-[0.2em] text-stone-500 uppercase">
                            Search and refine
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
                            Active property inventory
                        </h2>
                    </div>
                    <p className="text-sm text-stone-600">
                        Showing {result.data.length} of {result.meta.total}{' '}
                        listings.
                    </p>
                </div>
                <PropertyFiltersToggle values={filters} />
                <PropertyGrid properties={result.data} />
            </section>
        </>
    )
}
