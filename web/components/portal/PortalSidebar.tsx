'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    FiBarChart2,
    FiCalendar,
    FiHome,
    FiInbox,
    FiPlus,
    FiSettings,
    FiUser,
} from 'react-icons/fi'

import { Logo } from '@/components/site/Logo'
import { cn } from '@/lib/utils'

interface PortalSidebarProps {
    pendingCount?: number
    inquiryCount?: number
}

interface NavItem {
    href: string
    label: string
    icon: typeof FiHome
    badge?: number
}

interface NavSection {
    label: string
    items: NavItem[]
}

export function PortalSidebar({
    pendingCount = 0,
    inquiryCount = 0,
}: PortalSidebarProps) {
    const pathname = usePathname()

    const sections: NavSection[] = [
        {
            label: 'Overview',
            items: [
                { href: '/portal', label: 'My Listings', icon: FiHome },
                {
                    href: '/portal/properties/new',
                    label: 'New Listing',
                    icon: FiPlus,
                },
            ],
        },
        {
            label: 'Engagement',
            items: [
                {
                    href: '/portal/inquiries',
                    label: 'Inquiries',
                    icon: FiInbox,
                    badge: inquiryCount,
                },
                {
                    href: '/portal/viewings',
                    label: 'Viewings',
                    icon: FiCalendar,
                },
                {
                    href: '/portal/analytics',
                    label: 'Analytics',
                    icon: FiBarChart2,
                },
            ],
        },
        {
            label: 'Account',
            items: [
                {
                    href: '/portal/profile',
                    label: 'Profile',
                    icon: FiUser,
                },
                {
                    href: '/portal/settings',
                    label: 'Settings',
                    icon: FiSettings,
                },
            ],
        },
    ]

    function isActive(href: string) {
        if (href === '/portal') return pathname === '/portal'
        return pathname.startsWith(href)
    }

    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
            <div className="flex h-16 items-center border-b border-stone-200 px-6">
                <Logo showBetaBadge />
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
                {pendingCount > 0 ? (
                    <div className="bg-brand/10 border-brand/20 text-brand mb-5 flex items-start gap-2 rounded-xl border p-3 text-xs">
                        <span className="mt-0.5 inline-block size-1.5 rounded-full bg-current" />
                        <span>
                            You have {pendingCount} listing
                            {pendingCount === 1 ? '' : 's'} awaiting review.
                        </span>
                    </div>
                ) : null}

                {sections.map(section => (
                    <div key={section.label} className="mb-6">
                        <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] text-stone-400 uppercase">
                            {section.label}
                        </p>
                        <ul className="grid gap-1">
                            {section.items.map(item => {
                                const Icon = item.icon
                                const active = isActive(item.href)
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                active
                                                    ? 'bg-brand/10 text-brand'
                                                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950',
                                            )}>
                                            <span className="inline-flex items-center gap-3">
                                                <Icon className="size-4" />
                                                {item.label}
                                            </span>
                                            {item.badge && item.badge > 0 ? (
                                                <span
                                                    className={cn(
                                                        'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
                                                        active
                                                            ? 'bg-brand text-white'
                                                            : 'bg-stone-200 text-stone-700',
                                                    )}>
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t border-stone-200 px-4 py-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">
                    <FiHome className="size-4" />
                    Back to site
                </Link>
            </div>
        </aside>
    )
}
