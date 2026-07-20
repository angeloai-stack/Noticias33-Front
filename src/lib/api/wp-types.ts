// ============================================================================
// Tipos de la API REST de WordPress (https://noticias33.com/wp-json/wp/v2).
// Solo describen los campos que el frontend realmente consume; la API
// devuelve muchos más, pero tiparlos todos no aporta nada.
// ============================================================================

/** WordPress envuelve los campos de texto en { rendered: "<html>" }. */
export type WpRendered = {
  rendered: string;
};

/** Término de taxonomía: puede ser una categoría o una etiqueta (tag). */
export type WpTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

/** Autor del post. `avatar_urls` mapea tamaño (px) a URL de la imagen. */
export type WpAuthor = {
  id: number;
  name: string;
  avatar_urls?: Record<string, string>;
};

/** Imagen destacada del post. */
export type WpFeaturedMedia = {
  source_url?: string;
  alt_text?: string;
};

/**
 * Post de WordPress. El bloque `_embedded` solo existe cuando la petición
 * incluye `_embed=true` y evita pedir autor/imagen/categorías por separado.
 */
export type WpPost = {
  id: number;
  date_gmt: string;
  modified_gmt: string;
  slug: string;
  link: string;
  sticky: boolean;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  categories: number[];
  _embedded?: {
    author?: WpAuthor[];
    "wp:featuredmedia"?: WpFeaturedMedia[];
    // Primer arreglo: categorías; segundo: etiquetas
    "wp:term"?: WpTerm[][];
  };
};

/** Categoría de WordPress. `count` es el número de posts publicados. */
export type WpCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
};
