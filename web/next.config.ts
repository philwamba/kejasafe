import type { NextConfig } from "next";

function toRemotePattern(url: string | undefined) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: `${parsed.pathname.replace(/\/$/, "") || ""}/**`,
    };
  } catch {
    return null;
  }
}

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
const publicBucketPattern = toRemotePattern(process.env.S3_PUBLIC_BASE_URL);

if (publicBucketPattern) {
  remotePatterns.push(publicBucketPattern);
}

remotePatterns.push({
  protocol: "https",
  hostname: "i.roamcdn.net",
  pathname: "/**",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
