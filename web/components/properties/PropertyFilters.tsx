import Link from "next/link";
import { FiSearch } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import type { PropertySearchInput } from "@/lib/core/contracts/property";

interface PropertyFiltersProps {
  action?: string;
  values: PropertySearchInput;
}

export function PropertyFilters({
  action = "/properties",
  values,
}: PropertyFiltersProps) {
  return (
    <form
      action={action}
      className="grid gap-4 rounded-[32px] border border-white/10 bg-white/75 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:bg-white/5 md:grid-cols-2 xl:grid-cols-5"
    >
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          County
        </span>
        <input
          name="county"
          defaultValue={values.county ?? ""}
          placeholder="nairobi"
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none ring-0 transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          City
        </span>
        <input
          name="city"
          defaultValue={values.city ?? ""}
          placeholder="westlands"
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Property type
        </span>
        <select
          name="propertyType"
          defaultValue={values.propertyType ?? ""}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        >
          <option value="">All types</option>
          <option value="apartment">Apartment</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="studio">Studio</option>
          <option value="maisonette">Maisonette</option>
          <option value="townhouse">Townhouse</option>
          <option value="office">Office</option>
          <option value="hostel-student-housing">Student housing</option>
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Purpose
        </span>
        <select
          name="listingPurpose"
          defaultValue={values.listingPurpose ?? ""}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        >
          <option value="">Rent, sale, short stay</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
          <option value="short_stay">Short stay</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            Min KES
          </span>
          <input
            name="minPrice"
            defaultValue={values.minPrice ?? ""}
            placeholder="25000"
            className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            Max KES
          </span>
          <input
            name="maxPrice"
            defaultValue={values.maxPrice ?? ""}
            placeholder="120000"
            className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Bedrooms
        </span>
        <select
          name="bedrooms"
          defaultValue={values.bedrooms ?? ""}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Bathrooms
        </span>
        <select
          name="bathrooms"
          defaultValue={values.bathrooms ?? ""}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          Sort by
        </span>
        <select
          name="sortBy"
          defaultValue={values.sortBy ?? "newest"}
          className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-stone-950/60"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </label>
      <div className="flex items-end gap-3 xl:col-span-2">
        <Button type="submit" size="lg" className="h-12 rounded-2xl px-5">
          <FiSearch />
          Search listings
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 rounded-2xl">
          <Link href={action}>Reset</Link>
        </Button>
      </div>
    </form>
  );
}
