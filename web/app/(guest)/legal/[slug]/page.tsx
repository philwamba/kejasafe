import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";
import { getLegalPage, legalPages } from "@/modules/cms/content";

export async function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | Kejasafe`,
    description: page.description,
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <PublicPageShell
      eyebrow="Legal"
      title={page.title}
      description={page.description}
    >
      <div className="grid gap-6">
        {page.sections.map((section) => (
          <ContentSection key={section.heading} title={section.heading}>
            <div className="grid gap-4">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-stone-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </ContentSection>
        ))}
      </div>
    </PublicPageShell>
  );
}
