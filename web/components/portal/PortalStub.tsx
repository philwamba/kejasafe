import type { ReactNode } from 'react'

interface PortalStubProps {
    eyebrow: string
    title: string
    description: string
    icon: ReactNode
    comingFeatures: string[]
}

export function PortalStub({
    eyebrow,
    title,
    description,
    icon,
    comingFeatures,
}: PortalStubProps) {
    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-stone-600">{description}</p>
            </section>

            <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                <span className="bg-brand/10 text-brand mx-auto inline-flex size-14 items-center justify-center rounded-2xl">
                    {icon}
                </span>
                <h2 className="mt-5 text-xl font-semibold text-stone-950">
                    Coming soon
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600">
                    This surface is part of our roadmap. The navigation link
                    is already in place so we can ship it without breaking
                    your muscle memory.
                </p>
            </section>

            <section className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <h3 className="text-sm font-semibold tracking-[0.14em] text-stone-500 uppercase">
                    What this page will cover
                </h3>
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-stone-700">
                    {comingFeatures.map(feature => (
                        <li
                            key={feature}
                            className="flex items-start gap-3">
                            <span className="bg-brand/15 text-brand mt-1 inline-block size-1.5 shrink-0 rounded-full" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}
