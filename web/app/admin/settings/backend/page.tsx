import { BackendSwitchCard } from '@/components/admin/BackendSwitchCard'
import {
    getConfiguredBackendSetting,
    listSystemHealth,
} from '@/lib/core/services/system-service'
import { buildRequestContext } from '@/lib/core/auth/session'

export default async function AdminBackendSettingsPage() {
    const [setting, health] = await Promise.all([
        getConfiguredBackendSetting(),
        listSystemHealth(buildRequestContext()),
    ])

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin · Backend
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Backend Settings
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Switch the active backend between Prisma and Laravel and
                    monitor connectivity.
                </p>
            </div>
            <div className="grid gap-6">
                <BackendSwitchCard setting={setting} />
                <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
                        Connectivity Summary
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {health.map(entry => (
                            <article
                                key={entry.mode}
                                className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-stone-950 capitalize">
                                        {entry.mode.replace('_', ' ')}
                                    </h2>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            entry.isHealthy
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {entry.isHealthy
                                            ? 'Healthy'
                                            : 'Unhealthy'}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-stone-600">
                                    Latency: {entry.latencyMs}ms
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
