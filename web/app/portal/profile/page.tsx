import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FiCheck, FiMail, FiPhone, FiUser } from 'react-icons/fi'

import { StatusBadge, statusTone } from '@/components/ui/status-badge'
import { getServerCurrentUser } from '@/lib/core/auth/server'

export const metadata: Metadata = {
    title: 'Profile',
    robots: { index: false, follow: false },
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')
}

export default async function PortalProfilePage() {
    const user = await getServerCurrentUser()
    if (!user) redirect('/login?next=/portal/profile')

    return (
        <main className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Portal · Account
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Profile
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Your public identity on Kejasafe.
                </p>
            </section>

            <article className="rounded-2xl border border-stone-200 bg-white p-6">
                <div className="flex items-start gap-5">
                    <span className="bg-brand inline-flex size-16 items-center justify-center rounded-2xl text-xl font-semibold text-white">
                        {initials(user.fullName)}
                    </span>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-semibold text-stone-950">
                                {user.fullName}
                            </h2>
                            {user.roles.map(role => (
                                <StatusBadge key={role} tone="violet">
                                    {role.replace('_', ' ')}
                                </StatusBadge>
                            ))}
                        </div>
                        <dl className="mt-4 grid gap-2 text-sm text-stone-700">
                            <div className="flex items-center gap-2">
                                <FiMail className="text-brand size-4" />
                                <span>{user.email}</span>
                                {user.emailVerifiedAt ? (
                                    <FiCheck className="size-3.5 text-emerald-600" />
                                ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                                <FiPhone className="text-brand size-4" />
                                <span>{user.phone ?? 'No phone on file'}</span>
                            </div>
                        </dl>
                    </div>
                </div>
            </article>

            <section className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6">
                <div className="flex items-start gap-3">
                    <span className="bg-brand/10 text-brand inline-flex size-10 shrink-0 items-center justify-center rounded-xl">
                        <FiUser className="size-5" />
                    </span>
                    <div>
                        <h3 className="text-base font-semibold text-stone-950">
                            Profile editing is coming
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-stone-600">
                            You&apos;ll be able to update your display name,
                            avatar, phone number, and bio here. For now, you
                            can manage your account security from the{' '}
                            <a
                                href="/dashboard/settings/security"
                                className="text-brand font-medium hover:underline">
                                security settings
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
