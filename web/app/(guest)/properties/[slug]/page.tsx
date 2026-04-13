import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
    FiArrowLeft,
    FiCheckCircle,
    FiMapPin,
    FiShield,
    FiShare2,
    FiWifi,
} from 'react-icons/fi'
import { LuBath, LuBedDouble, LuRuler, LuUsers } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/properties/FavoriteButton'
import { PropertyGallery } from '@/components/properties/PropertyGallery'
import { PropertyMap } from '@/components/properties/PropertyMap'
import { fetchPropertyBySlug } from '@/lib/core/sdk/property-client'
import { buildPropertySubtitle, formatKes } from '@/modules/properties/search'

function purposeLabel(purpose: string) {
    const map: Record<string, string> = {
        rent: 'For Rent',
        sale: 'For Sale',
        short_stay: 'Short Stay',
    }
    return map[purpose] ?? purpose.replace('_', ' ')
}

function priceSuffix(purpose: string) {
    if (purpose === 'sale') return null
    if (purpose === 'short_stay') return 'night'
    return 'month'
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params

    try {
        const property = await fetchPropertyBySlug(slug)

        if (!property) {
            return { title: 'Property not found' }
        }

        return {
            title: property.title,
            description: property.summary,
        }
    } catch {
        return { title: 'Property' }
    }
}

export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const property = await fetchPropertyBySlug(slug)

    if (!property) {
        notFound()
    }

    const subtitle = buildPropertySubtitle([
        property.neighborhood,
        property.city,
        property.county,
    ])

    const suffix = priceSuffix(property.listingPurpose)

    return (
        <>
            <nav
                className="flex items-center justify-between gap-4"
                aria-label="Property navigation">
                <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="h-10 rounded-xl px-3 text-stone-600 hover:text-stone-950">
                    <Link href="/properties">
                        <FiArrowLeft className="size-4" />
                        Back to listings
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-10 rounded-xl px-3 text-stone-600 hover:text-stone-950">
                        <FiShare2 className="size-4" />
                        Share
                    </Button>
                    <FavoriteButton
                        propertyId={property.id}
                        propertyTitle={property.title}
                        variant="detail"
                    />
                </div>
            </nav>

            <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-brand rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
                        {purposeLabel(property.listingPurpose)}
                    </span>
                    {property.propertyType ? (
                        <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                            {property.propertyType}
                        </span>
                    ) : null}
                    {property.isFeatured ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                            ★ Featured
                        </span>
                    ) : null}
                </div>
                <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-stone-950">
                    {property.title}
                </h1>
                <p className="flex items-center gap-2 text-sm text-stone-600">
                    <FiMapPin className="text-brand size-4" />
                    <span className="underline decoration-stone-300 underline-offset-2">
                        {subtitle || property.county}
                    </span>
                </p>
            </header>

            <PropertyGallery property={property} />

            <section className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr]">
                <div className="space-y-8">
                    <div className="flex items-start justify-between gap-6 border-b border-stone-200 pb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-stone-950">
                                {purposeLabel(property.listingPurpose)} in{' '}
                                {property.city ?? property.county}
                            </h2>
                            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
                                {property.bedrooms !== null &&
                                property.bedrooms !== undefined ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <LuBedDouble className="size-4" />
                                        {property.bedrooms}{' '}
                                        {property.bedrooms === 1
                                            ? 'bedroom'
                                            : 'bedrooms'}
                                    </span>
                                ) : null}
                                {property.bathrooms !== null &&
                                property.bathrooms !== undefined ? (
                                    <>
                                        <span className="text-stone-300">·</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <LuBath className="size-4" />
                                            {property.bathrooms}{' '}
                                            {property.bathrooms === 1
                                                ? 'bathroom'
                                                : 'bathrooms'}
                                        </span>
                                    </>
                                ) : null}
                                {property.size ? (
                                    <>
                                        <span className="text-stone-300">·</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <LuRuler className="size-4" />
                                            {property.size}
                                        </span>
                                    </>
                                ) : null}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-stone-950">
                            About this property
                        </h2>
                        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-8 text-stone-700">
                            {property.description}
                        </p>
                    </div>

                    <div className="border-t border-stone-200 pt-8">
                        <h2 className="text-xl font-semibold text-stone-950">
                            What this place offers
                        </h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {property.amenities.length > 0 ? (
                                property.amenities.map(amenity => (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-3 py-2 text-[15px] text-stone-800">
                                        <FiCheckCircle className="text-brand size-4" />
                                        {amenity}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 py-2 text-[15px] text-stone-800">
                                        <FiShield className="text-brand size-4" />
                                        Secure entry workflow ready
                                    </div>
                                    <div className="flex items-center gap-3 py-2 text-[15px] text-stone-800">
                                        <FiWifi className="text-brand size-4" />
                                        Connectivity data supported
                                    </div>
                                    <div className="flex items-center gap-3 py-2 text-[15px] text-stone-800">
                                        <LuUsers className="text-brand size-4" />
                                        Verified landlord
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <aside>
                    <div className="sticky top-28 space-y-4">
                        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-lg">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-semibold tracking-tight text-stone-950">
                                    {formatKes(property.price)}
                                </span>
                                {suffix ? (
                                    <span className="text-sm text-stone-500">
                                        / {suffix}
                                    </span>
                                ) : null}
                            </div>

                            <dl className="mt-5 grid gap-3 border-t border-stone-100 pt-5 text-sm">
                                <div className="flex items-center justify-between">
                                    <dt className="text-stone-500">Type</dt>
                                    <dd className="font-medium text-stone-900">
                                        {property.propertyType ?? '—'}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-stone-500">Purpose</dt>
                                    <dd className="font-medium text-stone-900 capitalize">
                                        {property.listingPurpose.replace(
                                            '_',
                                            ' ',
                                        )}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-stone-500">County</dt>
                                    <dd className="font-medium capitalize text-stone-900">
                                        {property.county}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-6 grid gap-3">
                                <Button size="lg" className="h-12 rounded-xl">
                                    Book a viewing
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 rounded-xl">
                                    Send inquiry
                                </Button>
                            </div>

                            <p className="mt-4 text-center text-xs text-stone-500">
                                No charge until you book
                            </p>
                        </div>
                    </div>
                </aside>
            </section>

            {property.coordinates ? (
                <section className="flex flex-col gap-4 border-t border-stone-200 pt-8">
                    <div>
                        <h2 className="text-xl font-semibold text-stone-950">
                            Where you&apos;ll be
                        </h2>
                        <p className="mt-1 text-sm text-stone-600">
                            {subtitle || property.county}
                        </p>
                    </div>
                    <PropertyMap
                        latitude={property.coordinates.latitude}
                        longitude={property.coordinates.longitude}
                        title={property.title}
                        addressLabel={subtitle || property.county}
                    />
                </section>
            ) : null}
        </>
    )
}
