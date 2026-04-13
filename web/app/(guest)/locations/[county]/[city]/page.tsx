import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'

import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { getLocationContent, slugify } from '@/modules/locations/content'
import { fetchProperties } from '@/lib/core/sdk/property-client'

export const dynamic = 'force-dynamic'

interface CountyEntry {
    code: string
    name: string
    cities: Array<{ name: string; neighborhoods: string[] }>
}

function loadCatalog(): { counties: CountyEntry[] } {
    const catalogPath = resolve(process.cwd(), '../data/locations/kenya.json')
    return JSON.parse(readFileSync(catalogPath, 'utf-8'))
}

function resolveCityContext(
    countySlug: string,
    citySlug: string,
): { county: CountyEntry; city: CountyEntry['cities'][number] } | null {
    const catalog = loadCatalog()
    const county = catalog.counties.find(c => slugify(c.name) === countySlug)
    if (!county) return null
    const city = county.cities.find(c => slugify(c.name) === citySlug)
    if (!city) return null
    return { county, city }
}

export async function generateStaticParams() {
    const catalog = loadCatalog()
    const params: Array<{ county: string; city: string }> = []
    for (const county of catalog.counties) {
        for (const city of county.cities) {
            params.push({
                county: slugify(county.name),
                city: slugify(city.name),
            })
        }
    }
    return params
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ county: string; city: string }>
}): Promise<Metadata> {
    const { county: countySlug, city: citySlug } = await params
    const ctx = resolveCityContext(countySlug, citySlug)
    if (!ctx) return { title: 'Location not found' }

    return {
        title: `Houses In ${ctx.city.name}, ${ctx.county.name}`,
        description: `Verified property listings in ${ctx.city.name}, ${ctx.county.name}. Browse apartments, bungalows and houses for rent and sale.`,
        alternates: {
            canonical: `/locations/${countySlug}/${citySlug}`,
        },
    }
}

export default async function CityPage({
    params,
    searchParams,
}: {
    params: Promise<{ county: string; city: string }>
    searchParams: Promise<{ neighborhood?: string }>
}) {
    const { county: countySlug, city: citySlug } = await params
    const { neighborhood: neighborhoodSlug } = await searchParams
    const ctx = resolveCityContext(countySlug, citySlug)
    if (!ctx) notFound()

    const countyContent = getLocationContent(countySlug, ctx.county.name)

    const result = await fetchProperties({
        county: countySlug,
        city: citySlug,
        neighborhood: neighborhoodSlug || undefined,
        perPage: 12,
        sortBy: 'newest',
    }).catch(() => ({ data: [], meta: { total: 0 } }))

    const breadcrumbs = {
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
                name: ctx.county.name,
                item: `/locations/${countySlug}`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: ctx.city.name,
                item: `/locations/${countySlug}/${citySlug}`,
            },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbs),
                }}
            />

            <section className="space-y-4">
                <Link
                    href={`/locations/${countySlug}`}
                    className="hover:text-brand inline-flex items-center gap-2 text-sm text-stone-500">
                    ← Back to {ctx.county.name}
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-brand/10 text-brand inline-flex rounded-full px-4 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                        {countyContent.region}
                    </span>
                    <span className="inline-flex rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600">
                        {ctx.county.name}
                    </span>
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    Houses In {ctx.city.name}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-stone-600">
                    {result.meta.total} verified{' '}
                    {result.meta.total === 1 ? 'listing' : 'listings'} in{' '}
                    {ctx.city.name}, {ctx.county.name}.
                </p>
            </section>

            {ctx.city.neighborhoods.length > 0 ? (
                <section className="flex flex-col gap-3">
                    <p className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                        Filter by neighborhood
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/locations/${countySlug}/${citySlug}`}
                            className={
                                !neighborhoodSlug
                                    ? 'bg-brand rounded-full px-4 py-2 text-xs font-semibold text-white'
                                    : 'hover:border-brand hover:text-brand rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 transition'
                            }>
                            All of {ctx.city.name}
                        </Link>
                        {ctx.city.neighborhoods.map(name => {
                            const slug = slugify(name)
                            const active = neighborhoodSlug === slug
                            return (
                                <Link
                                    key={slug}
                                    href={`/locations/${countySlug}/${citySlug}?neighborhood=${slug}`}
                                    className={
                                        active
                                            ? 'bg-brand rounded-full px-4 py-2 text-xs font-semibold text-white'
                                            : 'hover:border-brand hover:text-brand rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 transition'
                                    }>
                                    {name}
                                </Link>
                            )
                        })}
                    </div>
                </section>
            ) : null}

            <section className="flex flex-col gap-4">
                <div className="flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                        {neighborhoodSlug
                            ? `Listings In ${ctx.city.neighborhoods.find(n => slugify(n) === neighborhoodSlug) ?? ctx.city.name}`
                            : `Listings In ${ctx.city.name}`}
                    </h2>
                    <Link
                        href={`/properties?county=${countySlug}&city=${citySlug}${
                            neighborhoodSlug
                                ? `&neighborhood=${neighborhoodSlug}`
                                : ''
                        }`}
                        className="text-brand inline-flex items-center gap-2 text-sm font-medium hover:underline">
                        Open in search
                        <FiArrowRight className="size-4" />
                    </Link>
                </div>
                <PropertyGrid properties={result.data} />
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    Living In {ctx.county.name}
                </h2>
                <p className="mt-4 text-base leading-8 text-stone-700">
                    {countyContent.description}
                </p>
                <div className="mt-6 border-t border-stone-100 pt-5">
                    <p className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                        What To Know Before Renting Here
                    </p>
                    <ul className="mt-3 grid gap-2">
                        {countyContent.whatToKnow.slice(0, 4).map(point => (
                            <li
                                key={point}
                                className="flex items-start gap-2 text-sm leading-6 text-stone-700">
                                <FiMapPin className="text-brand mt-0.5 size-4 shrink-0" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    )
}
