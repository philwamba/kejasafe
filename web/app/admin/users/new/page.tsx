import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

import { InviteUserForm } from '@/components/admin/InviteUserForm'
import {
    getServerCurrentUser,
    getServerRequestContext,
} from '@/lib/core/auth/server'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import { listAdminRoles } from '@/lib/core/services/admin-service'

export const metadata: Metadata = {
    title: 'Invite User',
    robots: { index: false, follow: false },
}

export default async function InviteUserPage() {
    const actor = await getServerCurrentUser()
    if (!actor) redirect('/login?next=/admin/users/new')
    if (!hasAnyPermission(actor.permissions, ['manage_users'])) {
        redirect('/dashboard')
    }

    const roles = await listAdminRoles(await getServerRequestContext())

    return (
        <main className="mx-auto w-full max-w-2xl px-6 py-8 lg:px-10 lg:py-10">
            <Link
                href="/admin/users"
                className="hover:text-brand inline-flex items-center gap-2 text-sm text-stone-500">
                <FiArrowLeft className="size-4" />
                Back to users
            </Link>

            <section className="mt-6 mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin · Users
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Invite A New User
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    The new user will receive a temporary password they can use
                    to log in and reset.
                </p>
            </section>

            <InviteUserForm roles={roles} />
        </main>
    )
}
