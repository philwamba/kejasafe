import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { Logo } from '@/components/site/Logo'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'

export default async function AdminLayout({
    children,
}: {
    children: ReactNode
}) {
    const user = await getServerCurrentUser()

    if (!user) {
        redirect('/login?next=/admin')
    }

    if (
        !hasAnyPermission(user.permissions, [
            'manage_users',
            'manage_settings',
            'view_audit_logs',
        ])
    ) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-white text-stone-950">
            <header className="border-b border-stone-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Logo />
                        <div>
                            <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
                                Admin Console
                            </p>
                            <h1 className="text-lg font-semibold text-stone-950">
                                Operations
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
