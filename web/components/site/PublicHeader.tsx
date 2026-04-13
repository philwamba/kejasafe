import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'

import { Logo } from '@/components/site/Logo'
import { Button } from '@/components/ui/button'

const primaryLinks = [
    { href: '/properties', label: 'Listings' },
    { href: '/search', label: 'Search' },
    { href: '/locations', label: 'Locations' },
    { href: '/pricing', label: 'Pricing' },
]

const secondaryLinks = [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
]

export function PublicHeader() {
    return (
        <header className="sticky top-4 z-30 rounded-2xl border border-stone-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="flex h-16 items-center gap-6 px-5">
                <Logo showBetaBadge />

                <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 lg:flex">
                    {primaryLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-brand transition-colors">
                            {link.label}
                        </Link>
                    ))}
                    <span className="h-5 w-px bg-stone-200" />
                    {secondaryLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-brand text-stone-500 transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="hidden h-10 rounded-xl px-4 text-sm font-medium text-stone-700 sm:inline-flex">
                        <Link href="/login">Sign in</Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="h-10 rounded-xl px-4 text-sm font-semibold">
                        <Link href="/login?next=/portal/properties/new">
                            <FiPlus />
                            List property
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
