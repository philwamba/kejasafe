import type { Metadata } from 'next'
import Link from 'next/link'
import { FiCheck, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Pricing',
    description:
        'Landlord and agent pricing plans for listing homes on Kejasafe.',
}

interface Plan {
    name: string
    tagline: string
    monthly: number
    annual: number
    listings: string
    featured: boolean
    highlights: string[]
    excludes?: string[]
    cta: string
    href: string
    popular?: boolean
}

const PLANS: Plan[] = [
    {
        name: 'Starter',
        tagline: 'For independent landlords listing one home.',
        monthly: 0,
        annual: 0,
        listings: '1 active listing',
        featured: false,
        highlights: [
            'Verified landlord badge',
            'Up to 8 photos per listing',
            'Standard placement in search',
            'Inquiry inbox',
            '24–48 hour review SLA',
        ],
        excludes: [
            'Featured placement',
            'Priority support',
            'Bulk listing tools',
        ],
        cta: 'Get started for free',
        href: '/login?next=/portal/properties/new',
    },
    {
        name: 'Growth',
        tagline: 'For agents and small property managers.',
        monthly: 2_500,
        annual: 25_000,
        listings: 'Up to 15 active listings',
        featured: false,
        highlights: [
            'Everything in Starter',
            'Up to 15 photos per listing',
            '2 featured listings per month',
            'Email and WhatsApp inquiry routing',
            'Listing performance analytics',
            'Email support within 1 business day',
        ],
        excludes: ['Dedicated account manager', 'Custom integrations'],
        cta: 'Start a Growth trial',
        href: '/login?next=/portal/properties/new',
        popular: true,
    },
    {
        name: 'Enterprise',
        tagline: 'For agencies and operational teams.',
        monthly: 12_500,
        annual: 125_000,
        listings: 'Unlimited listings',
        featured: true,
        highlights: [
            'Everything in Growth',
            'Unlimited featured listings',
            'Bulk import and CSV upload',
            'Multi-user team accounts with roles',
            'Dedicated account manager',
            'Custom branded landing pages',
            'Priority phone support',
        ],
        cta: 'Talk to sales',
        href: '/contact?topic=enterprise',
    },
]

const FAQS: Array<{ question: string; answer: string }> = [
    {
        question: 'Do I pay anything to list a property as a landlord?',
        answer: 'No. The Starter plan is free for independent landlords with one verified listing. You only pay if you need more listings, featured placement, or team features.',
    },
    {
        question: 'How does the verification process work?',
        answer: 'Every listing is reviewed by our team within 24–48 hours. We check ownership documents, image authenticity, and listing accuracy before publication.',
    },
    {
        question: 'Can I switch plans later?',
        answer: 'Yes. Upgrade or downgrade at any time. Changes prorate against your current billing cycle.',
    },
    {
        question: 'Is annual cheaper than monthly?',
        answer: 'Yes — annual billing saves you roughly 17% (the equivalent of two months free).',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'M-Pesa, bank transfer, and major credit/debit cards. Enterprise customers can be invoiced.',
    },
]

