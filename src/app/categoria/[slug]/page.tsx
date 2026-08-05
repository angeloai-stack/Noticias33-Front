// ============================================================================
// Listado por categoría (/categoria/[slug]) con paginación vía query string
// (?pagina=N). Si la categoría no existe en WordPress se responde 404.
// ============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdPlaceholder } from "@/components/news/ad-placeholder";
import { ArticleCard } from "@/components/news/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticlesByCategory, getCategoryBySlug } from "@/lib/api/news";
import { ADS } from "@/lib/config/ads";
import { siteConfig } from "@/lib/config/site";
import { categoryJsonLd } from "@/lib/seo";

export const revalidate = 60;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
};

/** Metadatos dinámicos con el nombre real de la categoría. */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Categoría no encontrada" };
  }

  return {
    title: category.name,
    description: `Noticias de ${category.name} en ${siteConfig.fullName}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { pagina } = await searchParams;
  // Normaliza el número de página: valores raros ("abc", "-2") caen en 1
  const page = Math.max(1, Number(pagina) || 1);

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const result = await getArticlesByCategory(slug, page);

  if (!result) {
    notFound();
  }

  const { data: articles, meta } = result;

  return (
    <div className="animate-fade-up mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Datos estructurados: página de colección con la lista de noticias */}
      <JsonLd data={categoryJsonLd(category.name, category.slug, articles)} />

      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        {category.name}
      </h1>
      <p className="mt-3 text-sm text-n33-muted">
        {meta.total} {meta.total === 1 ? "noticia" : "noticias"}
      </p>

      {articles.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              priority={index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-n33-border bg-n33-surface p-8 text-center text-n33-muted">
          No hay noticias en esta categoría todavía.
        </p>
      )}

      {/* Publicidad, tras el listado */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
        <AdPlaceholder
          className="h-69.75 w-29"
          ad={ADS.voltlabRail}
          sizes="116px"
        />
        <AdPlaceholder
          className="h-92 w-63.25"
          ad={ADS.voltlabSidebar}
          sizes="253px"
        />
      </div>
      <div className="mt-6 flex justify-center">
        <AdPlaceholder
          className="aspect-1034/145 w-full max-w-258.5"
          ad={ADS.propertyDreamz}
          sizes="(min-width: 1034px) 1034px, 100vw"
        />
      </div>

      {meta.totalPages > 1 && (
        <nav
          aria-label="Paginación"
          className="mt-12 flex items-center justify-center gap-4"
        >
          {page > 1 && (
            <Link
              href={`/categoria/${slug}?pagina=${page - 1}`}
              className="rounded-full border border-n33-border bg-white px-5 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-n33-primary hover:text-n33-primary hover:shadow-md"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-n33-muted">
            Página {page} de {meta.totalPages}
          </span>
          {page < meta.totalPages && (
            <Link
              href={`/categoria/${slug}?pagina=${page + 1}`}
              className="rounded-full border border-n33-border bg-white px-5 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-n33-primary hover:text-n33-primary hover:shadow-md"
            >
              Siguiente →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
