// ============================================================================
// Mappers: convierten las respuestas crudas de WordPress (WpPost) al modelo
// interno del frontend (Article). Así los componentes nunca dependen de la
// estructura de WordPress y un cambio de backend solo afecta a esta capa.
// ============================================================================

import type { Article, Category } from "@/types/news";
import type { WpPost, WpTerm } from "@/lib/api/wp-types";

/**
 * Limpia el HTML que WordPress incluye en títulos y extractos:
 * quita etiquetas y decodifica las entidades más comunes (comillas, &amp;...).
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\[&hellip;\]|\[\u2026\]/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .trim();
}

/**
 * Extrae las categorías del post desde `_embedded["wp:term"]`
 * (disponible cuando la petición usa `_embed=true`).
 * Si el post no tiene categoría se devuelve "General" como respaldo.
 */
function findCategories(post: WpPost): Category[] {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const categories = terms.filter(
    (term: WpTerm) => term.taxonomy === "category",
  );

  if (categories.length === 0) {
    return [{ id: "0", name: "General", slug: "general" }];
  }

  return categories.map((term) => ({
    id: String(term.id),
    name: term.name,
    slug: term.slug,
  }));
}

/** Convierte un post de WordPress al modelo Article usado por los componentes. */
export function mapWpPostToArticle(post: WpPost): Article {
  const [primaryCategory] = findCategories(post);
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const author = post._embedded?.author?.[0];

  return {
    id: String(post.id),
    title: stripHtml(post.title.rendered),
    slug: post.slug,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content?.rendered,
    coverImageUrl: media?.source_url,
    // WordPress entrega las fechas GMT sin zona horaria; se añade la "Z"
    // para que JavaScript las interprete correctamente como UTC.
    publishedAt: `${post.date_gmt}Z`,
    updatedAt: `${post.modified_gmt}Z`,
    category: primaryCategory,
    author: author
      ? {
          id: String(author.id),
          name: author.name,
          avatarUrl: author.avatar_urls?.["48"],
        }
      : undefined,
    isFeatured: post.sticky,
  };
}
