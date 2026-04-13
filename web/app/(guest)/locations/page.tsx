import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'

import { listAllCounties, type Region } from '@/modules/locations/content'

export const metadata: Metadata = {
    title: 'Locations in Kenya',
    description:
        'Browse verified property listings across all 47 counties in Kenya. Find homes in Nairobi, Mombasa, Kisumu, Nakuru, Eldoret and more.',
}

const REGION_ORDER: Region[] = [
    'Nairobi Metropolitan',
    'Coastal',
    'Central',
    'Rift Valley',
    'Western',
    'Nyanza',
    'Eastern',
    'Northern',
]

const REGION_DESCRIPTIONS: Record<Region, string> = {
    'Nairobi Metropolitan':
        'Nairobi and its commuter counties — the most active rental market in the country.',
    Coastal: 'Mombasa, Kilifi, Kwale and the rest of the Kenyan coast.',
    Central: 'The central highlands, from Nyeri to Embu and Meru.',
    'Rift Valley':
        'From Nakuru and Eldoret to the high-altitude counties of the north.',
    Western: 'Kakamega, Bungoma, Busia and Vihiga.',
    Nyanza: 'The Lake Victoria region — Kisumu, Kisii, Homa Bay, Migori, Siaya, Nyamira.',
    Eastern: 'Kitui, Makueni, Isiolo and the eastern lowlands.',
    Northern:
        'Garissa, Wajir, Mandera, Marsabit and the north-eastern counties.',
}

export default function LocationsIndexPage() {
    const catalogPath = resolve(process.cwd(), '../data/locations/kenya.json')
    const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))
    const counties = listAllCounties(catalog)

    const byRegion = new Map<Region, typeof counties>()
    for (const region of REGION_ORDER) {
        byRegion.set(region, [])
    }
    for (const county of counties) {
        byRegion.get(county.region)?.push(county)
    }

    return (
        <>
            <section className="space-y-4">
                <span className="bg-brand/10 text-brand inline-flex w-fit rounded-full px-4 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                    Kenya coverage
                </span>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    Browse Listings By Location
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-600">
                    All 47 Kenyan counties, grouped by region. Pick a county to
                    see its cities, local context, and verified listings.
                </p>
            </section>

            {REGION_ORDER.map(region => {
                const items = byRegion.get(region) ?? []
                if (items.length === 0) return null

                return (
                    <section key={region} className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                                {region}
                            </h2>
                            <p className="mt-1 max-w-3xl text-sm text-stone-600">
                                {REGION_DESCRIPTIONS[region]}
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map(county => (
                                <Link
                                    key={county.slug}
                                    href={`/locations/${county.slug}`}
                                    className="group hover:border-brand flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-4 transition hover:shadow-md">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950">
                                            <FiMapPin className="text-brand size-4" />
                                            {county.name}
                                        </span>
                                        <FiArrowRight className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-stone-900" />
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-5 text-stone-500">
                                        {county.tagline}
                                    </p>
                                    <p className="mt-auto text-xs font-medium text-stone-500">
                                        {county.cityCount}{' '}
                                        {county.cityCount === 1
                                            ? 'city / sub-area'
                                            : 'cities / sub-areas'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )
            })}
        </>
    )
}
