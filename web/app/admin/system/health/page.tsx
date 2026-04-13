import { buildRequestContext } from '@/lib/core/auth/session'
import { listSystemHealth } from '@/lib/core/services/system-service'

export default async function AdminSystemHealthPage() {
    const health = await listSystemHealth(buildRequestContext())

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <section className="mb-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
                    Admin · System
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    Backend Comparison
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                    Compare live health status across both backend modes. This
                    surface will expand into queues, mail, storage, and sync
                    diagnostics later.
                </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
                {health.map(entry => (
                    <article
                        key={entry.mode}
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-stone-950 capitalize">
                                {entry.mode.replace('_', ' ')}
                            </h2>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    entry.isHealthy
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                {entry.isHealthy ? 'Healthy' : 'Unhealthy'}
                            </span>
                        </div>
                        <dl className="mt-5 grid gap-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-stone-500">Latency</dt>
                                <dd className="font-medium text-stone-900">
                                    {entry.latencyMs}ms
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-stone-500">Checked at</dt>
                                <dd className="font-medium text-stone-900">
                                    {entry.checkedAt}
                                </dd>
                            </div>
                        </dl>
                        {entry.details ? (
                            <pre className="mt-5 overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs text-stone-700">
                                {JSON.stringify(entry.details, null, 2)}
                            </pre>
                        ) : null}
                    </article>
                ))}
            </div>
        </main>
    )
}
