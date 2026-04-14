import type { Metadata } from 'next'
import { FiBarChart2 } from 'react-icons/fi'

import { PortalStub } from '@/components/portal/PortalStub'

export const metadata: Metadata = {
    title: 'Analytics',
    robots: { index: false, follow: false },
}

export default function PortalAnalyticsPage() {
    return (
        <PortalStub
            eyebrow="Portal · Engagement"
            title="Analytics"
            description="Understand how your listings are performing."
            icon={<FiBarChart2 className="size-6" />}
            comingFeatures={[
                'Listing views, saves, and inquiry funnel per property',
                'Conversion rates from view to inquiry to viewing',
                'Geographic breakdown of where your tenants come from',
                'Best-performing cover images based on click-through',
                'Weekly email digest with performance highlights',
            ]}
        />
    )
}
