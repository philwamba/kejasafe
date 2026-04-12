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
            <div className="grid gap-6">
                <BackendSwitchCard setting={setting} />
                <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
                    <p className="text-xs tracking-[0.24em] text-zinc-400 uppercase">
                        Connectivity summary
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {health.map(entry => (
                            <article
                                key={entry.mode}
                                className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-white">
                                        {entry.mode}
                                    </h2>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            entry.isHealthy
                                                ? 'bg-orange-400/15 text-orange-300'
                                                : 'bg-rose-400/15 text-rose-300'
                                        }`}>
                                        {entry.isHealthy
                                            ? 'Healthy'
                                            : 'Unhealthy'}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-zinc-300">
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
