import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { LuBedDouble } from 'react-icons/lu'

import type { PropertyCardDto } from '@/lib/core/contracts/property'
import { buildPropertySubtitle, formatKes } from '@/modules/properties/search'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
    property: PropertyCardDto
}

function statusLabel(status: string) {
    const normalized = status.toLowerCase()
    if (['available', 'active', 'published'].includes(normalized))
        return 'Available'
    if (['taken', 'occupied', 'rented', 'sold'].includes(normalized))
        return 'Occupied / Taken'
    if (['pending', 'draft', 'review'].includes(normalized)) return 'Pending'
    return status.replace(/_/g, ' ')
}

export function PropertyCard({ property }: PropertyCardProps) {
    const subtitle = buildPropertySubtitle([
        property.neighborhood,
        property.city,
        property.county,
    ])
    const status = statusLabel(property.listingStatus)

    return (
        <article className="group flex flex-col overflow-hidden rounded-md border border-stone-200 bg-stone-50 shadow-sm transition hover:shadow-md">
            <Link
                href={`/properties/${property.slug}`}
                className="relative block aspect-4/3 overflow-hidden bg-stone-100">
                {property.coverImageUrl ? (
                    <Image
                        src={property.coverImageUrl}
                        alt={property.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Image
                            src="/logo.png"
                            alt="Kejasafe"
                            width={220}
                            height={220}
                            className="opacity-90"
                        />
                    </div>
                )}
                <span
                    className={cn(
                        'absolute top-3 right-0 px-3 py-1 text-xs font-medium text-white',
                        'bg-stone-500/90 [clip-path:polygon(8px_0,100%_0,100%_100%,8px_100%,0_50%)]',
                    )}>
                    {status}
                </span>
            </Link>

            <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-3">
                <Link
                    href={`/properties/${property.slug}`}
                    className="hover:decoration-brand text-lg font-semibold text-stone-900 underline decoration-stone-900/30 underline-offset-4">
                    {property.title}
                </Link>
                <p className="text-xl font-semibold text-stone-900">
                    {formatKes(property.price)}
                </p>
                {subtitle ? (
                    <p className="flex items-center gap-2 text-sm">
                        <FiMapPin className="text-brand size-4" />
                        <span className="text-stone-700 underline decoration-stone-300 underline-offset-2">
                            {subtitle}
                        </span>
                    </p>
                ) : null}
                <p className="flex items-center gap-2 text-xs text-stone-500">
                    <FiCalendar className="text-brand size-4" />
                    New listing
                </p>
            </div>

            <div className="bg-brand flex items-center justify-between px-4 py-2 text-xs font-medium text-white">
                <span className="inline-flex items-center gap-2">
                    {property.bedrooms !== null &&
                    property.bedrooms !== undefined ? (
                        <>
                            <LuBedDouble className="size-4" />
                            {property.bedrooms}
                        </>
                    ) : (
                        <span>&nbsp;</span>
                    )}
                </span>
                <span className="capitalize">
                    {property.listingPurpose.replace('_', ' ')}
                </span>
            </div>
        </article>
    )
}
