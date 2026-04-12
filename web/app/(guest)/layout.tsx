import type { ReactNode } from 'react'

import { PublicFooter } from '@/components/site/PublicFooter'
import { PublicHeader } from '@/components/site/PublicHeader'

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white text-stone-950">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8">
                <PublicHeader />
                {children}
                <PublicFooter />
            </div>
        </div>
    )
}
