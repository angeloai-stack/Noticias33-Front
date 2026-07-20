// ============================================================================
// Modelo de dominio del frontend. Los componentes solo conocen estos tipos;
// la traducción desde WordPress ocurre en src/lib/api/mappers.ts.
// ============================================================================

/** Categoría de noticias (Nacional, Deportes, Clima, etc.). */
export type Category = {
  id: string;
  name: string;
  slug: string;
};

/** Autor de una noticia. */
export type Author = {
  id: string;
  name: string;
  avatarUrl?: string;
};

/** Noticia normalizada, independiente del backend que la provea. */
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImageUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  category: Category;
  author?: Author;
  isFeatured?: boolean;
};

/** Respuesta de listados con metadatos de paginación. */
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
