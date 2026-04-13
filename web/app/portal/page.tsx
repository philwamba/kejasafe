import Link from 'next/link'
import Image from 'next/image'
import {
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiEye,
    FiHome,
    FiPlus,
    FiXCircle,
} from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'

type StatAccent = 'brand' | 'emerald' | 'amber' | 'rose'

function StatCard({
    label,
    value,
    delta,
    icon: Icon,
    accent = 'brand',
}: {
    label: string
    value: number | string
    delta?: string
    icon: typeof FiHome
    accent?: StatAccent
}) {
    const accentClasses: Record<StatAccent, string> = {
        brand: 'bg-brand/10 text-brand',
        emerald: 'bg-emerald-100 text-emerald-700',
        amber: 'bg-amber-100 text-amber-700',
        rose: 'bg-rose-100 text-rose-700',
    }

    return (
        <article className="flex h-full flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5">
            <span
                className={`inline-flex size-10 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
                <Icon className="size-5" />
            </span>
            <div>
                <p className="text-xs font-medium text-stone-500">{label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">
                    {value}
                </p>
                {delta ? (
                    <p className="mt-1 text-xs font-medium text-stone-500">
                        {delta}
                    </p>
                ) : null}
            </div>
        </article>
    )
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase()
    const config = {
        published: {
            label: 'Published',
            class: 'bg-emerald-100 text-emerald-700',
        },
        approved: {
            label: 'Approved',
            class: 'bg-emerald-100 text-emerald-700',
        },
        active: {
            label: 'Active',
            class: 'bg-emerald-100 text-emerald-700',
        },
        pending_review: {
            label: 'Pending review',
            class: 'bg-amber-100 text-amber-700',
        },
        pending: {
            label: 'Pending',
            class: 'bg-amber-100 text-amber-700',
        },
        rejected: {
            label: 'Rejected',
            class: 'bg-rose-100 text-rose-700',
        },
        draft: {
            label: 'Draft',
            class: 'bg-stone-100 text-stone-700',
        },
    }[normalized] ?? {
        label: normalized.replace('_', ' '),
        class: 'bg-stone-100 text-stone-700',
    }

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${config.class}`}>
            {config.label}
        </span>
    )
}

export default async function PortalPage() {
    const user = await getServerCurrentUser()
    if (!user) return null

    const [listings, publishedCount, pendingCount, rejectedCount] =
        await Promise.all([
            prisma.property
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
                .catch(() => []),
            prisma.property
                .count({
                    where: {
                        ownerId: user.id,
                        listingStatus: 'published',
                    },
                })
                .catch(() => 0),
            prisma.property
                .count({
                    where: {
                        ownerId: user.id,
                        moderationStatus: 'pending_review',
                    },
                })
                .catch(() => 0),
            prisma.property
                .count({
                    where: {
                        ownerId: user.id,
                        moderationStatus: 'rejected',
                    },
                })
                .catch(() => 0),
        ])

    const totalListings = listings.length

    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                        Welcome Back
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                        Hi, {user.fullName.split(' ')[0]}
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                        Here&apos;s how your listings are performing today.
                    </p>
                </div>
                <Button asChild size="lg" className="h-11 rounded-xl">
                    <Link href="/portal/properties/new">
                        <FiPlus />
                        List a new property
                    </Link>
                </Button>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Published"
                    value={publishedCount}
                    delta="Live on Kejasafe"
                    icon={FiCheckCircle}
                    accent="emerald"
                />
                <StatCard
                    label="Pending Review"
                    value={pendingCount}
                    delta={
                        pendingCount > 0
                            ? 'Usually 24–48 hours'
                            : 'Nothing in review'
                    }
                    icon={FiClock}
                    accent="amber"
                />
                <StatCard
                    label="Rejected"
                    value={rejectedCount}
                    delta={
                        rejectedCount > 0
                            ? 'Edit and resubmit'
                            : 'No rejections'
                    }
                    icon={FiXCircle}
                    accent="rose"
                />
                <StatCard
                    label="Total Listings"
                    value={totalListings}
                    icon={FiHome}
                    accent="brand"
                />
            </section>

            <section className="mt-8 rounded-2xl border border-stone-200 bg-white">
                <div className="flex items-center justify-between gap-4 border-b border-stone-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                            My Listings
                        </h2>
                        <p className="mt-0.5 text-xs text-stone-500">
                            Your most recent submissions.
                        </p>
                    </div>
                    <Link
                        href="/portal/properties/new"
                        className="text-brand text-xs font-semibold hover:underline">
                        + Add new
                    </Link>
                </div>

                {listings.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <FiHome className="mx-auto size-10 text-stone-300" />
                        <h3 className="mt-4 text-lg font-semibold text-stone-950">
                            No listings yet
                        </h3>
                        <p className="mt-2 text-sm text-stone-600">
                            Submit your first property and our team will
                            review it within 24–48 hours.
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
                    </div>
                ) : (
                    <ul className="divide-y divide-stone-100">
                        {listings.map(property => (
                            <li
                                key={property.id}
                                className="flex items-start gap-4 px-6 py-4 transition hover:bg-stone-50">
                                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                    {property.images[0] ? (
                                        <Image
                                            src={property.images[0].url}
                                            alt={property.title}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={`/properties/${property.slug}`}
                                            className="hover:text-brand line-clamp-1 text-sm font-semibold text-stone-950 transition-colors">
                                            {property.title}
                                        </Link>
                                        <StatusBadge
                                            status={property.moderationStatus}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500">
                                        {[
                                            property.city?.name,
                                            property.county.name,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}{' '}
                                        · KES{' '}
                                        {Number(property.price).toLocaleString()}
                                        {property.listingPurpose === 'rent'
                                            ? ' / mo'
                                            : ''}
                                    </p>
                                    {property.rejectionReason ? (
                                        <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700">
                                            <span className="font-semibold">
                                                Rejected:
                                            </span>{' '}
                                            {property.rejectionReason}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="shrink-0 text-right text-xs text-stone-400">
                                    {property.submittedAt
                                        ? new Date(
                                              property.submittedAt,
                                          ).toLocaleDateString()
                                        : 'Draft'}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
                <article className="rounded-2xl border border-stone-200 bg-white p-6">
                    <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                        Tips For A Successful Listing
                    </h2>
                    <ul className="mt-4 grid gap-3 text-sm text-stone-700">
                        <li className="flex items-start gap-3">
                            <span className="bg-brand/10 text-brand mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                                1
                            </span>
                            Upload 8+ high-quality photos from different
                            angles — bright daylight works best.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-brand/10 text-brand mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                                2
                            </span>
                            Be specific in your description — mention
                            amenities, nearby landmarks, and any quirks.
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-brand/10 text-brand mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                                3
                            </span>
                            Respond to inquiries within 24 hours — tenants
                            are more likely to book quickly.
                        </li>
                    </ul>
                </article>
                <article className="rounded-2xl border border-stone-200 bg-white p-6">
                    <div className="flex items-start gap-3">
                        <span className="bg-brand/10 text-brand inline-flex size-10 shrink-0 items-center justify-center rounded-xl">
                            <FiEye className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-stone-950">
                                Verification process
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                                Every listing you submit is reviewed by our
                                team within 24–48 hours. We check ownership,
                                image accuracy, and pricing sanity before
                                publication.
                            </p>
                            <Link
                                href="/faq"
                                className="text-brand mt-3 inline-flex text-xs font-semibold hover:underline">
                                Learn more about verification
                                <FiArrowRight className="ml-1 size-3" />
                            </Link>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}
