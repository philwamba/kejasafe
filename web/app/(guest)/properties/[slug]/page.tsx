import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
    FiArrowLeft,
    FiCheckCircle,
    FiMapPin,
    FiShield,
    FiWifi,
} from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { PropertyGallery } from '@/components/properties/PropertyGallery'
import { fetchPropertyBySlug } from '@/lib/core/sdk/property-client'
import { buildPropertySubtitle, formatKes } from '@/modules/properties/search'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params

    try {
        const property = await fetchPropertyBySlug(slug)

        if (!property) {
            return {
                title: 'Property not found',
            }
        }

        return {
            title: property.title,
            description: property.summary,
        }
    } catch {
        return {
            title: 'Property',
        }
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

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-xl px-4">
                    <Link href="/properties">
                        <FiArrowLeft />
                        Back to listings
                    </Link>
                </Button>
            </div>

            <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-brand/10 text-brand rounded-full px-3 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                                {property.propertyType ?? 'Property'}
                            </span>
                            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-medium tracking-[0.22em] text-white uppercase">
                                {property.listingPurpose.replace('_', ' ')}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                                {property.title}
                            </h1>
                            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">
                                {property.summary}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
                            <span className="inline-flex items-center gap-2">
                                <FiMapPin className="text-brand size-4" />
                                {subtitle || property.county}
                            </span>
                        </div>
                    </div>
                    <PropertyGallery property={property} />
                    <section className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                            Overview
                        </h2>
                        <p className="mt-4 text-base leading-8 text-stone-600">
                            {property.description}
                        </p>
                    </section>
                    <section className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                            Amenities and highlights
                        </h2>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {property.amenities.length > 0 ? (
                                property.amenities.map(amenity => (
                                    <div
                                        key={amenity}
                                        className="inline-flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800">
                                        <FiCheckCircle className="text-brand size-4" />
                                        {amenity}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="inline-flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800">
                                        <FiShield className="text-brand size-4" />
                                        Secure entry workflow ready
                                    </div>
                                    <div className="inline-flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800">
                                        <FiWifi className="text-brand size-4" />
                                        Connectivity data supported
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs tracking-[0.2em] text-stone-500 uppercase">
                            Pricing
                        </p>
                        <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
                            {formatKes(property.price)}
                        </p>
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
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                            Property facts
                        </h2>
                        <dl className="mt-5 grid gap-4 text-sm text-stone-800">
                            <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                                <dt className="text-stone-500">Bedrooms</dt>
                                <dd>{property.bedrooms ?? 'Not specified'}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                                <dt className="text-stone-500">Bathrooms</dt>
                                <dd>{property.bathrooms ?? 'Not specified'}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                                <dt className="text-stone-500">County</dt>
                                <dd className="capitalize">
                                    {property.county}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-stone-500">Coordinates</dt>
                                <dd>
                                    {property.coordinates
                                        ? `${property.coordinates.latitude}, ${property.coordinates.longitude}`
                                        : 'Not published'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </section>
        </>
    )
}
