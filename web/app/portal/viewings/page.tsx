import type { Metadata } from 'next'
import { FiCalendar } from 'react-icons/fi'

import { PortalStub } from '@/components/portal/PortalStub'

export const metadata: Metadata = {
    title: 'Viewings',
    robots: { index: false, follow: false },
}

export default function PortalViewingsPage() {
    return (
        <PortalStub
            eyebrow="Portal · Engagement"
            title="Viewings"
            description="Scheduled property tours and viewing requests."
            icon={<FiCalendar className="size-6" />}
            comingFeatures={[
                'Calendar view of all upcoming viewings',
                'Accept, reject, or reschedule requests in one click',
                'Send automated reminders to prospective tenants',
                'Block out unavailable dates per listing',
                'Post-viewing feedback capture and analytics',
            ]}
        />
    )
}
