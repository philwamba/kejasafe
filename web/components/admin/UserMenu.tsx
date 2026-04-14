'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import {
    FiChevronDown,
    FiExternalLink,
    FiHome,
    FiLogOut,
    FiShield,
    FiUser,
} from 'react-icons/fi'
import { toast } from 'sonner'

import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'
import type { AuthUserDto } from '@/lib/shared/types/auth'

interface UserMenuProps {
    user: AuthUserDto
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')
}

function roleLabel(user: AuthUserDto) {
    if (user.roles.includes('super_admin')) return 'Super admin'
    if (user.roles.includes('admin')) return 'Admin'
    if (user.roles.includes('moderator')) return 'Moderator'
    if (user.roles.includes('landlord')) return 'Landlord'
    return 'User'
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)

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
                toast.success('Signed out.')
                router.push('/login')
                router.refresh()
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Sign out failed.',
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
                        <p className="text-stone-500">{roleLabel(user)}</p>
                    </div>
                    <FiChevronDown
                        className={`size-3.5 text-stone-400 transition ${open ? 'rotate-180' : ''}`}
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
                    </div>
                    <div className="py-1">
                        <MenuLink
                            href="/dashboard"
                            icon={<FiHome className="size-4" />}
                            label="My dashboard"
                        />
                        <MenuLink
                            href="/portal/profile"
                            icon={<FiUser className="size-4" />}
                            label="Profile"
                        />
                        <MenuLink
                            href="/dashboard/settings/security"
                            icon={<FiShield className="size-4" />}
                            label="Security"
                        />
                        <MenuLink
                            href="/"
                            icon={<FiExternalLink className="size-4" />}
                            label="View public site"
                            external
                        />
                    </div>
                    <div className="border-t border-stone-100 py-1">
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
}: {
    href: string
    icon: React.ReactNode
    label: string
    external?: boolean
}) {
    return (
        <DropdownMenuPrimitive.Item asChild>
            <Link
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-stone-950 focus:bg-stone-50 focus:outline-none">
                <span className="text-stone-400">{icon}</span>
                {label}
            </Link>
        </DropdownMenuPrimitive.Item>
    )
}
