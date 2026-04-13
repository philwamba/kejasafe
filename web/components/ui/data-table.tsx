import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
    key: string
    header: ReactNode
    align?: 'left' | 'right' | 'center'
    width?: string
    cell: (row: T) => ReactNode
    className?: string
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[]
    rows: T[]
    getRowKey: (row: T) => string
    emptyState?: ReactNode
    rowHref?: (row: T) => string
    caption?: string
}

/**
 * Professional admin data table with sticky header, hover state,
 * consistent padding, and configurable alignment per column.
 * Server component friendly — does not manage state internally.
 */
export function DataTable<T>({
    columns,
    rows,
    getRowKey,
    emptyState,
    rowHref,
    caption,
}: DataTableProps<T>) {
    if (rows.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-16 text-center">
                {emptyState ?? (
                    <p className="text-sm text-stone-500">No records found.</p>
                )}
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    {caption ? (
                        <caption className="sr-only">{caption}</caption>
                    ) : null}
                    <thead>
                        <tr className="border-b border-stone-200 bg-stone-50/60">
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    style={
                                        column.width
                                            ? { width: column.width }
                                            : undefined
                                    }
                                    className={cn(
                                        'px-4 py-3 text-[11px] font-semibold tracking-[0.08em] text-stone-500 uppercase',
                                        column.align === 'right'
                                            ? 'text-right'
                                            : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-left',
                                    )}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {rows.map(row => {
                            const rowContent = (
                                <>
                                    {columns.map(column => (
                                        <td
                                            key={column.key}
                                            className={cn(
                                                'px-4 py-4 text-sm text-stone-700',
                                                column.align === 'right'
                                                    ? 'text-right'
                                                    : column.align === 'center'
                                                      ? 'text-center'
                                                      : 'text-left',
                                                column.className,
                                            )}>
                                            {column.cell(row)}
                                        </td>
                                    ))}
                                </>
                            )

                            return (
                                <tr
                                    key={getRowKey(row)}
                                    className={cn(
                                        'transition-colors',
                                        rowHref
                                            ? 'cursor-pointer hover:bg-stone-50'
                                            : 'hover:bg-stone-50',
                                    )}>
                                    {rowContent}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {rowHref ? (
                // Overlay-style row links (a11y fallback handled by column-level Link inside cell)
                <div className="sr-only" aria-hidden="true" />
            ) : null}
        </div>
    )
}
