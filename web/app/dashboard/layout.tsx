import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { Logo } from '@/components/site/Logo'
import { getServerCurrentUser } from '@/lib/core/auth/server'

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const user = await getServerCurrentUser()

    if (!user) {
        redirect('/login?next=/dashboard')
    }

    return (
        <div className="min-h-screen bg-white text-stone-950">
            <header className="border-b border-stone-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Logo />
                        <div>
                            <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
                                Tenant Workspace
                            </p>
                            <h1 className="text-lg font-semibold text-stone-950">
                                Dashboard
                            </h1>
                        </div>
                    </div>
                    <div className="text-sm text-stone-600">
                        {user.fullName} · {user.backendMode}
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}
