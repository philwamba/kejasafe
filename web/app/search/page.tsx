import type { Metadata } from "next";

import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { fetchProperties } from "@/lib/core/sdk/property-client";
import { parsePropertySearchParams, type PropertySearchPageParams } from "@/modules/properties/search";

export const metadata: Metadata = {
  title: "Search Properties | Kejasafe",
  description: "Filter housing listings by location, price, size, and purpose.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchPageParams>;
}) {
  const params = await searchParams;
  const filters = parsePropertySearchParams(params);
  const result = await fetchProperties({
    ...filters,
    page: filters.page ?? 1,
    perPage: filters.perPage ?? 12,
    sortBy: filters.sortBy ?? "newest",
  });

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-8 text-stone-950 dark:bg-stone-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[36px] border border-stone-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
            Search workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Refine listings with URL-based search filters.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300">
            This page is intentionally filter-first. It is useful for shared search links,
            future indexable location results, and admin support workflows when staff need
            to reproduce a user search exactly.
          </p>
          <div className="mt-8">
            <PropertyFilters action="/search" values={filters} />
          </div>
        </section>
        <PropertyGrid properties={result.data} />
      </div>
    </main>
  );
}
