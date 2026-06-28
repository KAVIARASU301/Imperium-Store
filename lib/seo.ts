const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production metadata.");
  }

  const siteUrl = raw || LOCAL_SITE_URL;
  return siteUrl.replace(/\/+$/, "");
}

export function truncateDescription(text: string, maxLength = 160) {
  const clean = text.trim();
  if (clean.length <= maxLength) return clean;

  const truncated = clean.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const safeCut = lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated;
  return `${safeCut.trimEnd()}…`;
}
