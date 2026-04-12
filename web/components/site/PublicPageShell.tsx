import type { ReactNode } from "react";

import { PublicFooter } from "@/components/site/PublicFooter";
import { PublicHeader } from "@/components/site/PublicHeader";

interface PublicPageShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
}: PublicPageShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_24%),linear-gradient(180deg,_#06110d_0%,_#0f172a_42%,_#020617_100%)] px-6 py-8 text-stone-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PublicHeader />
        <section className="rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:p-10">
          {eyebrow ? (
            <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-orange-200">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
            {description}
          </p>
        </section>
        {children}
        <PublicFooter />
      </div>
    </main>
  );
}
