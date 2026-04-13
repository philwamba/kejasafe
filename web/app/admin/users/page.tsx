import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FiPlus, FiSearch, FiUser } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Pagination } from '@/components/ui/pagination'
import { StatusBadge, statusTone } from '@/components/ui/status-badge'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { prisma } from '@/lib/core/prisma/client'

export const metadata: Metadata = {
    title: 'Users',
    robots: { index: false, follow: false },
}

interface SearchParams {
    page?: string
    q?: string
    status?: string
    role?: string
}

type StatusFilter = 'active' | 'invited' | 'suspended' | 'deactivated'

const STATUS_FILTERS: Array<{ value: StatusFilter | ''; label: string }> = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'invited', label: 'Invited' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'deactivated', label: 'Deactivated' },
]

function formatDate(date: Date | null | undefined) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function formatRelative(date: Date | null | undefined) {
    if (!date) return '—'
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3_600_000)
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return formatDate(date)
}

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const actor = await getServerCurrentUser()
    if (!actor) redirect('/login?next=/admin/users')
    if (!hasAnyPermission(actor.permissions, ['manage_users'])) {
        redirect('/dashboard')
    }

    const sp = await searchParams
    const page = Math.max(1, Number(sp.page ?? 1))
    const perPage = 20
    const search = (sp.q ?? '').trim()
    const statusFilter = (sp.status ?? '') as StatusFilter | ''

    const where = {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(search
            ? {
                  OR: [
                      { fullName: { contains: search, mode: 'insensitive' as const } },
                      { email: { contains: search, mode: 'insensitive' as const } },
                      { phone: { contains: search, mode: 'insensitive' as const } },
                  ],
              }
            : {}),
    }

    const [users, total, totals] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                lastLoginAt: true,
                createdAt: true,
                userRoles: {
                    select: { role: { select: { name: true } } },
                },
            },
        }),
        prisma.user.count({ where }),
        prisma.user.count(),
    ])

    const totalPages = Math.max(1, Math.ceil(total / perPage))

    function buildHref(params: {
        q?: string
        status?: StatusFilter | ''
        page?: number
    }) {
        const qs = new URLSearchParams()
        if (params.q ?? search) qs.set('q', params.q ?? search)
        if (params.status !== undefined) {
            if (params.status) qs.set('status', params.status)
        } else if (statusFilter) {
            qs.set('status', statusFilter)
        }
        if (params.page && params.page > 1) qs.set('page', String(params.page))
        const query = qs.toString()
        return query ? `/admin/users?${query}` : '/admin/users'
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                        Admin · Platform
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                        Users
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        {totals} registered users · {total}{' '}
                        {total === 1 ? 'result' : 'results'} with current
                        filters.
                    </p>
                </div>
                <Button
                    asChild
                    size="lg"
                    className="h-11 rounded-xl">
                    <Link href="/admin/users/new">
                        <FiPlus />
                        Invite user
                    </Link>
                </Button>
            </section>

            <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form
                    action="/admin/users"
                    className="flex h-11 items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 sm:w-96">
                    <FiSearch className="text-brand size-4 shrink-0" />
                    <input
                        type="search"
                        name="q"
                        defaultValue={search}
                        placeholder="Search name, email, or phone…"
                        className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                    />
                    {statusFilter ? (
                        <input type="hidden" name="status" value={statusFilter} />
                    ) : null}
                </form>
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-stone-200 bg-white p-1">
                    {STATUS_FILTERS.map(filter => {
                        const active = filter.value === statusFilter
                        return (
                            <Link
                                key={filter.value || 'all'}
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

            <DataTable
                rows={users}
                getRowKey={user => user.id}
                emptyState={
                    <>
                        <FiUser className="mx-auto size-10 text-stone-300" />
                        <p className="mt-4 text-lg font-semibold text-stone-700">
                            No users found
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                            Try clearing your filters or inviting a new user.
                        </p>
                    </>
                }
                columns={[
                    {
                        key: 'user',
                        header: 'User',
                        cell: user => (
                            <Link
                                href={`/admin/users/${user.id}`}
                                className="flex items-center gap-3">
                                <span className="bg-brand inline-flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white">
                                    {user.fullName
                                        .split(' ')
                                        .slice(0, 2)
                                        .map(p => p[0]?.toUpperCase() ?? '')
                                        .join('')}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-stone-950">
                                        {user.fullName}
                                    </p>
                                    <p className="truncate text-xs text-stone-500">
                                        {user.email}
                                    </p>
                                </div>
                            </Link>
                        ),
                    },
                    {
                        key: 'phone',
                        header: 'Phone',
                        cell: user => (
                            <span className="text-stone-600">
                                {user.phone ?? '—'}
                            </span>
                        ),
                    },
                    {
                        key: 'roles',
                        header: 'Roles',
                        cell: user => (
                            <div className="flex flex-wrap gap-1">
                                {user.userRoles.length === 0 ? (
                                    <span className="text-xs text-stone-400">
                                        No roles
                                    </span>
                                ) : (
                                    user.userRoles.map(r => (
                                        <StatusBadge
                                            key={r.role.name}
                                            tone="violet">
                                            {r.role.name.replace('_', ' ')}
                                        </StatusBadge>
                                    ))
                                )}
                            </div>
                        ),
                    },
                    {
                        key: 'status',
                        header: 'Status',
                        cell: user => (
                            <StatusBadge tone={statusTone(user.status)}>
                                {user.status}
                            </StatusBadge>
                        ),
                    },
                    {
                        key: 'lastLogin',
                        header: 'Last login',
                        align: 'right',
                        cell: user => (
                            <span className="text-xs text-stone-500">
                                {formatRelative(user.lastLoginAt)}
                            </span>
                        ),
                    },
                    {
                        key: 'joined',
                        header: 'Joined',
                        align: 'right',
                        cell: user => (
                            <span className="text-xs text-stone-500">
                                {formatDate(user.createdAt)}
                            </span>
                        ),
                    },
                ]}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                perPage={perPage}
                label="users"
                buildHref={p => buildHref({ page: p })}
            />
        </main>
    )
}
