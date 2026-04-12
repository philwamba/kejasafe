import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Landlord and agent pricing plans for listing homes on Kejasafe.",
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
            <article key={name} className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-brand">{name}</p>
              <p className="mt-4 text-sm leading-7 text-stone-600">{copy}</p>
            </article>
          ))}
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
