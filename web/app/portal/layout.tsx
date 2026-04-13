import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'

export default async function PortalLayout({
    children,
}: {
    children: ReactNode
}) {
    const user = await getServerCurrentUser()

    if (!user) {
        redirect('/login?next=/portal')
    }

    const pendingCount = await prisma.property
        .count({
            where: {
                ownerId: user.id,
                moderationStatus: 'pending_review',
            },
        })
        .catch(() => 0)

    return (
        <div className="flex min-h-screen bg-stone-50">
            <PortalSidebar pendingCount={pendingCount} />
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminTopBar user={user} />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    )
}
