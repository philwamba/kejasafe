import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Logo } from "@/components/site/Logo";
import { getServerCurrentUser } from "@/lib/core/auth/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50">
      <header className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo wordmarkClassName="text-orange-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Tenant Workspace
              </p>
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
          </div>
          <div className="text-sm text-stone-300">
            {user.fullName} · {user.backendMode}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
