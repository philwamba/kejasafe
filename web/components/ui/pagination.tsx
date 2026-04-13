import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { cn } from '@/lib/utils'

interface PaginationProps {
    page: number
    totalPages: number
    total: number
    perPage: number
    /** Builds a URL for a specific page number. */
    buildHref: (page: number) => string
    label?: string
}

function rangeAround(current: number, total: number): (number | 'gap')[] {
    const pages: (number | 'gap')[] = []
    const show = new Set<number>()

    show.add(1)
    show.add(total)
    show.add(current)
    if (current > 1) show.add(current - 1)
    if (current < total) show.add(current + 1)

    const sorted = [...show].filter(n => n >= 1 && n <= total).sort((a, b) => a - b)

    for (let i = 0; i < sorted.length; i++) {
        const value = sorted[i]
        if (i > 0 && value - sorted[i - 1] > 1) {
            pages.push('gap')
        }
        pages.push(value)
    }
    return pages
}

export function Pagination({
    page,
    totalPages,
    total,
    perPage,
    buildHref,
    label = 'items',
}: PaginationProps) {
    if (totalPages <= 1) {
        return (
            <div className="flex items-center justify-between border-t border-stone-100 px-6 py-4 text-xs text-stone-500">
                <p>
                    {total} {label}
                </p>
            </div>
        )
    }

    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)
    const pages = rangeAround(page, totalPages)

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-col items-center justify-between gap-3 border-t border-stone-100 px-6 py-4 text-xs sm:flex-row">
            <p className="text-stone-500">
                Showing{' '}
                <span className="font-semibold text-stone-900">
                    {start}–{end}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-stone-900">{total}</span>{' '}
                {label}
            </p>
            <ul className="flex items-center gap-1">
                <li>
                    <Link
                        href={buildHref(Math.max(1, page - 1))}
                        aria-label="Previous page"
                        aria-disabled={page === 1}
                        className={cn(
                            'inline-flex size-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition',
                            page === 1
                                ? 'pointer-events-none opacity-40'
                                : 'hover:border-brand hover:text-brand',
                        )}>
                        <FiChevronLeft className="size-4" />
                    </Link>
                </li>
                {pages.map((entry, index) =>
                    entry === 'gap' ? (
                        <li
                            key={`gap-${index}`}
                            aria-hidden="true"
                            className="px-2 text-stone-400">
                            …
                        </li>
                    ) : (
                        <li key={entry}>
                            <Link
                                href={buildHref(entry)}
                                aria-current={
                                    entry === page ? 'page' : undefined
                                }
                                className={cn(
                                    'inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm font-medium transition',
                                    entry === page
                                        ? 'border-brand bg-brand text-white'
                                        : 'border-stone-200 text-stone-700 hover:border-brand hover:text-brand',
                                )}>
                                {entry}
                            </Link>
                        </li>
                    ),
                )}
                <li>
                    <Link
                        href={buildHref(Math.min(totalPages, page + 1))}
                        aria-label="Next page"
                        aria-disabled={page === totalPages}
                        className={cn(
                            'inline-flex size-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition',
                            page === totalPages
                                ? 'pointer-events-none opacity-40'
                                : 'hover:border-brand hover:text-brand',
                        )}>
                        <FiChevronRight className="size-4" />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
