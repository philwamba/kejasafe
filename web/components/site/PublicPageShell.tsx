import type { ReactNode } from 'react'

interface PublicPageShellProps {
    eyebrow?: string
    title: string
    description: string
    children: ReactNode
}

export function PublicPageShell({
    eyebrow,
    title,
    description,
    children,
}: PublicPageShellProps) {
    return (
        <>
            <section className="space-y-4">
                {eyebrow ? (
                    <span className="bg-brand/10 text-brand inline-flex rounded-full px-4 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                        {eyebrow}
                    </span>
                ) : null}
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    {title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-stone-600">
                    {description}
                </p>
            </section>
            {children}
        </>
    )
}
