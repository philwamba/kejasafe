export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Protected dashboard shell</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
            Middleware and server-side auth guards are active for the dashboard
            route group. The next implementation step is wiring real tenant modules
            to the authenticated service layer.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-semibold text-white">Account tools</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Session management is now available in the dashboard security area.
          </p>
          <a
            href="/dashboard/settings/security"
            className="mt-4 inline-flex text-sm font-medium text-orange-300"
          >
            Open security settings
          </a>
        </div>
      </div>
    </main>
  );
}
