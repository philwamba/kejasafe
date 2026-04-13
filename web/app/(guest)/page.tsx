import Link from 'next/link'
import { FiArrowRight, FiCheckCircle, FiHome, FiShield } from 'react-icons/fi'

export const dynamic = 'force-dynamic'

import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertySearchBar } from '@/components/properties/PropertySearchBar'
import { Button } from '@/components/ui/button'
import { fetchProperties } from '@/lib/core/sdk/property-client'

const trustSignals = [
    {
        icon: FiShield,
        title: 'Verified landlords',
        description:
            'Every listing is checked for real ownership before it goes live.',
    },
    {
        icon: FiCheckCircle,
        title: 'No scams',
        description:
            'Browse real homes from real people — not brokers posing as owners.',
    },
    {
        icon: FiHome,
        title: 'All of Kenya',
        description:
            'Rentals, sales and short-stay homes across every county.',
    },
]

export default async function Home() {
    const result = await fetchProperties({
        page: 1,
        perPage: 8,
        sortBy: 'newest',
    })

    return (
        <>
            <section className="flex flex-col gap-8 pt-2 sm:pt-6">
                <div className="space-y-5">
                    <span className="bg-brand/10 text-brand inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase">
                        <span className="bg-brand inline-block size-1.5 rounded-full" />
                        Verified Listings Across Kenya
                    </span>
                    <h1 className="max-w-4xl text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-stone-950">
                        Find Safe & Verified Houses With{' '}
                        <span className="text-brand">Kejasafe</span>
                    </h1>
                    <p className="max-w-2xl text-lg leading-8 text-stone-600">
                        Browse available houses, avoid scams, and rent with
                        confidence. Real homes from verified landlords — no
                        ghost listings.
                    </p>
                </div>
                <PropertySearchBar />
                <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500">
                    <span>Popular:</span>
                    {[
                        ['Nairobi', '/locations/nairobi'],
                        ['Mombasa', '/locations/mombasa'],
                        ['Kiambu', '/locations/kiambu'],
                        ['Nakuru', '/locations/nakuru'],
                        ['Kisumu', '/locations/kisumu'],
                    ].map(([label, href]) => (
                        <Link
                            key={label}
                            href={href}
                            className="hover:text-brand font-medium transition-colors">
                            {label}
                        </Link>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                            Latest Listings
                        </h2>
                        <p className="mt-1 text-sm text-stone-600">
                            Freshly added homes from verified landlords.
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-11 rounded-xl">
                        <Link href="/properties">
                            View all listings
                            <FiArrowRight />
                        </Link>
                    </Button>
                </div>
                <PropertyGrid properties={result.data} />
            </section>

            <section className="rounded-3xl border border-stone-200 bg-gradient-to-br from-brand/5 via-white to-white p-8 sm:p-12">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
                    <div className="space-y-4">
                        <span className="text-brand text-xs font-semibold tracking-[0.22em] uppercase">
                            Why Kejasafe
                        </span>
                        <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                            The Trusted Way To Rent A Home In Kenya
                        </h2>
                        <p className="max-w-xl text-base leading-7 text-stone-600">
                            Kejasafe verifies every landlord and every listing
                            before it reaches you. No broker tricks. No ghost
                            addresses. Just real homes from real owners.
                        </p>
                        <Button asChild size="lg" className="mt-2 rounded-xl">
                            <Link href="/about">Learn more about us</Link>
                        </Button>
                    </div>
                    <div className="grid gap-5">
                        {trustSignals.map(signal => {
                            const Icon = signal.icon
                            return (
                                <div
                                    key={signal.title}
                                    className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                                    <span className="bg-brand/10 text-brand inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                                        <Icon className="size-5" />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-stone-950">
                                            {signal.title}
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-stone-600">
                                            {signal.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-stone-950 text-white rounded-3xl px-8 py-14 sm:px-14 sm:py-20">
                <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Own A Property? List It On Kejasafe.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                            Submit your property once. Our team reviews it
                            within 24–48 hours. Once approved, thousands of
                            verified renters can find it.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 rounded-xl px-6">
                            <Link href="/login?next=/portal/properties/new">
                                List your property
                                <FiArrowRight />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-xl border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                            <Link href="/pricing">See pricing</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}
