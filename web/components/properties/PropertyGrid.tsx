import type { PropertyCardDto } from '@/lib/core/contracts/property'

import { PropertyCard } from '@/components/properties/PropertyCard'

interface PropertyGridProps {
    properties: PropertyCardDto[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
    if (properties.length === 0) {
        return (
            <div className="rounded-[32px] border border-dashed border-stone-300 bg-white/70 p-10 text-center dark:border-white/15 dark:bg-white/5">
                <p className="text-sm tracking-[0.24em] text-stone-400 uppercase">
                    No listings
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 dark:text-white">
                    No properties match the current filters.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300">
                    Adjust rent range, location, or property type to widen the
                    search. The query-param filters are kept in the URL, so
                    refined searches stay shareable and bookmarkable.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    )
}
