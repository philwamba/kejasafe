'use client'

import { useMemo, useState } from 'react'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'

import { Button } from '@/components/ui/button'

interface CityOption {
    slug: string
    name: string
}

interface CountyOption {
    slug: string
    name: string
    cities: CityOption[]
}

interface PropertySearchBarClientProps {
    counties: CountyOption[]
}

export function PropertySearchBarClient({
    counties,
}: PropertySearchBarClientProps) {
    const [countySlug, setCountySlug] = useState('')

    const cityOptions = useMemo(() => {
        if (!countySlug) return []
        return counties.find(c => c.slug === countySlug)?.cities ?? []
    }, [counties, countySlug])

    return (
        <form
            action="/search"
            className="grid w-full gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1.1fr_1.1fr_1fr_auto]">
            <label className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    County
                </span>
                <div className="focus-within:border-brand flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4">
                    <FiMapPin className="text-brand size-4 shrink-0" />
                    <select
                        name="county"
                        value={countySlug}
                        onChange={e => setCountySlug(e.target.value)}
                        className="w-full bg-transparent text-sm text-stone-900 outline-none">
                        <option value="">Any county</option>
                        {counties.map(county => (
                            <option key={county.slug} value={county.slug}>
                                {county.name}
                            </option>
                        ))}
                    </select>
                </div>
            </label>

            <label className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    City / sub-area
                </span>
                <select
                    name="city"
                    disabled={cityOptions.length === 0}
                    className="focus:border-brand h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none disabled:cursor-not-allowed disabled:opacity-60">
                    <option value="">
                        {cityOptions.length === 0
                            ? 'Pick a county first'
                            : 'Any city'}
                    </option>
                    {cityOptions.map(city => (
                        <option key={city.slug} value={city.slug}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    Budget cap
                </span>
                <input
                    name="maxPrice"
                    inputMode="numeric"
                    placeholder="KES 80,000"
                    className="focus:border-brand h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                />
            </label>

            <div className="flex items-end">
                <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full rounded-xl px-5 md:w-auto">
                    Explore
                    <FiArrowRight />
                </Button>
            </div>
        </form>
    )
}
