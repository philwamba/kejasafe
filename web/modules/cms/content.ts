export interface BlogPostSummary {
    slug: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    readingTime: string
}

export interface FaqItem {
    question: string
    answer: string
}

export interface LegalPageContent {
    title: string
    description: string
    sections: Array<{
        heading: string
        body: string[]
    }>
}

export const blogPosts: BlogPostSummary[] = [
    {
        slug: 'how-to-rent-safely-in-nairobi',
        title: 'How to rent safely in Nairobi without wasting weeks on fake leads',
        excerpt:
            'A practical framework for verifying listings, budgets, estate quality, and landlord credibility before you commit.',
        category: 'Tenant Guides',
        publishedAt: '2026-03-20',
        readingTime: '6 min read',
    },
    {
        slug: 'what-landlords-should-track-before-publishing-a-listing',
        title: 'What landlords should track before publishing a listing',
        excerpt:
            'The operational checklist that keeps property data accurate, compliant, and conversion-ready from day one.',
        category: 'Landlord Operations',
        publishedAt: '2026-03-18',
        readingTime: '5 min read',
    },
    {
        slug: 'short-stay-vs-long-stay-pricing-kenya',
        title: 'Short stay vs long stay pricing in Kenya: where margins actually shift',
        excerpt:
            'How occupancy, furnishing, utility risk, and estate positioning change the pricing model for modern hosts.',
        category: 'Market Insights',
        publishedAt: '2026-03-15',
        readingTime: '7 min read',
    },
]

export const faqItems: FaqItem[] = [
    {
        question: 'What is Kejasafe?',
        answer: 'Kejasafe is a housing and property operations platform designed to support listing discovery, tenant workflows, landlord operations, and admin moderation through a modern dual-backend architecture.',
    },
    {
        question: 'Can listings come from different backends?',
        answer: 'Yes. The frontend consumes normalized internal APIs and provider contracts, so the public site can resolve data from Prisma or Laravel without scattering backend-specific logic through components.',
    },
    {
        question: 'Will Kejasafe support both rentals and sales?',
        answer: 'Yes. The listing model already supports rent, sale, and short-stay inventory, with room for pricing history, moderation, media, and occupancy workflows.',
    },
    {
        question: 'Does the platform support Kenyan locations properly?',
        answer: 'Yes. The data model supports counties, cities, and neighborhoods so search, location landing pages, and future SEO pages can be structured in a way that fits the Kenyan market.',
    },
]

export const legalPages: Record<string, LegalPageContent> = {
    privacy: {
        title: 'Privacy Policy',
        description:
            'How Kejasafe collects, uses, stores, and safeguards personal and operational housing data.',
        sections: [
            {
                heading: 'Information we collect',
                body: [
                    'We collect account details, profile information, listing data, inquiry content, session telemetry, and operational activity needed to run the platform safely.',
                    'We also record security-relevant metadata such as IP address and user agent where appropriate for abuse prevention, audit logging, and account protection.',
                ],
            },
            {
                heading: 'How information is used',
                body: [
                    'Data is used to deliver listings, support authentication, moderate content, route inquiries, and improve system reliability.',
                    'We do not rely on client-side role claims. Sensitive access decisions are resolved server-side against active permissions and validated session context.',
                ],
            },
        ],
    },
    terms: {
        title: 'Terms of Service',
        description:
            'The rules governing use of the Kejasafe website, listings, dashboards, and admin tools.',
        sections: [
            {
                heading: 'Platform use',
                body: [
                    'You may use the platform only for lawful property discovery, listing management, and related operational tasks.',
                    'You remain responsible for the accuracy of listing content, inquiry communication, and any documentation uploaded through the service.',
                ],
            },
            {
                heading: 'Account responsibility',
                body: [
                    'Account holders are responsible for safeguarding credentials and reporting unauthorized use promptly.',
                    'We reserve the right to suspend accounts, listings, or workflows where fraud, abuse, or policy violations are detected.',
                ],
            },
        ],
    },
    cookies: {
        title: 'Cookie Policy',
        description:
            'How Kejasafe uses cookies for authentication, preferences, and essential platform security.',
        sections: [
            {
                heading: 'Essential cookies',
                body: [
                    'The platform uses secure, httpOnly cookies for authentication and session continuity. We do not use localStorage for auth tokens.',
                    'Additional cookies may be used for CSRF protection, backend mode routing, and session management.',
                ],
            },
            {
                heading: 'Browser controls',
                body: [
                    'You can control many cookie behaviors through browser settings, although disabling required cookies may prevent the site from functioning correctly.',
                ],
            },
        ],
    },
    'acceptable-use': {
        title: 'Acceptable Use Policy',
        description:
            'What users may not do when using Kejasafe public pages, dashboards, APIs, and admin tools.',
        sections: [
            {
                heading: 'Prohibited behavior',
                body: [
                    'You may not publish deceptive listings, impersonate other users, scrape protected data, abuse inquiry flows, or attempt to bypass platform authorization controls.',
                    'You may not upload malicious files, misrepresent availability, or use the platform to facilitate fraud or harassment.',
                ],
            },
            {
                heading: 'Enforcement',
                body: [
                    'Violations may lead to content removal, account suspension, escalation to support or moderation teams, and retention of audit records for compliance review.',
                ],
            },
        ],
    },
}

export function getBlogPost(slug: string) {
    return blogPosts.find(post => post.slug === slug) ?? null
}

export function getLegalPage(slug: string) {
    return legalPages[slug] ?? null
}
