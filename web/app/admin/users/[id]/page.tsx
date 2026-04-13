import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { FiArrowLeft, FiMail, FiPhone } from 'react-icons/fi'

import { UserDetailActions } from '@/components/admin/UserDetailActions'
import { StatusBadge, statusTone } from '@/components/ui/status-badge'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { prisma } from '@/lib/core/prisma/client'

export const metadata: Metadata = {
    title: 'User Detail',
    robots: { index: false, follow: false },
}

function formatDate(date: Date | null | undefined) {
    if (!date) return 'Never'
    return new Date(date).toLocaleString('en-KE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const actor = await getServerCurrentUser()
    if (!actor) redirect('/login')
    if (!hasAnyPermission(actor.permissions, ['manage_users'])) {
        redirect('/dashboard')
    }

    const { id } = await params
    const [user, allRoles, recentActivity] = await Promise.all([
        prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                emailVerifiedAt: true,
                phoneVerifiedAt: true,
                lastLoginAt: true,
                lastLoginIp: true,
                createdAt: true,
                avatarUrl: true,
                userRoles: {
                    select: {
                        role: {
                            select: { id: true, name: true, description: true },
                        },
                    },
                },
            },
        }),
        prisma.role.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, description: true },
        }),
        prisma.auditLog.findMany({
            where: {
                OR: [{ actorUserId: id }, { entityId: id, entityType: 'user' }],
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        }),
    ])

    if (!user) notFound()

    const isSelf = user.id === actor.id

    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
            <Link
                href="/admin/users"
                className="hover:text-brand inline-flex items-center gap-2 text-sm text-stone-500">
                <FiArrowLeft className="size-4" />
                Back to users
            </Link>

            <section className="mt-6 flex items-start justify-between gap-6 border-b border-stone-200 pb-8">
                <div className="flex items-start gap-5">
                    <span className="bg-brand inline-flex size-16 items-center justify-center rounded-2xl text-xl font-semibold text-white">
                        {user.fullName
                            .split(' ')
                            .slice(0, 2)
                            .map(p => p[0]?.toUpperCase() ?? '')
                            .join('')}
                    </span>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
                                {user.fullName}
                            </h1>
                            <StatusBadge tone={statusTone(user.status)}>
                                {user.status}
                            </StatusBadge>
                            {isSelf ? (
                                <StatusBadge tone="sky">You</StatusBadge>
                            ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-stone-600">
                            <span className="inline-flex items-center gap-1.5">
                                <FiMail className="size-3.5" />
                                {user.email}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <FiPhone className="size-3.5" />
                                {user.phone}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">
                            Joined {formatDate(user.createdAt)}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6">
                    <article className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                            Activity Overview
                        </h2>
                        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-medium text-stone-500 uppercase">
                                    Last login
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-stone-900">
                                    {formatDate(user.lastLoginAt)}
                                </dd>
                                {user.lastLoginIp ? (
                                    <dd className="mt-0.5 text-xs text-stone-500">
                                        from {user.lastLoginIp}
                                    </dd>
                                ) : null}
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-stone-500 uppercase">
                                    Email verified
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-stone-900">
                                    {user.emailVerifiedAt
                                        ? formatDate(user.emailVerifiedAt)
                                        : 'Not verified'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-stone-500 uppercase">
                                    Phone verified
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-stone-900">
                                    {user.phoneVerifiedAt
                                        ? formatDate(user.phoneVerifiedAt)
                                        : 'Not verified'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-stone-500 uppercase">
                                    Account ID
                                </dt>
                                <dd className="mt-1 font-mono text-xs text-stone-700">
                                    {user.id.slice(0, 13)}…
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                            Recent Activity
                        </h2>
                        <ul className="mt-4 divide-y divide-stone-100">
                            {recentActivity.length === 0 ? (
                                <li className="py-8 text-center text-sm text-stone-500">
                                    No recorded activity yet.
                                </li>
                            ) : (
                                recentActivity.map(entry => (
                                    <li
                                        key={entry.id}
                                        className="flex items-start justify-between gap-3 py-3 text-sm">
                                        <div className="min-w-0">
                                            <p className="font-medium text-stone-900">
                                                {entry.action.replace(
                                                    /_/g,
                                                    ' ',
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-xs text-stone-500">
                                                {entry.entityType}
                                                {entry.entityId
                                                    ? ` · ${entry.entityId.slice(0, 8)}`
                                                    : ''}
                                            </p>
                                        </div>
                                        <time className="shrink-0 text-xs text-stone-400">
                                            {new Date(
                                                entry.createdAt,
                                            ).toLocaleDateString('en-KE', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </time>
                                    </li>
                                ))
                            )}
                        </ul>
                    </article>
                </div>

                <UserDetailActions
                    userId={user.id}
                    currentStatus={user.status}
                    currentRoles={user.userRoles.map(r => r.role.name)}
                    availableRoles={allRoles}
                    disabled={isSelf}
                />
            </section>
        </main>
    )
}
