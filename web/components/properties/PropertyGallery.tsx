'use client'

import { useState } from 'react'
import { FiImage } from 'react-icons/fi'

import { PropertyLightbox } from '@/components/properties/PropertyLightbox'
import type { PropertyDetailDto } from '@/lib/core/contracts/property'

interface PropertyGalleryProps {
    property: PropertyDetailDto
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    const sorted = [...property.gallery].sort((a, b) => {
        if (a.isCover === b.isCover) return 0
        return a.isCover ? -1 : 1
    })

    const hero = sorted[0] ?? null
    const remaining = sorted.slice(1, 4)

    return (
        <>
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <button
                    type="button"
                    onClick={() => hero && setLightboxIndex(0)}
                    className="group/hero relative block min-h-[360px] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                    {hero ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/hero:scale-[1.02]"
                            style={{ backgroundImage: `url(${hero.url})` }}
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
                    {sorted.length > 1 ? (
                        <span className="absolute bottom-3 right-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            {sorted.length} photos
                        </span>
                    ) : null}
                </button>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {remaining.length > 0
                        ? remaining.map((image, idx) => (
                              <button
                                  type="button"
                                  key={image.id}
                                  onClick={() => setLightboxIndex(idx + 1)}
                                  className="group/thumb relative min-h-28 overflow-hidden rounded-2xl border border-stone-200 bg-cover bg-center transition hover:shadow-md"
                                  style={{
                                      backgroundImage: `url(${image.url})`,
                                  }}
                                  aria-label={`Open photo ${idx + 2}`}
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
            {lightboxIndex !== null ? (
                <PropertyLightbox
                    images={sorted}
                    initialIndex={lightboxIndex}
                    title={property.title}
                    onClose={() => setLightboxIndex(null)}
                />
            ) : null}
        </>
    )
}
