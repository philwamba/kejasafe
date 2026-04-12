import { FiArrowRight, FiMapPin } from "react-icons/fi";

import { Button } from "@/components/ui/button";

export function PropertySearchBar() {
  return (
    <form
      action="/search"
      className="grid w-full gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1.1fr_1fr_1fr_auto]"
    >
      <label className="grid gap-2 min-w-0">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Location
        </span>
        <div className="flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 focus-within:border-brand">
          <FiMapPin className="size-4 text-brand shrink-0" />
          <input
            name="county"
            placeholder="Nairobi"
            autoCapitalize="words"
            className="w-full bg-transparent text-sm text-stone-900 capitalize outline-none placeholder:text-stone-400 placeholder:normal-case"
          />
        </div>
      </label>
      <label className="grid gap-2 min-w-0">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Property type
        </span>
        <select
          name="propertyType"
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none focus:border-brand"
          defaultValue=""
        >
          <option value="">Any type</option>
          <option value="apartment">Apartment</option>
          <option value="studio">Studio</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="townhouse">Townhouse</option>
        </select>
      </label>
      <label className="grid gap-2 min-w-0">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Budget cap
        </span>
        <input
          name="maxPrice"
          inputMode="numeric"
          placeholder="KES 80,000"
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none focus:border-brand placeholder:text-stone-400"
        />
      </label>
      <div className="flex items-end">
        <Button type="submit" size="lg" className="h-12 w-full rounded-xl px-5 md:w-auto">
          Explore
          <FiArrowRight />
        </Button>
      </div>
    </form>
  );
}
