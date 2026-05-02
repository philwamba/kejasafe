import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FiFileText, FiSearch } from 'react-icons/fi'

import { DataTable } from '@/components/ui/data-table'
import { Pagination } from '@/components/ui/pagination'
import { StatusBadge } from '@/components/ui/status-badge'
import {
    getServerCurrentUser,
    getServerRequestContext,
} from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { listAuditLogs } from '@/lib/core/services/admin-service'

export const metadata: Metadata = {
    title: 'Audit Log',
    robots: { index: false, follow: false },
}

interface SearchParams {
    page?: string
    q?: string
    level?: string
    entityType?: string
}

const LEVEL_FILTERS: Array<{ value: string; label: string }> = [
    { value: '', label: 'All levels' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
]

const ENTITY_FILTERS: Array<{ value: string; label: string }> = [
    { value: '', label: 'All entities' },
    { value: 'property', label: 'Property' },
    { value: 'user', label: 'User' },
    { value: 'system', label: 'System' },
]

function levelTone(level: string) {
    if (level === 'critical') return 'rose' as const
    if (level === 'warning') return 'amber' as const
    return 'sky' as const
}

function formatAction(action: string) {
    return action.replace(/_/g, ' ').replace(/\./g, ' · ')
}

function formatDate(date: Date) {
    return new Date(date).toLocaleString('en-KE', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default async function AuditLogPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const actor = await getServerCurrentUser()
    if (!actor) redirect('/login?next=/admin/audit')
    if (!hasAnyPermission(actor.permissions, ['view_audit_logs'])) {
        redirect('/dashboard')
    }

    const sp = await searchParams
    const page = Math.max(1, Number(sp.page ?? 1))
    const perPage = 25
    const search = (sp.q ?? '').trim()
    const level = sp.level ?? ''
    const entityType = sp.entityType ?? ''

    const { items, total, allCount } = await listAuditLogs(
        { page, perPage, search, level, entityType },
        await getServerRequestContext(),
    )

    const totalPages = Math.max(1, Math.ceil(total / perPage))

    function buildHref(params: {
        q?: string
        level?: string
        entityType?: string
        page?: number
    }) {
        const qs = new URLSearchParams()
        if (params.q ?? search) qs.set('q', params.q ?? search)
        if (params.level !== undefined) {
            if (params.level) qs.set('level', params.level)
        } else if (level) qs.set('level', level)
        if (params.entityType !== undefined) {
            if (params.entityType) qs.set('entityType', params.entityType)
        } else if (entityType) qs.set('entityType', entityType)
        if (params.page && params.page > 1) qs.set('page', String(params.page))
        const query = qs.toString()
        return query ? `/admin/audit?${query}` : '/admin/audit'
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin · Platform
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Audit Log
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    {allCount} total entries · {total}{' '}
                    {total === 1 ? 'result' : 'results'} with current filters.
                </p>
            </section>

            <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <form
                    action="/admin/audit"
                    className="flex h-11 items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 sm:w-96">
                    <FiSearch className="text-brand size-4 shrink-0" />
                    <input
                        type="search"
                        name="q"
                        defaultValue={search}
                        placeholder="Search action, actor, or entity…"
                        className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                    />
                    {level ? (
                        <input type="hidden" name="level" value={level} />
                    ) : null}
                    {entityType ? (
                        <input
                            type="hidden"
                            name="entityType"
                            value={entityType}
                        />
                    ) : null}
                </form>
                <div className="flex flex-wrap gap-2">
                    <FilterGroup
                        label="Level"
                        options={LEVEL_FILTERS}
                        current={level}
                        buildHref={v => buildHref({ level: v, page: 1 })}
                    />
                    <FilterGroup
                        label="Entity"
                        options={ENTITY_FILTERS}
                        current={entityType}
                        buildHref={v => buildHref({ entityType: v, page: 1 })}
                    />
                </div>
            </section>

            <DataTable
                rows={items}
                getRowKey={entry => entry.id}
                emptyState={
                    <>
                        <FiFileText className="mx-auto size-10 text-stone-300" />
                        <p className="mt-4 text-lg font-semibold text-stone-700">
                            No audit entries
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                            Actions will appear here as moderators work on the
                            platform.
                        </p>
                    </>
                }
                columns={[
                    {
                        key: 'when',
                        header: 'When',
                        width: '140px',
                        cell: entry => (
                            <time
                                className="font-mono text-xs text-stone-600"
                                dateTime={entry.createdAt.toISOString()}>
                                {formatDate(entry.createdAt)}
                            </time>
                        ),
                    },
                    {
                        key: 'action',
                        header: 'Action',
                        cell: entry => (
                            <div className="flex items-center gap-2">
                                <StatusBadge tone={levelTone(entry.level)}>
                                    {entry.level}
                                </StatusBadge>
                                <span className="font-medium text-stone-900 capitalize">
                                    {formatAction(entry.action)}
                                </span>
                            </div>
                        ),
                    },
                    {
                        key: 'actor',
                        header: 'Actor',
                        cell: entry =>
                            entry.actor ? (
                                <Link
                                    href={`/admin/users/${entry.actor.id}`}
                                    className="hover:text-brand text-stone-700">
                                    <span className="block font-medium">
                                        {entry.actor.fullName}
                                    </span>
                                    <span className="block text-xs text-stone-500">
                                        {entry.actor.email}
                                    </span>
                                </Link>
                            ) : (
                                <span className="text-xs text-stone-400">
                                    System
                                </span>
                            ),
                    },
                    {
                        key: 'entity',
                        header: 'Entity',
                        cell: entry => (
                            <div>
                                <p className="text-xs font-medium text-stone-600 capitalize">
                                    {entry.entityType}
                                </p>
                                {entry.entityId ? (
                                    <p className="font-mono text-[10px] text-stone-400">
                                        {entry.entityId.slice(0, 13)}…
                                    </p>
                                ) : null}
                            </div>
                        ),
                    },
                    {
                        key: 'backend',
                        header: 'Backend',
                        align: 'right',
                        cell: entry => (
                            <StatusBadge tone="stone">
                                {entry.backendProcessedBy.replace('_', ' ')}
                            </StatusBadge>
                        ),
                    },
                ]}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                perPage={perPage}
                label="entries"
                buildHref={p => buildHref({ page: p })}
            />
        </main>
    )
}

function FilterGroup({
    label,
    options,
    current,
    buildHref,
}: {
    label: string
    options: Array<{ value: string; label: string }>
    current: string
    buildHref: (value: string) => string
}) {
    return (
        <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1">
            <span className="px-2 text-[10px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
                {label}
            </span>
            {options.map(option => {
                const active = option.value === current
                return (
                    <Link
                        key={option.value || 'all'}
                        href={buildHref(option.value)}
                        className={
                            active
                                ? 'bg-brand/10 text-brand rounded-lg px-3 py-1.5 text-xs font-semibold'
                                : 'rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-950'
                        }>
                        {option.label}
                    </Link>
                )
            })}
        </div>
    )
}
