import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";
import { faqItems } from "@/modules/cms/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about renting, listing, and verification on Kejasafe.",
};

export default function FaqPage() {
  return (
    <PublicPageShell
      eyebrow="FAQ"
      title="Questions the platform should answer clearly."
      description="This FAQ surface is static for now, but the route structure and content shape are ready for CMS management and schema markup expansion."
    >
      <ContentSection title="Frequently asked questions">
        <div className="grid gap-4">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-2xl border border-stone-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-stone-950">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
