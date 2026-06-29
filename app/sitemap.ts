import type { MetadataRoute } from "next";

import { getActiveProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/seo";

const staticRoutes = [
  "",
  "/products",
  "/contact",
  "/support",
  "/terms",
  "/privacy-policy",
  "/refund-policy",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const routes = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }));

  const productRoutes = getActiveProducts().map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: now,
  }));

  return [...routes, ...productRoutes];
}
