'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheck, FiPause, FiUserMinus, FiUserPlus } from 'react-icons/fi'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'

type UserStatus = 'active' | 'invited' | 'suspended' | 'deactivated'

interface Role {
    id: string
    name: string
    description?: string | null
}

interface UserDetailActionsProps {
    userId: string
    currentStatus: string
    currentRoles: string[]
    availableRoles: Role[]
    disabled?: boolean
}

export function UserDetailActions({
    userId,
    currentStatus,
    currentRoles,
    availableRoles,
    disabled = false,
}: UserDetailActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedRoles, setSelectedRoles] =
        useState<Set<string>>(new Set(currentRoles))
    const [confirmAction, setConfirmAction] = useState<
        'suspend' | 'activate' | 'deactivate' | null
    >(null)

    const hasRoleChanges = (() => {
        if (selectedRoles.size !== currentRoles.length) return true
        for (const r of currentRoles) if (!selectedRoles.has(r)) return true
        return false
    })()

    async function patch(body: Record<string, unknown>, message: string) {
        const csrfToken = await fetchCsrfToken()
        const response = await fetch(`/api/internal/admin/users/${userId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}))
            throw new Error(errorBody?.message ?? 'Action failed.')
        }
        toast.success(message)
        router.refresh()
    }

    function runStatusChange(
        status: 'active' | 'suspended' | 'deactivated',
        successMessage: string,
    ) {
        startTransition(async () => {
            try {
                await patch({ status }, successMessage)
                setConfirmAction(null)
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Action failed.',
                )
            }
        })
    }

    function runRolesUpdate() {
        startTransition(async () => {
            try {
                await patch(
                    { roles: [...selectedRoles] },
                    'Roles updated successfully.',
                )
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Action failed.',
                )
            }
        })
    }

    function toggleRole(name: string) {
        setSelectedRoles(prev => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="text-sm font-semibold tracking-[0.14em] text-stone-500 uppercase">
                    Account Status
                </h2>

                {disabled ? (
                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                        You can&apos;t change your own account from the admin
                        panel.
                    </p>
                ) : (
                    <div className="mt-5 grid gap-2">
                        {currentStatus !== 'active' ? (
                            <Button
                                type="button"
                                size="lg"
                                className="h-11 justify-start rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                disabled={isPending}
                                onClick={() => setConfirmAction('activate')}>
                                <FiUserPlus />
                                Activate account
                            </Button>
                        ) : null}
                        {currentStatus !== 'suspended' ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="h-11 justify-start rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                disabled={isPending}
                                onClick={() => setConfirmAction('suspend')}>
                                <FiPause />
                                Suspend account
                            </Button>
                        ) : null}
                        {currentStatus !== 'deactivated' ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="h-11 justify-start rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                disabled={isPending}
                                onClick={() => setConfirmAction('deactivate')}>
                                <FiUserMinus />
                                Deactivate account
                            </Button>
                        ) : null}
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="text-sm font-semibold tracking-[0.14em] text-stone-500 uppercase">
                    Roles And Permissions
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                    Changes apply after you click &ldquo;Save roles&rdquo;.
                </p>

                <ul className="mt-5 grid gap-2">
                    {availableRoles.map(role => (
                        <li
                            key={role.id}
                            className="flex items-start gap-3 rounded-xl border border-stone-200 p-3">
                            <Checkbox
                                checked={selectedRoles.has(role.name)}
                                disabled={disabled || isPending}
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
                        </li>
                    ))}
                </ul>

                <div className="mt-5 flex items-center justify-end">
                    <Button
                        type="button"
                        size="lg"
                        disabled={disabled || !hasRoleChanges || isPending}
                        onClick={runRolesUpdate}
                        className="h-10 rounded-xl">
                        <FiCheck />
                        Save roles
                    </Button>
                </div>
            </section>

            <ConfirmDialog
                open={confirmAction === 'suspend'}
                onOpenChange={open => !open && setConfirmAction(null)}
                title="Suspend this account?"
                description="The user will be unable to sign in until you reactivate them. Their existing listings and data will be preserved."
                tone="brand"
                confirmLabel="Suspend account"
                loading={isPending}
                onConfirm={() =>
                    runStatusChange('suspended', 'Account suspended.')
                }
            />

            <ConfirmDialog
                open={confirmAction === 'activate'}
                onOpenChange={open => !open && setConfirmAction(null)}
                title="Activate this account?"
                description="The user will regain full access to Kejasafe."
                tone="brand"
                confirmLabel="Activate account"
                loading={isPending}
                onConfirm={() =>
                    runStatusChange('active', 'Account activated.')
                }
            />

            <ConfirmDialog
                open={confirmAction === 'deactivate'}
                onOpenChange={open => !open && setConfirmAction(null)}
                title="Deactivate this account?"
                description="This is a soft delete. The user will be unable to sign in, and their listings will be hidden from public view. This action is reversible."
                tone="danger"
                confirmLabel="Deactivate account"
                loading={isPending}
                onConfirm={() =>
                    runStatusChange('deactivated', 'Account deactivated.')
                }
            />
        </div>
    )
}
