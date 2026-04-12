import { FiArrowRight, FiMapPin } from 'react-icons/fi'

import { Button } from '@/components/ui/button'

export function PropertySearchBar() {
    return (
        <form
            action="/search"
            className="grid w-full gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1.1fr_1fr_1fr_auto]">
            <label className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    Location
                </span>
                <div className="focus-within:border-brand flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4">
                    <FiMapPin className="text-brand size-4 shrink-0" />
                    <input
                        name="county"
                        placeholder="Nairobi"
                        autoCapitalize="words"
                        className="w-full bg-transparent text-sm text-stone-900 capitalize outline-none placeholder:text-stone-400 placeholder:normal-case"
                    />
                </div>
            </label>
            <label className="grid min-w-0 gap-2">
                <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                    Property type
                </span>
                <select
                    name="propertyType"
                    className="focus:border-brand h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none"
                    defaultValue="">
                    <option value="">Any type</option>
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="bedsitter">Bedsitter</option>
                    <option value="townhouse">Townhouse</option>
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
