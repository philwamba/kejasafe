"use client";

import type { ReactNode } from "react";

import { Logo } from "@/components/site/Logo";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_22%),linear-gradient(180deg,_#06110d_0%,_#0f172a_58%,_#020617_100%)] px-6 py-16 text-stone-50">
      <section className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-between rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div>
            <Logo wordmarkClassName="text-orange-300" />
            <p className="mt-10 text-xs uppercase tracking-[0.28em] text-orange-200">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-stone-300">
              {description}
            </p>
          </div>
          <div className="grid gap-3 text-sm text-stone-300">
            <p>Cookie-based auth only.</p>
            <p>Provider-backed session flows.</p>
            <p>No backend-specific UI branching.</p>
          </div>
        </div>
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {children}
          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
