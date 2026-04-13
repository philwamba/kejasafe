import Image from 'next/image'
import Link from 'next/link'
import { LuBath, LuBedDouble } from 'react-icons/lu'

import { FavoriteButton } from '@/components/properties/FavoriteButton'
import type { PropertyCardDto } from '@/lib/core/contracts/property'
import { cn } from '@/lib/utils'
import { buildPropertySubtitle, formatKes } from '@/modules/properties/search'

interface PropertyCardProps {
    property: PropertyCardDto
}

function statusLabel(status: string) {
    const normalized = status.toLowerCase()
    if (['available', 'active', 'published'].includes(normalized))
        return 'Available'
    if (['taken', 'occupied', 'rented', 'sold'].includes(normalized))
        return 'Occupied'
    if (['pending', 'draft', 'review'].includes(normalized)) return 'Pending'
    return status.replace(/_/g, ' ')
}

function purposeLabel(purpose: string) {
    const map: Record<string, string> = {
        rent: 'For rent',
        sale: 'For sale',
        short_stay: 'Short stay',
    }
    return map[purpose] ?? purpose.replace('_', ' ')
}

function priceSuffix(purpose: string) {
    if (purpose === 'sale') return null
    if (purpose === 'short_stay') return 'night'
    return 'month'
}

export function PropertyCard({ property }: PropertyCardProps) {
    const subtitle = buildPropertySubtitle([
        property.neighborhood,
        property.city,
        property.county,
    ])
    const status = statusLabel(property.listingStatus)
    const suffix = priceSuffix(property.listingPurpose)

    return (
        <article className="group relative flex flex-col gap-3">
            <Link
                href={`/properties/${property.slug}`}
                className="relative block aspect-4/3 overflow-hidden rounded-2xl bg-stone-100"
                aria-label={property.title}>
                {property.coverImageUrl ? (
                    <Image
                        src={property.coverImageUrl}
                        alt={property.title}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Image
                            src="/logo.png"
                            alt="Kejasafe"
                            width={160}
                            height={160}
                            className="opacity-80"
                        />
                    </div>
                )}

                {/* Top row: purpose badge + status */}
                <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
                    <span className="bg-brand rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        {purposeLabel(property.listingPurpose)}
                    </span>
                    {property.isFeatured ? (
                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-900 shadow-sm backdrop-blur">
                            ★ Featured
                        </span>
                    ) : null}
                </div>

                {/* Status chip (bottom-left on hover) */}
                {status !== 'Available' ? (
                    <span className="absolute bottom-3 left-3 rounded-full bg-stone-900/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        {status}
                    </span>
                ) : null}
            </Link>

            {/* Save button pinned to the photo */}
            <div className="absolute right-3 top-3 z-10">
                <FavoriteButton
                    propertyId={property.id}
                    propertyTitle={property.title}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href={`/properties/${property.slug}`}
                        className={cn(
                            'line-clamp-1 text-[15px] font-semibold text-stone-950 transition-colors',
                            'group-hover:text-brand',
                        )}>
                        {property.title}
                    </Link>
                </div>
                {subtitle ? (
                    <p className="line-clamp-1 text-sm text-stone-500">
                        {subtitle}
                    </p>
                ) : null}

                {property.bedrooms !== null &&
                property.bedrooms !== undefined ? (
                    <div className="mt-1 flex items-center gap-4 text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1.5">
                            <LuBedDouble className="size-3.5" />
                            {property.bedrooms}{' '}
                            {property.bedrooms === 1 ? 'bed' : 'beds'}
                        </span>
                        {property.bathrooms !== null &&
                        property.bathrooms !== undefined ? (
                            <span className="inline-flex items-center gap-1.5">
                                <LuBath className="size-3.5" />
                                {property.bathrooms}{' '}
                                {property.bathrooms === 1 ? 'bath' : 'baths'}
                            </span>
                        ) : null}
                    </div>
                ) : null}

                <p className="mt-1 text-[15px] font-semibold text-stone-950">
                    {formatKes(property.price)}
                    {suffix ? (
                        <span className="ml-1 font-normal text-stone-500">
                            / {suffix}
                        </span>
                    ) : null}
                </p>
            </div>
        </article>
    )
}
