import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import {
    getServerCurrentUser,
    getServerRequestContext,
} from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { getAdminShellSummary } from '@/lib/core/services/admin-service'

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
            'approve_listings',
        ])
    ) {
        redirect('/dashboard')
    }

    const { pendingModerationCount } = await getAdminShellSummary(
        await getServerRequestContext(),
    ).catch(() => ({ pendingModerationCount: 0 }))

    return (
        <div className="flex min-h-screen bg-stone-50">
            <AdminSidebar pendingCount={pendingModerationCount} />
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminTopBar user={user} workspace="admin" />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    )
}
