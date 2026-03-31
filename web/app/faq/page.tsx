import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";
import { faqItems } from "@/modules/cms/content";

export const metadata: Metadata = {
  title: "FAQ | Kejasafe",
  description: "Frequently asked questions about the Kejasafe platform.",
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
            <article key={item.question} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{item.answer}</p>
            </article>
          ))}
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
