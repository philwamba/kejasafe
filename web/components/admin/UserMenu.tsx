'use client'

import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import {
    FiBriefcase,
    FiChevronDown,
    FiExternalLink,
    FiGrid,
    FiHome,
    FiLogOut,
    FiRepeat,
    FiSettings,
    FiShield,
    FiUser,
} from 'react-icons/fi'
import { toast } from 'sonner'

import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'
import { hasAnyPermission } from '@/lib/core/rbac/access'
import type { AuthUserDto } from '@/lib/shared/types/auth'
import { cn } from '@/lib/utils'

type Workspace = 'admin' | 'portal' | 'tenant'

interface UserMenuProps {
    user: AuthUserDto
    workspace: Workspace
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')
}

const WORKSPACE_LABELS: Record<Workspace, string> = {
    admin: 'Admin console',
    portal: 'Landlord portal',
    tenant: 'Tenant workspace',
}

function contextRole(user: AuthUserDto, workspace: Workspace): string {
    if (workspace === 'admin') {
        if (user.roles.includes('super_admin')) return 'Super admin'
        if (user.roles.includes('admin')) return 'Admin'
        return 'Moderator'
    }
    if (workspace === 'portal') {
        if (user.roles.includes('agent')) return 'Agent'
        if (user.roles.includes('property_manager'))
            return 'Property manager'
        return 'Landlord'
    }
    return 'Member'
}

export function UserMenu({ user, workspace }: UserMenuProps) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)

    const canAccessAdmin = hasAnyPermission(user.permissions, [
        'manage_users',
        'manage_settings',
        'view_audit_logs',
        'approve_listings',
    ])
    const canAccessPortal =
        hasAnyPermission(user.permissions, ['manage_listings']) ||
        user.roles.some(r =>
            ['landlord', 'agent', 'property_manager'].includes(r),
        )

    // Switch destinations: other workspaces this user has access to.
    const switchDestinations: Array<{
        workspace: Workspace
        href: string
        label: string
        icon: ReactNode
    }> = []

    if (workspace !== 'admin' && canAccessAdmin) {
        switchDestinations.push({
            workspace: 'admin',
            href: '/admin',
            label: WORKSPACE_LABELS.admin,
            icon: <FiShield className="size-4" />,
        })
    }
    if (workspace !== 'portal' && canAccessPortal) {
        switchDestinations.push({
            workspace: 'portal',
            href: '/portal',
            label: WORKSPACE_LABELS.portal,
            icon: <FiBriefcase className="size-4" />,
        })
    }
    if (workspace !== 'tenant') {
        switchDestinations.push({
            workspace: 'tenant',
            href: '/dashboard',
            label: WORKSPACE_LABELS.tenant,
            icon: <FiGrid className="size-4" />,
        })
    }

    // Workspace-specific menu items.
    const workspaceLinks: Array<{
        href: string
        label: string
        icon: ReactNode
    }> = (() => {
        if (workspace === 'admin') {
            return [
                {
                    href: '/admin',
                    label: 'Admin dashboard',
                    icon: <FiGrid className="size-4" />,
                },
                {
                    href: '/admin/users',
                    label: 'Users',
                    icon: <FiUser className="size-4" />,
                },
                {
                    href: '/admin/audit',
                    label: 'Audit log',
                    icon: <FiShield className="size-4" />,
                },
            ]
        }
        if (workspace === 'portal') {
            return [
                {
                    href: '/portal',
                    label: 'My listings',
                    icon: <FiHome className="size-4" />,
                },
                {
                    href: '/portal/profile',
                    label: 'Profile',
                    icon: <FiUser className="size-4" />,
                },
                {
                    href: '/portal/settings',
                    label: 'Settings',
                    icon: <FiSettings className="size-4" />,
                },
            ]
        }
        return [
            {
                href: '/dashboard',
                label: 'My dashboard',
                icon: <FiGrid className="size-4" />,
            },
            {
                href: '/dashboard/settings/security',
                label: 'Security',
                icon: <FiShield className="size-4" />,
            },
        ]
    })()

    function signOut() {
        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const response = await fetch('/api/internal/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                })
                if (!response.ok) {
                    throw new Error('Sign out failed.')
                }
                // Hard navigation so cookies are fully cleared before
                // Next.js attempts any server-side guards or cache
                // re-fetching. Using router.push + router.refresh
                // races against the current route's auth redirect.
                window.location.href = '/login'
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Sign out failed.',
                )
            }
        })
    }

    return (
        <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
            <DropdownMenuPrimitive.Trigger asChild>
                <button
                    type="button"
                    aria-label="Account menu"
                    className="hover:border-brand flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-1.5 transition">
                    <span className="bg-brand inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold text-white">
                        {initials(user.fullName)}
                    </span>
                    <div className="hidden text-left text-xs leading-tight md:block">
                        <p className="font-semibold text-stone-950">
                            {user.fullName}
                        </p>
                        <p className="text-stone-500">
                            {contextRole(user, workspace)}
                        </p>
                    </div>
                    <FiChevronDown
                        className={cn(
                            'size-3.5 text-stone-400 transition',
                            open && 'rotate-180',
                        )}
                    />
                </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align="end"
                    sideOffset={8}
                    className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 min-w-64 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
                    <div className="border-b border-stone-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-stone-950">
                            {user.fullName}
                        </p>
                        <p className="truncate text-xs text-stone-500">
                            {user.email}
                        </p>
                        <p className="mt-1.5 inline-flex rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-stone-600 uppercase">
                            {WORKSPACE_LABELS[workspace]}
                        </p>
                    </div>

                    <div className="py-1">
                        {workspaceLinks.map(link => (
                            <MenuLink
                                key={link.href}
                                href={link.href}
                                icon={link.icon}
                                label={link.label}
                            />
                        ))}
                    </div>

                    {switchDestinations.length > 0 ? (
                        <div className="border-t border-stone-100 pt-2 pb-1">
                            <p className="px-4 pb-1 text-[10px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
                                Switch workspace
                            </p>
                            {switchDestinations.map(destination => (
                                <MenuLink
                                    key={destination.workspace}
                                    href={destination.href}
                                    icon={
                                        <span className="text-brand">
                                            {destination.icon}
                                        </span>
                                    }
                                    label={destination.label}
                                    suffix={
                                        <FiRepeat className="size-3 text-stone-300" />
                                    }
                                />
                            ))}
                        </div>
                    ) : null}

                    <div className="border-t border-stone-100 py-1">
                        <MenuLink
                            href="/"
                            icon={<FiExternalLink className="size-4" />}
                            label="View public site"
                            external
                        />
                        <button
                            type="button"
                            onClick={signOut}
                            disabled={isPending}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">
                            <FiLogOut className="size-4" />
                            {isPending ? 'Signing out…' : 'Sign out'}
                        </button>
                    </div>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    )
}

function MenuLink({
    href,
    icon,
    label,
    external = false,
    suffix,
}: {
    href: string
    icon: ReactNode
    label: string
    external?: boolean
    suffix?: ReactNode
}) {
    return (
        <DropdownMenuPrimitive.Item asChild>
            <Link
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-stone-950 focus:bg-stone-50 focus:outline-none">
                <span className="flex items-center gap-3">
                    <span className="text-stone-400">{icon}</span>
                    {label}
                </span>
                {suffix}
            </Link>
        </DropdownMenuPrimitive.Item>
    )
}
