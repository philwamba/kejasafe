import type { Metadata } from "next";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county } = await params;

  return {
    title: `${county} listings | Kejasafe`,
    description: `Explore property listings, rental demand, and neighborhood positioning for ${county}.`,
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county } = await params;

  return (
    <PublicPageShell
      eyebrow="Location"
      title={`Property discovery for ${county}`}
      description="Location landing pages are important for SEO, navigation, and future editorial content. This route is ready to evolve into CMS-backed market pages."
    >
      <ContentSection title={`Why ${county} matters`}>
        <p className="text-sm leading-7 text-stone-300">
          This county page is the correct foundation for search-focused location content, neighborhood breakdowns, internal linking, and future listing clusters.
        </p>
      </ContentSection>
    </PublicPageShell>
  );
}
