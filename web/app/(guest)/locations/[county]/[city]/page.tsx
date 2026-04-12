import type { Metadata } from 'next'

import { ContentSection } from '@/components/cms/ContentSection'
import { PublicPageShell } from '@/components/site/PublicPageShell'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ county: string; city: string }>
}): Promise<Metadata> {
    const { county, city } = await params

    return {
        title: `Houses in ${city}, ${county}`,
        description: `Verified rental and sale listings in ${city}, ${county}, Kenya.`,
    }
}

export default async function CityPage({
    params,
}: {
    params: Promise<{ county: string; city: string }>
}) {
    const { county, city } = await params

    return (
        <PublicPageShell
            eyebrow="City landing page"
            title={`Housing and property context for ${city}, ${county}`}
            description="City-level landing pages give the platform indexable search entry points and a structured place for localized market information.">
            <ContentSection title="Location strategy">
                <p className="text-sm leading-7 text-stone-600">
                    This page is a deliberate SEO and content shell. Later it
                    should surface neighborhood trends, listing clusters, FAQs,
                    and internal links to relevant property searches.
                </p>
            </ContentSection>
        </PublicPageShell>
    )
}
