'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    FiActivity,
    FiClock,
    FiGrid,
    FiHome,
    FiSettings,
    FiUsers,
    FiFileText,
    FiBell,
} from 'react-icons/fi'

import { Logo } from '@/components/site/Logo'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
    pendingCount?: number
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

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
    const pathname = usePathname()

    const sections: NavSection[] = [
        {
            label: 'Overview',
            items: [
                { href: '/admin', label: 'Dashboard', icon: FiGrid },
            ],
        },
        {
            label: 'Moderation',
            items: [
                {
                    href: '/admin/properties/moderation',
                    label: 'Review Queue',
                    icon: FiClock,
                    badge: pendingCount,
                },
                {
                    href: '/admin/reports',
                    label: 'Reports',
                    icon: FiBell,
                },
            ],
        },
        {
            label: 'Platform',
            items: [
                {
                    href: '/admin/users',
                    label: 'Users',
                    icon: FiUsers,
                },
                {
                    href: '/admin/audit',
                    label: 'Audit Log',
                    icon: FiFileText,
                },
            ],
        },
        {
            label: 'System',
            items: [
                {
                    href: '/admin/settings/backend',
                    label: 'Backend Settings',
                    icon: FiSettings,
                },
                {
                    href: '/admin/system/health',
                    label: 'System Health',
                    icon: FiActivity,
                },
            ],
        },
    ]

    function isActive(href: string) {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
            <div className="flex h-16 items-center border-b border-stone-200 px-6">
                <Logo showBetaBadge />
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
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
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">
                    <FiHome className="size-4" />
                    Back to app
                </Link>
            </div>
        </aside>
    )
}
