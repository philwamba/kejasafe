import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Logo } from "@/components/site/Logo";
import { getServerCurrentUser } from "@/lib/core/auth/server";
import { hasAnyPermission } from "@/lib/core/rbac/access";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerCurrentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (
    !hasAnyPermission(user.permissions, [
      "manage_users",
      "manage_settings",
      "view_audit_logs",
    ])
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo wordmarkClassName="text-orange-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                Admin Console
              </p>
              <h1 className="text-lg font-semibold text-white">Operations</h1>
            </div>
          </div>
          <div className="text-sm text-zinc-300">
            {user.fullName} · {user.backendMode}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
