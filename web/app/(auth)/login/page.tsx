import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Sign in to your Kejasafe account.',
    robots: { index: false, follow: false },
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>
}) {
    const params = await searchParams

    return (
        <AuthShell
            eyebrow="Welcome back"
            title="Sign in to your account"
            description="Access your saved searches, inquiries, and saved properties."
            footer={
                <p>
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-brand font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            }>
            <LoginForm next={params.next} />
        </AuthShell>
    )
}
