import type { Metadata } from 'next'
import { FiInbox } from 'react-icons/fi'

import { PortalStub } from '@/components/portal/PortalStub'

export const metadata: Metadata = {
    title: 'Inquiries',
    robots: { index: false, follow: false },
}

export default function PortalInquiriesPage() {
    return (
        <PortalStub
            eyebrow="Portal · Engagement"
            title="Inquiries"
            description="Messages and questions from interested tenants about your listings."
            icon={<FiInbox className="size-6" />}
            comingFeatures={[
                'Unified inbox across all your active listings',
                'Reply directly from Kejasafe — no copy-paste into email',
                'Auto-suggest responses for common questions',
                'Filter by listing, time, and read/unread status',
                'Mark inquiries as qualified, booked, or closed',
            ]}
        />
    )
}
