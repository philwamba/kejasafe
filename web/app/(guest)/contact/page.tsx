import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Kejasafe team for support, partnerships, or landlord onboarding.",
};

export default function ContactPage() {
  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Talk to the team behind the platform."
      description="This page is ready to be replaced by CMS-managed content and a real contact workflow. For now it establishes the route, metadata, and public information architecture."
    >
      <ContentSection title="Contact channels">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Email</p>
            <p className="mt-3 text-lg font-medium text-stone-950">hello@kejasafe.co.ke</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Support</p>
            <p className="mt-3 text-lg font-medium text-stone-950">support@kejasafe.co.ke</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Location</p>
            <p className="mt-3 text-lg font-medium text-stone-950">Nairobi, Kenya</p>
          </div>
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
