import "server-only";

export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      return new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    } catch {
      // Try the next deployment URL before falling back to local development.
    }
  }

  return new URL("http://localhost:3000");
}
