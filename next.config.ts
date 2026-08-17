import type { NextConfig } from "next";

import resources from "./appwrite/catalogue-resources.json";

function appwriteImagePattern(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim();
  if (!endpoint) return [];

  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" && url.protocol !== "http:") return [];

    const basePath = url.pathname.replace(/\/$/, "");
    return [
      {
        protocol: url.protocol.slice(0, -1) as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: `${basePath}/storage/buckets/${resources.imagesBucketId}/files/**`,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: appwriteImagePattern(),
  },
};

export default nextConfig;
