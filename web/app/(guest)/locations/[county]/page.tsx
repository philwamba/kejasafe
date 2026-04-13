import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'

import { getLocationContent, slugify } from '@/modules/locations/content'
import { fetchProperties } from '@/lib/core/sdk/property-client'

export const dynamic = 'force-dynamic'

interface CountyCatalogEntry {
    code: string
    name: string
    cities: Array<{ name: string; neighborhoods: string[] }>
}

function loadCatalog(): { counties: CountyCatalogEntry[] } {
    const catalogPath = resolve(process.cwd(), '../data/locations/kenya.json')
    return JSON.parse(readFileSync(catalogPath, 'utf-8'))
}

function findCounty(slug: string): CountyCatalogEntry | null {
    const catalog = loadCatalog()
    return (
        catalog.counties.find(county => slugify(county.name) === slug) ?? null
    )
}

export async function generateStaticParams() {
    const catalog = loadCatalog()
    return catalog.counties.map(county => ({ county: slugify(county.name) }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ county: string }>
}): Promise<Metadata> {
    const { county: countySlug } = await params
    const county = findCounty(countySlug)

    if (!county) {
        return { title: 'Location not found' }
    }

    const content = getLocationContent(countySlug, county.name)

    return {
        title: `Houses & Properties In ${county.name}`,
        description: `${content.tagline}. Verified rental and sale listings across ${county.name}, Kenya.`,
        keywords: content.keywords,
        alternates: { canonical: `/locations/${countySlug}` },
    }
}

export default async function CountyPage({
    params,
}: {
    params: Promise<{ county: string }>
}) {
    const { county: countySlug } = await params
    const county = findCounty(countySlug)

    if (!county) {
        notFound()
    }

    const content = getLocationContent(countySlug, county.name)

    // Fetch a handful of featured listings for the county
    const result = await fetchProperties({
        county: countySlug,
        perPage: 6,
        sortBy: 'newest',
    }).catch(() => ({ data: [], meta: { total: 0 } }))

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Locations',
                                item: '/locations',
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: county.name,
                                item: `/locations/${countySlug}`,
                            },
                        ],
                    }),
                }}
            />

            <section className="space-y-4">
                <Link
                    href="/locations"
                    className="hover:text-brand inline-flex items-center gap-2 text-sm text-stone-500">
                    ← All locations
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-brand/10 text-brand inline-flex rounded-full px-4 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                        {content.region}
                    </span>
                    {content.hasFlagshipContent ? (
                        <span className="inline-flex rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600">
                            Flagship guide
                        </span>
                    ) : null}
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    Houses & Properties In {county.name}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-stone-600">
                    {content.tagline}.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                        About {county.name}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-stone-700">
                        {content.description}
                    </p>
                </article>
                <aside className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
                        Housing Snapshot
                    </h3>
                    <div>
                        <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
                            Price band
                        </p>
                        <p className="mt-1 text-lg font-semibold text-stone-950 capitalize">
                            {content.priceBand === 'mixed'
                                ? 'All tiers'
                                : content.priceBand}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
                            Common types
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                            {content.commonTypes.map(type => (
                                <li
                                    key={type}
                                    className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                                    {type}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
                            Best for
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-stone-700">
                            {content.bestFor.map(item => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2">
                                    <span className="text-brand mt-1 size-1.5 shrink-0 rounded-full bg-current" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    What To Know Before Renting In {county.name}
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {content.whatToKnow.map(point => (
                        <li
                            key={point}
                            className="flex items-start gap-3 rounded-xl bg-stone-50 p-4 text-sm leading-6 text-stone-700">
                            <span className="bg-brand/15 text-brand inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                !
                            </span>
                            {point}
                        </li>
                    ))}
                </ul>
            </section>

            {county.cities.length > 1 ? (
                <section className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                            Cities In {county.name}
                        </h2>
                        <p className="mt-1 text-sm text-stone-600">
                            Pick a city to see local listings.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {county.cities.map(city => (
                            <Link
                                key={city.name}
                                href={`/locations/${countySlug}/${slugify(city.name)}`}
                                className="group hover:border-brand flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition hover:shadow-md">
                                <div>
                                    <p className="flex items-center gap-2 text-sm font-semibold text-stone-950">
                                        <FiMapPin className="text-brand size-4" />
                                        {city.name}
                                    </p>
                                    <p className="mt-1 text-xs text-stone-500">
                                        {city.neighborhoods.length}{' '}
                                        {city.neighborhoods.length === 1
                                            ? 'neighborhood'
                                            : 'neighborhoods'}
                                    </p>
                                </div>
                                <FiArrowRight className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-stone-900" />
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            {(() => {
                const allNeighborhoods = county.cities.flatMap(city =>
                    city.neighborhoods.map(name => ({
                        name,
                        citySlug: slugify(city.name),
                    })),
                )
                if (allNeighborhoods.length === 0) return null

                return (
                    <section className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                                Sub-Areas In {county.name}
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                {allNeighborhoods.length} sub-areas — pick
                                one to see listings there.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allNeighborhoods.map(n => (
                                <Link
                                    key={`${n.citySlug}:${n.name}`}
                                    href={`/locations/${countySlug}/${n.citySlug}?neighborhood=${slugify(n.name)}`}
                                    className="hover:border-brand hover:text-brand inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition">
                                    <FiMapPin className="text-brand size-3.5" />
                                    {n.name}
                                </Link>
                            ))}
                        </div>
                    </section>
                )
            })()}

            {result.data.length > 0 ? (
                <section className="flex flex-col gap-4">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                                Latest Listings In {county.name}
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                {result.meta.total} verified listings in this
                                county.
                            </p>
                        </div>
                        <Link
                            href={`/properties?county=${countySlug}`}
                            className="text-brand inline-flex items-center gap-2 text-sm font-medium hover:underline">
                            View all
                            <FiArrowRight className="size-4" />
                        </Link>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {result.data.map(property => (
                            <li key={property.id}>
                                <Link
                                    href={`/properties/${property.slug}`}
                                    className="group hover:border-brand flex h-full flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 transition hover:shadow-md">
                                    <p className="text-sm font-semibold text-stone-950">
                                        {property.title}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        {property.neighborhood ??
                                            property.city ??
                                            property.county}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </>
    )
}
