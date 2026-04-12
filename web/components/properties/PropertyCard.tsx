import Link from "next/link";
import { FiArrowUpRight, FiDroplet, FiHeart, FiMapPin, FiMoon, FiStar } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import type { PropertyCardDto } from "@/lib/core/contracts/property";
import { buildPropertySubtitle, formatKes } from "@/modules/properties/search";

interface PropertyCardProps {
  property: PropertyCardDto;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const subtitle = buildPropertySubtitle([
    property.neighborhood,
    property.city,
    property.county,
  ]);

  return (
    <Link href={`/properties/${property.slug}`} className="block">
      <Card className="overflow-hidden rounded-[28px] border border-white/10 bg-white/80 p-0 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 dark:bg-white/5">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-200 via-white to-stone-200 dark:from-orange-950/40 dark:via-stone-950 dark:to-stone-900">
          {property.coverImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover/card:scale-105"
              style={{ backgroundImage: `url(${property.coverImageUrl})` }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {property.listingPurpose.replace("_", " ")}
            </span>
            {property.isFeatured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/90 px-3 py-1 text-xs font-medium text-stone-900">
                <FiStar className="size-3" />
                Featured
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"
            aria-label={`Save ${property.title}`}
          >
            <FiHeart />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-700">
              <FiMapPin className="size-3.5" />
              {subtitle || property.county}
            </div>
          </div>
        </div>
        <CardContent className="space-y-4 px-5 pb-5 pt-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">
                  {property.propertyType ?? "Property"}
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-stone-950 dark:text-white">
                  {property.title}
                </h3>
              </div>
              <FiArrowUpRight className="mt-1 size-5 text-stone-400" />
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
              {property.summary}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-300">
            {property.bedrooms !== null && property.bedrooms !== undefined ? (
              <span className="inline-flex items-center gap-2">
                <FiMoon className="size-4" />
                {property.bedrooms} bed
              </span>
            ) : null}
            {property.bathrooms !== null && property.bathrooms !== undefined ? (
              <span className="inline-flex items-center gap-2">
                <FiDroplet className="size-4" />
                {property.bathrooms} bath
              </span>
            ) : null}
          </div>
          <div className="flex items-end justify-between gap-3 border-t border-stone-200/70 pt-4 dark:border-white/10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                Starting from
              </p>
              <p className="text-2xl font-semibold tracking-tight text-stone-950 dark:text-white">
                {formatKes(property.price)}
              </p>
            </div>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              View details
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
