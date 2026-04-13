'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FiCheckCircle, FiCopy } from 'react-icons/fi'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'

interface Role {
    id: string
    name: string
    description: string | null
}

interface InviteUserFormProps {
    roles: Role[]
}

interface FormValues {
    fullName: string
    email: string
    phone: string
}

const inputClass =
    'h-11 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-brand placeholder:text-stone-400'
const labelClass = 'text-sm font-medium text-stone-900'

export function InviteUserForm({ roles }: InviteUserFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(
        new Set(['tenant']),
    )
    const [invitedUser, setInvitedUser] = useState<{
        fullName: string
        email: string
        tempPassword: string
    } | null>(null)

    const form = useForm<FormValues>({
        defaultValues: { fullName: '', email: '', phone: '' },
    })

    function toggleRole(name: string) {
        setSelectedRoles(prev => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    const onSubmit = form.handleSubmit(values => {
        if (selectedRoles.size === 0) {
            toast.error('Select at least one role for the new user.')
            return
        }

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const response = await fetch('/api/internal/admin/users', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify({
                        fullName: values.fullName,
                        email: values.email,
                        phone: values.phone,
                        roles: [...selectedRoles],
                    }),
                })

                const body = await response.json().catch(() => ({}))
                if (!response.ok) {
                    throw new Error(
                        body?.message ?? 'Unable to invite this user.',
                    )
                }

                setInvitedUser({
                    fullName: body.data.user.fullName,
                    email: body.data.user.email,
                    tempPassword: body.data.temporaryPassword,
                })
                toast.success(`Invited ${values.fullName}`)
                form.reset()
                setSelectedRoles(new Set(['tenant']))
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Unable to invite user.',
                )
            }
        })
    })

    async function copyPassword() {
        if (!invitedUser) return
        try {
            await navigator.clipboard.writeText(invitedUser.tempPassword)
            toast.success('Temporary password copied to clipboard.')
        } catch {
            toast.error('Could not copy password.')
        }
    }

    if (invitedUser) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-start gap-3">
                    <FiCheckCircle className="mt-0.5 size-5 text-emerald-600" />
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-emerald-900">
                            Invited {invitedUser.fullName}
                        </h2>
                        <p className="mt-1 text-sm text-emerald-800">
                            Share this temporary password with them — they
                            should change it after signing in. This is the
                            only time you&apos;ll see it.
                        </p>
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white p-3">
                            <code className="flex-1 font-mono text-sm text-stone-900">
                                {invitedUser.tempPassword}
                            </code>
                            <Button
                                type="button"
                                size="lg"
                                variant="outline"
                                className="h-9 rounded-lg"
                                onClick={copyPassword}>
                                <FiCopy />
                                Copy
                            </Button>
                        </div>
                        <div className="mt-5 flex items-center gap-2">
                            <Button
                                type="button"
                                size="lg"
                                className="h-10 rounded-xl"
                                onClick={() => setInvitedUser(null)}>
                                Invite another user
                            </Button>
                            <Button
                                type="button"
                                size="lg"
                                variant="outline"
                                className="h-10 rounded-xl"
                                onClick={() => router.push('/admin/users')}>
                                Back to users
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid gap-6 rounded-2xl border border-stone-200 bg-white p-6">
            <div className="grid gap-2">
                <label className={labelClass} htmlFor="fullName">
                    Full name <span className="text-red-600">*</span>
                </label>
                <input
                    id="fullName"
                    autoCapitalize="words"
                    {...form.register('fullName', {
                        required: true,
                        minLength: 3,
                    })}
                    className={`${inputClass} capitalize placeholder:normal-case`}
                    placeholder="Jane Doe"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <label className={labelClass} htmlFor="email">
                        Email <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...form.register('email', { required: true })}
                        className={inputClass}
                        placeholder="jane@example.com"
                    />
                </div>
                <div className="grid gap-2">
                    <label className={labelClass} htmlFor="phone">
                        Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        {...form.register('phone', { required: true })}
                        className={inputClass}
                        placeholder="+254 700 000 000"
                    />
                </div>
            </div>

            <div>
                <p className={labelClass}>
                    Roles <span className="text-red-600">*</span>
                </p>
                <p className="mt-1 text-xs text-stone-500">
                    Choose at least one role. You can edit these later from
                    the user detail page.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {roles.map(role => (
                        <li key={role.id}>
                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 p-3 transition hover:border-brand">
                                <Checkbox
                                    checked={selectedRoles.has(role.name)}
                                    onCheckedChange={() => toggleRole(role.name)}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-stone-950 capitalize">
                                        {role.name.replace('_', ' ')}
                                    </p>
                                    {role.description ? (
                                        <p className="mt-0.5 text-xs text-stone-500">
                                            {role.description}
                                        </p>
                                    ) : null}
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center justify-end gap-3">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="h-11 rounded-xl px-6">
                    {isPending ? 'Inviting…' : 'Send invitation'}
                </Button>
            </div>
        </form>
    )
}
