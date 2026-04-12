import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { PublicFooter } from "@/components/site/PublicFooter";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertySearchBar } from "@/components/properties/PropertySearchBar";
import { Button } from "@/components/ui/button";
import { fetchProperties } from "@/lib/core/sdk/property-client";

export default async function Home() {
  const result = await fetchProperties({ page: 1, perPage: 6, sortBy: "newest" });

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-stone-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12">
        <PublicHeader />

        <section className="flex flex-col gap-8">
          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Find Safe & Verified Houses with Kejasafe
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-600">
              Browse available houses, avoid scams, and rent with confidence.
            </p>
          </div>
          <PropertySearchBar />
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
              Latest listings
            </h2>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/properties">
                View all
                <FiArrowRight />
              </Link>
            </Button>
          </div>
          <PropertyGrid properties={result.data} />
        </section>

        <PublicFooter />
      </section>
    </main>
  );
}
