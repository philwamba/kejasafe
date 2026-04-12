import Link from "next/link";

import { SessionList } from "@/components/auth/SessionList";

export default function DashboardSecurityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-orange-300">
            Account security
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Manage active sessions</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
            This page consumes the existing internal session endpoints and gives the user a real security surface instead of leaving session controls API-only.
          </p>
          <div className="mt-6">
            <SessionList />
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-semibold text-white">Verification and alerts</h3>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            Email verification, login alerts, and broader account hardening flows are staged next on top of the route and session structures already in place.
          </p>
          <div className="mt-4">
            <Link href="/verify-email" className="text-sm text-orange-300">
              View verification route
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
