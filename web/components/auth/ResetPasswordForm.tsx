'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { resetPasswordSchema } from '@/lib/core/auth/schemas'
import { fetchCsrfToken, resetPassword } from '@/lib/core/sdk/auth-client'

type ResetPasswordValues = {
    email: string
    token: string
    password: string
    passwordConfirmation: string
}

interface ResetPasswordFormProps {
    defaultEmail?: string
    defaultToken?: string
}

const inputClass =
    'h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400'
const labelClass = 'text-sm font-medium text-stone-900'
const errorClass = 'text-sm text-red-600'

export function ResetPasswordForm({
    defaultEmail = '',
    defaultToken = '',
}: ResetPasswordFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: defaultEmail,
            token: defaultToken,
            password: '',
            passwordConfirmation: '',
        },
    })

    const onSubmit = form.handleSubmit(values => {
        setMessage(null)
        setServerError(null)

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const result = await resetPassword(values, csrfToken)
                setMessage(result.message)
                setTimeout(() => {
                    router.push('/login')
                }, 900)
            } catch (error) {
                setServerError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to reset password.',
                )
            }
        })
    })

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-2">
                <label className={labelClass} htmlFor="email">
                    Email address <span className="text-red-600">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...form.register('email')}
                    className={inputClass}
                />
            </div>
            <div className="grid gap-2">
                <label className={labelClass} htmlFor="token">
                    Reset token <span className="text-red-600">*</span>
                </label>
                <input
                    id="token"
                    {...form.register('token')}
                    className={inputClass}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <label className={labelClass} htmlFor="password">
                        New password <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        {...form.register('password')}
                        className={inputClass}
                    />
                    {form.formState.errors.password ? (
                        <p className={errorClass}>
                            {form.formState.errors.password.message}
                        </p>
                    ) : null}
                </div>
                <div className="grid gap-2">
                    <label
                        className={labelClass}
                        htmlFor="passwordConfirmation">
                        Confirm password <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="passwordConfirmation"
                        type="password"
                        autoComplete="new-password"
                        {...form.register('passwordConfirmation')}
                        className={inputClass}
                    />
                    {form.formState.errors.passwordConfirmation ? (
                        <p className={errorClass}>
                            {form.formState.errors.passwordConfirmation.message}
                        </p>
                    ) : null}
                </div>
            </div>

            {message ? (
                <p className="text-sm text-green-700">{message}</p>
            ) : null}
            {serverError ? <p className={errorClass}>{serverError}</p> : null}

            <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="h-12 rounded-xl">
                {isPending ? 'Resetting...' : 'Reset password'}
            </Button>
        </form>
    )
}
