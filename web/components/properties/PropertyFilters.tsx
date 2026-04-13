'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import type { PropertySearchInput } from '@/lib/core/contracts/property'

interface PropertyFiltersProps {
    action?: string
    values: PropertySearchInput
}

const inputClass =
    'h-11 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400'

const labelClass =
    'text-xs font-medium uppercase tracking-[0.14em] text-stone-500'

const PROPERTY_TYPE_OPTIONS: ComboboxOption[] = [
    { value: '', label: 'All types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'bedsitter', label: 'Bedsitter' },
    { value: 'studio', label: 'Studio' },
    { value: 'maisonette', label: 'Maisonette' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Office' },
    { value: 'hostel-student-housing', label: 'Student housing' },
]

const PURPOSE_OPTIONS: ComboboxOption[] = [
    { value: '', label: 'Rent, sale, short stay' },
    { value: 'rent', label: 'Rent' },
    { value: 'sale', label: 'Sale' },
    { value: 'short_stay', label: 'Short stay' },
]

const BEDROOM_OPTIONS: ComboboxOption[] = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
]

const BATHROOM_OPTIONS: ComboboxOption[] = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
]

const SORT_OPTIONS: ComboboxOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: low to high' },
    { value: 'price_desc', label: 'Price: high to low' },
]

export function PropertyFilters({
    action = '/properties',
    values,
}: PropertyFiltersProps) {
    const [propertyType, setPropertyType] = useState(values.propertyType ?? '')
    const [listingPurpose, setListingPurpose] = useState(
        (values.listingPurpose as string) ?? '',
    )
    const [bedrooms, setBedrooms] = useState(
        values.bedrooms !== undefined ? String(values.bedrooms) : '',
    )
    const [bathrooms, setBathrooms] = useState(
        values.bathrooms !== undefined ? String(values.bathrooms) : '',
    )
    const [sortBy, setSortBy] = useState((values.sortBy as string) ?? 'newest')

    return (
        <form
            action={action}
            className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>County</span>
                <input
                    name="county"
                    defaultValue={values.county ?? ''}
                    placeholder="Nairobi"
                    autoCapitalize="words"
                    className={`${inputClass} capitalize placeholder:normal-case`}
                />
            </label>
            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>City</span>
                <input
                    name="city"
                    defaultValue={values.city ?? ''}
                    placeholder="Westlands"
                    autoCapitalize="words"
                    className={`${inputClass} capitalize placeholder:normal-case`}
                />
            </label>
            <div className="grid min-w-0 gap-2">
                <span className={labelClass}>Property type</span>
                <Combobox
                    options={PROPERTY_TYPE_OPTIONS}
                    value={propertyType}
                    onChange={setPropertyType}
                    name="propertyType"
                    placeholder="All types"
                    searchPlaceholder="Search types…"
                    allowClear={false}
                />
            </div>
            <div className="grid min-w-0 gap-2">
                <span className={labelClass}>Purpose</span>
                <Combobox
                    options={PURPOSE_OPTIONS}
                    value={listingPurpose}
                    onChange={setListingPurpose}
                    name="listingPurpose"
                    placeholder="Rent, sale, short stay"
                    searchPlaceholder="Search purpose…"
                    allowClear={false}
                />
            </div>

            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>Min KES</span>
                <input
                    name="minPrice"
                    inputMode="numeric"
                    defaultValue={values.minPrice ?? ''}
                    placeholder="25,000"
                    className={inputClass}
                />
            </label>
            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>Max KES</span>
                <input
                    name="maxPrice"
                    inputMode="numeric"
                    defaultValue={values.maxPrice ?? ''}
                    placeholder="120,000"
                    className={inputClass}
                />
            </label>

            <div className="grid min-w-0 gap-2">
                <span className={labelClass}>Bedrooms</span>
                <Combobox
                    options={BEDROOM_OPTIONS}
                    value={bedrooms}
                    onChange={setBedrooms}
                    name="bedrooms"
                    placeholder="Any"
                    searchPlaceholder="Search"
                    allowClear={false}
                />
            </div>
            <div className="grid min-w-0 gap-2">
                <span className={labelClass}>Bathrooms</span>
                <Combobox
                    options={BATHROOM_OPTIONS}
                    value={bathrooms}
                    onChange={setBathrooms}
                    name="bathrooms"
                    placeholder="Any"
                    searchPlaceholder="Search"
                    allowClear={false}
                />
            </div>

            <div className="grid min-w-0 gap-2 sm:col-span-2">
                <span className={labelClass}>Sort by</span>
                <Combobox
                    options={SORT_OPTIONS}
                    value={sortBy}
                    onChange={setSortBy}
                    name="sortBy"
                    placeholder="Newest"
                    searchPlaceholder="Search"
                    allowClear={false}
                />
            </div>

            <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3 xl:col-span-2">
                <Button
                    type="submit"
                    size="lg"
                    className="h-11 rounded-xl px-5">
                    <FiSearch />
                    Search listings
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-xl">
                    <Link href={action}>Reset</Link>
                </Button>
            </div>
        </form>
    )
}
