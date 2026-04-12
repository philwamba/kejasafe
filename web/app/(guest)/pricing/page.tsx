import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";

export const metadata: Metadata = {
  title: "Pricing | Kejasafe",
  description: "Illustrative pricing structure for listing plans and operational tooling.",
};

export default function PricingPage() {
  return (
    <PublicPageShell
      eyebrow="Pricing"
      title="Monetization-ready without overbuilding billing too early."
      description="The platform model already leaves room for subscriptions, featured listings, and invoices. This page establishes the public pricing route and presentation surface."
    >
      <ContentSection title="Illustrative plan tiers">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Starter", "For independent landlords onboarding a few verified listings."],
            ["Growth", "For agents and managers handling active portfolios and lead flow."],
            ["Enterprise", "For larger operational teams, custom processes, and reporting."],
          ].map(([name, copy]) => (
            <article key={name} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-orange-300">{name}</p>
              <p className="mt-4 text-sm leading-7 text-stone-300">{copy}</p>
            </article>
          ))}
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
