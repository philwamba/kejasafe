import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { FiBell } from 'react-icons/fi'

import { UserMenu } from '@/components/admin/UserMenu'
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
        <div className="flex min-h-screen flex-col bg-stone-50">
            <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-stone-200 bg-white/95 px-6 backdrop-blur">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Logo showBetaBadge />
                    <span className="hidden h-5 w-px bg-stone-200 sm:inline-block" />
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-stone-500 uppercase">
                            Tenant Workspace
                        </p>
                        <p className="text-sm font-semibold text-stone-950">
                            Dashboard
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
                        aria-label="Notifications">
                        <FiBell className="size-4" />
                    </button>
                    <UserMenu user={user} workspace="tenant" />
                </div>
            </header>
            <div className="flex-1">{children}</div>
        </div>
    )
}
