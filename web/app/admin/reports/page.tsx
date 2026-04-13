import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FiBell, FiShield } from 'react-icons/fi'

import { getServerCurrentUser } from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'

export const metadata: Metadata = {
    title: 'Reports',
    robots: { index: false, follow: false },
}

export default async function ReportsPage() {
    const actor = await getServerCurrentUser()
    if (!actor) redirect('/login?next=/admin/reports')
    if (
        !hasAnyPermission(actor.permissions, [
            'moderate_reports',
            'approve_listings',
        ])
    ) {
        redirect('/dashboard')
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin · Moderation
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Reports
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    User-submitted reports about listings or accounts will
                    appear here for moderator review.
                </p>
            </section>

            <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                <FiBell className="mx-auto size-12 text-stone-300" />
                <h2 className="mt-4 text-xl font-semibold text-stone-950">
                    No reports yet
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600">
                    The reporting flow is not yet exposed to end users, so
                    there&apos;s nothing in the queue. Once the tenant-side
                    &ldquo;Report this listing&rdquo; action is wired, any
                    reports will show up here for moderator action.
                </p>
            </section>

            <section className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <div className="flex items-start gap-3">
                    <span className="bg-brand/10 text-brand inline-flex size-10 shrink-0 items-center justify-center rounded-xl">
                        <FiShield className="size-5" />
                    </span>
                    <div>
                        <h3 className="text-base font-semibold text-stone-950">
                            What this page will cover
                        </h3>
                        <ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-700">
                            <li>• Listings flagged for fake information</li>
                            <li>
                                • Users reported for suspicious activity or
                                harassment
                            </li>
                            <li>
                                • Duplicate-listing reports with a merge /
                                hide action
                            </li>
                            <li>
                                • Priority weighting by report volume and
                                reporter trust
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}
