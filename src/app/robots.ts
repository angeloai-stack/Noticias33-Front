// ============================================================================
// robots.txt (/robots.txt). Permite rastrear todo el sitio público y bloquea
// las herramientas internas y las API. Además apunta al sitemap.
// ============================================================================

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/publicar", "/admin", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
