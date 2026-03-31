import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";

export const metadata: Metadata = {
  title: "Contact | Kejasafe",
  description: "Contact Kejasafe for platform partnerships, landlord onboarding, or operational support.",
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
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Email</p>
            <p className="mt-3 text-lg font-medium text-white">hello@kejasafe.co.ke</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Support</p>
            <p className="mt-3 text-lg font-medium text-white">support@kejasafe.co.ke</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Location</p>
            <p className="mt-3 text-lg font-medium text-white">Nairobi, Kenya</p>
          </div>
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
