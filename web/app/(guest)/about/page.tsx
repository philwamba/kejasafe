import type { Metadata } from 'next'

import { ContentSection } from '@/components/cms/ContentSection'
import { PublicPageShell } from '@/components/site/PublicPageShell'

export const metadata: Metadata = {
    title: 'About Us',
    description:
        'Learn how Kejasafe verifies landlords and listings to help Kenyans rent and buy homes safely.',
}

export default function AboutPage() {
    return (
        <PublicPageShell
            eyebrow="About Kejasafe"
            title="A housing platform designed like an actual product, not a listing dump."
            description="Kejasafe is being structured to support public discovery, landlord operations, tenant workflows, moderation, and long-term platform maintainability through a clean service and provider architecture.">
            <ContentSection
                title="Why the architecture matters"
                description="The frontend is intentionally backend-agnostic. That allows the platform to evolve operationally without rewriting the public experience.">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-600">
                        Secure cookie-based authentication and server-side
                        authorization.
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-600">
                        Provider-backed internal APIs for Prisma and Laravel
                        compatibility.
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-600">
                        Public listing discovery, admin moderation,
                        auditability, and future billing readiness.
                    </div>
                </div>
            </ContentSection>
        </PublicPageShell>
    )
}
