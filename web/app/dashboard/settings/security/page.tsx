import Link from 'next/link'

import { SessionList } from '@/components/auth/SessionList'

export default function DashboardSecurityPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Account Security
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Manage Active Sessions
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                    Review devices currently signed in to your account and
                    revoke any you don&apos;t recognize.
                </p>
            </div>
            <div className="grid gap-6">
                <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                        Active sessions
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                        Each entry represents a device or browser currently
                        signed in to your Kejasafe account.
                    </p>
                    <div className="mt-6">
                        <SessionList />
                    </div>
                </section>
                <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold tracking-tight text-stone-950">
                        Verification And Alerts
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Confirm your email so we can notify you about
                        important account activity.
                    </p>
                    <div className="mt-4">
                        <Link
                            href="/verify-email"
                            className="text-brand text-sm font-medium hover:underline">
                            Verify your email →
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    )
}
