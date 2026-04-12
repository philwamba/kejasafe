import Link from "next/link";
import { FiArrowRight, FiMapPin, FiShield, FiTrendingUp } from "react-icons/fi";

import { PublicFooter } from "@/components/site/PublicFooter";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PropertySearchBar } from "@/components/properties/PropertySearchBar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_26%),linear-gradient(180deg,_#06110d_0%,_#0f172a_58%,_#020617_100%)] px-6 py-8 text-stone-50">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PublicHeader />

        <section className="grid gap-8 rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-8">
            <span className="inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-orange-200">
              Dual-backend property platform
            </span>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Verified rentals, sale listings, and tenant intelligence for Kenya.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-stone-300">
                Kejasafe is being built as a serious property operating system. The
                public experience already resolves listings through a provider layer
                that can run against Prisma or Laravel without UI duplication.
              </p>
            </div>
            <PropertySearchBar />
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-2xl px-5">
                <Link href="/properties">
                  Browse listings
                  <FiArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-2xl border-white/15 bg-white/5 px-5 text-white hover:bg-white/10">
                <Link href="/admin">Open admin shell</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-orange-300/20 via-white/10 to-white/5 p-6">
              <FiMapPin className="size-6 text-orange-300" />
              <h2 className="mt-6 text-2xl font-semibold text-white">
                Location-first discovery
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Search by county, neighborhood, pricing range, property type, and
                occupancy needs using URL-safe filters.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <FiShield className="size-6 text-orange-300" />
              <h2 className="mt-6 text-2xl font-semibold text-white">
                Provider-safe architecture
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Public pages consume normalized DTOs and internal APIs instead of
                leaking Prisma or Laravel assumptions into components.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <FiTrendingUp className="size-6 text-orange-300" />
              <h2 className="mt-6 text-2xl font-semibold text-white">
                Production-grade growth path
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                The next phases expand this foundation into full marketplace,
                landlord, tenant, and moderation workflows.
              </p>
            </div>
          </div>
        </section>
        <section className="grid gap-4 lg:grid-cols-3">
          <Link href="/about" className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/8">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-300">About</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">How the platform is being built</h2>
          </Link>
          <Link href="/blog" className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/8">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-300">Insights</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Guides, market notes, and housing operations content</h2>
          </Link>
          <Link href="/contact" className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/8">
            <p className="text-xs uppercase tracking-[0.22em] text-orange-300">Contact</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Talk to the team or prepare for onboarding</h2>
          </Link>
        </section>
        <PublicFooter />
      </section>
    </main>
  );
}
