import { FiArrowRight, FiMapPin } from "react-icons/fi";

import { Button } from "@/components/ui/button";

export function PropertySearchBar() {
  return (
    <form
      action="/search"
      className="grid gap-4 rounded-[32px] border border-white/10 bg-white/85 p-4 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.5)] backdrop-blur-sm md:grid-cols-[1.1fr_1fr_1fr_auto] dark:bg-white/5"
    >
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
          Location
        </span>
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 dark:border-white/10 dark:bg-stone-950/60">
          <FiMapPin className="size-4 text-emerald-600" />
          <input
            name="county"
            placeholder="Nairobi"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </label>
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
          Property type
        </span>
        <select
          name="propertyType"
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-stone-950/60"
          defaultValue=""
        >
          <option value="">Any type</option>
          <option value="apartment">Apartment</option>
          <option value="studio">Studio</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="townhouse">Townhouse</option>
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
          Budget cap
        </span>
        <input
          name="maxPrice"
          placeholder="KES 80,000"
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-stone-950/60"
        />
      </label>
      <div className="flex items-end">
        <Button type="submit" size="lg" className="h-12 w-full rounded-2xl px-5 md:w-auto">
          Explore
          <FiArrowRight />
        </Button>
      </div>
    </form>
  );
}
