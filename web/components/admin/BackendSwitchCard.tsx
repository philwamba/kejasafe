'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { fetchCsrfToken } from '@/lib/core/sdk/auth-client'
import { internalApiClient } from '@/lib/core/http/axios'
import type { BackendSettingDto } from '@/lib/core/contracts/system'
import type { BackendMode } from '@/lib/core/contracts/common'
import type { ApiDataEnvelope } from '@/lib/shared/types/api'

interface BackendSwitchCardProps {
    setting: BackendSettingDto | null
}

export function BackendSwitchCard({ setting }: BackendSwitchCardProps) {
    const router = useRouter()
    const [activeMode, setActiveMode] = useState<BackendMode>(
        setting?.activeMode ?? 'prisma_neon',
    )
    const [fallbackMode, setFallbackMode] = useState<BackendMode | ''>(
        setting?.fallbackMode ?? '',
    )
    const [switchNotes, setSwitchNotes] = useState(setting?.switchNotes ?? '')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const submit = () => {
        setMessage(null)
        setError(null)

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                const response = await internalApiClient.put<
                    ApiDataEnvelope<BackendSettingDto>
                >(
                    '/admin/backend-settings',
                    {
                        activeMode,
                        fallbackMode: fallbackMode || null,
                        switchNotes: switchNotes || null,
                    },
                    {
                        headers: {
                            'X-CSRF-Token': csrfToken,
                        },
                    },
                )
                setMessage(
                    `Active backend switched to ${response.data.data.activeMode}.`,
                )
                router.refresh()
            } catch (switchError) {
                setError(
                    switchError instanceof Error
                        ? switchError.message
                        : 'Unable to switch backend.',
                )
            }
        })
    }

    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs tracking-[0.24em] text-amber-300 uppercase">
                Backend switch
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
                Control the active platform backend
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
                Switching is persisted in the control-plane settings table and
                audited in Prisma. New internal requests without an explicit
                backend cookie now resolve against that persisted setting.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-white">
                        Active backend
                    </span>
                    <select
                        value={activeMode}
                        onChange={event =>
                            setActiveMode(event.target.value as BackendMode)
                        }
                        className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none">
                        <option value="prisma_neon">Prisma + Neon</option>
                        <option value="laravel_api">Laravel API</option>
                    </select>
                </label>
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-white">
                        Fallback backend
                    </span>
                    <select
                        value={fallbackMode}
                        onChange={event =>
                            setFallbackMode(
                                event.target.value as BackendMode | '',
                            )
                        }
                        className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none">
                        <option value="">No fallback</option>
                        <option value="prisma_neon">Prisma + Neon</option>
                        <option value="laravel_api">Laravel API</option>
                    </select>
                </label>
            </div>

            <label className="mt-5 grid gap-2">
                <span className="text-sm font-medium text-white">
                    Switch notes
                </span>
                <textarea
                    value={switchNotes}
                    onChange={event => setSwitchNotes(event.target.value)}
                    className="min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                    placeholder="Why are you switching the active backend?"
                />
            </label>

            {message ? (
                <p className="mt-4 text-sm text-orange-300">{message}</p>
            ) : null}
            {error ? (
                <p className="mt-4 text-sm text-rose-300">{error}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={submit}
                    disabled={isPending}
                    className="h-12 rounded-2xl bg-amber-300 px-5 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:opacity-60">
                    {isPending ? 'Switching...' : 'Apply backend switch'}
                </button>
                <p className="text-sm text-zinc-400">
                    Current version: {setting?.version ?? 0}
                </p>
            </div>
        </section>
    )
}
