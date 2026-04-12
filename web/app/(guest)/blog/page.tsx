import type { Metadata } from "next";
import Link from "next/link";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";
import { blogPosts } from "@/modules/cms/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Rental guides, housing market updates, and advice for Kenyan tenants and landlords.",
};

export default function BlogPage() {
  return (
    <PublicPageShell
      eyebrow="Blog"
      title="Market notes, operational guidance, and housing intelligence."
      description="Guides, market updates, and housing operations content from the Kejasafe team."
    >
      <ContentSection title="Latest posts">
        <div className="grid gap-4 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-brand hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-brand">
                {post.category}
              </p>
              <h2 className="mt-4 text-xl font-semibold text-stone-950">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-500">
                {post.publishedAt} • {post.readingTime}
              </p>
            </Link>
          ))}
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
