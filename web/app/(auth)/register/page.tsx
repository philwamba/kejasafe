import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/auth/AuthShell'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
    title: 'Register',
    description:
        'Create a Kejasafe account to save properties and contact landlords.',
    robots: { index: false, follow: false },
}

export default function RegisterPage() {
    return (
        <AuthShell
            eyebrow="Get started"
            title="Create your account"
            description="Save listings, message landlords, and get alerts for new homes."
            footer={
                <p>
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-brand font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            }>
            <RegisterForm />
        </AuthShell>
    )
}
