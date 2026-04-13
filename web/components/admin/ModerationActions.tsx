'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheck, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'

interface ModerationActionsProps {
    propertyId: string
}

export function ModerationActions({ propertyId }: ModerationActionsProps) {
    const router = useRouter()
    const [mode, setMode] = useState<'idle' | 'approving' | 'rejecting'>('idle')
    const [error, setError] = useState<string | null>(null)
    const [notes, setNotes] = useState('')
    const [reason, setReason] = useState('')

    async function approve() {
        setError(null)
        setMode('approving')
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
                    body: JSON.stringify({ notes: notes || undefined }),
                },
            )
            if (!response.ok) {
                const body = await response.json().catch(() => ({}))
                throw new Error(body?.message ?? 'Approval failed.')
            }
            router.push('/admin/properties/moderation')
            router.refresh()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Approval failed.')
            setMode('idle')
        }
    }

    async function reject() {
        setError(null)
        if (reason.trim().length < 10) {
            setError('Rejection reason must be at least 10 characters.')
            return
        }
        setMode('rejecting')
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
            router.push('/admin/properties/moderation')
            router.refresh()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Rejection failed.')
            setMode('idle')
        }
    }

    return (
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
                Moderation Actions
            </h2>

            <label className="mt-4 grid gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
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
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                    Rejection reason (shown to owner)
                </span>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={3}
                    className="focus:border-brand w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none"
                    placeholder="Explain why this is being rejected. Visible to the owner."
                />
            </label>

            {error ? (
                <p className="mt-3 text-sm text-red-600">{error}</p>
            ) : null}

            <div className="mt-4 grid gap-2">
                <Button
                    type="button"
                    size="lg"
                    disabled={mode !== 'idle'}
                    onClick={approve}
                    className="h-11 rounded-xl bg-green-600 hover:bg-green-700">
                    <FiCheck />
                    {mode === 'approving' ? 'Approving…' : 'Approve & publish'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={mode !== 'idle'}
                    onClick={reject}
                    className="h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <FiX />
                    {mode === 'rejecting' ? 'Rejecting…' : 'Reject'}
                </Button>
            </div>
        </section>
    )
}
