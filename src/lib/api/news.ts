// ============================================================================
// Capa de datos de noticias: todas las lecturas del sitio público pasan por
// aquí (portada, detalle, categorías y búsqueda). Consume la API REST de
// WordPress y devuelve siempre el modelo interno (Article / Category).
// ============================================================================

import { apiFetch, apiFetchPaginated, ApiError } from "@/lib/api/client";
import { mapWpPostToArticle } from "@/lib/api/mappers";
import type { WpCategory, WpPost } from "@/lib/api/wp-types";
import type { Article, Category, PaginatedResponse } from "@/types/news";

// `_embed=true` hace que WordPress incluya autor, imagen destacada y
// categorías en la misma respuesta (evita peticiones adicionales).
const EMBED_PARAMS = { _embed: true } as const;

/** Empaqueta una lista de posts con sus metadatos de paginación. */
function toPaginated(
  posts: WpPost[],
  page: number,
  pageSize: number,
  total: number,
  totalPages: number,
): PaginatedResponse<Article> {
  return {
    data: posts.map(mapWpPostToArticle),
    meta: { page, pageSize, total, totalPages },
  };
}

/** Últimas noticias en orden cronológico inverso (alimenta la portada). */
export async function getLatestArticles(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResponse<Article>> {
  const { data, total, totalPages } = await apiFetchPaginated<WpPost[]>(
    "posts",
    {
      params: { ...EMBED_PARAMS, page, per_page: pageSize },
    },
  );

  return toPaginated(data, page, pageSize, total, totalPages);
}

/**
 * Noticias destacadas. Los posts "sticky" de WordPress funcionan como
 * destacados; si no hay ninguno, se usan los más recientes como respaldo.
 */
export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const sticky = await apiFetch<WpPost[]>("posts", {
    params: { ...EMBED_PARAMS, sticky: true, per_page: limit },
  });

  if (sticky.length > 0) {
    return sticky.map(mapWpPostToArticle);
  }

  const latest = await apiFetch<WpPost[]>("posts", {
    params: { ...EMBED_PARAMS, per_page: limit },
  });

  return latest.map(mapWpPostToArticle);
}

/** Busca una noticia por su slug (URL amigable). Devuelve null si no existe. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const posts = await apiFetch<WpPost[]>("posts", {
    params: { ...EMBED_PARAMS, slug },
  });

  if (posts.length === 0) {
    return null;
  }

  return mapWpPostToArticle(posts[0]);
}

/**
 * Lista de categorías con contenido. Se cachea 1 hora porque las categorías
 * cambian con muy poca frecuencia.
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await apiFetch<WpCategory[]>("categories", {
    params: { per_page: 100, hide_empty: true },
    next: { revalidate: 3600 },
  });

  return categories
    .filter((category) => category.slug !== "uncategorized")
    .map((category) => ({
      id: String(category.id),
      name: category.name,
      slug: category.slug,
    }));
}

/** Busca una categoría por su slug. Devuelve null si no existe. */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = await apiFetch<WpCategory[]>("categories", {
    params: { slug },
    next: { revalidate: 3600 },
  });

  if (categories.length === 0) {
    return null;
  }

  const [category] = categories;
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
  };
}

/**
 * Noticias de una categoría, paginadas.
 * Devuelve null si la categoría no existe (la página mostrará un 404).
 */
export async function getArticlesByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 12,
): Promise<PaginatedResponse<Article> | null> {
  // Primero se resuelve el slug al ID numérico que exige WordPress
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return null;
  }

  const { data, total, totalPages } = await apiFetchPaginated<WpPost[]>(
    "posts",
    {
      params: {
        ...EMBED_PARAMS,
        categories: category.id,
        page,
        per_page: pageSize,
      },
    },
  );

  return toPaginated(data, page, pageSize, total, totalPages);
}

/**
 * Búsqueda de texto libre. No se cachea (revalidate: 0) porque cada consulta
 * es distinta y los resultados deben ser frescos.
 */
export async function searchArticles(
  query: string,
  page = 1,
  pageSize = 12,
): Promise<PaginatedResponse<Article>> {
  try {
    const { data, total, totalPages } = await apiFetchPaginated<WpPost[]>(
      "posts",
      {
        params: { ...EMBED_PARAMS, search: query, page, per_page: pageSize },
        next: { revalidate: 0 },
      },
    );

    return toPaginated(data, page, pageSize, total, totalPages);
  } catch (error) {
    // WordPress devuelve 400 cuando la página solicitada excede el total.
    if (error instanceof ApiError && error.status === 400) {
      return toPaginated([], page, pageSize, 0, 0);
    }
    throw error;
  }
}
