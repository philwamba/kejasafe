import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiMapPin, FiShield, FiWifi } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { fetchPropertyBySlug } from "@/lib/core/sdk/property-client";
import { buildPropertySubtitle, formatKes } from "@/modules/properties/search";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const property = await fetchPropertyBySlug(slug);

    if (!property) {
      return {
        title: "Property not found | Kejasafe",
      };
    }

    return {
      title: `${property.title} | Kejasafe`,
      description: property.summary,
    };
  } catch {
    return {
      title: "Property | Kejasafe",
    };
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const subtitle = buildPropertySubtitle([
    property.neighborhood,
    property.city,
    property.county,
  ]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#ecfeff_100%)] px-6 py-8 text-stone-950 dark:bg-[linear-gradient(180deg,_#0a0a0a_0%,_#111827_45%,_#052e2b_100%)] dark:text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="outline" size="lg" className="h-11 rounded-2xl px-4">
            <Link href="/properties">
              <FiArrowLeft />
              Back to listings
            </Link>
          </Button>
          <div className="text-sm text-stone-500 dark:text-stone-300">
            Provider-backed property detail
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                  {property.propertyType ?? "Property"}
                </span>
                <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white dark:bg-white dark:text-stone-950">
                  {property.listingPurpose.replace("_", " ")}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {property.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300">
                  {property.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 dark:text-stone-300">
                <span className="inline-flex items-center gap-2">
                  <FiMapPin className="size-4" />
                  {subtitle || property.county}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiCalendar className="size-4" />
                  Status: {property.listingStatus}
                </span>
              </div>
            </div>
            <PropertyGallery property={property} />
            <section className="rounded-[32px] border border-stone-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
              <p className="mt-4 text-base leading-8 text-stone-600 dark:text-stone-300">
                {property.description}
              </p>
            </section>
            <section className="rounded-[32px] border border-stone-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-2xl font-semibold tracking-tight">Amenities and highlights</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.length > 0 ? (
                  property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-stone-900/70"
                    >
                      <FiCheckCircle className="size-4 text-emerald-600" />
                      {amenity}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-stone-900/70">
                      <FiShield className="size-4 text-emerald-600" />
                      Secure entry workflow ready
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-stone-900/70">
                      <FiWifi className="size-4 text-emerald-600" />
                      Connectivity data supported
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_24px_90px_-55px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Pricing
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">
                {formatKes(property.price)}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                This card is ready to evolve into inquiry, booking, WhatsApp, or lead
                capture flows without changing the property DTO contract.
              </p>
              <div className="mt-6 grid gap-3">
                <Button size="lg" className="h-12 rounded-2xl">
                  Book a viewing
                </Button>
                <Button variant="outline" size="lg" className="h-12 rounded-2xl">
                  Send inquiry
                </Button>
              </div>
            </div>
            <div className="rounded-[32px] border border-stone-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-xl font-semibold tracking-tight">Property facts</h2>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3 dark:border-white/10">
                  <dt className="text-stone-500 dark:text-stone-400">Bedrooms</dt>
                  <dd>{property.bedrooms ?? "Not specified"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3 dark:border-white/10">
                  <dt className="text-stone-500 dark:text-stone-400">Bathrooms</dt>
                  <dd>{property.bathrooms ?? "Not specified"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3 dark:border-white/10">
                  <dt className="text-stone-500 dark:text-stone-400">County</dt>
                  <dd>{property.county}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-stone-500 dark:text-stone-400">Coordinates</dt>
                  <dd>
                    {property.coordinates
                      ? `${property.coordinates.latitude}, ${property.coordinates.longitude}`
                      : "Not published"}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
