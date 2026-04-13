import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { NewPropertyForm } from '@/components/portal/NewPropertyForm'
import { Logo } from '@/components/site/Logo'
import { getServerCurrentUser } from '@/lib/core/auth/server'
import { prisma } from '@/lib/core/prisma/client'
import { slugify } from '@/modules/locations/content'

export const metadata: Metadata = {
    title: 'List a Property',
    description:
        'Submit a verified property listing on Kejasafe. Review takes 24–48 hours.',
    robots: { index: false, follow: false },
}

interface CountyCatalog {
    counties: Array<{
        name: string
        cities: Array<{ name: string; neighborhoods: string[] }>
    }>
}

export default async function NewPropertyPage() {
    const user = await getServerCurrentUser()
    if (!user) {
        redirect('/login?next=/portal/properties/new')
    }

    const propertyTypes = await prisma.propertyType.findMany({
        orderBy: { name: 'asc' },
        select: { slug: true, name: true },
    })

    const catalogPath = resolve(process.cwd(), '../data/locations/kenya.json')
    const catalog: CountyCatalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))
    const counties = catalog.counties.map(county => ({
        slug: slugify(county.name),
        name: county.name,
        cities: county.cities.map(city => ({
            slug: slugify(city.name),
            name: city.name,
            neighborhoods: city.neighborhoods.map(n => ({
                slug: slugify(n),
                name: n,
            })),
        })),
    }))

    return (
        <div className="min-h-screen bg-stone-50">
            <header className="border-b border-stone-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Logo />
                    <div className="text-sm text-stone-600">
                        Signed in as {user.fullName}
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-6 py-10">
                <section className="mb-8 flex flex-col gap-3">
                    <span className="bg-brand/10 text-brand inline-flex w-fit rounded-full px-4 py-1 text-xs font-medium tracking-[0.22em] uppercase">
                        List a property
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight text-stone-950">
                        Submit Your Property For Review
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-stone-600">
                        Fill in the details accurately. Our team reviews every
                        submission before it goes live — usually within 24–48
                        hours. Review the{' '}
                        <a
                            href="#owner-instructions"
                            className="text-brand font-medium underline">
                            owner instructions
                        </a>{' '}
                        before you submit.
                    </p>
                </section>
                <NewPropertyForm
                    counties={counties}
                    propertyTypes={propertyTypes}
                    ownerContactPhone={user.phone ?? ''}
                />
            </main>
        </div>
    )
}
