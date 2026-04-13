import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import {
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiEye,
    FiHome,
    FiUsers,
} from 'react-icons/fi'

import { prisma } from '@/lib/core/prisma/client'

type AuditLogEntry = Prisma.AuditLogGetPayload<{
    include: {
        actor: {
            select: {
                id: true
                fullName: true
                email: true
            }
        }
    }
}>

interface StatCardProps {
    label: string
    value: number | string
    delta?: string
    trend?: 'up' | 'down' | 'flat'
    icon: typeof FiHome
    accent?: 'brand' | 'emerald' | 'amber' | 'rose'
    href?: string
}

function StatCard({
    label,
    value,
    delta,
    trend = 'flat',
    icon: Icon,
    accent = 'brand',
    href,
}: StatCardProps) {
    const accentClasses: Record<NonNullable<StatCardProps['accent']>, string> = {
        brand: 'bg-brand/10 text-brand',
        emerald: 'bg-emerald-100 text-emerald-700',
        amber: 'bg-amber-100 text-amber-700',
        rose: 'bg-rose-100 text-rose-700',
    }

    const trendColors: Record<NonNullable<StatCardProps['trend']>, string> = {
        up: 'text-emerald-600',
        down: 'text-rose-600',
        flat: 'text-stone-500',
    }

    const content = (
        <article className="flex h-full flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
                <span
                    className={`inline-flex size-10 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
                    <Icon className="size-5" />
                </span>
                {href ? (
                    <FiArrowRight className="size-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-900" />
                ) : null}
            </div>
            <div>
                <p className="text-xs font-medium text-stone-500">{label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">
                    {value}
                </p>
                {delta ? (
                    <p
                        className={`mt-1 text-xs font-medium ${trendColors[trend]}`}>
                        {delta}
                    </p>
                ) : null}
            </div>
        </article>
    )

    if (href) {
        return (
            <Link href={href} className="group block h-full">
                {content}
            </Link>
        )
    }
    return content
}

function QuickAction({
    href,
    label,
    count,
}: {
    href: string
    label: string
    count?: number
}) {
    return (
        <Link
            href={href}
            className="group hover:border-brand flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium transition">
            <span className="text-stone-800">{label}</span>
            <span className="flex items-center gap-2">
                {count !== undefined && count > 0 ? (
                    <span className="bg-brand rounded-full px-2 py-0.5 text-[11px] font-semibold text-white">
                        {count}
                    </span>
                ) : null}
                <FiArrowRight className="text-brand size-4 transition group-hover:translate-x-0.5" />
            </span>
        </Link>
    )
}

function formatRelative(date: Date): string {
    const diffMs = Date.now() - date.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
}

async function loadRecentActivity(): Promise<AuditLogEntry[]> {
    try {
        return await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 8,
            include: {
                actor: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        })
    } catch {
        return []
    }
}

export default async function AdminPage() {
    const [
        pendingCount,
        publishedCount,
        totalProperties,
        totalUsers,
        recentActivity,
    ] = await Promise.all([
        prisma.property
            .count({ where: { moderationStatus: 'pending_review' } })
            .catch(() => 0),
        prisma.property
            .count({ where: { listingStatus: 'published' } })
            .catch(() => 0),
        prisma.property.count().catch(() => 0),
        prisma.user.count().catch(() => 0),
        loadRecentActivity(),
    ])

    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8 flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
                    Operations Dashboard
                </h1>
                <p className="text-sm text-stone-600">
                    Monitor submissions, moderate listings, and track
                    platform-wide activity.
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Pending Review"
                    value={pendingCount}
                    delta={
                        pendingCount > 0
                            ? `${pendingCount} awaiting action`
                            : 'Queue clear'
                    }
                    trend={pendingCount > 0 ? 'up' : 'flat'}
                    icon={FiClock}
                    accent="amber"
                    href="/admin/properties/moderation"
                />
                <StatCard
                    label="Published Listings"
                    value={publishedCount}
                    delta="Live on the site"
                    trend="flat"
                    icon={FiCheckCircle}
                    accent="emerald"
                />
                <StatCard
                    label="Total Listings"
                    value={totalProperties}
                    delta={`${Math.max(0, totalProperties - publishedCount)} not live`}
                    icon={FiHome}
                    accent="brand"
                />
                <StatCard
                    label="Registered Users"
                    value={totalUsers}
                    icon={FiUsers}
                    accent="brand"
                />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <article className="rounded-2xl border border-stone-200 bg-white p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                                Recent Activity
                            </h2>
                            <p className="mt-0.5 text-xs text-stone-500">
                                Latest moderator and user actions.
                            </p>
                        </div>
                        <Link
                            href="/admin/audit"
                            className="text-brand text-xs font-semibold hover:underline">
                            View all
                        </Link>
                    </div>
                    <ul className="mt-5 divide-y divide-stone-100">
                        {recentActivity.length === 0 ? (
                            <li className="py-10 text-center text-sm text-stone-500">
                                No activity yet.
                            </li>
                        ) : (
                            recentActivity.map(entry => (
                                <li
                                    key={entry.id}
                                    className="flex items-start gap-3 py-3 text-sm">
                                    <span className="bg-brand/10 text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full">
                                        <FiEye className="size-3.5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-stone-900">
                                            {entry.action.replace(/_/g, ' ')}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-stone-500">
                                            {entry.actor?.fullName ??
                                                'System'}{' '}
                                            · {entry.entityType}
                                            {entry.entityId
                                                ? ` #${entry.entityId.slice(0, 8)}`
                                                : ''}
                                        </p>
                                    </div>
                                    <time
                                        className="shrink-0 text-xs text-stone-400"
                                        dateTime={entry.createdAt.toISOString()}>
                                        {formatRelative(entry.createdAt)}
                                    </time>
                                </li>
                            ))
                        )}
                    </ul>
                </article>

                <article className="rounded-2xl border border-stone-200 bg-white p-6">
                    <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                        Quick Actions
                    </h2>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Jump straight into common workflows.
                    </p>
                    <div className="mt-5 grid gap-3">
                        <QuickAction
                            href="/admin/properties/moderation"
                            label="Review pending submissions"
                            count={pendingCount}
                        />
                        <QuickAction
                            href="/admin/settings/backend"
                            label="Switch active backend"
                        />
                        <QuickAction
                            href="/admin/system/health"
                            label="Check backend health"
                        />
                        <QuickAction
                            href="/admin/users"
                            label="Manage users"
                        />
                    </div>
                </article>
            </section>
        </main>
    )
}
