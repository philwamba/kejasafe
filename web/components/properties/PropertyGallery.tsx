import { FiImage } from "react-icons/fi";

import type { PropertyDetailDto } from "@/lib/core/contracts/property";

interface PropertyGalleryProps {
  property: PropertyDetailDto;
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const heroImage = property.gallery.find((image) => image.isCover) ?? property.gallery[0];
  const remaining = property.gallery.slice(heroImage ? 1 : 0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-200 via-white to-stone-200 dark:from-orange-950/40 dark:via-stone-950 dark:to-stone-900">
        {heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage.url})` }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-stone-500 dark:text-stone-300">
            <div className="text-center">
              <FiImage className="mx-auto size-8" />
              <p className="mt-3 text-sm">Gallery media will appear here.</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {remaining.length > 0
          ? remaining.map((image) => (
              <div
                key={image.id}
                className="min-h-28 rounded-[28px] border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${image.url})` }}
              />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-h-28 rounded-[28px] border border-dashed border-stone-300 bg-white/60 dark:border-white/10 dark:bg-white/5"
              />
            ))}
      </div>
    </div>
  );
}
