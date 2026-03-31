import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://kejasafe.co.ke";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/properties", "/search", "/blog", "/about", "/contact", "/faq"],
      disallow: ["/admin", "/dashboard", "/portal", "/api/internal"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
