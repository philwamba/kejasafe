'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'

interface ModerationActionsProps {
    propertyId: string
    propertyTitle: string
}

export function ModerationActions({
    propertyId,
    propertyTitle,
}: ModerationActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [confirm, setConfirm] = useState<'approve' | 'reject' | null>(null)
    const [notes, setNotes] = useState('')
    const [reason, setReason] = useState('')

    function runApprove() {
        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const response = await fetch(
                    `/api/internal/admin/properties/${propertyId}/approve`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken,
                        },
                        body: JSON.stringify({
                            notes: notes || undefined,
                        }),
                    },
                )
                if (!response.ok) {
                    const body = await response.json().catch(() => ({}))
                    throw new Error(body?.message ?? 'Approval failed.')
                }
                toast.success(`Approved "${propertyTitle}"`, {
                    description: 'The listing is now live on Kejasafe.',
                })
                setConfirm(null)
                router.push('/admin/properties/moderation')
                router.refresh()
            } catch (e) {
                toast.error(
                    e instanceof Error ? e.message : 'Approval failed.',
                )
            }
        })
    }

    function runReject() {
        if (reason.trim().length < 10) {
            toast.error('Rejection reason must be at least 10 characters.')
            return
        }
        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const response = await fetch(
                    `/api/internal/admin/properties/${propertyId}/reject`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken,
                        },
                        body: JSON.stringify({
                            reason,
                            notes: notes || undefined,
                        }),
                    },
                )
                if (!response.ok) {
                    const body = await response.json().catch(() => ({}))
                    throw new Error(body?.message ?? 'Rejection failed.')
                }
                toast.success(`Rejected "${propertyTitle}"`, {
                    description: 'The owner will be notified with your reason.',
                })
                setConfirm(null)
                router.push('/admin/properties/moderation')
                router.refresh()
            } catch (e) {
                toast.error(
                    e instanceof Error ? e.message : 'Rejection failed.',
                )
            }
        })
    }

    return (
        <>
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold tracking-[0.14em] text-stone-500 uppercase">
                    Moderation Actions
                </h2>

                <label className="mt-5 grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
                        Internal notes (optional)
                    </span>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        className="focus:border-brand w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none"
                        placeholder="Visible to other moderators, not the owner."
                    />
                </label>

                <label className="mt-4 grid gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
                        Rejection reason
                    </span>
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        rows={3}
                        className="focus:border-brand w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none"
                        placeholder="Required only for rejection. Min 10 characters. Visible to the owner."
                    />
                </label>

                <div className="mt-6 grid gap-2">
                    <Button
                        type="button"
                        size="lg"
                        disabled={isPending}
                        onClick={() => setConfirm('approve')}
                        className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700">
                        <FiCheck />
                        Approve & publish
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        disabled={isPending}
                        onClick={() => setConfirm('reject')}
                        className="h-11 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                        <FiX />
                        Reject
                    </Button>
                </div>
            </section>

            <ConfirmDialog
                open={confirm === 'approve'}
                onOpenChange={open => !open && setConfirm(null)}
                title="Approve and publish this listing?"
                description="The listing will go live on Kejasafe immediately and become visible to all tenants. This action is logged to the audit trail."
                tone="brand"
                confirmLabel="Approve & publish"
                loading={isPending}
                onConfirm={runApprove}
            />

            <ConfirmDialog
                open={confirm === 'reject'}
                onOpenChange={open => !open && setConfirm(null)}
                title="Reject this listing?"
                description="The owner will see your rejection reason and can edit and resubmit. Make sure the reason is clear and actionable."
                tone="danger"
                confirmLabel="Reject listing"
                loading={isPending}
                onConfirm={runReject}>
                {reason.trim().length < 10 ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                        Enter a rejection reason of at least 10 characters in
                        the form before confirming.
                    </p>
                ) : (
                    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs">
                        <p className="font-semibold text-stone-500 uppercase">
                            Reason owner will see
                        </p>
                        <p className="mt-1 text-stone-900">{reason}</p>
                    </div>
                )}
            </ConfirmDialog>
        </>
    )
}
