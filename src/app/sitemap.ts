// ============================================================================
// Sitemap dinámico (/sitemap.xml). Incluye la portada, todas las categorías
// y las últimas noticias con su fecha real de modificación, para que los
// buscadores indexen el contenido nuevo rápidamente. Se regenera cada hora.
// Las rutas internas (/publicar, /admin, /api) quedan fuera a propósito.
// ============================================================================

import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api/client";
import { getCategories } from "@/lib/api/news";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

/** Versión mínima del post: solo lo que el sitemap necesita. */
type SitemapPost = {
  slug: string;
  modified_gmt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  // Categorías (si la API falla, el sitemap sale al menos con la portada)
  try {
    const categories = await getCategories();
    entries.push(
      ...categories.map((category) => ({
        url: `${base}/categoria/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.8,
      })),
    );
  } catch {
    // Sin categorías; se continúa con lo demás
  }

  // Últimas noticias (100 es el máximo por petición de WordPress).
  // Se piden solo slug y fecha con `_fields` para mantener la respuesta
  // ligera y dentro del límite de caché de Next.js (2 MB).
  try {
    const posts = await apiFetch<SitemapPost[]>("posts", {
      params: { _fields: "slug,modified_gmt", per_page: 100 },
      next: { revalidate: 3600 },
    });
    entries.push(
      ...posts.map((post) => ({
        url: `${base}/noticia/${post.slug}`,
        lastModified: new Date(`${post.modified_gmt}Z`),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    );
  } catch {
    // Sin noticias; se devuelve lo acumulado
  }

  return entries;
}
