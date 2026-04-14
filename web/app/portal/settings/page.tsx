import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FiArrowRight, FiBell, FiSettings, FiShield } from 'react-icons/fi'

import { getServerCurrentUser } from '@/lib/core/auth/server'

export const metadata: Metadata = {
    title: 'Settings',
    robots: { index: false, follow: false },
}

const SETTING_GROUPS = [
    {
        icon: FiShield,
        title: 'Security',
        description:
            'Password, active sessions, and two-factor authentication.',
        href: '/dashboard/settings/security',
        available: true,
    },
    {
        icon: FiBell,
        title: 'Notifications',
        description:
            'Choose how you want to be notified about inquiries, viewings, and platform updates.',
        href: '#',
        available: false,
    },
    {
        icon: FiSettings,
        title: 'Listing preferences',
        description:
            'Default billing period, currency, and reply templates for new inquiries.',
        href: '#',
        available: false,
    },
]

export default async function PortalSettingsPage() {
    const user = await getServerCurrentUser()
    if (!user) redirect('/login?next=/portal/settings')

    return (
        <main className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Portal · Account
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Settings
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Manage how Kejasafe works for you.
                </p>
            </section>

            <ul className="grid gap-4">
                {SETTING_GROUPS.map(group => {
                    const Icon = group.icon
                    const content = (
                        <>
                            <span className="bg-brand/10 text-brand inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                                <Icon className="size-5" />
                            </span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-semibold text-stone-950">
                                        {group.title}
                                    </h2>
                                    {!group.available ? (
                                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 uppercase tracking-wide">
                                            Soon
                                        </span>
                                    ) : null}
                                </div>
                                <p className="mt-1 text-sm text-stone-600">
                                    {group.description}
                                </p>
                            </div>
                            {group.available ? (
                                <FiArrowRight className="text-stone-400 size-4" />
                            ) : null}
                        </>
                    )

                    if (!group.available) {
                        return (
                            <li
                                key={group.title}
                                className="flex items-start gap-4 rounded-2xl border border-dashed border-stone-200 bg-white p-5">
                                {content}
                            </li>
                        )
                    }

                    return (
                        <li key={group.title}>
                            <Link
                                href={group.href}
                                className="hover:border-brand flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:shadow-md">
                                {content}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </main>
    )
}
