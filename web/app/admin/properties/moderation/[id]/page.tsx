import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { FiArrowLeft, FiMapPin } from 'react-icons/fi'

import { ModerationActions } from '@/components/admin/ModerationActions'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'
import { hasAnyPermission } from '@/lib/core/rbac/access'

export const metadata: Metadata = {
    title: 'Review Property',
    robots: { index: false, follow: false },
}

export default async function ModerationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const user = await getServerCurrentUser()
    if (!user) redirect('/login')
    if (!hasAnyPermission(user.permissions, ['approve_listings'])) {
        redirect('/dashboard')
    }

    const { id } = await params
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            county: true,
            city: true,
            neighborhood: true,
            propertyType: true,
            images: { orderBy: { position: 'asc' } },
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            },
        },
    })

    if (!property) notFound()

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <Link
                href="/admin/properties/moderation"
                className="hover:text-brand inline-flex items-center gap-2 text-sm text-stone-500">
                <FiArrowLeft className="size-4" />
                Back to queue
            </Link>

            <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                            {property.propertyType.name} ·{' '}
                            {property.listingPurpose.replace('_', ' ')}
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                            {property.title}
                        </h1>
                        <p className="mt-3 flex items-center gap-2 text-sm text-stone-600">
                            <FiMapPin className="text-brand size-4" />
                            {[
                                property.neighborhood?.name,
                                property.city?.name,
                                property.county.name,
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                    </div>

                    {property.images.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {property.images.map(image => (
                                <div
                                    key={image.id}
                                    className="relative aspect-4/3 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                                    <Image
                                        src={image.url}
                                        alt={image.altText ?? property.title}
                                        fill
                                        sizes="(min-width: 640px) 50vw, 100vw"
                                        className="object-cover"
                                    />
                                    {image.isCover ? (
                                        <span className="bg-brand absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                                            Cover
                                        </span>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <section className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-stone-950">
                            Summary
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-stone-700">
                            {property.summary}
                        </p>
                    </section>

                    <section className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-stone-950">
                            Description
                        </h2>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-700">
                            {property.description}
                        </p>
                    </section>
                </div>

                <aside className="flex flex-col gap-6">
                    <section className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
                            Owner
                        </h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div>
                                <dt className="text-stone-500">Name</dt>
                                <dd className="font-medium text-stone-900">
                                    {property.owner.fullName}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-stone-500">Email</dt>
                                <dd className="font-medium text-stone-900">
                                    {property.owner.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-stone-500">Phone</dt>
                                <dd className="font-medium text-stone-900">
                                    {property.owner.phone}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-stone-500">
                                    Account created
                                </dt>
                                <dd className="font-medium text-stone-900">
                                    {new Date(
                                        property.owner.createdAt,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-stone-200 bg-white p-6">
                        <h2 className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
                            Listing Facts
                        </h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-stone-500">Price</dt>
                                <dd className="font-medium text-stone-900">
                                    KES{' '}
                                    {Number(property.price).toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-stone-500">Bedrooms</dt>
                                <dd className="font-medium text-stone-900">
                                    {property.bedrooms ?? '—'}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-stone-500">Bathrooms</dt>
                                <dd className="font-medium text-stone-900">
                                    {property.bathrooms ?? '—'}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-stone-500">Submitted</dt>
                                <dd className="font-medium text-stone-900">
                                    {property.submittedAt
                                        ? new Date(
                                              property.submittedAt,
                                          ).toLocaleString()
                                        : '—'}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <ModerationActions
                        propertyId={property.id}
                        propertyTitle={property.title}
                    />
                </aside>
            </section>
        </main>
    )
}
