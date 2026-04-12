import type { Metadata } from "next";
import Link from "next/link";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";
import { blogPosts } from "@/modules/cms/content";

export const metadata: Metadata = {
  title: "Insights | Kejasafe",
  description: "Guides and market insights for tenants, landlords, and property operators.",
};

export default function BlogPage() {
  return (
    <PublicPageShell
      eyebrow="Insights"
      title="Market notes, operational guidance, and housing intelligence."
      description="The blog route structure is now in place for SEO and CMS evolution. Content is static for now, but the path and metadata model are production-ready."
    >
      <ContentSection title="Latest posts">
        <div className="grid gap-4 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-orange-300">
                {post.category}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{post.excerpt}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400">
                {post.publishedAt} • {post.readingTime}
              </p>
            </Link>
          ))}
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
