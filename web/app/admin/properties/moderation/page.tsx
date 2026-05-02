import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FiClock, FiSearch } from 'react-icons/fi'

import { Pagination } from '@/components/ui/pagination'
import { StatusBadge } from '@/components/ui/status-badge'
import {
    getServerCurrentUser,
    getServerRequestContext,
} from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { listModerationQueue } from '@/lib/core/services/admin-service'

export const metadata: Metadata = {
    title: 'Moderation Queue',
    robots: { index: false, follow: false },
}

interface SearchParams {
    page?: string
    q?: string
    status?: string
}

type ModerationStatus = 'pending_review' | 'approved' | 'rejected' | 'all'

const STATUS_FILTERS: Array<{
    value: ModerationStatus
    label: string
    tone: 'brand' | 'amber' | 'emerald' | 'rose' | 'stone'
}> = [
    { value: 'pending_review', label: 'Pending', tone: 'amber' },
    { value: 'approved', label: 'Approved', tone: 'emerald' },
    { value: 'rejected', label: 'Rejected', tone: 'rose' },
    { value: 'all', label: 'All', tone: 'stone' },
]

function formatRelative(date: Date | null): string {
    if (!date) return '—'
    const diffMs = Date.now() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
}

export default async function ModerationQueuePage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const user = await getServerCurrentUser()
    if (!user) redirect('/login?next=/admin/properties/moderation')
    if (!hasAnyPermission(user.permissions, ['approve_listings'])) {
        redirect('/dashboard')
    }

    const sp = await searchParams
    const page = Math.max(1, Number(sp.page ?? 1))
    const perPage = 15
    const search = (sp.q ?? '').trim()
    const statusParam = (sp.status ?? 'pending_review') as ModerationStatus

    const { items, total, pendingTotal } = await listModerationQueue(
        { page, perPage, search, status: statusParam },
        await getServerRequestContext(),
    )

    const totalPages = Math.max(1, Math.ceil(total / perPage))

    function buildHref(params: {
        q?: string
        status?: ModerationStatus
        page?: number
    }) {
        const qs = new URLSearchParams()
        if (params.q ?? search) qs.set('q', params.q ?? search)
        const effectiveStatus = params.status ?? statusParam
        if (effectiveStatus !== 'pending_review')
            qs.set('status', effectiveStatus)
        if (params.page && params.page > 1) qs.set('page', String(params.page))
        const query = qs.toString()
        return query
            ? `/admin/properties/moderation?${query}`
            : '/admin/properties/moderation'
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Moderation
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Listing Queue
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    {pendingTotal} pending review · target SLA 24–48 hours
                </p>
            </section>

            <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form
                    action="/admin/properties/moderation"
                    className="flex h-11 items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 sm:w-96">
                    <FiSearch className="text-brand size-4 shrink-0" />
                    <input
                        type="search"
                        name="q"
                        defaultValue={search}
                        placeholder="Search by title, owner, or email…"
                        className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                    />
                    {statusParam !== 'pending_review' ? (
                        <input
                            type="hidden"
                            name="status"
                            value={statusParam}
                        />
                    ) : null}
                </form>
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-stone-200 bg-white p-1">
                    {STATUS_FILTERS.map(filter => {
                        const active = filter.value === statusParam
                        return (
                            <Link
                                key={filter.value}
                                href={buildHref({
                                    status: filter.value,
                                    page: 1,
                                })}
                                className={
                                    active
                                        ? 'bg-brand/10 text-brand rounded-lg px-3 py-1.5 text-xs font-semibold'
                                        : 'rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-950'
                                }>
                                {filter.label}
                            </Link>
                        )
                    })}
                </div>
            </section>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-16 text-center">
                    <FiClock className="mx-auto size-10 text-stone-300" />
                    <p className="mt-4 text-lg font-semibold text-stone-700">
                        Nothing in the queue
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                        {search || statusParam !== 'pending_review'
                            ? 'Try clearing filters to see more results.'
                            : 'New submissions will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <ul className="divide-y divide-stone-100">
                        {items.map(property => (
                            <li key={property.id}>
                                <Link
                                    href={`/admin/properties/moderation/${property.id}`}
                                    className="flex items-start gap-5 p-5 transition hover:bg-stone-50">
                                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                        {property.images[0] ? (
                                            <Image
                                                src={property.images[0].url}
                                                alt={property.title}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="truncate text-base font-semibold text-stone-950">
                                                {property.title}
                                            </h2>
                                            <StatusBadge
                                                tone={
                                                    property.moderationStatus ===
                                                    'pending_review'
                                                        ? 'amber'
                                                        : property.moderationStatus ===
                                                            'approved'
                                                          ? 'emerald'
                                                          : property.moderationStatus ===
                                                              'rejected'
                                                            ? 'rose'
                                                            : 'stone'
                                                }>
                                                {property.moderationStatus.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </StatusBadge>
                                            <StatusBadge tone="brand">
                                                {property.listingPurpose.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </StatusBadge>
                                        </div>
                                        <p className="mt-1 text-sm text-stone-600">
                                            {property.city?.name ??
                                                property.county.name}{' '}
                                            · {property.propertyType.name} · KES{' '}
                                            {Number(
                                                property.price,
                                            ).toLocaleString()}
                                        </p>
                                        <p className="mt-2 text-xs text-stone-500">
                                            Owner: {property.owner.fullName} ·{' '}
                                            {property.owner.email}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-xs font-medium text-stone-600">
                                            {formatRelative(
                                                property.submittedAt,
                                            )}
                                        </p>
                                        <p className="mt-1 text-[10px] text-stone-400">
                                            {property.images.length > 0
                                                ? `${property.images.length} image${property.images.length === 1 ? '' : 's'}`
                                                : 'No images'}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        perPage={perPage}
                        label="submissions"
                        buildHref={p => buildHref({ page: p })}
                    />
                </div>
            )}
        </main>
    )
}
