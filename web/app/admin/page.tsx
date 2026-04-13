import Link from 'next/link'
import { FiActivity, FiClock, FiSettings } from 'react-icons/fi'

import { prisma } from '@/lib/core/prisma/client'

export default async function AdminPage() {
    const pendingCount = await prisma.property
        .count({ where: { moderationStatus: 'pending_review' } })
        .catch(() => 0)

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin
                </p>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight text-stone-950">
                    Operations
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Moderate submissions, switch the active backend, and
                    monitor system health.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link
                    href="/admin/properties/moderation"
                    className="hover:border-brand flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <FiClock className="text-brand size-6" />
                        {pendingCount > 0 ? (
                            <span className="bg-brand rounded-full px-2.5 py-0.5 text-xs font-semibold text-white">
                                {pendingCount}
                            </span>
                        ) : null}
                    </div>
                    <h3 className="text-lg font-semibold text-stone-950">
                        Moderation Queue
                    </h3>
                    <p className="text-sm text-stone-600">
                        Review pending property submissions.
                    </p>
                </Link>
                <Link
                    href="/admin/settings/backend"
                    className="hover:border-brand flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 transition hover:shadow-md">
                    <FiSettings className="text-brand size-6" />
                    <h3 className="text-lg font-semibold text-stone-950">
                        Backend Settings
                    </h3>
                    <p className="text-sm text-stone-600">
                        Switch between Prisma and Laravel backends.
                    </p>
                </Link>
                <Link
                    href="/admin/system/health"
                    className="hover:border-brand flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 transition hover:shadow-md">
                    <FiActivity className="text-brand size-6" />
                    <h3 className="text-lg font-semibold text-stone-950">
                        System Health
                    </h3>
                    <p className="text-sm text-stone-600">
                        Compare backend health metrics.
                    </p>
                </Link>
            </div>
        </main>
    )
}
