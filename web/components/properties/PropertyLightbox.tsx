'use client'

import { useCallback, useEffect, useState } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

interface GalleryImage {
    id: string
    url: string
    altText?: string | null
}

interface PropertyLightboxProps {
    images: GalleryImage[]
    initialIndex: number
    title: string
    onClose: () => void
}

export function PropertyLightbox({
    images,
    initialIndex,
    title,
    onClose,
}: PropertyLightboxProps) {
    const [index, setIndex] = useState(initialIndex)

    const hasMultiple = images.length > 1

    const next = useCallback(() => {
        setIndex(prev => (prev + 1) % images.length)
    }, [images.length])

    const prev = useCallback(() => {
        setIndex(prev => (prev - 1 + images.length) % images.length)
    }, [images.length])

    useEffect(() => {
        function handleKey(event: KeyboardEvent) {
            if (event.key === 'ArrowRight') next()
            else if (event.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [next, prev])

    const current = images[index]
    if (!current) return null

    return (
        <DialogPrimitive.Root open onOpenChange={open => !open && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-stone-950/92 backdrop-blur-sm" />
                <DialogPrimitive.Content
                    className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 flex flex-col outline-none"
                    onEscapeKeyDown={() => onClose()}>
                    <DialogPrimitive.Title className="sr-only">
                        {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Photo {index + 1} of {images.length} for {title}
                    </DialogPrimitive.Description>

                    {/* Top bar */}
                    <div className="flex items-center justify-between px-6 py-4 text-white">
                        <div>
                            <p className="text-sm font-semibold">{title}</p>
                            <p className="text-xs text-white/60">
                                Photo {index + 1} of {images.length}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                            aria-label="Close gallery">
                            <FiX className="size-5" />
                        </button>
                    </div>

                    {/* Main image */}
                    <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
                        {hasMultiple ? (
                            <button
                                type="button"
                                onClick={prev}
                                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                aria-label="Previous photo">
                                <FiChevronLeft className="size-6" />
                            </button>
                        ) : null}

                        <div className="relative flex h-full max-h-full w-full max-w-5xl items-center justify-center">
                            <img
                                src={current.url}
                                alt={current.altText ?? title}
                                className="max-h-[calc(100vh-180px)] max-w-full select-none rounded-xl object-contain shadow-2xl"
                            />
                        </div>

                        {hasMultiple ? (
                            <button
                                type="button"
                                onClick={next}
                                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                aria-label="Next photo">
                                <FiChevronRight className="size-6" />
                            </button>
                        ) : null}
                    </div>

                    {/* Thumbnails */}
                    {hasMultiple ? (
                        <div className="px-6 pb-6">
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((image, idx) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => setIndex(idx)}
                                        className={`aspect-4/3 size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-cover bg-center transition ${
                                            idx === index
                                                ? 'border-brand opacity-100'
                                                : 'border-transparent opacity-50 hover:opacity-80'
                                        }`}
                                        style={{
                                            backgroundImage: `url(${image.url})`,
                                        }}
                                        aria-label={`Go to photo ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
