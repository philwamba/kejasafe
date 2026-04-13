import Link from 'next/link'
import { FiHome, FiInbox, FiPlus } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'

function statusBadgeClass(status: string) {
    const normalized = status.toLowerCase()
    if (['published', 'approved', 'active'].includes(normalized)) {
        return 'bg-green-100 text-green-800'
    }
    if (['pending_review', 'pending'].includes(normalized)) {
        return 'bg-amber-100 text-amber-800'
    }
    if (['rejected'].includes(normalized)) {
        return 'bg-red-100 text-red-800'
    }
    return 'bg-stone-100 text-stone-700'
}

export default async function PortalPage() {
    const user = await getServerCurrentUser()
    if (!user) return null

    const listings = await prisma.property
        .findMany({
            where: { ownerId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                county: { select: { name: true } },
                city: { select: { name: true } },
                images: {
                    take: 1,
                    orderBy: { position: 'asc' },
                    select: { url: true },
                },
            },
        })
        .catch(() => [])

    const pending = listings.filter(
        l => l.moderationStatus === 'pending_review',
    ).length
    const published = listings.filter(l => l.listingStatus === 'published')
        .length

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                        Landlord Portal
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                        My Listings
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        {listings.length} total listing
                        {listings.length === 1 ? '' : 's'} · {published}{' '}
                        published · {pending} pending review
                    </p>
                </div>
                <Button asChild size="lg" className="h-11 rounded-xl">
                    <Link href="/portal/properties/new">
                        <FiPlus />
                        List a new property
                    </Link>
                </Button>
            </section>

            {listings.length === 0 ? (
                <section className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
                    <FiHome className="mx-auto size-12 text-stone-400" />
                    <h2 className="mt-4 text-xl font-semibold text-stone-950">
                        No listings yet
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                        Submit your first property and our team will review it
                        within 24–48 hours.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="mt-6 h-11 rounded-xl">
                        <Link href="/portal/properties/new">
                            <FiPlus />
                            Submit your first listing
                        </Link>
                    </Button>
                </section>
            ) : (
                <ul className="grid gap-4">
                    {listings.map(property => (
                        <li key={property.id}>
                            <article className="flex items-start gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                                <div
                                    className="aspect-4/3 size-24 shrink-0 rounded-xl bg-stone-100 bg-cover bg-center"
                                    style={
                                        property.images[0]
                                            ? {
                                                  backgroundImage: `url(${property.images[0].url})`,
                                              }
                                            : undefined
                                    }
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="truncate text-lg font-semibold text-stone-950">
                                            {property.title}
                                        </h2>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusBadgeClass(property.moderationStatus)}`}>
                                            {property.moderationStatus.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-stone-600">
                                        {[property.city?.name, property.county.name]
                                            .filter(Boolean)
                                            .join(' · ')}{' '}
                                        · KES{' '}
                                        {Number(property.price).toLocaleString()}
                                        {property.listingPurpose === 'rent'
                                            ? ' / month'
                                            : ''}
                                    </p>
                                    {property.rejectionReason ? (
                                        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                            <span className="font-semibold">
                                                Rejection reason:
                                            </span>{' '}
                                            {property.rejectionReason}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="text-right text-xs text-stone-500">
                                    {property.submittedAt ? (
                                        <>
                                            Submitted{' '}
                                            {new Date(
                                                property.submittedAt,
                                            ).toLocaleDateString()}
                                        </>
                                    ) : (
                                        'Draft'
                                    )}
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            )}

            <section className="mt-10 flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <span className="bg-brand/10 text-brand inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <FiInbox className="size-5" />
                </span>
                <div>
                    <h2 className="text-lg font-semibold text-stone-950">
                        Inquiries coming soon
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                        Messages and viewing requests from interested tenants
                        will appear here once someone engages with your
                        listings.
                    </p>
                </div>
            </section>
        </main>
    )
}
