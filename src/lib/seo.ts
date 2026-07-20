// ============================================================================
// Constructores de datos estructurados (schema.org) para el JSON-LD.
// Cada función devuelve un objeto listo para pasarse al componente <JsonLd>.
// Referencia: https://schema.org y guías de Google Search Central.
// ============================================================================

import { siteConfig } from "@/lib/config/site";
import type { Article } from "@/types/news";

const base = siteConfig.url.replace(/\/$/, "");

/** Editor (publisher) reutilizado por el resto de los esquemas. */
const publisher = {
  "@type": "NewsMediaOrganization",
  "@id": `${base}/#organization`,
  name: siteConfig.fullName,
  url: base,
  logo: {
    "@type": "ImageObject",
    url: `${base}/design/logo-n33-footer.png`,
  },
} as const;

/**
 * Esquema global del sitio: la organización de noticias y el sitio web con
 * su buscador interno (SearchAction permite el cuadro de búsqueda directa
 * en los resultados de Google). Se inserta una vez en el layout raíz.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisher,
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: siteConfig.fullName,
        url: base,
        inLanguage: siteConfig.locale,
        publisher: { "@id": `${base}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${base}/buscar?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/** Esquema NewsArticle para la página de detalle de una noticia. */
export function newsArticleJsonLd(article: Article) {
  const url = `${base}/noticia/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.title,
    description: article.excerpt,
    image: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    articleSection: article.category.name,
    inLanguage: siteConfig.locale,
    author: article.author
      ? [{ "@type": "Person", name: article.author.name }]
      : [{ "@type": "Organization", name: siteConfig.fullName }],
    publisher,
  };
}

/**
 * Esquema CollectionPage con la lista de noticias de una categoría.
 * Ayuda a los buscadores a descubrir los artículos desde el listado.
 */
export function categoryJsonLd(
  categoryName: string,
  categorySlug: string,
  articles: Article[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} — ${siteConfig.fullName}`,
    url: `${base}/categoria/${categorySlug}`,
    inLanguage: siteConfig.locale,
    isPartOf: { "@id": `${base}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${base}/noticia/${article.slug}`,
        name: article.title,
      })),
    },
  };
}
