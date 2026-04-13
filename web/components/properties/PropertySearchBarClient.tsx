'use client'

import { useMemo, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'

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
    const hasNairobi = counties.some(c => c.slug === 'nairobi')
    const [countySlug, setCountySlug] = useState(hasNairobi ? 'nairobi' : '')
    const [citySlug, setCitySlug] = useState('')

    const cityOptions = useMemo(() => {
        if (!countySlug) return []
        return counties.find(c => c.slug === countySlug)?.cities ?? []
    }, [counties, countySlug])

    const countyComboOptions: ComboboxOption[] = useMemo(
        () =>
            counties.map(c => ({
                value: c.slug,
                label: c.name,
                description: `${c.cities.length} ${
                    c.cities.length === 1 ? 'city' : 'cities'
                }`,
            })),
        [counties],
    )

    const cityComboOptions: ComboboxOption[] = useMemo(
        () => cityOptions.map(c => ({ value: c.slug, label: c.name })),
        [cityOptions],
    )

    return (
        <form
            action="/search"
            className="grid w-full gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1.1fr_1.1fr_1fr_auto]">
            <div className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    County
                </span>
                <Combobox
                    options={countyComboOptions}
                    value={countySlug}
                    onChange={value => {
                        setCountySlug(value)
                        setCitySlug('')
                    }}
                    name="county"
                    placeholder="Any county"
                    searchPlaceholder="Search county…"
                    className="h-12"
                />
            </div>

            <div className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    City / sub-area
                </span>
                <Combobox
                    options={cityComboOptions}
                    value={citySlug}
                    onChange={setCitySlug}
                    name="city"
                    placeholder={
                        cityComboOptions.length === 0
                            ? 'Pick a county first'
                            : 'Any city'
                    }
                    searchPlaceholder="Search city…"
                    disabled={cityComboOptions.length === 0}
                    className="h-12"
                />
            </div>

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
