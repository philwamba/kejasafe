import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import type { PropertySearchInput } from '@/lib/core/contracts/property'

interface PropertyFiltersProps {
    action?: string
    values: PropertySearchInput
}

const inputClass =
    'h-11 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400'

const labelClass =
    'text-xs font-medium uppercase tracking-[0.14em] text-stone-500'

export function PropertyFilters({
    action = '/properties',
    values,
}: PropertyFiltersProps) {
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
            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>Property type</span>
                <select
                    name="propertyType"
                    defaultValue={values.propertyType ?? ''}
                    className={inputClass}>
                    <option value="">All types</option>
                    <option value="apartment">Apartment</option>
                    <option value="bedsitter">Bedsitter</option>
                    <option value="studio">Studio</option>
                    <option value="maisonette">Maisonette</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="office">Office</option>
                    <option value="hostel-student-housing">
                        Student housing
                    </option>
                </select>
            </label>
            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>Purpose</span>
                <select
                    name="listingPurpose"
                    defaultValue={values.listingPurpose ?? ''}
                    className={inputClass}>
                    <option value="">Rent, sale, short stay</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                    <option value="short_stay">Short stay</option>
                </select>
            </label>

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

            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>Bedrooms</span>
                <select
                    name="bedrooms"
                    defaultValue={values.bedrooms ?? ''}
                    className={inputClass}>
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                </select>
            </label>
            <label className="grid min-w-0 gap-2">
                <span className={labelClass}>Bathrooms</span>
                <select
                    name="bathrooms"
                    defaultValue={values.bathrooms ?? ''}
                    className={inputClass}>
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                </select>
            </label>

            <label className="grid min-w-0 gap-2 sm:col-span-2">
                <span className={labelClass}>Sort by</span>
                <select
                    name="sortBy"
                    defaultValue={values.sortBy ?? 'newest'}
                    className={inputClass}>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                </select>
            </label>

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
