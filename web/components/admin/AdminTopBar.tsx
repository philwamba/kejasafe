'use client'

import { FiBell, FiSearch } from 'react-icons/fi'

import { UserMenu } from '@/components/admin/UserMenu'
import type { AuthUserDto } from '@/lib/shared/types/auth'

interface AdminTopBarProps {
    user: AuthUserDto
}

export function AdminTopBar({ user }: AdminTopBarProps) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-stone-200 bg-white/95 px-6 backdrop-blur">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="hidden w-full max-w-md items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500 focus-within:border-brand focus-within:bg-white sm:flex">
                    <FiSearch className="size-4 text-stone-400" />
                    <input
                        type="search"
                        placeholder="Search listings, users, or reports…"
                        className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                    />
                    <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-stone-500">
                        ⌘K
                    </kbd>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
                    aria-label="Notifications">
                    <FiBell className="size-4" />
                    <span className="bg-brand absolute right-1.5 top-1.5 inline-block size-1.5 rounded-full" />
                </button>
                <UserMenu user={user} />
            </div>
        </header>
    )
}
