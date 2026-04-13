'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FiHeart } from 'react-icons/fi'
import { toast } from 'sonner'

import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
    propertyId: string
    propertyTitle: string
    initialFavorited?: boolean
    variant?: 'card' | 'detail'
}

// Lightweight in-memory cache of the current user's favorites so that
// every card on a page doesn't GET /favorites separately.
let cachedFavoriteIds: Set<string> | null = null
let inflightFetch: Promise<Set<string>> | null = null

async function loadFavorites(): Promise<Set<string>> {
    if (cachedFavoriteIds) return cachedFavoriteIds
    if (inflightFetch) return inflightFetch

    inflightFetch = (async () => {
        try {
            const response = await fetch('/api/internal/favorites', {
                credentials: 'include',
            })
            if (!response.ok) return new Set<string>()
            const body = (await response.json()) as {
                data?: { propertyIds?: string[] }
            }
            const ids = new Set(body.data?.propertyIds ?? [])
            cachedFavoriteIds = ids
            return ids
        } catch {
            return new Set<string>()
        } finally {
            inflightFetch = null
        }
    })()

    return inflightFetch
}

export function FavoriteButton({
    propertyId,
    propertyTitle,
    initialFavorited,
    variant = 'card',
}: FavoriteButtonProps) {
    const router = useRouter()
    const [favorited, setFavorited] = useState(initialFavorited ?? false)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (initialFavorited !== undefined) return
        loadFavorites().then(ids => setFavorited(ids.has(propertyId)))
    }, [propertyId, initialFavorited])

    async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        event.stopPropagation()

        const nextState = !favorited
        setFavorited(nextState)

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const response = await fetch('/api/internal/favorites', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify({ propertyId }),
                })

                if (response.status === 401) {
                    setFavorited(!nextState)
                    toast('Sign in to save properties', {
                        description: 'You need an account to save listings.',
                        action: {
                            label: 'Sign in',
                            onClick: () =>
                                router.push(
                                    `/login?next=${encodeURIComponent(window.location.pathname)}`,
                                ),
                        },
                    })
                    return
                }

                if (!response.ok) {
                    setFavorited(!nextState)
                    toast.error('Could not save property. Try again.')
                    return
                }

                const body = await response.json()
                const serverState = Boolean(body.data?.favorited)
                setFavorited(serverState)

                // Keep in-memory cache in sync
                if (cachedFavoriteIds) {
                    if (serverState) cachedFavoriteIds.add(propertyId)
                    else cachedFavoriteIds.delete(propertyId)
                }

                toast.success(
                    serverState
                        ? `Saved "${propertyTitle}"`
                        : `Removed from saved`,
                )
            } catch {
                setFavorited(!nextState)
                toast.error('Something went wrong.')
            }
        })
    }

    const isDetail = variant === 'detail'

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={isPending}
            aria-pressed={favorited}
            aria-label={favorited ? 'Remove from saved' : 'Save property'}
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full transition',
                isDetail
                    ? 'h-11 gap-2 border border-stone-200 bg-white px-4 text-sm font-medium shadow-sm hover:border-brand'
                    : 'size-9 border border-stone-200 bg-white/90 backdrop-blur hover:border-brand',
                favorited && 'border-brand',
            )}>
            <FiHeart
                className={cn(
                    'size-4 transition',
                    favorited ? 'fill-brand text-brand' : 'text-stone-500',
                )}
            />
            {isDetail ? (
                <span className={favorited ? 'text-brand' : 'text-stone-700'}>
                    {favorited ? 'Saved' : 'Save'}
                </span>
            ) : null}
        </button>
    )
}
