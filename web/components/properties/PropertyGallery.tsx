import { FiImage } from 'react-icons/fi'

import type { PropertyDetailDto } from '@/lib/core/contracts/property'

interface PropertyGalleryProps {
    property: PropertyDetailDto
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
    const heroImage =
        property.gallery.find(image => image.isCover) ?? property.gallery[0]
    const remaining = property.gallery.slice(heroImage ? 1 : 0, 4)

    return (
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                {heroImage ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImage.url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-stone-500">
                        <div className="text-center">
                            <FiImage className="mx-auto size-8" />
                            <p className="mt-3 text-sm">
                                Gallery media will appear here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {remaining.length > 0
                    ? remaining.map(image => (
                          <div
                              key={image.id}
                              className="min-h-28 rounded-2xl border border-stone-200 bg-cover bg-center"
                              style={{ backgroundImage: `url(${image.url})` }}
                          />
                      ))
                    : Array.from({ length: 3 }).map((_, index) => (
                          <div
                              key={index}
                              className="min-h-28 rounded-2xl border border-dashed border-stone-300 bg-stone-50"
                          />
                      ))}
            </div>
        </div>
    )
}
