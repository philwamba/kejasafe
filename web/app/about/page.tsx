import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";

export const metadata: Metadata = {
  title: "About | Kejasafe",
  description: "Why Kejasafe is being built as a secure, scalable property and tenant platform.",
};

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About Kejasafe"
      title="A housing platform designed like an actual product, not a listing dump."
      description="Kejasafe is being structured to support public discovery, landlord operations, tenant workflows, moderation, and long-term platform maintainability through a clean service and provider architecture."
    >
      <ContentSection
        title="Why the architecture matters"
        description="The frontend is intentionally backend-agnostic. That allows the platform to evolve operationally without rewriting the public experience."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-stone-300">
            Secure cookie-based authentication and server-side authorization.
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-stone-300">
            Provider-backed internal APIs for Prisma and Laravel compatibility.
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-stone-300">
            Public listing discovery, admin moderation, auditability, and future billing readiness.
          </div>
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
