import type { MetadataRoute } from "next";

import { blogPosts, legalPages } from "@/modules/cms/content";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://kejasafe.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/pricing",
    "/properties",
    "/search",
    "/blog",
  ].map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: new Date(),
  }));

  const legalRoutes = Object.keys(legalPages).map((slug) => ({
    url: `${appUrl}/legal/${slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${appUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticRoutes, ...legalRoutes, ...blogRoutes];
}
