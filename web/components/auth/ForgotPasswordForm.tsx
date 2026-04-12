'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { forgotPasswordSchema } from '@/lib/core/auth/schemas'
import {
    fetchCsrfToken,
    requestPasswordResetToken,
} from '@/lib/core/sdk/auth-client'

type ForgotPasswordValues = {
    email: string
}

const inputClass =
    'h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400'

export function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    })

    const onSubmit = form.handleSubmit(values => {
        setMessage(null)
        setServerError(null)

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const result = await requestPasswordResetToken(
                    values,
                    csrfToken,
                )
                setMessage(result.message)
            } catch (error) {
                setServerError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to request password reset.',
                )
            }
        })
    })

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-2">
                <label
                    className="text-sm font-medium text-stone-900"
                    htmlFor="email">
                    Email Address <span className="text-red-600">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...form.register('email')}
                    className={inputClass}
                    placeholder="you@example.com"
                />
                {form.formState.errors.email ? (
                    <p className="text-sm text-red-600">
                        {form.formState.errors.email.message}
                    </p>
                ) : null}
            </div>

            {message ? (
                <p className="text-sm text-green-700">{message}</p>
            ) : null}
            {serverError ? (
                <p className="text-sm text-red-600">{serverError}</p>
            ) : null}

            <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="h-12 rounded-xl">
                {isPending ? 'Submitting...' : 'Send reset instructions'}
            </Button>
        </form>
    )
}
