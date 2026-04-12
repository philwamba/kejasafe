import type { ReactNode } from 'react'
import Link from 'next/link'
import { FiCheckCircle, FiHome, FiShield } from 'react-icons/fi'

import { Logo } from '@/components/site/Logo'

interface AuthShellProps {
    eyebrow: string
    title: string
    description: string
    children: ReactNode
    footer?: ReactNode
}

const trustPoints = [
    {
        icon: FiShield,
        label: 'Verified landlords',
        copy: 'Every listing goes through identity and ownership checks.',
    },
    {
        icon: FiCheckCircle,
        label: 'No scams',
        copy: 'Browse real homes from real people — not brokers posing as owners.',
    },
    {
        icon: FiHome,
        label: 'All of Kenya',
        copy: 'Rentals, sales, and short-stay homes across every county.',
    },
]

export function AuthShell({
    eyebrow,
    title,
    description,
    children,
    footer,
}: AuthShellProps) {
    return (
        <main className="min-h-screen bg-white">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                {/* Brand panel */}
                <aside className="bg-brand relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 lg:text-white">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.4) 0, transparent 45%)',
                        }}
                    />
                    <div className="relative">
                        <Logo wordmarkClassName="text-white" />
                    </div>
                    <div className="relative space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl leading-tight font-semibold tracking-tight">
                                Find safe, verified houses across Kenya.
                            </h2>
                            <p className="max-w-md text-base leading-7 text-white/80">
                                Kejasafe is the trusted way to discover rentals
                                and properties without scams, broker tricks, or
                                ghost listings.
                            </p>
                        </div>
                        <ul className="grid gap-5">
                            {trustPoints.map(point => {
                                const Icon = point.icon
                                return (
                                    <li
                                        key={point.label}
                                        className="flex items-start gap-4">
                                        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                            <Icon className="size-4" />
                                        </span>
                                        <div>
                                            <p className="font-semibold">
                                                {point.label}
                                            </p>
                                            <p className="text-sm leading-6 text-white/80">
                                                {point.copy}
                                            </p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <p className="relative text-xs tracking-[0.24em] text-white/60 uppercase">
                        © {new Date().getFullYear()} Kejasafe
                    </p>
                </aside>

                {/* Form panel */}
                <section className="flex min-h-screen flex-col px-6 py-10 sm:px-12 lg:py-16">
                    <div className="mb-10 flex items-center justify-between lg:hidden">
                        <Logo />
                        <Link
                            href="/"
                            className="hover:text-brand text-sm font-medium text-stone-500">
                            Back to home
                        </Link>
                    </div>
                    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                        <div className="space-y-2">
                            <p className="text-brand text-xs font-semibold tracking-[0.24em] uppercase">
                                {eyebrow}
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                                {title}
                            </h1>
                            <p className="text-sm leading-7 text-stone-600">
                                {description}
                            </p>
                        </div>
                        <div className="mt-8">{children}</div>
                        {footer ? (
                            <div className="mt-6 text-sm text-stone-600">
                                {footer}
                            </div>
                        ) : null}
                    </div>
                </section>
            </div>
        </main>
    )
}
