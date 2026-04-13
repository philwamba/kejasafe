import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke',
    ),
    title: {
        default: 'Kejasafe — Find Safe & Verified Houses in Kenya',
        template: '%s',
    },
    description:
        'Browse verified rentals, sales, and short-stay listings across Kenya. Avoid scams and rent with confidence on Kejasafe.',
    keywords: [
        'Kenya rentals',
        'houses for rent Nairobi',
        'verified properties Kenya',
        'bedsitter',
        'apartment rent Kenya',
        'property listings Kenya',
        'Kejasafe',
    ],
    openGraph: {
        title: 'Kejasafe — Find Safe & Verified Houses in Kenya',
        description:
            'Browse verified rentals, sales, and short-stay listings across Kenya. Avoid scams and rent with confidence.',
        url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://kejasafe.co.ke',
        siteName: 'Kejasafe',
        locale: 'en_KE',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kejasafe — Find Safe & Verified Houses in Kenya',
        description:
            'Verified rentals and sales across Kenya. Avoid scams and rent with confidence.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="flex min-h-full flex-col">
                {children}
                <Toaster position="bottom-right" richColors closeButton />
            </body>
        </html>
    )
}
