import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentSection } from "@/components/cms/ContentSection";
import { PublicPageShell } from "@/components/site/PublicPageShell";
import { blogPosts, getBlogPost } from "@/modules/cms/content";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Kejasafe`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicPageShell
      eyebrow={post.category}
      title={post.title}
      description={post.excerpt}
    >
      <ContentSection title="Article body">
        <div className="grid gap-4 text-sm leading-8 text-stone-300">
          <p>
            This article route is intentionally production-shaped even though the body is static today.
            It supports future author data, scheduling, SEO fields, related content, and FAQ/article schema.
          </p>
          <p>
            In later sprints, this surface should be backed by the CMS and blog domain so content managers can publish and revise insights without changing application code.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
            Published {post.publishedAt} • {post.readingTime}
          </p>
        </div>
      </ContentSection>
    </PublicPageShell>
  );
}
