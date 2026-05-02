import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import {
    getServerCurrentUser,
    getServerRequestContext,
} from '@/lib/core/auth/server'
import { getPortalPendingCount } from '@/lib/core/services/dashboard-service'

export default async function PortalLayout({
    children,
}: {
    children: ReactNode
}) {
    const user = await getServerCurrentUser()

    if (!user) {
        redirect('/login?next=/portal')
    }

    const pendingCount = await getPortalPendingCount(
        user.id,
        await getServerRequestContext(),
    ).catch(() => 0)

    return (
        <div className="flex min-h-screen bg-stone-50">
            <PortalSidebar pendingCount={pendingCount} />
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminTopBar user={user} workspace="portal" />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    )
}
