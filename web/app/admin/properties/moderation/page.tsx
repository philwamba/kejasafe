import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FiClock } from 'react-icons/fi'

import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'
import { hasAnyPermission } from '@/lib/core/rbac/access'

export const metadata: Metadata = {
    title: 'Moderation Queue',
    robots: { index: false, follow: false },
}

function formatRelative(date: Date | null): string {
    if (!date) return '—'
    const diffMs = Date.now() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
}

export default async function ModerationQueuePage() {
    const user = await getServerCurrentUser()
    if (!user) redirect('/login?next=/admin/properties/moderation')
    if (!hasAnyPermission(user.permissions, ['approve_listings'])) {
        redirect('/dashboard')
    }

    const items = await prisma.property.findMany({
        where: { moderationStatus: 'pending_review' },
        orderBy: { submittedAt: 'asc' },
        include: {
            county: true,
            city: true,
            propertyType: true,
            images: { take: 1, orderBy: { position: 'asc' } },
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                },
            },
        },
    })

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <section className="mb-8 flex items-end justify-between gap-6">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                        Moderation
                    </p>
                    <h1 className="mt-1 text-4xl font-semibold tracking-tight text-stone-950">
                        Pending Review
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        {items.length}{' '}
                        {items.length === 1 ? 'submission' : 'submissions'}{' '}
                        awaiting review. Target SLA: 24–48 hours.
                    </p>
                </div>
                <Link
                    href="/admin"
                    className="text-sm font-medium text-stone-500 hover:text-stone-900">
                    ← Admin home
                </Link>
            </section>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
                    <FiClock className="mx-auto size-10 text-stone-400" />
                    <p className="mt-4 text-lg font-semibold text-stone-700">
                        Nothing in the queue
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                        New submissions will appear here.
                    </p>
                </div>
            ) : (
                <ul className="grid gap-4">
                    {items.map(property => (
                        <li key={property.id}>
                            <Link
                                href={`/admin/properties/moderation/${property.id}`}
                                className="hover:border-brand flex items-start gap-5 rounded-2xl border border-stone-200 bg-white p-5 transition hover:shadow-md">
                                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                    {property.images[0] ? (
                                        <Image
                                            src={property.images[0].url}
                                            alt={property.title}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="truncate text-lg font-semibold text-stone-950">
                                            {property.title}
                                        </h2>
                                        <span className="bg-brand/10 text-brand rounded-full px-3 py-0.5 text-xs font-medium capitalize">
                                            {property.listingPurpose.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-stone-600">
                                        {property.city?.name ?? property.county.name} ·{' '}
                                        {property.propertyType.name} · KES{' '}
                                        {Number(property.price).toLocaleString()}
                                    </p>
                                    <p className="mt-2 text-xs text-stone-500">
                                        Owner: {property.owner.fullName} ·{' '}
                                        {property.owner.email} ·{' '}
                                        {property.owner.phone}
                                    </p>
                                </div>
                                <div className="text-right text-xs text-stone-500">
                                    <p>{formatRelative(property.submittedAt)}</p>
                                    <p className="mt-1">
                                        {property.images.length > 0
                                            ? `${property.images.length} image`
                                            : 'No images'}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}
