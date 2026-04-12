import { buildRequestContext } from "@/lib/core/auth/session";
import { listSystemHealth } from "@/lib/core/services/system-service";

export default async function AdminSystemHealthPage() {
  const health = await listSystemHealth(buildRequestContext());

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
          System health
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Backend comparison
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
          This page compares the live health status of both backend modes from the Next
          control layer. It is the operational surface that should expand into queues,
          mail, storage, and sync diagnostics later.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {health.map((entry) => (
            <article
              key={entry.mode}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">{entry.mode}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    entry.isHealthy
                      ? "bg-orange-400/15 text-orange-300"
                      : "bg-rose-400/15 text-rose-300"
                  }`}
                >
                  {entry.isHealthy ? "Healthy" : "Unhealthy"}
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-400">Latency</dt>
                  <dd className="text-white">{entry.latencyMs}ms</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-400">Checked at</dt>
                  <dd className="text-white">{entry.checkedAt}</dd>
                </div>
              </dl>
              {entry.details ? (
                <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-300">
                  {JSON.stringify(entry.details, null, 2)}
                </pre>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
