import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertySearchBar } from "@/components/properties/PropertySearchBar";
import { Button } from "@/components/ui/button";
import { fetchProperties } from "@/lib/core/sdk/property-client";
import type { Metadata } from "next";
import {
  buildPropertySubtitle,
  formatKes,
  parsePropertySearchParams,
  type PropertySearchPageParams,
} from "@/modules/properties/search";

export const metadata: Metadata = {
  title: "Property Listings | Kejasafe",
  description: "Browse verified rental, sale, and short-stay listings across Kenya.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchPageParams>;
}) {
  const params = await searchParams;
  const filters = parsePropertySearchParams(params);
  const result = await fetchProperties({
    ...filters,
    page: filters.page ?? 1,
    perPage: filters.perPage ?? 9,
    sortBy: filters.sortBy ?? "newest",
  });
  const featured = result.data[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#ecfdf5_42%,_#ffffff_100%)] px-6 py-8 text-stone-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_28%),linear-gradient(180deg,_#0a0a0a_0%,_#07140f_36%,_#111827_100%)] dark:text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-[36px] border border-white/10 bg-white/70 p-8 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:bg-white/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex w-fit rounded-full bg-orange-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-orange-700 dark:text-orange-300">
                Verified housing intelligence
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Discover premium, practical homes and property inventory across Kenya.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-300">
                Search by county, budget, property type, or occupancy need. The listings
                below are served through the platform provider layer, so the same UI can
                resolve against Prisma or Laravel without component-level branching.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" className="h-12 rounded-2xl px-5">
                <Link href="/search">
                  Open search page
                  <FiArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <PropertySearchBar />
        </header>

        {featured ? (
          <section className="grid gap-6 rounded-[36px] border border-stone-200 bg-white/80 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1.3fr_0.9fr]">
            <div
              className="min-h-[320px] rounded-[30px] bg-gradient-to-br from-orange-200 via-white to-stone-200 bg-cover bg-center dark:from-orange-950/40 dark:via-stone-950 dark:to-stone-900"
              style={
                featured.coverImageUrl
                  ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.10), rgba(0,0,0,0.45)), url(${featured.coverImageUrl})` }
                  : undefined
              }
            />
            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-stone-900">
                  Featured now
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-orange-700 dark:text-orange-300">
                    {featured.propertyType ?? "Property"}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    {featured.title}
                  </h2>
                </div>
                <p className="text-base leading-8 text-stone-600 dark:text-stone-300">
                  {featured.summary}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {buildPropertySubtitle([
                    featured.neighborhood,
                    featured.city,
                    featured.county,
                  ])}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-stone-200 pt-4 dark:border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    Starting from
                  </p>
                  <p className="text-3xl font-semibold tracking-tight">
                    {formatKes(featured.price)}
                  </p>
                </div>
                <Button asChild size="lg" className="h-12 rounded-2xl px-5">
                  <Link href={`/properties/${featured.slug}`}>Inspect listing</Link>
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Search and refine
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Active property inventory
              </h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Showing {result.data.length} of {result.meta.total} listings.
            </p>
          </div>
          <PropertyFilters values={filters} />
          <PropertyGrid properties={result.data} />
        </section>
      </div>
    </main>
  );
}
