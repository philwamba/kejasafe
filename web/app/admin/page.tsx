import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Protected admin shell</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
            The admin route group is protected by both middleware and server-side
            permission checks. The backend control surfaces are now available
            below.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/settings/backend"
            className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
              Backend settings
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Switch active backend
            </h3>
          </Link>
          <Link
            href="/admin/system/health"
            className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-orange-300">
              System health
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Compare backend health
            </h3>
          </Link>
        </div>
      </div>
    </main>
  );
}
