'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

import {
    fetchCsrfToken,
    fetchSessions,
    logoutAllSessions,
    revokeSession,
} from '@/lib/core/sdk/auth-client'
import type { SessionSummaryDto } from '@/lib/shared/types/auth'

export function SessionList() {
    const router = useRouter()
    const [sessions, setSessions] = useState<SessionSummaryDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let active = true

        async function load() {
            try {
                const result = await fetchSessions()
                if (active) {
                    setSessions(result)
                }
            } catch (loadError) {
                if (active) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Unable to load sessions.',
                    )
                }
            } finally {
                if (active) {
                    setIsLoading(false)
                }
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [])

    const handleRevoke = (sessionId: string) => {
        setError(null)

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                await revokeSession(sessionId, csrfToken)
                setSessions(current =>
                    current.filter(session => session.id !== sessionId),
                )
            } catch (revokeError) {
                setError(
                    revokeError instanceof Error
                        ? revokeError.message
                        : 'Unable to revoke session.',
                )
            }
        })
    }

    const handleLogoutAll = () => {
        setError(null)

        startTransition(async () => {
            try {
                const csrfToken = await fetchCsrfToken()
                await logoutAllSessions(csrfToken)
                setSessions([])
                router.push('/login')
                router.refresh()
            } catch (logoutError) {
                setError(
                    logoutError instanceof Error
                        ? logoutError.message
                        : 'Unable to sign out all sessions.',
                )
            }
        })
    }

    if (isLoading) {
        return (
            <p className="text-sm text-stone-300">Loading active sessions...</p>
        )
    }

    return (
        <div className="grid gap-4">
            <div className="flex justify-end">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={handleLogoutAll}
                    className="h-11 rounded-2xl border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60">
                    Sign out all sessions
                </button>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {sessions.map(session => (
                <div
                    key={session.id}
                    className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                            {session.isCurrent
                                ? 'Current session'
                                : 'Active session'}
                        </p>
                        <p className="text-sm text-stone-300">
                            {session.userAgent ?? 'Unknown device'}
                        </p>
                        <p className="text-xs tracking-[0.18em] text-stone-400 uppercase">
                            {session.ipAddress ?? 'Unknown IP'} • last seen{' '}
                            {session.lastSeenAt
                                ? formatDistanceToNow(
                                      new Date(session.lastSeenAt),
                                      { addSuffix: true },
                                  )
                                : 'recently'}
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleRevoke(session.id)}
                        className="h-11 rounded-2xl border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60">
                        {session.isCurrent
                            ? 'Sign out this session'
                            : 'Revoke session'}
                    </button>
                </div>
            ))}
        </div>
    )
}
