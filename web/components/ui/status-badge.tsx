import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type StatusTone =
    | 'brand'
    | 'emerald'
    | 'amber'
    | 'rose'
    | 'stone'
    | 'sky'
    | 'violet'

const toneClasses: Record<StatusTone, string> = {
    brand: 'bg-brand/10 text-brand',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    rose: 'bg-rose-100 text-rose-700',
    stone: 'bg-stone-100 text-stone-700',
    sky: 'bg-sky-100 text-sky-700',
    violet: 'bg-violet-100 text-violet-700',
}

interface StatusBadgeProps {
    children: ReactNode
    tone?: StatusTone
    className?: string
}

export function StatusBadge({
    children,
    tone = 'stone',
    className,
}: StatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize',
                toneClasses[tone],
                className,
            )}>
            {children}
        </span>
    )
}

/**
 * Helper: pick a tone for common status strings.
 */
export function statusTone(status: string): StatusTone {
    const normalized = status.toLowerCase()
    if (
        ['active', 'published', 'approved', 'healthy', 'success'].includes(
            normalized,
        )
    )
        return 'emerald'
    if (['pending_review', 'pending', 'review', 'warning'].includes(normalized))
        return 'amber'
    if (
        [
            'rejected',
            'suspended',
            'deactivated',
            'failed',
            'unhealthy',
            'critical',
        ].includes(normalized)
    )
        return 'rose'
    if (['invited', 'draft'].includes(normalized)) return 'sky'
    return 'stone'
}