function formatKes(amount: number) {
    if (amount === 0) return 'Free'
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function PricingPage() {
    return (
        <>
            <section className="space-y-4 text-center">
                <span className="bg-brand/10 text-brand inline-flex w-fit items-center gap-2 self-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase">
                    Pricing
                </span>
                <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] mx-auto max-w-3xl font-semibold leading-tight tracking-tight text-stone-950">
                    Simple Pricing For Landlords And Agents
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600">
                    Free for independent landlords. Affordable plans for agents
                    and agencies. No hidden fees, no commission on rent.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
                {PLANS.map(plan => (
                    <article
                        key={plan.name}
                        className={
                            plan.popular
                                ? 'border-brand bg-brand relative flex flex-col overflow-hidden rounded-2xl border-2 p-7 text-white shadow-lg'
                                : 'relative flex flex-col rounded-2xl border border-stone-200 bg-white p-7 shadow-sm'
                        }>
                        {plan.popular ? (
                            <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-stone-900 uppercase">
                                Most Popular
                            </span>
                        ) : null}

                        <div>
                            <h2
                                className={
                                    plan.popular
                                        ? 'text-xl font-semibold text-white'
                                        : 'text-xl font-semibold text-stone-950'
                                }>
                                {plan.name}
                            </h2>
                            <p
                                className={
                                    plan.popular
                                        ? 'mt-1 text-sm text-white/80'
                                        : 'mt-1 text-sm text-stone-600'
                                }>
                                {plan.tagline}
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-baseline gap-1.5">
                                <span
                                    className={
                                        plan.popular
                                            ? 'text-4xl font-semibold tracking-tight text-white'
                                            : 'text-4xl font-semibold tracking-tight text-stone-950'
                                    }>
                                    {formatKes(plan.monthly)}
                                </span>
                                {plan.monthly > 0 ? (
                                    <span
                                        className={
                                            plan.popular
                                                ? 'text-sm text-white/70'
                                                : 'text-sm text-stone-500'
                                        }>
                                        / month
                                    </span>
                                ) : null}
                            </div>
                            {plan.annual > 0 ? (
                                <p
                                    className={
                                        plan.popular
                                            ? 'mt-1 text-xs text-white/70'
                                            : 'mt-1 text-xs text-stone-500'
                                    }>
                                    or {formatKes(plan.annual)} / year
                                </p>
                            ) : null}
                            <p
                                className={
                                    plan.popular
                                        ? 'mt-3 text-sm font-medium text-white'
                                        : 'mt-3 text-sm font-medium text-stone-700'
                                }>
                                {plan.listings}
                            </p>
                        </div>

                        <ul
                            className={
                                plan.popular
                                    ? 'mt-6 grid gap-2.5 border-t border-white/15 pt-6 text-sm'
                                    : 'mt-6 grid gap-2.5 border-t border-stone-100 pt-6 text-sm'
                            }>
                            {plan.highlights.map(item => (
                                <li
                                    key={item}
                                    className={
                                        plan.popular
                                            ? 'flex items-start gap-2 text-white/90'
                                            : 'flex items-start gap-2 text-stone-700'
                                    }>
                                    <FiCheck
                                        className={
                                            plan.popular
                                                ? 'mt-0.5 size-4 shrink-0 text-white'
                                                : 'text-brand mt-0.5 size-4 shrink-0'
                                        }
                                    />
                                    {item}
                                </li>
                            ))}
                            {plan.excludes?.map(item => (
                                <li
                                    key={item}
                                    className={
                                        plan.popular
                                            ? 'flex items-start gap-2 text-white/50 line-through'
                                            : 'flex items-start gap-2 text-stone-400 line-through'
                                    }>
                                    <FiX className="mt-0.5 size-4 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <Button
                                asChild
                                size="lg"
                                className={
                                    plan.popular
                                        ? 'h-12 w-full rounded-xl bg-white text-stone-950 hover:bg-white/90'
                                        : 'h-12 w-full rounded-xl'
                                }
                                variant={plan.popular ? 'ghost' : 'default'}>
                                <Link href={plan.href}>{plan.cta}</Link>
                            </Button>
                        </div>
                    </article>
                ))}
            </section>

            <section className="rounded-2xl border border-stone-200 bg-stone-50 p-8">
                <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_auto]">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                            Looking for tenant-side pricing?
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                            Browsing, saving and contacting verified landlords
                            on Kejasafe is and will always be free for tenants.
                            We charge landlords and agents — never the people
                            looking for a home.
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-11 rounded-xl">
                        <Link href="/properties">Browse listings</Link>
                    </Button>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                        Pricing FAQ
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                        Quick answers to the most common questions.
                    </p>
                </div>
                <ul className="grid gap-4">
                    {FAQS.map(faq => (
                        <li
                            key={faq.question}
                            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-stone-950">
                                {faq.question}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                                {faq.answer}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}
