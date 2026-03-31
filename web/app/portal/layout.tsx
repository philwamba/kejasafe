import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getServerCurrentUser } from "@/lib/core/auth/server";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerCurrentUser();

  if (!user) {
    redirect("/login?next=/portal");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Landlord / Agent
            </p>
            <h1 className="text-lg font-semibold text-white">Portal</h1>
          </div>
          <div className="text-sm text-slate-300">
            {user.fullName} · {user.backendMode}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
