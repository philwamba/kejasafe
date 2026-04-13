import Link from 'next/link'
import { FiActivity, FiHeart, FiHome, FiShield } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'

export default async function DashboardPage() {
    const user = await getServerCurrentUser()
    if (!user) return null

    const [savedCount, mySubmissions] = await Promise.all([
        prisma.favorite.count({ where: { userId: user.id } }).catch(() => 0),
        prisma.property
            .count({ where: { ownerId: user.id } })
            .catch(() => 0),
    ])

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <section className="mb-10">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Welcome Back
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Hi, {user.fullName.split(' ')[0]}
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Manage your saved properties, submissions, and account
                    settings from one place.
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    href="/properties"
                    className="hover:border-brand flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <FiHeart className="text-brand size-6" />
                    <h2 className="text-lg font-semibold text-stone-950">
                        Saved Properties
                    </h2>
                    <p className="text-sm text-stone-600">
                        {savedCount}{' '}
                        {savedCount === 1 ? 'property' : 'properties'} saved.
                    </p>
                </Link>

                <Link
                    href="/portal/properties/new"
                    className="hover:border-brand flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <FiHome className="text-brand size-6" />
                    <h2 className="text-lg font-semibold text-stone-950">
                        My Listings
                    </h2>
                    <p className="text-sm text-stone-600">
                        {mySubmissions}{' '}
                        {mySubmissions === 1 ? 'submission' : 'submissions'}.
                        List a new property.
                    </p>
                </Link>

                <Link
                    href="/dashboard/settings/security"
                    className="hover:border-brand flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <FiShield className="text-brand size-6" />
                    <h2 className="text-lg font-semibold text-stone-950">
                        Security
                    </h2>
                    <p className="text-sm text-stone-600">
                        Manage active sessions and account security.
                    </p>
                </Link>
            </section>

            <section className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <span className="bg-brand/10 text-brand inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                            <FiActivity className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-lg font-semibold text-stone-950">
                                Looking for a home?
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                Browse verified listings across all 47 Kenyan
                                counties.
                            </p>
                        </div>
                    </div>
                    <Button
                        asChild
                        size="lg"
                        className="h-11 rounded-xl">
                        <Link href="/properties">Browse listings</Link>
                    </Button>
                </div>
            </section>
        </main>
    )
}
